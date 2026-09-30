import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { SPORTS_DATABASE } from './src/data/sportsDatabase';
import { searchMuscleWiki, MUSCLEWIKI_DATABASE } from './src/data/muscleWikiDatabase';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Search helper across sports and martial arts database
function searchSportsDatabase(query: string, maxResults = 3) {
  if (!query) return [];
  const q = query.toLowerCase();
  return SPORTS_DATABASE.filter((item) => {
    return (
      item.name.toLowerCase().includes(q) ||
      item.subCategory.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.targetMuscles.some((m) => m.toLowerCase().includes(q)) ||
      item.painPreventionAndStrengthening.commonPainArea.toLowerCase().includes(q)
    );
  }).slice(0, maxResults);
}

// Search helper across MuscleWiki database
function searchMuscleWikiDatabase(query: string, maxResults = 4) {
  if (!query) return [];
  return searchMuscleWiki(query).slice(0, maxResults);
}

// POST /api/chat - Main chat endpoint for Sistem
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userPreferences, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Mensagens são obrigatórias.' });
    }

    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // Search databases
    const matchedSports = searchSportsDatabase(lastUserMessage, 3);
    const matchedMuscleWiki = searchMuscleWikiDatabase(lastUserMessage, 3);

    const muscleWikiContextText = matchedMuscleWiki.length > 0
      ? `\nBASE DE DADOS MUSCLEWIKI (musclewiki.com - EXERCÍCIOS & BIOMECÂNICA):\n` +
        matchedMuscleWiki
          .map(
            (mw) =>
              `- [MUSCLEWIKI] ${mw.name} (${mw.nameEn}) | Músculo Alvo: ${mw.primaryMuscle}\n  Secundários: ${mw.secondaryMuscles.join(', ')} | Equipamento: ${mw.equipment} | Dificuldade: ${mw.difficulty}\n  Foco: ${mw.targetFocus}\n  Instruções Passo a Passo: ${mw.instructions.join(' -> ')}\n  Dicas Posturais (Form Cues): ${mw.formTips.join(' | ')}\n  Erros Comuns: ${mw.commonMistakes.join(' | ')}\n  Link Oficial: ${mw.muscleWikiUrl}`
          )
          .join('\n\n')
      : '';

    const sportsContextText = matchedSports.length > 0
      ? `\nBASE DE DADOS DE ESPORTES E ARTES MARCIAIS:\n` +
        matchedSports
          .map(
            (s) =>
              `- [${s.category.toUpperCase()} / ${s.subCategory}] ${s.name} (Dificuldade: ${s.difficulty})\n  Músculos/Habilidades: ${s.targetMuscles.join(', ')}\n  Descrição: ${s.description}\n  Dicas Técnicas: ${s.technicalTips.join(' | ')}\n  Reforço Físico para Dores: ${s.painPreventionAndStrengthening.commonPainArea} -> ${s.painPreventionAndStrengthening.strengtheningExercise} (${s.painPreventionAndStrengthening.preventionTip})`
          )
          .join('\n\n')
      : '';

    const studySubjectsText = (context?.studySubjects || [])
      .map(
        (sub: any) =>
          `- Disciplina: ${sub.name} (${sub.category}, Nível ${sub.level})\n  Tópicos: ${(sub.topics || []).map((t: any) => `${t.title} [${t.completed ? 'Feito' : 'Pendente'}]`).join(', ')}`
      )
      .join('\n');

    if (!ai) {
      return res.status(200).json({
        reply: 'Olá! Sou o Sistem, seu agente inteligente pessoal. Como posso orientar sua agenda, treinos do MuscleWiki, tarefas ou estudos agora?',
        suggestedActions: [],
        activeAgent: 'sistem',
        agentName: 'Sistem',
      });
    }

    const systemInstruction = `
Você é o **Sistem**, o agente de inteligência artificial principal do usuário.
Você é o ÚNICO agente que conversa diretamente com o usuário. Os outros módulos (organizador de agenda/tarefas, treinador esportivo e tutor de estudos) são subsistemas internos e ocultos que você coordena silenciosamente. Nunca se refira a si mesmo como múltiplos agentes ou como sub-agente; apresente-se sempre como "Sistem".

SUAS CAPACIDADES INTEGRADAS:
1. **BASE DE DADOS MUSCLEWIKI (musclewiki.com)**:
   - Você utiliza as informações e instruções de exercícios do MuscleWiki (musclewiki.com) como fonte primária para musculação, anatomia muscular (peitoral, dorsais, deltoides, bíceps, tríceps, quadríceps, isquiotibiais, glúteos, core, antebraço), biomecânica, pegadas, postura e correções de erros.
   - Sempre que apropriado, cite as dicas posturais do MuscleWiki e o link oficial de referência (ex: https://musclewiki.com).
2. **ESPORTES & ARTES MARCIAIS**:
   - Taekwondo, Hapkido, Jiu-Jitsu, Muay Thai, Boxe, Judô, Corrida, Natação, Ciclismo. Domina prevenção e reforço articular para dores.
3. **ORGANIZAÇÃO PESSOAL & GOOGLE CALENDAR**:
   - Reuniões, agendamentos, tarefas diárias e sincronização de lembretes.
4. **WHATSAPP & CONVERSAS DIRETAS**:
   - Integração completa para lembretes e conversas em tempo real com o usuário pelo WhatsApp.
5. **MENTORIA & ESTUDOS MULTIDISCIPLINARES**:
   - Capacidade de ensinar qualquer assunto (Programação, Matemática, Idiomas, Filosofia, etc.) com didática cristalina e analogias práticas.

DADOS DO USUÁRIO:
Nome: ${userPreferences?.userName || 'Usuário'}
Objetivo Físico: ${userPreferences?.fitnessGoal || 'Geral'}
Dores Conhecidas: ${JSON.stringify(userPreferences?.knownPains || [])}
WhatsApp: ${userPreferences?.whatsappPhone || 'Não configurado'}
Memórias Aprendidas: ${(userPreferences?.learnedMemories || []).join('; ')}

DISCIPLINAS DE ESTUDO ATIVAS:
${studySubjectsText || 'Nenhuma disciplina cadastrada ainda.'}

${muscleWikiContextText}
${sportsContextText}

ESTADO DE PRODUTIVIDADE HOJE:
Tarefas: ${context?.tasks?.length || 0} (${context?.tasks?.filter((t: any) => t.completed).length || 0} concluídas)
Reuniões Calendar: ${context?.calendarEvents?.length || 0}
Treino: ${context?.currentWorkout?.title || 'Livre'}

FORMATO DE RESPOSTA OBRIGATÓRIO:
Responda diretamente com alta qualidade, tom prestativo, claro e objetivo como Sistem.
Ao final da resposta, inclua OBRIGATORIAMENTE um bloco JSON:
\`\`\`json
{
  "activeAgent": "sistem",
  "agentName": "Sistem",
  "delegationNote": "Processado diretamente pelo Sistem com apoio das bases MuscleWiki e planejamento integrado",
  "suggestedActions": [
    {
      "type": "SCHEDULE_MEETING" | "CREATE_TASK" | "SEND_WHATSAPP" | "ADJUST_WORKOUT" | "VIEW_PAIN_GUIDE" | "EXPLAIN_TOPIC" | "CREATE_STUDY_SUBJECT",
      "label": "Rótulo legível para o botão de ação",
      "payload": { ... }
    }
  ],
  "learnedMemorySuggestion": "Texto opcional caso tenha detectado uma nova preferência do usuário para salvar na memória permanente"
}
\`\`\`
`.trim();

    const contents: any[] = [];
    contents.push({
      role: 'user',
      parts: [{ text: systemInstruction }],
    });
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido. Eu sou o Sistem, agente principal. Operando com as bases de dados MuscleWiki (musclewiki.com), esportes, artes marciais, agenda do Google Calendar e automação de WhatsApp. Pronto para interagir com o usuário.' }],
    });

    for (const msg of messages) {
      contents.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
    });

    const fullText = response.text || '';
    let cleanReply = fullText;
    let suggestedActions: any[] = [];
    let learnedMemorySuggestion: string | undefined = undefined;
    let activeAgent = 'sistem';
    let agentName = 'Sistem';
    let delegationNote = 'Sistem';

    const jsonMatch = fullText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        suggestedActions = parsed.suggestedActions || [];
        learnedMemorySuggestion = parsed.learnedMemorySuggestion;
        if (parsed.activeAgent) activeAgent = 'sistem';
        if (parsed.agentName) agentName = 'Sistem';
        if (parsed.delegationNote) delegationNote = parsed.delegationNote;
        cleanReply = fullText.replace(/```json\s*[\s\S]*?\s*```/, '').trim();
      } catch (e) {
        console.warn('Failed to parse Sistem JSON payload', e);
      }
    }

    return res.json({
      reply: cleanReply,
      suggestedActions,
      learnedMemorySuggestion,
      activeAgent,
      agentName,
      delegationNote,
      matchedMuscleWikiCount: matchedMuscleWiki.length,
      matchedSportsCount: matchedSports.length,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Erro ao processar mensagem com o Sistem.',
      details: error.message,
    });
  }
});

