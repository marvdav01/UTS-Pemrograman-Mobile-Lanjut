# DOKUMENTASI TEKNIS APLIKASI RECIPEKU – INDONESIAN RECIPE EXPLORER

**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Mahasiswa:** Marviel David (411231222)  
**Soal:** Soal 2 (Bobot 35% – CPMK 2: Mengimplementasikan manajemen state dan integrasi API)  

---

## 1. Arsitektur dan Struktur Proyek React Native

Aplikasi **RecipeKu – Indonesian Recipe Explorer** dirancang menggunakan pemisahan lapisan (*Layered Architecture*) yang terdiri atas lapisan antarmuka (`src/screens` & `src/components`), lapisan navigasi (`src/navigation`), lapisan pengelolaan *Server State* (`src/hooks`), lapisan layanan jaringan (`src/api`), serta lapisan utilitas dan konstanta (`src/utils` & `src/constants`).

### 1.1. Struktur Folder Proyek Aktual

Struktur berikut telah diverifikasi langsung terhadap kode sumber pada direktori `RecipeKu/`:

```text
RecipeKu/
├── App.js                                    # Root component: QueryClient, QueryClientProvider, SafeAreaProvider
├── index.js                                  # Entry point aplikasi Expo (registerRootComponent)
├── app.json                                  # Konfigurasi identitas aplikasi Expo
├── package.json                              # Spesifikasi dependency dan script proyek
├── package-lock.json                         # Lockfile pohon dependency npm
├── verify_recipeku_api.js                    # Skrip verifikasi konfigurasi, logika filter, dan endpoint API
├── README.md                                 # Panduan instalasi dan eksekusi aplikasi
├── assets/
│   └── recipeku_logo.svg                     # Aset vektor logo RecipeKu
└── src/
    ├── api/
    │   └── recipeApi.js                      # Konfigurasi Axios & 5 fungsi pemanggil endpoint DummyJSON
    ├── components/
    │   ├── EmptyState.js                     # Komponen reusable tampilan data kosong / tidak ditemukan
    │   ├── ErrorState.js                     # Komponen reusable tampilan error jaringan & tombol Retry
    │   ├── Loading.js                        # Komponen reusable indikator loading & skeleton card
    │   ├── RecipeCard.js                     # Komponen reusable kartu informasi ringkas resep
    │   └── SearchBar.js                      # Komponen reusable TextInput pencarian & tombol clear (✕)
    ├── constants/
    │   └── colors.js                         # Konstanta desain: COLORS, SPACING, dan RADIUS
    ├── hooks/
    │   └── useRecipes.js                     # Custom hooks TanStack Query & filtering bahan makanan
    ├── navigation/
    │   └── AppNavigator.js                   # Konfigurasi NativeStackNavigator & BottomTabNavigator
    ├── screens/
    │   ├── CookingInstructionsScreen.js      # Layar panduan langkah memasak interaktif
    │   ├── DetailScreen.js                   # Layar detail resep, daftar bahan (ceklis), & instruksi
    │   ├── HomeScreen.js                     # Layar utama katalog resep (FlatList) & filter kategori
    │   ├── IngredientsScreen.js              # Layar pencarian resep berdasarkan kombinasi bahan makanan
    │   └── SearchScreen.js                   # Layar pencarian resep berdasarkan nama makanan (API)
    └── utils/
        ├── formatters.js                     # Fungsi pemformat waktu memasak, tingkat kesulitan, & deskripsi
        └── useDebounce.js                    # Custom hook penunda input pencarian (default 450 ms)
```

### 1.2. Konfigurasi `package.json` dan Konsistensi Versi

Berdasarkan pemeriksaan langsung pada `package.json` dan `package-lock.json`, proyek menggunakan konfigurasi aktual berikut:

```json
{
  "name": "recipeku",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node ./node_modules/expo/bin/cli start",
    "android": "node ./node_modules/expo/bin/cli start --android",
    "ios": "node ./node_modules/expo/bin/cli start --ios",
    "web": "node ./node_modules/expo/bin/cli start --web"
  },
  "dependencies": {
    "@expo/metro-runtime": "~58.0.17",
    "@expo/vector-icons": "^15.0.2",
    "@react-navigation/bottom-tabs": "^7.2.0",
    "@react-navigation/native": "^7.0.14",
    "@react-navigation/native-stack": "^7.2.0",
    "@tanstack/react-query": "^5.66.0",
    "axios": "^1.7.9",
    "expo": "~58.0.25",
    "expo-status-bar": "~58.0.5",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-native": "0.88.1",
    "react-native-safe-area-context": "~5.11.1",
    "react-native-screens": "~4.30.1",
    "react-native-web": "~0.21.4"
  },
  "private": true
}
```

