# CHANGELOG – Perbaikan Laporan & Dokumentasi UTS Pemrograman Mobile Lanjut

**Mahasiswa:** Marviel David (NIM: `411231222`)  
**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Tanggal Pembaruan:** 16 November 2026  

---

## 1. Ringkasan Bagian yang Diperbaiki

### A. Jawaban Soal Nomor 1 – Analisis React Native & Kasus E-Commerce (Bobot 20%)
1. **Arsitektur React Native (UI, Logic, Data Layer):**
   * Diperjelas peran masing-masing lapisan (`View`, `Text`, `Image`, `TextInput`, `FlatList` dengan virtualisasi pada UI Layer; Custom Hooks, Client State, dan TanStack Query pada Logic Layer; Axios dan AsyncStorage pada Data Layer).
   * Ditambahkan diagram alur sederhana sesuai ketentuan soal:  
     `Pengguna → UI Layer → Logic Layer → Data Layer → REST API → Database → JSON Response → UI Layer`
   * Ditambahkan penjelasan bertahap (8 langkah) untuk alur pengambilan hingga penampilan daftar produk e-commerce.
2. **Local State, Server State, Context API, dan Redux:**
   * Diperjelas cakupan **Local State** (data sementara, pilihan ukuran/warna, teks pencarian, status modal dan filter, state yang tidak perlu disimpan di server) dan **Server State** (daftar produk, harga dan stok, data keranjang di backend, data dari REST API, data yang dapat berubah di luar kendali client).
   * Ditambahkan tabel perbandingan yang sistematis antara Local State dan Server State.
   * Ditegaskan peran Context API / Redux untuk keranjang sementara, autentikasi, dan state global lintas layar, dengan tetap menyinkronkan data ke backend via REST API.
3. **Integrasi REST API (GET, POST, PUT, DELETE) & JSON:**
   * Disempurnakan tabel endpoint, fungsi, contoh *Request Body* JSON, *Response Body* JSON, dan status HTTP (`200 OK`, `201 Created`).
   * Ditambahkan contoh JSON lengkap dan konsisten (`productId: 101`, `quantity: 2` → `id: 1`, `quantity: 3`).
   * Ditegaskan bahwa `/api/v1/products`, `/api/v1/cart/items`, dan `/api/v1/cart/items/{id}` merupakan **contoh rancangan (ilustrasi desain REST API)**, bukan endpoint backend publik yang telah diverifikasi.
4. **Server State Management (Caching, Refetching, Loading, Error Handling):**
   * Diperjelas mekanisme dan manfaat bagi UX untuk masing-masing konsep serta tabel perilaku aplikasi pada kondisi koneksi lambat (*slow network*), terputus (*offline*), dan kembali tersedia (*reconnected*).

---

### B. Jawaban Soal Nomor 2 – Implementasi Aplikasi RecipeKu (Bobot 35%)
1. **Konsistensi Versi Expo & Dependency:**
   * Diperbaiki ketidaksesuaian pada laporan PDF awal yang sebelumnya menyebut **Expo SDK 52**.
   * Diselaraskan dengan `RecipeKu/package.json` dan `RecipeKu/package-lock.json` aktual: **Expo `~58.0.25`** (`58.0.25`), **React Native `0.88.1`**, **React `19.3.0`**, **`@tanstack/react-query` `^5.66.0`**, **`axios` `^1.7.9`**, dan **React Navigation v7**.
2. **Struktur Proyek React Native:**
   * Ditambahkan dokumentasi struktur folder aktual proyek `RecipeKu/` (`App.js`, `index.js`, `app.json`, `package.json`, `src/api`, `src/components`, `src/screens`, `src/navigation`, `src/hooks`, `src/constants`, `src/utils`, serta `verify_recipeku_api.js`).
3. **Dokumentasi Integrasi REST API:**
   * Didokumentasikan 5 endpoint DummyJSON Recipes API yang benar-benar diimplementasikan pada `src/api/recipeApi.js`:
     * `GET /recipes?limit=50` (`fetchRecipes`)
     * `GET /recipes/search?q=Pizza` (`searchRecipesByName`)
     * `GET /recipes/{id}` (`fetchRecipeById`)
     * `GET /recipes/tags` (`fetchRecipeTags`)
     * `GET /recipes/tag/{tag}` (`fetchRecipesByTag`)
   * Dijelaskan fungsi, parameter request, format response, pemrosesan data, serta keterhubungannya dengan komponen React Native.
