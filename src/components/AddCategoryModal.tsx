import React, { useState } from 'react';
import { X, FolderPlus, Sparkles, AlertCircle } from 'lucide-react';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (name: string, color: string, icon: string) => Promise<boolean>;
  actionLoading: boolean;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
  actionLoading,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState('violet');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const colorOptions = [
    { id: 'violet', label: 'Violeta', bgClass: 'bg-violet-500' },
    { id: 'emerald', label: 'Esmeralda', bgClass: 'bg-emerald-500' },
    { id: 'amber', label: 'Ámbar', bgClass: 'bg-amber-500' },
    { id: 'rose', label: 'Rosa', bgClass: 'bg-rose-500' },
    { id: 'cyan', label: 'Cian', bgClass: 'bg-cyan-500' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('El nombre del apartado es obligatorio.');
      return;
    }

    const success = await onAddCategory(name.trim(), color, 'folder');
    if (success) {
      setName('');
      onClose();
    }
  };

  return (
    <div
      id="add-category-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div
        id="add-category-modal"
        className="w-full max-w-md rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-6 text-zinc-100 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-950/60 border border-violet-800/50 text-violet-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 font-sans">
                Añadir Nuevo Apartado
              </h2>
              <p className="text-xs text-zinc-400">Crea una categoría personalizada para tu panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-900/60 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">
              Nombre del Apartado *
            </label>
            <input
              id="new-category-name-input"
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Licencias, Cripto, Servidores, Médicos..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-2 uppercase tracking-wider">
              Color Distintivo
            </label>
            <div className="flex items-center gap-3">
              {colorOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColor(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                    color === opt.id
                      ? 'bg-zinc-800 text-white border-zinc-600 ring-2 ring-violet-500/40'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${opt.bgClass}`} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-900">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              id="save-category-btn"
              type="submit"
              disabled={actionLoading}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-medium text-sm shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <span>Crear Apartado</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