---

## 2. Dokumentasi Integrasi REST API (`src/api/recipeApi.js`)

Seluruh komunikasi jaringan diabstraksi di dalam file `src/api/recipeApi.js` menggunakan *instance* Axios (`apiClient`) dengan `baseURL: 'https://dummyjson.com'` dan batas waktu tunggu `timeout: 12000` (12 detik).

### 2.1. Ringkasan 5 Endpoint Resmi DummyJSON yang Digunakan

| No | Endpoint REST API | Fungsi pada `recipeApi.js` | Parameter Request | Struktur Data Response Utama | Komponen / Screen Pengguna |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | `GET /recipes?limit=50` | `fetchRecipes({ limit = 50, skip = 0 })` | Query params: `limit=50`, `skip=0` | `{ recipes: [...], total: 50, skip: 0, limit: 50 }` | `HomeScreen.js`, `IngredientsScreen.js`, `RecipeCard.js` |
| 2 | `GET /recipes/search?q=Pizza` | `searchRecipesByName(query)` | Query param: `q` (string kata kunci nama resep) | `{ recipes: [...], total: N, skip: 0, limit: N }` | `SearchScreen.js`, `SearchBar.js`, `RecipeCard.js` |
| 3 | `GET /recipes/{id}` | `fetchRecipeById(id)` | Path param: `id` (ID numerik resep, mis. `1`) | Objek tunggal resep (`id`, `name`, `ingredients`, `instructions`, `prepTimeMinutes`, `cookTimeMinutes`, `servings`, `caloriesPerServing`, `image`, `rating`, `cuisine`, `tags`) | `DetailScreen.js`, `CookingInstructionsScreen.js` |
| 4 | `GET /recipes/tags` | `fetchRecipeTags()` | Tanpa parameter | Array string tag kuliner (`["Pizza", "Italian", "Vegetarian", ...]`) | `HomeScreen.js` (ScrollView chip kategori) |
| 5 | `GET /recipes/tag/{tag}` | `fetchRecipesByTag(tag)` | Path param: `tag` (nama tag terenkode URL) | `{ recipes: [...], total: N, skip: 0, limit: N }` | `HomeScreen.js` (ketika chip kategori selain `'All'` dipilih) |

### 2.2. Implementasi Kode `src/api/recipeApi.js`

```javascript
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

// 1. GET /recipes?limit=50&skip=0
export const fetchRecipes = async ({ limit = 50, skip = 0 } = {}) => {
  checkSimulatedError();
  const response = await apiClient.get('/recipes', { params: { limit, skip } });
  return response.data;
};

// 2. GET /recipes/search?q={query}
export const searchRecipesByName = async (query) => {
  checkSimulatedError();
  const cleanQuery = (query || '').trim();
  if (!cleanQuery) return { recipes: [], total: 0, skip: 0, limit: 0 };
  const response = await apiClient.get('/recipes/search', { params: { q: cleanQuery } });
  return response.data;
};

// 3. GET /recipes/{id}
export const fetchRecipeById = async (id) => {
  checkSimulatedError();
  if (!id) throw new Error('ID Resep tidak valid.');
  const response = await apiClient.get(`/recipes/${id}`);
  return response.data;
};

// 4. GET /recipes/tags
export const fetchRecipeTags = async () => {
  checkSimulatedError();
  const response = await apiClient.get('/recipes/tags');
  return response.data;
};

// 5. GET /recipes/tag/{tag}
export const fetchRecipesByTag = async (tag) => {
  checkSimulatedError();
  const response = await apiClient.get(`/recipes/tag/${encodeURIComponent(tag)}`);
  return response.data;
};
```

### 2.3. Cara Aplikasi Memproses Data dan Hubungannya dengan Komponen React Native

