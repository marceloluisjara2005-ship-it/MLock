import { useState, useEffect, useCallback, useMemo } from 'react';
import { CustomCategory, ItemCategoryType, MLockItem, UserProfile } from '../types';
import { getSupabase, uploadPdfToSupabase, deletePdfFromSupabase } from '../lib/supabase';
import { INITIAL_DEMO_CATEGORIES, INITIAL_DEMO_ITEMS } from '../lib/mockData';

export function useMLockData() {
  const [items, setItems] = useState<MLockItem[]>(() => {
    const saved = localStorage.getItem('mlock_items_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DEMO_ITEMS;
  });

  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    const saved = localStorage.getItem('mlock_categories_data');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_DEMO_CATEGORIES;
  });

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSupabaseMode, setIsSupabaseMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Initialize Supabase Auth & Session listener
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setIsSupabaseMode(false);
      setLoading(false);
      return;
    }

    setIsSupabaseMode(true);

    // Check active session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        });
        loadSupabaseData(user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    }).catch((err) => {
      console.warn('Supabase auth error:', err);
      setLoading(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          user_metadata: session.user.user_metadata,
        });
        loadSupabaseData(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Save to local storage when in offline/demo mode
  useEffect(() => {
    if (!isSupabaseMode || !user) {
      localStorage.setItem('mlock_items_data', JSON.stringify(items));
    }
  }, [items, isSupabaseMode, user]);

  useEffect(() => {
    if (!isSupabaseMode || !user) {
      localStorage.setItem('mlock_categories_data', JSON.stringify(categories));
    }
  }, [categories, isSupabaseMode, user]);

  // Load from Supabase
  const loadSupabaseData = async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('mlock_categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (catError) throw catError;
      if (catData) setCategories(catData);

      // 2. Fetch items
      const { data: itemsData, error: itemsError } = await supabase
        .from('mlock_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (itemsError) throw itemsError;
      if (itemsData) setItems(itemsData);
    } catch (err: any) {
      console.error('Error fetching Supabase data:', err);
      setError(err.message || 'Error al sincronizar con Supabase');
    } finally {
      setLoading(false);
    }
  };

  // Add Item
  const addItem = async (
    itemData: {
      title: string;
      category: ItemCategoryType;
      description?: string;
      metadata: Record<string, any>;
    },
    pdfFile?: File | null
  ) => {
    setActionLoading(true);
    setError(null);

    try {
      const currentUserId = user?.id || 'demo-user';
      let finalMetadata = { ...itemData.metadata };

      // Handle PDF Upload
      if (itemData.category === 'PDF' && pdfFile) {
        if (isSupabaseMode && user) {
          // Upload to Supabase Storage
          const { path, url } = await uploadPdfToSupabase(pdfFile, user.id);
          finalMetadata.fileName = pdfFile.name;
          finalMetadata.fileSize = pdfFile.size;
          finalMetadata.filePath = path;
          finalMetadata.fileUrl = url;
        } else {
          // Local fallback: convert to base64 DataURL
          const reader = new FileReader();
          const dataUrl = await new Promise<string>((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(pdfFile);
          });
          finalMetadata.fileName = pdfFile.name;
          finalMetadata.fileSize = pdfFile.size;
          finalMetadata.fileUrl = dataUrl;
          finalMetadata.filePath = `local/${pdfFile.name}`;
        }
      }

      const newItem: MLockItem = {
        id: isSupabaseMode && user ? crypto.randomUUID() : `item-${Date.now()}`,
        user_id: currentUserId,
        title: itemData.title.trim(),
        category: itemData.category,
        description: itemData.description?.trim() || '',
        metadata: finalMetadata,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseMode && user) {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase client is not available');

        const { data, error: insertError } = await supabase
          .from('mlock_items')
          .insert([newItem])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          setItems((prev) => [data, ...prev]);
        }
      } else {
        setItems((prev) => [newItem, ...prev]);
      }

      return true;
    } catch (err: any) {
      console.error('Error adding item:', err);
      setError(err.message || 'Error al guardar el elemento');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Item
  const deleteItem = async (itemId: string) => {
    setActionLoading(true);
    setError(null);

    try {
      const itemToDelete = items.find((i) => i.id === itemId);
      if (itemToDelete?.category === 'PDF' && itemToDelete.metadata?.filePath && isSupabaseMode && user) {
        await deletePdfFromSupabase(itemToDelete.metadata.filePath);
      }

      if (isSupabaseMode && user) {
        const supabase = getSupabase();
        if (supabase) {
          const { error: delError } = await supabase
            .from('mlock_items')
            .delete()
            .eq('id', itemId);
          if (delError) throw delError;
        }
      }

      setItems((prev) => prev.filter((item) => item.id !== itemId));
      return true;
    } catch (err: any) {
      console.error('Error deleting item:', err);
      setError(err.message || 'Error al eliminar el elemento');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Add Dynamic Category / Section
  const addCategory = async (name: string, color = 'violet', icon = 'folder') => {
    setActionLoading(true);
    setError(null);

    try {
      const currentUserId = user?.id || 'demo-user';
      const cleanName = name.trim();
      const slug = cleanName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      // Check duplicate
      const exists = categories.some(
        (c) => c.name.toLowerCase() === cleanName.toLowerCase() ||
        ['todos', 'cuentas', 'notas', 'links', 'pdfs'].includes(cleanName.toLowerCase())
      );
      if (exists) {
        throw new Error('Ya existe una categoría o apartado con este nombre');
      }

      const newCategory: CustomCategory = {
        id: isSupabaseMode && user ? crypto.randomUUID() : `cat-${Date.now()}`,
        user_id: currentUserId,
        name: cleanName,
        slug,
        icon,
        color,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseMode && user) {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Supabase client is not available');

        const { data, error: insertError } = await supabase
          .from('mlock_categories')
          .insert([newCategory])
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) {
          setCategories((prev) => [...prev, data]);
        }
      } else {
        setCategories((prev) => [...prev, newCategory]);
      }

      // Automatically select new category
      setActiveCategory(cleanName);
      return true;
    } catch (err: any) {
      console.error('Error adding category:', err);
      setError(err.message || 'Error al crear el apartado');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Dynamic Category
  const deleteCategory = async (categoryId: string, categoryName: string) => {
    setActionLoading(true);
    setError(null);

    try {
      if (isSupabaseMode && user) {
        const supabase = getSupabase();
        if (supabase) {
          const { error: delError } = await supabase
            .from('mlock_categories')
            .delete()
            .eq('id', categoryId);
          if (delError) throw delError;
        }
      }

      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      if (activeCategory === categoryName) {
        setActiveCategory('Todos');
      }
      return true;
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Error al eliminar el apartado');
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // Reset demo data
  const resetDemoData = () => {
    setItems(INITIAL_DEMO_ITEMS);
    setCategories(INITIAL_DEMO_CATEGORIES);
    setActiveCategory('Todos');
    localStorage.removeItem('mlock_items_data');
    localStorage.removeItem('mlock_categories_data');
  };

  // Filtered & Sorted Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Category Filter
        if (activeCategory !== 'Todos') {
          // Match standard categories or custom ones
          if (activeCategory === 'Cuentas') {
            if (item.category !== 'Cuenta') return false;
          } else if (activeCategory === 'Notas') {
            if (item.category !== 'Nota') return false;
          } else if (activeCategory === 'Links') {
            if (item.category !== 'Link') return false;
          } else if (activeCategory === 'PDFs') {
            if (item.category !== 'PDF') return false;
          } else {
            // Custom category match
            if (item.category.toLowerCase() !== activeCategory.toLowerCase()) {
              return false;
            }
          }
        }

        // Search Query Filter
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q) || false;
          const matchService = item.metadata?.service?.toLowerCase().includes(q) || false;
          const matchEmail = item.metadata?.email?.toLowerCase().includes(q) || false;
          const matchNote = item.metadata?.content?.toLowerCase().includes(q) || false;
          const matchUrl = item.metadata?.url?.toLowerCase().includes(q) || false;
          const matchFile = item.metadata?.fileName?.toLowerCase().includes(q) || false;

          return matchTitle || matchDesc || matchService || matchEmail || matchNote || matchUrl || matchFile;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [items, activeCategory, searchQuery, sortBy]);

  // Counts for each standard and custom category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Todos: items.length,
      Cuentas: items.filter((i) => i.category === 'Cuenta').length,
      Notas: items.filter((i) => i.category === 'Nota').length,
      Links: items.filter((i) => i.category === 'Link').length,
      PDFs: items.filter((i) => i.category === 'PDF').length,
    };

    categories.forEach((cat) => {
      counts[cat.name] = items.filter(
        (i) => i.category.toLowerCase() === cat.name.toLowerCase()
      ).length;
    });

    return counts;
  }, [items, categories]);

  return {
    items,
    filteredItems,
    categories,
    categoryCounts,
    user,
    isSupabaseMode,
    loading,
    actionLoading,
    error,
    clearError: () => setError(null),
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
    reloadSupabaseData: () => user && loadSupabaseData(user.id),
  };
}
