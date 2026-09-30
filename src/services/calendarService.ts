import { CalendarEventItem } from '../types';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
const LOCAL_STORAGE_EVENTS_KEY = 'nexuspulse_local_calendar_events_v1';

export const getLocalEvents = (): CalendarEventItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_EVENTS_KEY);
    if (!raw) {
      // Default sample meetings for today and tomorrow to kickstart
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      
      const defaultEvents: CalendarEventItem[] = [
        {
          id: 'demo-1',
          summary: 'Alinhamento Semanal de Metas & Projetos',
          description: 'Revisão das prioridades da semana com a equipe e planejamento das entregas críticas.',
          start: { dateTime: `${y}-${m}-${d}T10:00:00` },
          end: { dateTime: `${y}-${m}-${d}T10:45:00` },
          location: 'Google Meet',
          isLocalOnly: true,
          attendees: [{ email: 'equipe@empresa.com', displayName: 'Equipe de Projetos' }],
        },
        {
          id: 'demo-2',
          summary: 'Reunião de Feedback & Estratégia',
          description: 'Ajuste de escopo e feedback com a diretoria.',
          start: { dateTime: `${y}-${m}-${d}T15:30:00` },
          end: { dateTime: `${y}-${m}-${d}T16:15:00` },
          location: 'Google Meet',
          isLocalOnly: true,
          attendees: [{ email: 'augusto12fonseca@gmail.com', displayName: 'Augusto Fonseca' }],
        },
      ];
      localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(defaultEvents));
      return defaultEvents;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local events', err);
    return [];
  }
};

export const saveLocalEvents = (events: CalendarEventItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_EVENTS_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Error saving local events', err);
  }
};

export const fetchGoogleCalendarEvents = async (
  accessToken: string,
  timeMin?: string,
  timeMax?: string
): Promise<CalendarEventItem[]> => {
  try {
    const min = timeMin || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const max = timeMax || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const url = new URL(CALENDAR_API_BASE);
    url.searchParams.set('timeMin', min);
    url.searchParams.set('timeMax', max);
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');
    url.searchParams.set('maxResults', '50');

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.warn('Google Calendar fetch error, falling back to local:', errorData);
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const googleItems: CalendarEventItem[] = (data.items || []).map((item: any) => ({
      id: item.id,
      summary: item.summary || 'Sem título',
      description: item.description,
      start: {
        dateTime: item.start?.dateTime,
        date: item.start?.date,
      },
      end: {
        dateTime: item.end?.dateTime,
        date: item.end?.date,
      },
      location: item.location,
      htmlLink: item.htmlLink,
      attendees: item.attendees?.map((a: any) => ({
        email: a.email,
        displayName: a.displayName,
      })),
      isLocalOnly: false,
    }));

    return googleItems;
  } catch (error) {
    console.error('Failed to fetch events from Google Calendar:', error);
    throw error;
  }
};

export const createGoogleCalendarEvent = async (
  accessToken: string | null,
  event: {
    summary: string;
    description?: string;
    startDateTime: string;
    endDateTime: string;
    location?: string;
    attendeesEmails?: string[];
  }
): Promise<CalendarEventItem> => {
  if (accessToken) {
    try {
      const payload: any = {
        summary: event.summary,
        description: event.description,
        start: { dateTime: new Date(event.startDateTime).toISOString() },
        end: { dateTime: new Date(event.endDateTime).toISOString() },
      };

      if (event.location) {
        payload.location = event.location;
      }

      if (event.attendeesEmails && event.attendeesEmails.length > 0) {
        payload.attendees = event.attendeesEmails.map((email) => ({ email: email.trim() }));
      }

      const response = await fetch(CALENDAR_API_BASE, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erro ao criar evento: HTTP ${response.status}`);
      }

      const created = await response.json();
      const newEvent: CalendarEventItem = {
        id: created.id,
        summary: created.summary,
        description: created.description,
        start: created.start,
        end: created.end,
        location: created.location,
        htmlLink: created.htmlLink,
        attendees: created.attendees,
        isLocalOnly: false,
      };

      // Also sync to local cache
      const local = getLocalEvents();
      saveLocalEvents([newEvent, ...local]);
      return newEvent;
    } catch (err) {
      console.warn('Google API failed to create event, creating local event instead:', err);
    }
  }

  // Local fallback event
  const newLocalEvent: CalendarEventItem = {
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    summary: event.summary,
    description: event.description,
    start: { dateTime: event.startDateTime },
    end: { dateTime: event.endDateTime },
    location: event.location || 'Presencial / Online',
    attendees: event.attendeesEmails?.map((e) => ({ email: e })),
    isLocalOnly: true,
  };

  const local = getLocalEvents();
  saveLocalEvents([newLocalEvent, ...local]);
  return newLocalEvent;
};

export const deleteGoogleCalendarEvent = async (
  accessToken: string | null,
  eventId: string
): Promise<boolean> => {
  if (accessToken && !eventId.startsWith('local-') && !eventId.startsWith('demo-')) {
    try {
      const response = await fetch(`${CALENDAR_API_BASE}/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok && response.status !== 404) {
        console.warn('Could not delete event from Google Calendar');
      }
    } catch (err) {
      console.error('Error deleting from Google Calendar:', err);
    }
  }

  // Remove from local list
  const local = getLocalEvents();
  const updated = local.filter((e) => e.id !== eventId);
  saveLocalEvents(updated);
  return true;
};
