import React from 'react';
import { 
  Shield, 
  Layers, 
  KeyRound, 
  FileText, 
  Link2, 
  FileCheck2, 
  Plus, 
  Trash2, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { CustomCategory } from '../types';

interface SidebarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  categories: CustomCategory[];
  categoryCounts: Record<string, number>;
  onOpenAddCategory: () => void;
  onDeleteCategory: (id: string, name: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeCategory,
  onSelectCategory,
  categories,
  categoryCounts,
  onOpenAddCategory,
  onDeleteCategory,
  isOpenMobile,
  onCloseMobile,
}) => {
  const mainNavItems = [
    { name: 'Todos', icon: Layers, countKey: 'Todos' },
    { name: 'Cuentas', icon: KeyRound, countKey: 'Cuentas' },
    { name: 'Notas', icon: FileText, countKey: 'Notas' },
    { name: 'Links', icon: Link2, countKey: 'Links' },
    { name: 'PDFs', icon: FileCheck2, countKey: 'PDFs' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex-col bg-zinc-950 border-r border-zinc-900 transition-transform duration-300 lg:static lg:translate-x-0 flex ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-900/80">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-violet-950/70 border border-violet-500/40 text-violet-400 shadow-md shadow-violet-950/50">
              <Shield className="w-5 h-5 text-violet-400" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-wider text-zinc-100 font-sans">MLock</span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-violet-950/80 text-violet-300 border border-violet-800/50">
                  Vault
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">Panel Personal Seguro</p>
            </div>
          </div>

          <button
            id="close-sidebar-btn"
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 lg:hidden"
            aria-label="Cerrar navegación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 px-4 py-5 overflow-y-auto space-y-6">
          {/* Main Navigation Sections */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              <span>Apartados Principales</span>
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeCategory === item.name;
                const count = categoryCounts[item.countKey] || 0;

                return (
                  <button
                    key={item.name}
                    id={`nav-item-${item.name.toLowerCase()}`}
                    onClick={() => {
                      onSelectCategory(item.name);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-violet-900/30 text-violet-200 border border-violet-500/30 shadow-sm shadow-violet-900/20'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-violet-400' : 'text-zinc-400 group-hover:text-zinc-300'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-mono transition-colors ${
                        isActive
                          ? 'bg-violet-950 text-violet-300 border border-violet-700/50'
                          : 'bg-zinc-900 text-zinc-400 group-hover:text-zinc-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Dynamic Categories Section */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold tracking-wider text-zinc-400 uppercase">
              <span>Mis Apartados</span>
              <span className="text-[10px] text-zinc-400 font-mono">({categories.length})</span>
            </div>

            {categories.length === 0 ? (
              <div className="px-3 py-3 rounded-lg border border-dashed border-zinc-900 text-center">
                <p className="text-xs text-zinc-400">Sin apartados personalizados aún.</p>
              </div>
            ) : (
              <nav className="space-y-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.name;
                  const count = categoryCounts[cat.name] || 0;

                  return (
                    <div
                      key={cat.id}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-violet-900/25 text-violet-200 border border-violet-500/30'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                      }`}
                    >
                      <button
                        id={`custom-cat-${cat.slug}`}
                        onClick={() => {
                          onSelectCategory(cat.name);
                          onCloseMobile();
                        }}
                        className="flex-1 flex items-center gap-2.5 text-left truncate"
                      >
                        <span
                          className={`w-2 h-2 rounded-full flex-shrink-0 ${
                            cat.color === 'emerald'
                              ? 'bg-emerald-400'
                              : cat.color === 'amber'
                              ? 'bg-amber-400'
                              : cat.color === 'rose'
                              ? 'bg-rose-400'
                              : cat.color === 'cyan'
                              ? 'bg-cyan-400'
                              : 'bg-violet-400'
                          }`}
                        />
                        <span className="truncate">{cat.name}</span>
                      </button>

                      <div className="flex items-center gap-1.5 pl-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-zinc-900 text-zinc-400">
                          {count}
                        </span>
                        <button
                          id={`delete-cat-${cat.slug}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`¿Eliminar el apartado "${cat.name}"?`)) {
                              onDeleteCategory(cat.id, cat.name);
                            }
                          }}
                          className="p-1 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Eliminar apartado"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </nav>
            )}

            {/* + Añadir Apartado Button */}
            <button
              id="add-category-sidebar-btn"
              onClick={onOpenAddCategory}
              className="mt-2.5 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-violet-500/30 bg-violet-950/20 text-violet-300 hover:bg-violet-900/30 hover:border-violet-500/60 text-xs font-semibold tracking-wide transition-all group"
            >
              <Plus className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
              <span>+ Añadir Apartado</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
