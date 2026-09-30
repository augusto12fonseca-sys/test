import React, { useState } from 'react';
import {
  BrainCircuit,
  Plus,
  Trash2,
  Check,
  User,
  Phone,
  Clock,
  Dumbbell,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { UserPreferences } from '../types';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSavePreferences: (updated: UserPreferences) => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [formData, setFormData] = useState<UserPreferences>(preferences);
  const [newMemory, setNewMemory] = useState('');

  if (!isOpen) return null;

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.trim()) return;

    setFormData((prev) => ({
      ...prev,
      learnedMemories: [newMemory.trim(), ...prev.learnedMemories],
    }));
    setNewMemory('');
  };

  const handleRemoveMemory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      learnedMemories: prev.learnedMemories.filter((_, i) => i !== index),
    }));
  };

  const handleSave = () => {
    onSavePreferences(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Memória da IA & Preferências
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O assistente aprende seus hábitos com o tempo para personalizar rotinas, treinos e reuniões.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Section 1: AI Learned Memories Bank */}
        <div className="space-y-3 p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/60">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>Memórias Aprendidas Automaticamente pela IA ({formData.learnedMemories.length})</span>
            </h4>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300">
            Fatos, manias e horários que o NexusPulse absorveu das suas conversas e feedbacks:
          </p>

          {/* Add custom memory input */}
          <form onSubmit={handleAddMemory} className="flex items-center space-x-2">
            <input
              type="text"
              value={newMemory}
              onChange={(e) => setNewMemory(e.target.value)}
              placeholder="Ensinar novo hábito à IA (ex: Prefiro treinar às 7h em jejum)..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
            />
            <button
              type="submit"
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ensinar</span>
            </button>
          </form>

          {/* Memory chips list */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {formData.learnedMemories.map((mem, index) => (
              <div
                key={index}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between space-x-2 text-xs text-slate-800 dark:text-slate-200"
              >
                <span>• {mem}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveMemory(index)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  title="Esquecer esta informação"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: General Profile & Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Seu Nome / Apelido
            </label>
            <input
              type="text"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              WhatsApp para Lembretes Automáticos
            </label>
            <input
              type="text"
              value={formData.whatsappPhone}
              onChange={(e) => setFormData({ ...formData, whatsappPhone: e.target.value })}
              placeholder="+55 11 99999-9999"
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Objetivo Físico Principal
            </label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
            >
              <option value="hipertrofia">Hipertrofia & Força Muscular</option>
              <option value="emagrecimento">Emagrecimento & Definição</option>
              <option value="resistencia">Resistência Cardiorrespiratória</option>
              <option value="saude_geral">Saúde Geral, Postura & Alívio de Dor</option>
              <option value="condicionamento">Condicionamento Atlético Funcional</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tom de Comunicação da IA
            </label>
            <select
              value={formData.communicationTone}
              onChange={(e) => setFormData({ ...formData, communicationTone: e.target.value as any })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none"
            >
              <option value="direto_sincero">Direto e Sincero (Recomendado)</option>
              <option value="muito_direto">Muito Franco (Sem rodeios esportivos)</option>
              <option value="acolhedor_firme">Acolhedor porém Firme</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center space-x-1"
          >
            <Check className="w-4 h-4" />
            <span>Salvar Preferências</span>
          </button>
        </div>
      </div>
    </div>
  );
};
