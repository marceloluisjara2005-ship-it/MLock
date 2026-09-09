import React, { useState } from 'react';
import { useMLockData } from './hooks/useMLockData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ItemCard } from './components/ItemCard';
import { CreateItemModal } from './components/CreateItemModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { SqlSchemaModal } from './components/SqlSchemaModal';
import { SupabaseConfigModal } from './components/SupabaseConfigModal';
import { EmptyState } from './components/EmptyState';
import { MLockItem } from './types';
import { AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const {
    items,
    filteredItems,
    categories,
    categoryCounts,
    user,
    isSupabaseMode,
    loading,
    actionLoading,
    error,
    clearError,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addItem,
    deleteItem,
    addCategory,
    deleteCategory,
    resetDemoData,
  } = useMLockData();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MLockItem | null>(null);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row font-sans selection:bg-violet-600 selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        categories={categories}
        categoryCounts={categoryCounts}
        onOpenAddCategory={() => setIsAddCategoryOpen(true)}
        onDeleteCategory={deleteCategory}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isSupabaseMode={isSupabaseMode}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        <Navbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          activeCategory={activeCategory}
          totalFiltered={filteredItems.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onOpenCreateItem={() => setIsCreateOpen(true)}
          onOpenAddCategory={() => setIsAddCategoryOpen(true)}
          user={user}
          isSupabaseMode={isSupabaseMode}
          onOpenConfig={() => setIsConfigModalOpen(true)}
        />

        {/* Global Error Banner */}
        {error && (
          <div className="mx-4 lg:mx-8 mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="text-xs text-rose-400 hover:text-rose-200 ml-3"
            >
              Descartar
            </button>
          </div>
        )}

        {/* Informative Mode Tag (if in Demo Mode) */}
        {!isSupabaseMode && (
          <div className="mx-4 lg:mx-8 mt-3 px-3.5 py-2 rounded-xl bg-violet-950/20 border border-violet-900/30 text-xs text-violet-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
              <span>
                <strong>Modo Demostración Activo:</strong> Puedes crear cuentas, notas, links, PDFs y apartados dinámicos con persistencia local.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSqlModalOpen(true)}
                className="underline hover:text-violet-100 font-medium text-[11px]"
              >
                Ver SQL & RLS
              </button>
              <span>•</span>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="underline hover:text-violet-100 font-medium text-[11px]"
              >
                Conectar Supabase
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Section Summary Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-zinc-400 font-medium">
                Mostrando <span className="text-zinc-200 font-bold">{filteredItems.length}</span> elementos en{' '}
                <span className="text-violet-400 font-semibold">{activeCategory}</span>
                {searchQuery && (
                  <span> para "<span className="text-zinc-200">{searchQuery}</span>"</span>
                )}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 animate-pulse p-5 space-y-4"
                >
                  <div className="h-5 w-24 bg-zinc-800 rounded-md" />
                  <div className="h-6 w-3/4 bg-zinc-800 rounded-md" />
                  <div className="h-4 w-full bg-zinc-800/60 rounded-md" />
                  <div className="h-10 w-full bg-zinc-800/40 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              isSearch={Boolean(searchQuery)}
              activeCategory={activeCategory}
              onOpenCreateItem={() => setIsCreateOpen(true)}
              onClearSearch={() => setSearchQuery('')}
            />
          ) : (
            /* Floating Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onDelete={deleteItem}
                  onViewDetails={(item) => setSelectedItemForDetail(item)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Dynamic Creation Modal */}
      <CreateItemModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        categories={categories}
        defaultCategory={activeCategory === 'Todos' ? 'Cuenta' : activeCategory}
        onSave={addItem}
        actionLoading={actionLoading}
      />

      {/* Add Custom Category Modal */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onAddCategory={addCategory}
        actionLoading={actionLoading}
      />

      {/* Item Detail View Modal */}
      <ItemDetailModal
        item={selectedItemForDetail}
        onClose={() => setSelectedItemForDetail(null)}
        onDelete={deleteItem}
      />

      {/* Supabase SQL Schema & RLS Modal */}
      <SqlSchemaModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      {/* Supabase Connection Config Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onResetDemo={resetDemoData}
      />
    </div>
  );
}