// POST /api/whatsapp/chat - Direct chat with Sistem via WhatsApp channel
app.post('/api/whatsapp/chat', async (req: Request, res: Response) => {
  try {
    const { message, phone, userName, context } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Mensagem é obrigatória.' });
    }

    const matchedExercises = searchMuscleWikiDatabase(message, 2);
    const matchedSports = searchSportsDatabase(message, 2);

    let muscleContext = '';
    if (matchedExercises.length > 0) {
      muscleContext = `\nExercícios MuscleWiki encontrados:\n` +
        matchedExercises.map((e) => `• ${e.name} (${e.primaryMuscle}, ${e.equipment}): ${e.formTips[0]} (Ref: ${e.muscleWikiUrl})`).join('\n');
    }

    if (!ai) {
      return res.json({
        reply: `*Sistem no WhatsApp:*\nRecebi sua mensagem: "${message}". Configure sua GEMINI_API_KEY para respostas completas em tempo real!`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sender: 'sistem',
      });
    }

    const prompt = `
Você é o **Sistem**, respondendo ao usuário pelo WhatsApp.
Nome do usuário: ${userName || 'Usuário'}
Telefone: ${phone || 'WhatsApp'}
Mensagem recebida: "${message}"

${muscleContext}

Diretrizes para resposta no WhatsApp:
- Use formatação natural do WhatsApp: *negrito*, _itálico_, quebras de linha limpas e emojis adequados.
- Responda de forma ágil, direta, empática e prestativa.
- Se for dúvida de exercício, use os dados do MuscleWiki (musclewiki.com).
- Se for comando como "/treino", "/agenda", "/tarefas", responda com os destaques pertinentes de forma sintetizada.
- Assine ou identifique-se de forma elegante como *Sistem*.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({
      reply: response.text || 'Mensagem recebida pelo Sistem.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      sender: 'sistem',
    });
  } catch (error: any) {
    console.error('Error in /api/whatsapp/chat:', error);
    return res.status(500).json({
      error: 'Erro na conversa via WhatsApp com o Sistem.',
      details: error.message,
    });
  }
});

// POST /api/whatsapp/local-send - Local dispatch confirmation & logging
app.post('/api/whatsapp/local-send', (req: Request, res: Response) => {
  const { phone, message, title } = req.body;
  console.log(`[WhatsApp Local Dispatch] To: ${phone} | Title: ${title}`);
  return res.json({ success: true, timestamp: new Date().toISOString() });
});

// GET /api/whatsapp/webhook - WhatsApp Business Cloud API Verification
app.get('/api/whatsapp/webhook', (req: Request, res: Response) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'sistem_nexus_verify_2026';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('WhatsApp Webhook Verified successfully');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// POST /api/whatsapp/webhook - WhatsApp Cloud API Inbound messages
app.post('/api/whatsapp/webhook', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    // Log inbound webhook event
    console.log('Incoming WhatsApp Webhook Payload:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      if (message && message.type === 'text') {
        const fromNumber = message.from;
        const textBody = message.text?.body;
        console.log(`Received WhatsApp message from ${fromNumber}: ${textBody}`);
        // Here Sistem could trigger automatic WhatsApp Cloud API reply if access token is set
      }
    }

    return res.status(200).send('EVENT_RECEIVED');
  } catch (err: any) {
    console.error('Error processing WhatsApp webhook:', err);
    return res.status(500).send('ERROR');
  }
});

// POST /api/feedback
app.post('/api/feedback', async (req: Request, res: Response) => {
  try {
    const { userPreferences, tasks, workout, meetingsCount, waterGlasses } = req.body;

    if (!ai) {
      return res.json({
        feedback: 'Bom progresso geral! Mantenha a atenção nas prioridades de amanhã e hidrate-se bem.',
      });
    }

    const completedTasks = (tasks || []).filter((t: any) => t.completed).length;
    const totalTasks = tasks?.length || 0;

    const prompt = `
Gere um feedback diário franco, sincero e construtivo de Sistem para ${userPreferences?.userName || 'o atleta/usuário'}.
Tom: Realista, sem rodeios ou bajulação, amigável e focado em evolução.
Linguagem acessível e motivadora. Se o treino envolveu exercícios, mencione a execução segura baseada nas diretrizes do MuscleWiki.

DADOS DO DIA:
- Tarefas concluídas: ${completedTasks} de ${totalTasks}
- Reuniões realizadas: ${meetingsCount}
- Treino: ${workout?.title || 'Nenhum'} | Concluído: ${workout?.completed ? 'Sim' : 'Não'}
- Esforço (RPE): ${workout?.feedback?.rpe || 'Não informado'}/10
- Dor relatada: ${workout?.feedback?.feltPain ? `${workout?.feedback?.painArea} (Severidade: ${workout?.feedback?.painSeverity}/10)` : 'Nenhuma'}
- Água: ${(waterGlasses || 0) * 250} ml

ESTRUTURA DA RESPOSTA (em tópicos limpos):
1. Resumo honesto do dia por Sistem.
2. Avaliação de corpo & treino (postura, sobrecarga e recuperação).
3. Plano de ação imediato para amanhã.
`.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    return res.json({ feedback: response.text });
  } catch (error: any) {
    console.error('Error in /api/feedback:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sistem server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
