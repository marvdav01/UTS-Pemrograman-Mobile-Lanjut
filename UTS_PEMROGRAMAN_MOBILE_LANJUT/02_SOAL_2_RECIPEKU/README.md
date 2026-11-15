# RecipeKu – Indonesian Recipe Explorer (Soal 2 UTS)

**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Mahasiswa:** Marviel David (411231222)  
**Bobot Penilaian:** 35% (CPMK 2: Mengimplementasikan manajemen state dan integrasi API)  
**Inspirasi Aplikasi:** Cookpad  
**Sumber REST API:** [DummyJSON Recipes API](https://dummyjson.com/docs/recipes)  

---

## 1. Deskripsi Aplikasi

**RecipeKu – Indonesian Recipe Explorer** adalah aplikasi mobile eksplorasi resep masakan berbasis **React Native (Expo)** yang terinspirasi dari aplikasi Cookpad. Aplikasi ini mengambil data dari **REST API DummyJSON Recipes** menggunakan **Axios** dan mengelola seluruh siklus hidup *Server State* (*caching*, *refetching*, *loading*, *error handling*, dan *retry*) menggunakan **TanStack Query v5 (`@tanstack/react-query`)**.

---

## 2. Teknologi & Versi Aktual Proyek (`package.json` & `package-lock.json`)

| Komponen | Teknologi / Library | Versi Aktual Proyek | Kegunaan |
| :--- | :--- | :--- | :--- |
| **Framework & SDK** | `expo` | `~58.0.25` (`58.0.25`) | Kerangka kerja utama aplikasi *cross-platform* (Android, iOS, Web) |
| **Core Mobile** | `react-native` | `0.88.1` | Komponen antarmuka inti (`View`, `Text`, `Image`, `FlatList`, `TextInput`) |
| **UI Runtime** | `react` / `react-dom` | `19.3.0` | Pustaka komponen deklaratif & *Hooks* (`useState`, `useEffect`, `useMemo`) |
| **HTTP Client** | `axios` | `^1.7.9` (`1.7.9`) | Pemanggilan REST API (`GET /recipes`, `/recipes/search`, `/recipes/{id}`, `/recipes/tags`, `/recipes/tag/{tag}`) |
| **Server State Management** | `@tanstack/react-query` | `^5.66.0` (`5.66.0`) | `QueryClient`, `QueryClientProvider`, `useQuery`, `queryKey`, `staleTime`, `gcTime`, `retry`, `refetchOnReconnect` |
| **Navigasi** | `@react-navigation/native` (`native-stack` & `bottom-tabs`) | `^7.0.14` & `^7.2.0` | Navigasi *Bottom Tabs* (`HomeTab`, `SearchTab`, `IngredientsTab`) & *Stack* (`Detail`, `CookingInstructions`) |

---

## 3. Struktur Proyek Aktual

```text
RecipeKu/ (02_SOAL_2_RECIPEKU/source-code/)
├── App.js                                    # Inisialisasi QueryClient, QueryClientProvider, & SafeAreaProvider
├── index.js                                  # Entry point Expo (registerRootComponent)
├── app.json                                  # Konfigurasi aplikasi Expo
├── package.json                              # Konfigurasi dependency & script npm
├── package-lock.json                         # Lockfile versi dependency aktual
├── verify_recipeku_api.js                    # Skrip verifikasi proyek, logika filtering, & endpoint API
├── README.md                                 # Panduan instalasi & cara menjalankan aplikasi
├── assets/
│   └── recipeku_logo.svg                     # Aset logo aplikasi RecipeKu
└── src/
    ├── api/
    │   └── recipeApi.js                      # Instance Axios & 5 fungsi endpoint DummyJSON Recipes API
    ├── components/
    │   ├── RecipeCard.js                     # Komponen reusable kartu resep
    │   ├── SearchBar.js                      # Komponen reusable TextInput pencarian + tombol clear (✕)
    │   ├── Loading.js                        # Komponen indikator loading + skeleton card preview
    │   ├── ErrorState.js                     # Komponen tampilan error jaringan + tombol Retry
    │   └── EmptyState.js                     # Komponen tampilan ketika hasil pencarian/filter kosong
    ├── screens/
    │   ├── HomeScreen.js                     # Halaman utama katalog resep (FlatList + filter tag + status cache)
    │   ├── SearchScreen.js                   # Halaman pencarian nama resep (/recipes/search?q=) + debounce 450ms
    │   ├── DetailScreen.js                   # Halaman detail resep (/recipes/{id}), bahan, & langkah memasak
    │   ├── IngredientsScreen.js              # Halaman pencarian resep berdasarkan bahan makanan
    │   └── CookingInstructionsScreen.js      # Halaman panduan memasak interaktif langkah demi langkah
    ├── navigation/
    │   └── AppNavigator.js                   # Konfigurasi Stack & Bottom Tab Navigator
    ├── hooks/
    │   └── useRecipes.js                     # Custom hooks TanStack Query (queryKey, staleTime, gcTime, initialData)
    ├── constants/
    │   └── colors.js                         # Konstanta palet warna hijau kuliner, spacing, & border radius
    └── utils/
        ├── useDebounce.js                    # Custom hook debounce (450ms) untuk input pencarian
        └── formatters.js                     # Fungsi helper pemformat waktu, tingkat kesulitan, & deskripsi resep
```

---

## 4. Cara Menjalankan Aplikasi

1. Masuk ke direktori kode sumber:
   ```bash
   cd "UTS_PEMROGRAMAN_MOBILE_LANJUT/02_SOAL_2_RECIPEKU/source-code"
   ```
2. Instal seluruh *dependency*:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Jalankan server pengembangan Expo:
   * **Android Emulator / Expo Go:**
     ```bash
     npx expo start
     ```
   * **Browser Web:**
     ```bash
     npx expo start --web
     ```
4. Jalankan skrip verifikasi:
   ```bash
   node verify_recipeku_api.js
   ```