1. **Deserialisasi di Data Layer:** Axios menerima payload JSON dari DummyJSON dan mengembalikan objek JavaScript melalui `response.data`.
2. **Pengelolaan di Logic Layer (`useRecipes.js`):** Setiap fungsi API dibungkus ke dalam *custom hook* berbasis `useQuery` dari TanStack Query yang menyediakan properti `data`, `isLoading`, `isFetching`, `isRefetching`, `isError`, `error`, `refetch`, dan `dataUpdatedAt`.
3. **Konsumsi di UI Layer (`src/screens` & `src/components`):**
   * `HomeScreen.js` membaca `data.recipes` dari `useRecipesList(selectedTag)` dan merendernya ke dalam komponen `FlatList` menggunakan `RecipeCard.js`.
   * `SearchScreen.js` meneruskan kata kunci yang telah di-*debounce* (450 ms) ke `useSearchRecipes(debouncedQuery)` dan menampilkan hasil pencarian pada `FlatList`.
   * `DetailScreen.js` membaca objek resep tunggal dari `useRecipeDetail(recipeId)` untuk menampilkan gambar hero (`Image`), informasi waktu dan kalori, daftar `recipe.ingredients` dengan fitur ceklis interaktif, serta daftar `recipe.instructions`.

---

## 3. Dokumentasi Implementasi TanStack Query

Pengelolaan *Server State* diimplementasikan pada file `App.js` dan `src/hooks/useRecipes.js`.

### 3.1. Konfigurasi `QueryClient` dan `QueryClientProvider` (`App.js`)