4. **Dokumentasi TanStack Query:**
   * Disertakan cuplikan kode aktual dari `App.js` dan `src/hooks/useRecipes.js`.
   * Didokumentasikan `QueryClient`, `QueryClientProvider`, `useQuery`, `RECIPE_QUERY_KEYS`, `staleTime` (5 menit), `gcTime` (30 menit), `retry: 1`, `refetchOnReconnect: true`, `isLoading`, `isError`, `refetch`, serta mekanisme **Initial Cache Hydration** (`initialData` & `initialDataUpdatedAt`) saat berpindah `HomeScreen ↔ DetailScreen`.
5. **Dokumentasi Pencarian Resep:**
   * **Berdasarkan Nama (`SearchScreen.js`):** Menggunakan `GET /recipes/search?q={query}`, `useDebounce(searchText, 450)`, `enabled: normalizedQuery.length > 0`, serta `EmptyState.js` jika hasil kosong.
   * **Berdasarkan Bahan (`IngredientsScreen.js` & `useRecipesByIngredients`):** Dijelaskan secara transparan bahwa DummyJSON tidak memiliki endpoint server khusus pencarian bahan, sehingga aplikasi memfilter properti `recipe.ingredients` di sisi client menggunakan `useMemo` dari data `GET /recipes?limit=50` yang telah di-cache (termasuk skenario pencarian `"Garlic"`).
6. **Komponen Loading, Error Handling, dan Retry:**
   * Didokumentasikan `Loading.js`, `ErrorState.js`, dan `EmptyState.js` beserta hubungannya dengan state TanStack Query serta cuplikan kode tombol *Retry* aktual pada `ErrorState.js` dan `HomeScreen.js`.
7. **Dokumentasi Quality Assurance (QA) & Bukti Visual:**
   * Diaudit 13 skenario pengujian wajib dengan memisahkan **Skenario Pengujian**, **Hasil yang Diharapkan**, **Hasil Aktual**, dan **Bukti Visual**.
   * Diverifikasi keberadaan dan hasil eksekusi lokal `RecipeKu/verify_recipeku_api.js` (7/7 pemeriksaan lokal lulus).
   * Ditambahkan seluruh 7 tangkapan layar aplikasi aktual termasuk **`06_cooking_instructions.png`** (*Cooking Instructions*) yang sebelumnya belum tercantum di PDF awal.

---

## 2. Daftar File yang Dimodifikasi / Dihasilkan

| File | Keterangan |
| :--- | :--- |
| `UTS_PEMROGRAMAN_MOBILE_LANJUT/04_LAPORAN_AKHIR/Laporan_UTS_Final_Marviel_David_411231222.pdf` | Laporan UTS final format A4 siap dikumpulkan (Soal 1 & Soal 2 lengkap dengan diagram, kode aktual, tabel QA, dan 7 screenshot). |
| `UTS_PEMROGRAMAN_MOBILE_LANJUT/04_LAPORAN_AKHIR/Laporan_UTS_Final_Marviel_David_411231222.docx` | Dokumen Word (.docx) versi *editable* dari laporan final. |
| `UTS_PEMROGRAMAN_MOBILE_LANJUT/04_LAPORAN_AKHIR/RecipeKu_Source_Code.zip` | Arsip source code `RecipeKu` tanpa `node_modules` dan `.expo`, dilengkapi `README.md` instalasi dan cara menjalankan aplikasi. |
| `DOKUMENTASI_QA_RECIPEKU.md` | Dokumentasi QA lengkap (skenario pengujian, cara menjalankan, hasil aktual, dan log `verify_recipeku_api.js`). |
| `CHANGELOG.md` | Catatan perubahan perbaikan laporan, dokumentasi, dan verifikasi. |

---

## 3. Bagian yang Tidak Dapat Diverifikasi Secara Langsung di Lingkungan Sandbox

1. **Uji Konektivitas Langsung (*Live Network*) ke `https://dummyjson.com`:**  
   Saat menjalankan `node RecipeKu/verify_recipeku_api.js`, langkah `[6] Uji Konektivitas Langsung Endpoint DummyJSON Recipes API` berstatus `[LIVE API SKIPPED]` karena lingkungan terminal sandbox berjalan secara *offline* tanpa akses jaringan eksternal. Namun, integrasi API telah terverifikasi pada level kode sumber (`src/api/recipeApi.js`) dan bukti tangkapan layar eksekusi aplikasi aktual (`01_home_screen.png` s/d `07_error_retry_state.png`).
2. **Eksekusi Interaktif Expo Metro Bundler di Perangkat Fisik/Emulator pada Sesi Ini:**  
   Pengujian fungsional UI mengacu pada kode sumber aktual dan 7 berkas tangkapan layar aplikasi yang telah tersedia di `UTS_PEMROGRAMAN_MOBILE_LANJUT/02_SOAL_2_RECIPEKU/screenshots/`.
