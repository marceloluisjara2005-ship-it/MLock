import React, { useState, useEffect } from 'react';
import { X, Database, Key, Check, AlertTriangle, Shield, RefreshCw } from 'lucide-react';
import { getStoredSupabaseConfig, saveSupabaseConfig, clearSupabaseConfig } from '../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetDemo: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onResetDemo,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getStoredSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !anonKey.trim()) {
      setStatusMessage('Por favor ingresa tanto la URL como la Anon Key.');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setStatusMessage('La URL de Supabase debe comenzar con https://');
      return;
    }

    saveSupabaseConfig(url.trim(), anonKey.trim());
    setStatusMessage('Configuración guardada exitosamente. Recargando...');
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  const handleClear = () => {
    if (window.confirm('¿Deseas desvincular Supabase y volver al Modo Seguro Demo?')) {
      clearSupabaseConfig();
      onResetDemo();
      window.location.reload();
    }
  };

  return (
    <div
      id="supabase-config-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        id="supabase-config-modal"
        className="w-full max-w-lg rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-950/60 border border-violet-800/40 text-violet-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 font-sans">
                Conectar con Supabase
              </h2>
              <p className="text-xs text-zinc-400">Project Settings → API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          {statusMessage && (
            <div className="p-3 text-xs rounded-xl bg-violet-950/40 border border-violet-800/50 text-violet-200">
              {statusMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Project URL *
            </label>
            <input
              id="supabase-url-input"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Anon / Public API Key *
            </label>
            <input
              id="supabase-anon-key-input"
              type="text"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 font-mono focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 space-y-1">
            <p className="text-zinc-300 font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              ¿Dónde encontrar estos datos?
            </p>
            <p className="text-[11px]">
              En tu consola de Supabase, entra a tu proyecto → <strong>Project Settings</strong> → <strong>API</strong> y copia la URL y la llave anónima (anon public).
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
            >
              Restablecer Modo Demo
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Cerrar
              </button>
              <button
                id="save-supabase-config-btn"
                type="submit"
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md shadow-violet-900/30 transition-all"
              >
                Guardar y Conectar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
