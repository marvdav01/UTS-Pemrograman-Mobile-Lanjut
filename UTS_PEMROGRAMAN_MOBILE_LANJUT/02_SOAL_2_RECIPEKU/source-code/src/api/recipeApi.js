// src/api/recipeApi.js
import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Flag opsional untuk pengujian QA skenario Error Handling & Tombol Retry
let simulateNetworkError = false;

export const setSimulateNetworkError = (value) => {
  simulateNetworkError = Boolean(value);
};

export const getSimulateNetworkError = () => simulateNetworkError;

const checkSimulatedError = () => {
  if (simulateNetworkError) {
    const error = new Error(
      'Gagal terhubung ke server DummyJSON API. Periksa koneksi internet Anda atau coba beberapa saat lagi.'
    );
    error.code = 'ERR_SIMULATED_NETWORK';
    throw error;
  }
};

/**
 * 1. Mengambil daftar seluruh resep masakan dari DummyJSON
 * Endpoint: GET https://dummyjson.com/recipes?limit=50&skip=0
 */
export const fetchRecipes = async ({ limit = 50, skip = 0 } = {}) => {
  checkSimulatedError();
  const response = await apiClient.get('/recipes', {
    params: { limit, skip },
  });
  return response.data;
};

/**
 * 2. Mencari resep masakan berdasarkan nama makanan
 * Endpoint: GET https://dummyjson.com/recipes/search?q={query}
 */
export const searchRecipesByName = async (query) => {
  checkSimulatedError();
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) {
    return { recipes: [], total: 0, skip: 0, limit: 0 };
  }
  const response = await apiClient.get('/recipes/search', {
    params: { q: cleanQuery },
  });
  return response.data;
};

/**
 * 3. Mengambil detail lengkap satu resep berdasarkan ID
 * Endpoint: GET https://dummyjson.com/recipes/{id}
 */
export const fetchRecipeById = async (id) => {
  checkSimulatedError();
  if (!id) {
    throw new Error('ID Resep tidak valid.');
  }
  const response = await apiClient.get(`/recipes/${id}`);
  return response.data;
};

/**
 * 4. Mengambil daftar tag / kategori resep dari DummyJSON
 * Endpoint: GET https://dummyjson.com/recipes/tags
 */
export const fetchRecipeTags = async () => {
  checkSimulatedError();
  const response = await apiClient.get('/recipes/tags');
  return response.data;
};

/**
 * 5. Mengambil daftar resep berdasarkan tag spesifik
 * Endpoint: GET https://dummyjson.com/recipes/tag/{tag}
 */
export const fetchRecipesByTag = async (tag) => {
  checkSimulatedError();
  const response = await apiClient.get(`/recipes/tag/${encodeURIComponent(tag)}`);
  return response.data;
};

