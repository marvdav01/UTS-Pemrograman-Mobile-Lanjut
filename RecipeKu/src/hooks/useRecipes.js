// src/hooks/useRecipes.js
import { useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchRecipes,
  searchRecipesByName,
  fetchRecipeById,
  fetchRecipeTags,
  fetchRecipesByTag,
} from '../api/recipeApi';

// Konfigurasi waktu Cache TanStack Query
export const STALE_TIME = 1000 * 60 * 5; // 5 menit data dianggap fresh (tidak refetch ulang saat kembali ke halaman)
export const GC_TIME = 1000 * 60 * 30;   // 30 menit disimpan di memori sebelum garbage collection

// Struktur Query Keys terstandarisasi
export const RECIPE_QUERY_KEYS = {
  all: ['recipes'],
  lists: () => [...RECIPE_QUERY_KEYS.all, 'list'],
  list: (tag = 'All') => [...RECIPE_QUERY_KEYS.lists(), tag],
  searches: () => [...RECIPE_QUERY_KEYS.all, 'search'],
  search: (query) => [...RECIPE_QUERY_KEYS.searches(), query],
  details: () => [...RECIPE_QUERY_KEYS.all, 'detail'],
  detail: (id) => [...RECIPE_QUERY_KEYS.details(), Number(id)],
  tags: () => [...RECIPE_QUERY_KEYS.all, 'tags'],
};

/**
 * Hook untuk mengambil daftar resep (semua resep atau berdasarkan tag/kategori)
 */
export const useRecipesList = (selectedTag = 'All') => {
  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.list(selectedTag),
    queryFn: () => {
      if (!selectedTag || selectedTag === 'All') {
        return fetchRecipes({ limit: 50, skip: 0 });
      }
      return fetchRecipesByTag(selectedTag);
    },
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: true,
  });
};

/**
 * Hook untuk mencari resep berdasarkan nama makanan via endpoint /recipes/search?q=
 * Menggunakan properti `enabled` agar API hanya dipanggil ketika kata kunci tidak kosong
 */
export const useSearchRecipes = (debouncedQuery) => {
  const normalizedQuery = (debouncedQuery || '').trim();

  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.search(normalizedQuery),
    queryFn: () => searchRecipesByName(normalizedQuery),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: normalizedQuery.length > 0,
  });
};

/**
 * Hook untuk mengambil detail resep berdasarkan ID via endpoint /recipes/{id}
 * Menggunakan cache placeholder dari daftar resep jika sudah pernah dimuat sebelumnya
 */
export const useRecipeDetail = (recipeId) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.detail(recipeId),
    queryFn: () => fetchRecipeById(recipeId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: Boolean(recipeId),
    initialData: () => {
      // Cek apakah resep sudah ada di dalam cache daftar utama ['recipes', 'list', 'All']
      const cachedList = queryClient.getQueryData(RECIPE_QUERY_KEYS.list('All'));
      if (cachedList?.recipes) {
        return cachedList.recipes.find((item) => Number(item.id) === Number(recipeId));
      }
      return undefined;
    },
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(RECIPE_QUERY_KEYS.list('All'))?.dataUpdatedAt,
  });
};

/**
 * Hook untuk mengambil daftar tag resep dari endpoint /recipes/tags
 */
export const useRecipeTags = () => {
  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.tags(),
    queryFn: fetchRecipeTags,
    staleTime: 1000 * 60 * 15,
    gcTime: GC_TIME,
  });
};

/**
 * Hook untuk pencarian berdasarkan bahan makanan (Search by Ingredients).
 *
 * Catatan Teknis Keterbatasan API:
 * Dokumentasi resmi DummyJSON Recipes (https://dummyjson.com/docs/recipes) hanya menyediakan
 * pencarian server berbasis nama resep (`/recipes/search?q=`) dan filter tag (`/recipes/tag/{tag}`),
 * serta TIDAK memiliki endpoint khusus pencarian bahan makanan di sisi server.
 * Oleh karena itu, hook ini menggunakan data katalog resep dari endpoint resmi `GET /recipes?limit=50`
 * yang dikelola dan di-cache oleh TanStack Query, lalu melakukan pencocokan multi-bahan
 * terhadap properti `recipe.ingredients` di sisi client secara akurat.
 */
export const useRecipesByIngredients = (selectedIngredients = [], keywordInput = '') => {
  const listQuery = useRecipesList('All');

  const filteredData = useMemo(() => {
    const allRecipes = listQuery.data?.recipes || [];
    const activeChips = selectedIngredients.map((item) => item.toLowerCase().trim()).filter(Boolean);
    const typedKeywords = (keywordInput || '')
      .split(',')
      .map((item) => item.toLowerCase().trim())
      .filter(Boolean);

    const requiredTerms = [...new Set([...activeChips, ...typedKeywords])];

    // Ekstrak bahan populer dari seluruh resep yang ada untuk memudahkan eksplorasi pengguna
    const ingredientFrequency = {};
    allRecipes.forEach((recipe) => {
      (recipe.ingredients || []).forEach((ing) => {
        const lower = ing.toLowerCase();
        const commonKeys = [
          'garlic',
          'onion',
          'chicken',
          'cheese',
          'tomato',
          'olive oil',
          'butter',
          'egg',
          'flour',
          'milk',
          'pasta',
          'rice',
          'beef',
          'ginger',
          'Basil',
          'Lemon',
          'Potato',
          'Spinach',
          'Mushroom',
          'Shrimp',
        ];
        commonKeys.forEach((key) => {
          if (lower.includes(key.toLowerCase())) {
            const label = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            ingredientFrequency[label] = (ingredientFrequency[label] || 0) + 1;
          }
        });
      });
    });

    const popularIngredients = Object.entries(ingredientFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([name, count]) => ({ name, count }));

    if (requiredTerms.length === 0) {
      return {
        recipes: allRecipes,
        matchedCount: allRecipes.length,
        requiredTerms: [],
        popularIngredients,
      };
    }

    const matchedRecipes = allRecipes
      .map((recipe) => {
        const recipeIngredients = recipe.ingredients || [];
        const matchedIngredients = recipeIngredients.filter((ing) =>
          requiredTerms.some((term) => ing.toLowerCase().includes(term))
        );
        const matchesAllTerms = requiredTerms.every((term) =>
          recipeIngredients.some((ing) => ing.toLowerCase().includes(term))
        );

        return {
          ...recipe,
          matchedIngredients,
          matchesAllTerms,
        };
      })
      .filter((recipe) => recipe.matchesAllTerms);

    return {
      recipes: matchedRecipes,
      matchedCount: matchedRecipes.length,
      requiredTerms,
      popularIngredients,
    };
  }, [listQuery.data, selectedIngredients, keywordInput]);

  return {
    ...listQuery,
    ...filteredData,
  };
};
