import React from 'react';
import { ShieldAlert, Plus, SearchX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  isSearch: boolean;
  activeCategory: string;
  onOpenCreateItem: () => void;
  onClearSearch: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isSearch,
  activeCategory,
  onOpenCreateItem,
  onClearSearch,
}) => {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 my-6">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
          <SearchX className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h3 className="text-base font-bold text-zinc-100">No se encontraron resultados</h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-sm">
          No hay elementos que coincidan con los términos de búsqueda en {activeCategory}.
        </p>
        <button
          onClick={onClearSearch}
          className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800 transition-colors"
        >
          Limpiar búsqueda
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-zinc-800/80 bg-zinc-950/40 my-6">
      <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-800/30 text-violet-400 mb-3.5 shadow-md shadow-violet-950/30">
        <Sparkles className="w-8 h-8 stroke-[1.5]" />
      </div>
      <h3 className="text-base font-bold text-zinc-100">
        {activeCategory === 'Todos' ? 'Tu bóveda está vacía' : `Sin elementos en ${activeCategory}`}
      </h3>
      <p className="text-xs text-zinc-400 mt-1.5 max-w-sm leading-relaxed">
        {activeCategory === 'Todos'
          ? 'Comienza a organizar tus contraseñas, notas confidenciales, enlaces importantes y archivos PDF protegidos.'
          : `Añade tu primer elemento para clasificarlo de forma segura en este apartado.`}
      </p>
      <button
        id="empty-state-add-btn"
        onClick={onOpenCreateItem}
        className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-lg shadow-violet-900/40 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Agregar elemento a {activeCategory}</span>
      </button>
    </div>
  );
};