```javascript
// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppNavigator from './src/navigation/AppNavigator';
import { STALE_TIME, GC_TIME } from './src/hooks/useRecipes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME, // 5 menit (300.000 ms)
      gcTime: GC_TIME,       // 30 menit (1.800.000 ms)
      retry: 1,              // Mencoba ulang otomatis 1x sebelum masuk ke ErrorState
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <AppNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

### 3.2. Struktur `queryKey` dan Custom Hooks (`src/hooks/useRecipes.js`)

```javascript
// src/hooks/useRecipes.js
export const STALE_TIME = 1000 * 60 * 5; // 5 menit data dianggap fresh
export const GC_TIME = 1000 * 60 * 30;   // 30 menit disimpan di memori sebelum garbage collection

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
```

### 3.3. Penjelasan Parameter dan State TanStack Query

* **`QueryClient` & `QueryClientProvider`:** Menyediakan penyimpanan *cache* terpusat (*Query Cache*) yang dapat diakses oleh seluruh komponen layar di dalam `AppNavigator`.
* **`useQuery` & `queryKey`:** Mengidentifikasi setiap jenis permintaan API secara unik:
  * Katalog semua resep: `['recipes', 'list', 'All']`
  * Filter tag spesifik: `['recipes', 'list', selectedTag]`
  * Pencarian nama: `['recipes', 'search', normalizedQuery]`
  * Detail resep: `['recipes', 'detail', Number(id)]`
  * Daftar tag: `['recipes', 'tags']`
* **`staleTime` (`300.000 ms` / 5 menit):** Menentukan durasi data di *cache* tetap berstatus *fresh*. Selama belum melewati 5 menit, navigasi kembali ke halaman yang sama tidak memicu permintaan jaringan ulang. Khusus `useRecipeTags()`, `staleTime` diatur selama `15 menit` karena daftar tag jarang berubah.
* **`gcTime` (`1.800.000 ms` / 30 menit):** Menentukan durasi penyimpanan data kueri yang sedang tidak aktif di memori sebelum dibersihkan oleh *Garbage Collector*.
* **`retry: 1`:** Jika pemanggilan API gagal, TanStack Query otomatis mencoba ulang 1 kali sebelum menetapkan status `isError: true`.
* **`refetchOnReconnect: true`:** Menyinkronkan ulang data secara otomatis ketika koneksi internet perangkat kembali aktif.
* **`Loading State`, `Error State`, & `Refetch`:**
  * `isLoading`: Bernilai `true` saat pemuatan pertama kali dan *cache* masih kosong; memicu perenderan komponen `Loading.js`.
  * `isError` & `error`: Bernilai `true` jika permintaan gagal setelah *retry*; memicu perenderan komponen `ErrorState.js`.
  * `refetch` & `isRefetching`: Digunakan pada fitur *Pull-to-Refresh* (`RefreshControl` di `HomeScreen.js`) serta pada tombol **Retry** di `ErrorState.js`.

### 3.4. Mekanisme Caching Saat Berpindah dari Home Screen ke Detail Screen

Pada fungsi `useRecipeDetail(recipeId)` di `src/hooks/useRecipes.js`, diterapkan teknik **Initial Cache Hydration** menggunakan properti `initialData` dan `initialDataUpdatedAt`:

```javascript
export const useRecipeDetail = (recipeId) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: RECIPE_QUERY_KEYS.detail(recipeId),
    queryFn: () => fetchRecipeById(recipeId),
    staleTime: STALE_TIME,
    gcTime: GC_TIME,
    enabled: Boolean(recipeId),
    initialData: () => {
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
```

**Cara Kerja Alur Caching Home ↔ Detail:**
1. Ketika pengguna membuka `HomeScreen`, aplikasi memanggil `GET /recipes?limit=50` dan menyimpan ke-50 objek resep lengkap (termasuk `ingredients` dan `instructions`) ke dalam *cache* `['recipes', 'list', 'All']`.
2. Ketika pengguna mengetuk salah satu kartu resep (misalnya *Classic Margherita Pizza*, `id: 1`) untuk berpindah ke `DetailScreen`, fungsi `initialData` mengambil objek resep ber-ID `1` langsung dari *cache* `['recipes', 'list', 'All']` beserta waktu pembaruannya (`initialDataUpdatedAt`).
3. Karena usia data tersebut masih di bawah `staleTime` (5 menit), `DetailScreen` langsung menampilkan seluruh detail resep secara instan (0 ms) tanpa menampilkan layar *loading* dan menampilkan indikator `"• Tersimpan di Cache"`.
4. Ketika pengguna menekan tombol kembali (*Back*) menuju `HomeScreen`, daftar resep pada `['recipes', 'list', 'All']` juga langsung dirender dari memori *cache* tanpa memanggil ulang API.

---

## 4. Dokumentasi Mekanisme Pencarian Resep

Aplikasi menyediakan dua mekanisme pencarian resep yang saling melengkapi:

### 4.1. A. Pencarian Berdasarkan Nama Makanan (`SearchScreen.js`)

1. **Endpoint Server:** Menggunakan endpoint pencarian resmi DummyJSON `GET https://dummyjson.com/recipes/search?q={query}` melalui hook `useSearchRecipes(debouncedQuery)`.
2. **Mekanisme Debounce 450 ms (`src/utils/useDebounce.js`):**
   Di dalam `SearchScreen.js`, teks yang diketik pengguna pada `SearchBar` disimpan di state lokal `searchText`, lalu ditunda selama **450 milidetik** menggunakan `const debouncedQuery = useDebounce(searchText, 450)`. Hal ini mencegah pengiriman HTTP request pada setiap ketikan huruf.
3. **Conditional Fetching (`enabled`):** Pada `useSearchRecipes`, opsi `enabled: normalizedQuery.length > 0` memastikan API hanya dipanggil apabila kotak pencarian berisi teks.
4. **Penampilan Hasil dan Empty State:**
   * Jika ditemukan resep yang cocok (contoh: kata kunci `"Pizza"` mengembalikan 2 resep), hasil dirender menggunakan `FlatList` dan `RecipeCard`.
   * Jika server mengembalikan array kosong (`recipes: []`, contoh: kata kunci `"RendangSateXYZ"`), `ListEmptyComponent` pada `FlatList` merender komponen `EmptyState.js` dengan pesan *"Hasil Pencarian Tidak Ditemukan"* dan tombol **"Hapus Kata Kunci"** untuk mereset input.

### 4.2. B. Pencarian Berdasarkan Bahan Makanan (`IngredientsScreen.js` & `useRecipesByIngredients`)

1. **Keterbatasan API DummyJSON:**
   Berdasarkan dokumentasi resmi DummyJSON Recipes, endpoint pencarian server (`/recipes/search?q=`) hanya mencocokkan nama hidangan (`recipe.name`) dan tidak menyediakan endpoint khusus untuk memfilter berdasarkan bahan makanan (`ingredients`).
2. **Proses Filtering di Sisi Aplikasi (`useRecipesByIngredients`):**
   Hook `useRecipesByIngredients(selectedIngredients, keywordInput)` mengambil sumber data dari `useRecipesList('All')` (`GET /recipes?limit=50`) yang telah di-*cache* oleh TanStack Query.
3. **Optimalisasi dengan `useMemo`:**
   Di dalam `useRecipesByIngredients`, hook `useMemo` digunakan untuk:
   * Mengekstrak frekuensi 14 bahan makanan populer (`popularIngredients`) dari seluruh 50 resep di katalog berdasarkan daftar `commonKeys` (`garlic`, `onion`, `chicken`, `cheese`, `tomato`, `olive oil`, `butter`, `egg`, `flour`, `milk`, `pasta`, `rice`, `beef`, `ginger`, dll.).
   * Menggabungkan chip bahan yang dipilih pengguna (`selectedIngredients`) dengan teks bahan yang diketik (`keywordInput`, mendukung pemisahan dengan tanda koma dan *debounce* 350 ms) menjadi `requiredTerms`.
   * Memfilter array `allRecipes` menggunakan logika `requiredTerms.every((term) => recipeIngredients.some((ing) => ing.toLowerCase().includes(term)))`, sekaligus menyimpan daftar bahan yang cocok ke dalam properti `matchedIngredients` untuk ditampilkan pada `RecipeCard`.
4. **Mekanisme Pencarian Bahan `"Garlic"`:**
   Ketika pengguna memilih chip **`✓ Garlic (20)`** atau mengetik `"garlic"` pada `IngredientsScreen`, `requiredTerms` bernilai `['garlic']`. Fungsi `useMemo` memindai properti `recipe.ingredients` pada ke-50 resep di *cache* secara *case-insensitive*, menemukan **20 resep** yang mengandung bahan *garlic* (seperti *Vegetarian Stir-Fry*, *Chicken Alfredo Pasta*, dll.), serta menampilkan kotak informasi *"✓ Bahan cocok: Garlic, minced"* pada kartu resep.

---

## 5. Dokumentasi Komponen Loading, Error Handling, dan Tombol Retry

### 5.1. Fungsi Komponen Status Visual dan Hubungannya dengan TanStack Query

1. **`src/components/Loading.js`**
   * **Fungsi:** Menampilkan `ActivityIndicator` berukuran besar, judul pesan pemuatan, sub-pesan informasi endpoint yang sedang diakses, serta 2 kartu *Skeleton Preview* (`skeletonCard`).
   * **Hubungan dengan TanStack Query:** Dirender ketika nilai `isLoading` dari `useQuery` bernilai `true` (saat pengambilan data awal dan *cache* belum tersedia).
2. **`src/components/ErrorState.js`**
   * **Fungsi:** Menampilkan kartu peringatan kegagalan jaringan (`⚠️`), judul dan pesan penjelasan kesalahan, kotak `Detail Teknis` (menampilkan informasi `QueryKey` atau endpoint yang gagal), serta tombol interaktif **Retry**.
   * **Hubungan dengan TanStack Query:** Dirender ketika `isError` bernilai `true` setelah mekanisme `retry: 1` selesai, dan meneruskan fungsi `refetch()` dari `useQuery` ke prop `onRetry`.
3. **`src/components/EmptyState.js`**
   * **Fungsi:** Menampilkan ilustrasi ikon, pesan informatif bahwa data tidak ditemukan, dan tombol aksi pemulihan (seperti *"Hapus Kata Kunci"* atau *"Reset Filter Bahan"*).
   * **Hubungan dengan TanStack Query:** Dirender pada `ListEmptyComponent` di `FlatList` ketika query berhasil (`isSuccess: true`) namun array hasil `data.recipes` bernilai kosong (`length === 0`).

### 5.2. Implementasi Kode Tombol Retry Aktual (`ErrorState.js` & `HomeScreen.js`)

Di dalam `src/components/ErrorState.js`, tombol *Retry* diimplementasikan menggunakan `TouchableOpacity` yang mengeksekusi prop `onRetry`:

```javascript
// Cuplikan src/components/ErrorState.js
{onRetry && (
  <TouchableOpacity
    style={styles.retryButton}
    activeOpacity={0.85}
    onPress={onRetry}
  >
    <Text style={styles.retryButtonText}>🔄 {retryLabel}</Text>
  </TouchableOpacity>
)}
```

Sedangkan pada `src/screens/HomeScreen.js`, fungsi `handleRetryFromError` memulihkan status simulasi gangguan jaringan (apabila mode uji error diaktifkan) dan memanggil `await refetch()` milik TanStack Query:

```javascript
// Cuplikan src/screens/HomeScreen.js
const handleRetryFromError = async () => {
  if (isSimulatingError) {
    setSimulateNetworkError(false);
    setIsSimulatingError(false);
  }
  await refetch();
};

if (isError) {
  return (
    <ErrorState
      title="Gagal Memuat Daftar Resep"
      message={
        error?.message ||
        'Tidak dapat mengambil daftar resep dari server. Periksa koneksi internet Anda lalu tekan tombol Coba Lagi.'
      }
      errorDetails={`QueryKey: JSON.stringify(['recipes', 'list', '${selectedTag}'])`}
      onRetry={handleRetryFromError}
      retryLabel="Coba Lagi (Pulihkan Koneksi)"
    />
  );
}
```
