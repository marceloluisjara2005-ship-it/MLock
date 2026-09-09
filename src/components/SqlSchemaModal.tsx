import React, { useState } from 'react';
import { X, Copy, Check, Database, ShieldCheck, Terminal, BookOpen, ExternalLink } from 'lucide-react';
import { SUPABASE_SQL_SCHEMA } from '../lib/sqlSchema';

interface SqlSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlSchemaModal: React.FC<SqlSchemaModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id="sql-schema-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="sql-schema-modal"
        className="relative w-full max-w-3xl my-8 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-zinc-900 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-violet-950/70 border border-violet-800/40 text-violet-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 font-sans">
                Esquema SQL & Políticas RLS de Supabase
              </h2>
              <p className="text-xs text-zinc-400">
                Estructura PostgreSQL, Storage y Row Level Security lista para copiar y ejecutar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps / Guide Banner */}
        <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="font-semibold text-violet-300 flex items-center gap-1.5 mb-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>1. SQL Editor</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Entra en tu proyecto Supabase y ve a la sección <strong>SQL Editor</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="font-semibold text-emerald-300 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Ejecutar Script</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Pega el código SQL y presiona <strong>Run</strong>. Creará tablas, índices y RLS.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>3. Google Auth</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              En Authentication → Providers, activa <strong>Google</strong> con tus credenciales OAuth.
            </p>
          </div>
        </div>

        {/* SQL Code Block */}
        <div className="relative rounded-xl bg-zinc-900/90 border border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/70 border-b border-zinc-800/80">
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />
              schema_mlock_rls.sql
            </span>

            <button
              id="copy-sql-btn"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-80 leading-relaxed scrollbar-thin">
            <code>{SUPABASE_SQL_SCHEMA}</code>
          </pre>
        </div>

        {/* Storage Notice */}
        <div className="mt-4 p-3 rounded-xl bg-violet-950/20 border border-violet-900/40 text-xs text-violet-200">
          <p className="font-semibold flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4 text-violet-400" />
            Políticas Row Level Security (RLS) Garantizadas
          </p>
          <p className="text-[11px] text-zinc-400">
            Las políticas definidas en este archivo garantizan que ningún usuario pueda consultar, modificar o eliminar registros ni archivos PDF ajenos, aislando de forma estricta los datos bajo <code>auth.uid() = user_id</code>.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-900">
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200"
          >
            <span>Ir a Supabase Dashboard</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
