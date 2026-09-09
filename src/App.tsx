import React, { useState } from 'react';
import { useMLockData } from './hooks/useMLockData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ItemCard } from './components/ItemCard';
import { CreateItemModal } from './components/CreateItemModal';
import { AddCategoryModal } from './components/AddCategoryModal';
import { ItemDetailModal } from './components/ItemDetailModal';
import { AuthPage } from './components/AuthPage';
import { EmptyState } from './components/EmptyState';
import { MLockItem } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const {
    items,
    filteredItems,
    categories,
    categoryCounts,
    user,
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
  } = useMLockData();

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [selectedItemForDetail, setSelectedItemForDetail] = useState<MLockItem | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // If user session is checking on initial load
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-3" />
        <p className="text-xs font-medium">Verificando sesión segura...</p>
      </div>
    );
  }

  // First page: AUTH PAGE if not logged in
  if (!user) {
    return <AuthPage />;
  }

  // Main Dashboard View (Only accessible once logged in)
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
    </div>
  );
}
