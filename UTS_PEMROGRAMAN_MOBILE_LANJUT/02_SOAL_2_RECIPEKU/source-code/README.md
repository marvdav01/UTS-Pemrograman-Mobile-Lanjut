# RecipeKu – Indonesian Recipe Explorer

Aplikasi mobile eksplorasi resep masakan berbasis **React Native (Expo)** yang terinspirasi dari aplikasi **Cookpad**. Aplikasi ini mengambil data resep secara asinkron dari **REST API DummyJSON Recipes** (`https://dummyjson.com/docs/recipes`) menggunakan **Axios** dan mengelola *Server State* (*caching*, *refetching*, *loading*, *error handling*, serta *retry*) menggunakan **TanStack Query v5 (`@tanstack/react-query`)**.

---

## 1. Spesifikasi Teknologi & Dependency Aktual (`package.json`)

| Komponen | Paket / Library | Versi pada `package.json` | Versi Terinstal (`package-lock.json`) |
| :--- | :--- | :--- | :--- |
| **Framework & SDK** | `expo` | `~58.0.25` | `58.0.25` |
| **Core Mobile** | `react-native` | `0.88.1` | `0.88.1` |
| **UI Library** | `react` / `react-dom` | `19.3.0` | `19.3.0` |
| **Server State Management** | `@tanstack/react-query` | `^5.66.0` | `5.66.0` |
| **HTTP Client** | `axios` | `^1.7.9` | `1.7.9` |
| **Navigasi** | `@react-navigation/native` | `^7.0.14` | `7.0.14` |
| **Stack & Tab Navigator** | `@react-navigation/native-stack` & `bottom-tabs` | `^7.2.0` | `7.2.0` |
| **Safe Area & Screens** | `react-native-safe-area-context` / `react-native-screens` | `~5.11.1` / `~4.30.1` | `5.11.1` / `4.30.1` |
| **Web Runtime** | `react-native-web` / `@expo/metro-runtime` | `~0.21.4` / `~58.0.17` | `0.21.4` / `58.0.17` |

---

## 2. Struktur Folder Proyek

```text
RecipeKu/
├── App.js                                    # Entry component: QueryClient, QueryClientProvider & SafeAreaProvider
├── index.js                                  # Registrasi root component Expo (registerRootComponent)
├── app.json                                  # Konfigurasi aplikasi Expo (slug: recipeku, package: com.undira.recipeku)
├── package.json                              # Daftar dependency & skrip eksekusi proyek
├── package-lock.json                         # Lockfile dependency npm
├── verify_recipeku_api.js                    # Skrip verifikasi struktur proyek, logika filter, & endpoint API
├── README.md                                 # Dokumentasi instalasi dan penggunaan aplikasi
├── assets/
│   └── recipeku_logo.svg                     # Aset ikon/logo aplikasi RecipeKu
└── src/
    ├── api/
    │   └── recipeApi.js                      # Instance Axios & fungsi pemanggil 5 endpoint DummyJSON Recipes
    ├── components/
    │   ├── RecipeCard.js                     # Kartu resep reusable (gambar, cuisine, rating, waktu, kalori, tag)
    │   ├── SearchBar.js                      # Input pencarian reusable + tombol hapus (✕)
    │   ├── Loading.js                        # Indikator pemuatan (ActivityIndicator + skeleton card preview)
    │   ├── ErrorState.js                     # Tampilan gagal jaringan + detail QueryKey + tombol Retry
    │   └── EmptyState.js                     # Tampilan saat hasil pencarian/filter tidak ditemukan
    ├── screens/
    │   ├── HomeScreen.js                     # Katalog resep (FlatList), filter kategori/tag, & status cache
    │   ├── SearchScreen.js                   # Pencarian resep berdasarkan nama (/recipes/search?q=) + debounce 450ms
    │   ├── DetailScreen.js                   # Detail resep (/recipes/{id}), ceklis bahan, & instruksi memasak
    │   ├── IngredientsScreen.js              # Pencarian resep berdasarkan kombinasi bahan makanan
    │   └── CookingInstructionsScreen.js      # Mode panduan memasak interaktif langkah demi langkah
    ├── navigation/
    │   └── AppNavigator.js                   # Konfigurasi NativeStackNavigator & BottomTabNavigator
    ├── hooks/
    │   └── useRecipes.js                     # Custom hooks TanStack Query (queryKey, staleTime 5m, gcTime 30m)
    ├── constants/
    │   └── colors.js                         # Konstanta palet warna hijau kuliner (COLORS, SPACING, RADIUS)
    └── utils/
        ├── useDebounce.js                    # Custom hook debounce (default 450ms) untuk menunda input pencarian
        └── formatters.js                     # Fungsi helper pemformat waktu, tingkat kesulitan, & deskripsi resep
```

---

## 3. Cara Instalasi dan Menjalankan Aplikasi

1. **Instalasi Dependency**
   Pastikan **Node.js** dan **npm** telah terpasang, lalu jalankan perintah berikut di dalam folder proyek `RecipeKu`:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Menjalankan Server Pengembangan Expo (Android / iOS / Expo Go)**
   ```bash
   npm start
   # atau:
   npx expo start
   ```
   * Tekan `a` untuk membuka pada **Android Emulator**.
   * Pindai QR Code melalui aplikasi **Expo Go** pada perangkat fisik.

3. **Menjalankan pada Browser Web (`react-native-web`)**
   ```bash
   npm run web
   # atau:
   npx expo start --web
   ```

4. **Menjalankan Skrip Verifikasi Proyek & API**
   ```bash
   node verify_recipeku_api.js
   ```

---

## 4. Endpoint REST API yang Digunakan

Seluruh data diambil dari **DummyJSON Recipes API** (`https://dummyjson.com`):
1. `GET /recipes?limit=50&skip=0` – Mengambil daftar 50 resep katalog utama.
2. `GET /recipes/search?q={query}` – Mencari resep berdasarkan nama makanan (dengan *debounce* 450 ms).
3. `GET /recipes/{id}` – Mengambil detail resep berdasarkan ID.
4. `GET /recipes/tags` – Mengambil daftar kategori/tag kuliner.
5. `GET /recipes/tag/{tag}` – Memfilter daftar resep berdasarkan kategori/tag tertentu.

*(Catatan: Untuk pencarian berdasarkan bahan makanan pada `IngredientsScreen.js`, karena DummyJSON tidak menyediakan endpoint pencarian bahan di sisi server, aplikasi menggunakan fungsi `useRecipesByIngredients()` yang memfilter properti `recipe.ingredients` secara client-side menggunakan `useMemo` di atas data cache `GET /recipes?limit=50`).*
