import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  FolderPlus, 
  LogOut, 
  User as UserIcon, 
  SlidersHorizontal,
  X,
  ShieldCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { signOut } from '../lib/supabase';

interface NavbarProps {
  onOpenMobileSidebar: () => void;
  activeCategory: string;
  totalFiltered: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'newest' | 'oldest' | 'title';
  onSortChange: (sort: 'newest' | 'oldest' | 'title') => void;
  onOpenCreateItem: () => void;
  onOpenAddCategory: () => void;
  user: UserProfile | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileSidebar,
  activeCategory,
  totalFiltered,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenCreateItem,
  onOpenAddCategory,
  user,
  onLogout,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header id="app-navbar" className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-900 px-4 lg:px-8 py-3.5">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Mobile Menu + Active Section Heading */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onOpenMobileSidebar}
            className="p-2 -ml-1 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg lg:text-xl font-bold text-zinc-100 tracking-tight font-sans">
                {activeCategory}
              </h1>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-800">
                {totalFiltered} {totalFiltered === 1 ? 'ítem' : 'ítems'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">
              {activeCategory === 'Todos'
                ? 'Todos los elementos protegidos en tu bóveda'
                : `Elementos clasificados en ${activeCategory}`}
            </p>
          </div>
        </div>

        {/* Center/Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por título, servicio, nota, enlace..."
              className="w-full bg-zinc-900/90 text-sm text-zinc-100 placeholder-zinc-400 pl-10 pr-9 py-2 rounded-xl border border-zinc-800/90 focus:outline-none focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Sort, Add Apartado, Main Agregar Button & Auth */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Sort Selector */}
          <div className="relative hidden sm:block">
            <select
              id="sort-selector"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="bg-zinc-900/80 text-xs font-medium text-zinc-300 border border-zinc-800 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:border-violet-500/60 cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="title">Título (A-Z)</option>
            </select>
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Quick Add Apartado Button */}
          <button
            id="navbar-add-category-btn"
            onClick={onOpenAddCategory}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 transition-all"
            title="Crear un nuevo apartado personalizado"
          >
            <FolderPlus className="w-3.5 h-3.5 text-violet-400" />
            <span>+ Apartado</span>
          </button>

          {/* Primary AGREGAR Button */}
          <button
            id="main-add-item-btn"
            onClick={onOpenCreateItem}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white font-medium text-xs sm:text-sm tracking-wide shadow-lg shadow-violet-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-violet-400/50"
          >
            <Plus className="w-4 h-4 text-white stroke-[2.5]" />
            <span>Agregar</span>
          </button>

          {/* User Profile / Auth Button */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 transition-colors"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.email || 'Usuario'}
                      className="w-6 h-6 rounded-full ring-1 ring-violet-500/40"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-violet-950 border border-violet-700/60 text-violet-300 flex items-center justify-center text-xs font-bold">
                      {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-medium text-zinc-200 hidden md:block max-w-[110px] truncate">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-zinc-900 mb-1">
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mb-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sesión Autenticada</span>
                      </div>
                      <p className="text-xs font-medium text-zinc-200 truncate">{user.email}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {user.id.substring(0, 12)}...</p>
                    </div>

                    <button
                      id="logout-btn"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile search bar if screen is small */}
      <div className="mt-3 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar en la bóveda..."
            className="w-full bg-zinc-900 text-sm text-zinc-100 placeholder-zinc-400 pl-9 pr-8 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-violet-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
