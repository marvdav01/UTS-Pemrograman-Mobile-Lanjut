# RecipeKu – Indonesian Recipe Explorer (Soal 2 UTS)

**Mata Kuliah:** Pemrograman Mobile Lanjut (412573401)  
**Bobot Penilaian:** 35% (CPMK 2: Mengimplementasikan manajemen state dan integrasi API)  
**Inspirasi Aplikasi:** Cookpad  
**Sumber REST API:** [DummyJSON Recipes API](https://dummyjson.com/docs/recipes)  

---

## 1. Deskripsi Aplikasi

**RecipeKu – Indonesian Recipe Explorer** adalah aplikasi mobile eksplorasi resep masakan berbasis **React Native (Expo)** yang terinspirasi dari Cookpad. Aplikasi ini mengambil data secara *real-time* dari **REST API DummyJSON Recipes** menggunakan **Axios** dan mengelola seluruh siklus hidup *Server State* (*caching*, *refetching*, *loading*, *error handling*, dan *deduplication*) menggunakan **TanStack Query v5 (`@tanstack/react-query`)**.

---

## 2. Teknologi yang Digunakan

| Komponen | Teknologi / Library | Kegunaan |
| :--- | :--- | :--- |
| **Framework Mobile** | React Native `0.76.7` + Expo SDK `52` | Kerangka kerja utama aplikasi *cross-platform* (Android, iOS, Web) |
| **Bahasa Pemrograman** | JavaScript (ES6+) | Logika komponen, *custom hooks*, dan layanan API |
| **HTTP Client** | Axios `^1.7.9` | Pemanggilan REST API (`GET /recipes`, `/recipes/search`, `/recipes/{id}`, `/recipes/tags`) |
| **Server State Management** | TanStack Query `^5.66.0` | `QueryClient`, `QueryClientProvider`, `useQuery`, `staleTime`, `gcTime`, `enabled`, *caching*, & *refetching* |
| **Navigasi** | React Navigation v7 (`native-stack` & `bottom-tabs`) | Navigasi *Bottom Tabs* (Home, Search, Ingredients) & *Stack* (Detail, Cooking Instructions) |

---

## 3. Fitur Utama yang Diimplementasikan

1. **Home Screen (`HomeScreen.js`)**
   * Menampilkan *Header Banner* aplikasi **RecipeKu**, *Search Bar* untuk filter cepat, chip kategori/tag kuliner (`All`, `Asian`, `Italian`, `Chicken`, `Pizza`, `Pasta`, `Vegetarian`, dll.), serta indikator waktu pembaruan *Cache* TanStack Query.
   * Menampilkan daftar resep menggunakan komponen teroptimasi **`FlatList`** dan **`RecipeCard`** yang memuat: gambar makanan, nama resep, kategori/*cuisine*, *rating* beserta jumlah ulasan, waktu persiapan (`prepTimeMinutes`), waktu memasak (`cookTimeMinutes`), kalori, dan tingkat kesulitan.
   * Mendukung **Pull-to-Refresh** (`RefreshControl`) untuk memicu `refetch()`.
   * Menyediakan tombol **"🧪 Uji Error API"** untuk mempermudah pengujian skenario *Error Handling* dan tombol *Retry* secara langsung.

2. **Search Recipe by Name (`SearchScreen.js`)**
   * Terhubung langsung ke endpoint resmi: `GET https://dummyjson.com/recipes/search?q={kata_kunci}`.
   * Menggunakan `TextInput` melalui komponen *reusable* `SearchBar.js` lengkap dengan tombol hapus pencarian (*clear button* `✕`).
   * Mengimplementasikan **Debounce (`useDebounce` 450ms)** dan opsi `enabled: normalizedQuery.length > 0` pada `useQuery` agar aplikasi tidak memanggil API secara berlebihan pada setiap ketikan huruf.
   * Menampilkan komponen `EmptyState` informatif apabila kata kunci tidak menghasilkan resep yang cocok.

3. **Recipe Detail (`DetailScreen.js`)**
   * Terhubung ke endpoint resmi: `GET https://dummyjson.com/recipes/{id}` dengan pemanfaatan *initial cache* dari daftar resep (`initialData`).
   * Menampilkan gambar makanan ukuran penuh, nama hidangan, deskripsi terstruktur, *cuisine*, *rating*, *preparation time*, *cooking time*, *servings* (porsi), dan *calories per serving*.
   * Menampilkan **Daftar Bahan Makanan (`ingredients`)** dengan fitur *interactive checklist* (ketuk bahan untuk menandai bahan yang sudah disiapkan).
   * Menampilkan **Langkah-Langkah Memasak (`instructions`)** bernomor urut rapi serta tombol untuk membuka **Mode Memasak Interaktif (`CookingInstructionsScreen.js`)**.

4. **Search by Ingredients (`IngredientsScreen.js`)**
   * Mengizinkan pengguna mencari resep berdasarkan satu atau kombinasi beberapa bahan makanan sekaligus (misalnya `Garlic` + `Chicken`).
   * **Penjelasan Teknis Keterbatasan API:** Sesuai dokumentasi resmi DummyJSON (`https://dummyjson.com/docs/recipes`), server hanya menyediakan endpoint pencarian nama (`/recipes/search?q=`) dan filter tag (`/recipes/tag/{tag}`), serta **tidak menyediakan endpoint pencarian bahan di sisi server**. Oleh karena itu, fitur ini mengambil data dari endpoint resmi `GET /recipes?limit=50` yang disimpan di dalam *cache* TanStack Query, lalu melakukan *multi-ingredient filtering* di sisi *client* terhadap array `recipe.ingredients` tanpa mengarang endpoint palsu.

5. **Interactive Cooking Instructions (`CookingInstructionsScreen.js`)**
   * Halaman khusus panduan memasak langkah demi langkah (*step-by-step*) dengan bilah progres (*progress bar*) persentase penyelesaian langkah memasak.

---

## 4. Struktur Proyek

```text
source-code/
├── src/
│   ├── api/
│   │   └── recipeApi.js                  # Instance Axios & fungsi pemanggil endpoint DummyJSON
│   ├── components/
│   │   ├── RecipeCard.js                 # Komponen reusable kartu resep
│   │   ├── SearchBar.js                  # Komponen reusable TextInput + tombol clear
│   │   ├── Loading.js                    # Komponen indikator loading + skeleton preview
│   │   ├── ErrorState.js                 # Komponen tampilan error koneksi + tombol Retry
│   │   └── EmptyState.js                 # Komponen tampilan data kosong / hasil tidak ditemukan
│   ├── screens/
│   │   ├── HomeScreen.js                 # Halaman utama katalog resep (FlatList + Filter Tag)
│   │   ├── SearchScreen.js               # Halaman pencarian nama resep (Debounce + API Search)
│   │   ├── DetailScreen.js               # Halaman detail resep, nutrisi, bahan & instruksi
│   │   ├── IngredientsScreen.js          # Halaman pencarian resep berdasarkan bahan makanan
│   │   └── CookingInstructionsScreen.js  # Halaman panduan memasak langkah demi langkah
│   ├── navigation/
│   │   └── AppNavigator.js               # Konfigurasi Stack & Bottom Tab Navigator
│   ├── hooks/
│   │   └── useRecipes.js                 # Custom hooks TanStack Query (queryKey, staleTime, gcTime)
│   ├── constants/
│   │   └── colors.js                     # Palet warna hijau kuliner, spacing, & border radius
│   └── utils/
│       ├── useDebounce.js                # Custom hook debounce input pencarian
│       └── formatters.js                 # Fungsi pemformat waktu, tingkat kesulitan, & deskripsi
├── App.js                                # Konfigurasi QueryClientProvider & SafeAreaProvider
├── index.js                              # Entry point Expo
├── app.json                              # Konfigurasi proyek Expo
├── package.json                          # Daftar dependency proyek
└── README.md                             # Dokumentasi proyek
```

---

## 5. Cara Menjalankan Aplikasi

1. Masuk ke direktori kode sumber:
   ```bash
   cd "UTS_PEMROGRAMAN_MOBILE_LANJUT/02_SOAL_2_RECIPEKU/source-code"
   ```
2. Instal seluruh *dependency* (jika belum terinstal):
   ```bash
   npm install --legacy-peer-deps
   ```
3. Jalankan server pengembangan Expo:
   * **Untuk Android Emulator / Expo Go:**
     ```bash
     npx expo start
     ```
     Tekan `a` untuk membuka di Android Emulator atau pindai QR Code menggunakan aplikasi **Expo Go**.
   * **Untuk Pengujian di Browser Web:**
     ```bash
     npx expo start --web
     ```

