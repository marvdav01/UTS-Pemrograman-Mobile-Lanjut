# DOKUMENTASI PENGUJIAN DAN QUALITY ASSURANCE (QA) – APLIKASI RECIPEKU

**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Mahasiswa:** Marviel David (411231222)  
**Nama Aplikasi:** RecipeKu – Indonesian Recipe Explorer (Soal 2)  
**Metode Pengujian:** Pengujian Fungsional Manual (*Black-Box UI Testing*) & Verifikasi Kode/Konfigurasi (`verify_recipeku_api.js`)  

---

## 1. Lingkungan Pengujian (*Test Environment*)

Spesifikasi lingkungan pengujian diselaraskan dengan konfigurasi aktual pada `package.json` dan `package-lock.json`:

* **Runtime & Package Manager:** Node.js `v24.12.0`, npm `11.6.2`.
* **Framework & SDK:** Expo `~58.0.25` (terinstal `58.0.25`), React Native `0.88.1`, React `19.3.0`.
* **State & Network Library:** `@tanstack/react-query` `^5.66.0`, `axios` `^1.7.9`, `@react-navigation/native` `^7.0.14`, `@react-navigation/native-stack` `^7.2.0`, `@react-navigation/bottom-tabs` `^7.2.0`.
* **Sumber Data REST API:** DummyJSON Recipes API (`https://dummyjson.com/recipes`).

---

## 2. Cara Menjalankan Pengujian

### A. Pengujian Fungsional Manual pada Antarmuka Aplikasi
1. Masuk ke direktori proyek:
   ```bash
   cd RecipeKu
   ```
2. Pastikan seluruh *dependency* terinstal:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Jalankan aplikasi menggunakan Expo:
   ```bash
   npx expo start --web
   # atau untuk Android Emulator / Expo Go:
   npx expo start
   ```
4. Lakukan pengujian berurutan terhadap 13 skenario wajib: pembukaan aplikasi, pemuatan daftar resep, tampilan gambar, pencarian nama (`"Pizza"`), pencarian tanpa hasil (`"RendangSateXYZ"`), halaman detail resep (`id: 1`), ceklis daftar bahan, panduan langkah memasak, pencarian berdasarkan bahan (`"Garlic"`), indikator *loading*, simulasi *error handling* melalui tombol **"🧪 Uji Error API"**, pemulihan melalui tombol **"🔄 Coba Lagi (Pulihkan Koneksi)"**, serta perpindahan halaman *Home ↔ Detail* untuk memverifikasi *caching* TanStack Query.

### B. Verifikasi Struktur, Konfigurasi, dan Logika melalui Skrip (`verify_recipeku_api.js`)
Jalankan perintah berikut dari direktori proyek:
```bash
node verify_recipeku_api.js
```

---

## 3. Tabel Hasil Pengujian Fungsional Quality Assurance

Tabel berikut memisahkan secara tegas antara **Skenario Pengujian**, **Hasil yang Diharapkan**, **Hasil Aktual**, **Bukti Visual**, dan **Status Verifikasi**:

| No | Fitur yang Diuji | Skenario Pengujian | Hasil yang Diharapkan | Hasil Aktual (Terverifikasi dari Implementasi & Eksekusi Aplikasi) | Bukti Visual | Status |
| :-: | :--- | :--- | :--- | :--- | :--- | :---: |
| **1** | **Aplikasi Berhasil Dibuka** | Menjalankan aplikasi `RecipeKu` dari `App.js` (`SafeAreaProvider`, `QueryClientProvider`, dan `AppNavigator`). | Aplikasi berhasil dibuka tanpa *error* atau *crash*, serta menampilkan halaman utama (`HomeScreen`) beserta *Bottom Tab* (`Beranda`, `Cari Resep`, `Cari Bahan`). | Aplikasi tampil normal tanpa *error* terminal; *Header* `🌿 RecipeKu – Explorer`, *hero banner* hijau, *SearchBar*, chip kategori, dan *Bottom Tab Navigator* ter-render dengan utuh. | `01_home_screen.png` | **BERHASIL** |
| **2** | **Daftar Resep Berhasil Dimuat** | Membuka `HomeScreen` sehingga `useRecipesList('All')` memanggil `GET /recipes?limit=50&skip=0`. | Daftar resep berhasil diambil dari REST API dan ditampilkan menggunakan komponen `FlatList` dan `RecipeCard`. | Server mengembalikan 50 resep (`Cache: 15.57.03 (50 resep)`); kartu resep pertama (*Classic Margherita Pizza*) dan resep berikutnya tampil lengkap dengan nama, kategori, waktu memasak, kalori, dan *rating*. | `01_home_screen.png` | **BERHASIL** |
| **3** | **Gambar Resep Tampil** | Memeriksa pemuatan gambar makanan (`recipe.image`) pada setiap `RecipeCard` di `FlatList` dan gambar utama di `DetailScreen`. | Gambar makanan dari CDN DummyJSON berhasil dimuat dan tampil proporsional (`resizeMode="cover"`). | Gambar makanan tampil jelas dan proporsional dilengkapi *badge overlay* kategori (`Italian • Dinner`) di kiri atas serta *rating* (`★ 4.6 (98)`) di kanan atas. | `01_home_screen.png`, `04_detail_screen.png` | **BERHASIL** |
| **4** | **Pencarian Berdasarkan Nama** | Membuka `SearchScreen`, mengetik kata kunci `"Pizza"` pada `SearchBar`, dan menunggu jeda *debounce* 450 ms. | Aplikasi memanggil `GET /recipes/search?q=Pizza` setelah *debounce* 450 ms dan menampilkan daftar resep yang cocok. | Tampil indikator `Endpoint: GET https://dummyjson.com/recipes/search?q=Pizza` dan badge `✓ Ditemukan 2 resep untuk "Pizza"`, diikuti kartu resep Pizza yang relevan. | `02_search_pizza.png` | **BERHASIL** |
| **5** | **Pencarian Tanpa Hasil** | Mengetik kata kunci yang tidak tersedia di server, yaitu `"RendangSateXYZ"`, pada `SearchScreen`. | Aplikasi tidak mengalami *error/crash* dan merender komponen `EmptyState` beserta tombol untuk menghapus kata kunci. | Tampil badge `✓ Ditemukan 0 resep untuk "RendangSateXYZ"` dan komponen `EmptyState` berjudul *"Hasil Pencarian Tidak Ditemukan"* lengkap dengan tombol **"Hapus Kata Kunci"**. | `03_search_empty.png` | **BERHASIL** |
| **6** | **Detail Resep** | Mengetuk kartu resep *Classic Margherita Pizza* (`id: 1`) untuk membuka `DetailScreen` (`GET /recipes/1`). | Halaman detail menampilkan gambar, nama resep, deskripsi, *cuisine*, tingkat kesulitan, waktu persiapan, waktu memasak, porsi, dan kalori. | `DetailScreen` menampilkan *Classic Margherita Pizza*, badge `🌍 Italian`, `★ 4.6 (98 ulasan)`, `Dinner`, `Tingkat: Mudah`, Persiapan `20 mnt`, Memasak `15 mnt`, `4 Porsi`, `300 kkal / Porsi`, dan `Total Waktu: 35 menit`. | `04_detail_screen.png` | **BERHASIL** |
| **7** | **Daftar Bahan Makanan** | Memeriksa bagian **Daftar Bahan Makanan** pada `DetailScreen` resep #1 dan mengetuk baris bahan untuk mencentang. | Seluruh bahan pada `recipe.ingredients` tampil lengkap dan mendukung fitur ceklis interaktif (`checkedIngredients`). | Keenam bahan (*Pizza dough*, *Tomato sauce*, *Fresh mozzarella cheese*, *Fresh basil leaves*, *Olive oil*, *Salt and pepper to taste*) tampil lengkap dengan kotak ceklis interaktif (`0/6`). | `04_detail_screen.png` | **BERHASIL** |
| **8** | **Langkah Memasak** | Memeriksa bagian **Langkah-Langkah Memasak** pada `DetailScreen` lalu menekan tombol **"👨‍🍳 Mode Memasak"** (`CookingInstructionsScreen`). | Seluruh langkah memasak (`recipe.instructions`) tampil berurutan dengan nomor langkah, navigasi *Sebelumnya/Berikutnya*, dan indikator progres. | Halaman `CookingInstructionsScreen` menampilkan panduan interaktif *Classic Margherita Pizza* (`Progres Selesai: 0 dari 6 langkah`), kartu `Langkah Aktif: 1 / 6`, tombol `Tandai Selesai`, dan daftar lengkap Langkah 1 s/d 6. | `06_cooking_instructions.png` | **BERHASIL** |
| **9** | **Pencarian Berdasarkan Bahan** | Membuka `IngredientsScreen` (`Cari Bahan`) dan memilih chip bahan **`Garlic`**. | Hook `useRecipesByIngredients()` memfilter data resep di *cache* (`GET /recipes?limit=50`) menggunakan `useMemo` terhadap `recipe.ingredients`. | Chip `✓ Garlic (20)` aktif, menampilkan kotak informasi teknis keterbatasan API DummyJSON serta ringkasan `Ditemukan 20 resep yang mengandung: garlic` beserta kartu resep yang cocok. | `05_ingredients_screen.png` | **BERHASIL** |
| **10** | **Loading State** | Mengamati tampilan saat pengambilan data awal (*initial loading* ketika `isLoading: true` dan *cache* masih kosong). | Komponen `Loading.js` tampil dengan `ActivityIndicator`, pesan pemuatan, dan 2 kartu *skeleton preview*. | Saat `isLoading` bernilai `true` pada `HomeScreen`, `DetailScreen`, atau `IngredientsScreen`, komponen `Loading.js` merender spinner hijau dan *skeleton card* sebelum data tampil. | Terverifikasi pada kode `Loading.js` & `HomeScreen.js` | **BERHASIL** |
| **11** | **Error Handling** | Mengaktifkan simulasi gangguan jaringan melalui tombol **"🧪 Uji Error API"** pada `HomeScreen` (`setSimulateNetworkError(true)`). | Aplikasi menangkap *error* jaringan dan merender komponen `ErrorState.js` tanpa mengalami *force close / crash*. | Layar menampilkan komponen `ErrorState` dengan judul *"Gagal Memuat Daftar Resep"*, pesan kesalahan koneksi, dan kotak `Detail Teknis: QueryKey: JSON.stringify(['recipes', 'list', 'All'])`. | `07_error_retry_state.png` | **BERHASIL** |
| **12** | **Tombol Retry** | Menekan tombol **"🔄 Coba Lagi (Pulihkan Koneksi)"** pada komponen `ErrorState`. | Fungsi `handleRetryFromError` menonaktifkan simulasi *error*, memanggil `await refetch()`, dan memulihkan tampilan katalog resep. | Tombol Retry berhasil mengeksekusi `refetch()` pada TanStack Query dan mengembalikan tampilan 50 resep di `HomeScreen`. | `07_error_retry_state.png` & `01_home_screen.png` | **BERHASIL** |
| **13** | **Caching TanStack Query** | Berpindah dari `HomeScreen` ke `DetailScreen` resep #1 lalu kembali ke `HomeScreen` dalam durasi `< 5 menit` (`staleTime`). | Data disajikan langsung dari memori *cache* (`initialData` & Query Cache) secara instan tanpa pemuatan ulang dari jaringan. | Pada `HomeScreen` tercatat timestamp `Cache: 15.57.03 (50 resep)` dan pada `DetailScreen` tampil indikator hijau `• Tersimpan di Cache` tanpa layar *loading* berulang. | `01_home_screen.png`, `04_detail_screen.png` | **BERHASIL** |

---

## 4. Hasil Eksekusi Skrip Verifikasi (`verify_recipeku_api.js`)

Berikut adalah log aktual hasil eksekusi perintah `node RecipeKu/verify_recipeku_api.js`:

```text
======================================================================
  VERIFIKASI STRUKTUR, LOGIKA, & INTEGRASI API APLIKASI RECIPEKU
======================================================================

--- [1] Verifikasi Struktur File Proyek React Native ---
[PASS] Seluruh 20 file inti proyek RecipeKu tersedia lengkap.

--- [2] Verifikasi Konfigurasi Dependency (package.json) ---
[PASS] Dependency utama terverifikasi: expo (~58.0.25), react-native (0.88.1), react (19.3.0), @tanstack/react-query (^5.66.0), axios (^1.7.9).

--- [3] Verifikasi Konfigurasi TanStack Query ---
[PASS] App.js menginisialisasi QueryClient & QueryClientProvider dengan staleTime, gcTime, retry: 1, dan refetchOnReconnect: true.
[PASS] src/hooks/useRecipes.js mendefinisikan STALE_TIME (5 menit), GC_TIME (30 menit), RECIPE_QUERY_KEYS, initialData cache hydration, dan 5 custom hooks.

--- [4] Verifikasi Modul Layanan REST API (src/api/recipeApi.js) ---
[PASS] src/api/recipeApi.js mengimplementasikan ke-5 endpoint resmi DummyJSON (/recipes, /recipes/search, /recipes/{id}, /recipes/tags, /recipes/tag/{tag}).

--- [5] Verifikasi Logika Pencarian Nama (Debounce) & Bahan Makanan ---
[PASS] SearchScreen.js menerapkan useDebounce(searchText, 450) untuk pencarian nama makanan.
[PASS] Algoritma filtering bahan makanan (recipe.ingredients) mencocokkan kata kunci "Garlic" secara case-insensitive dengan akurat.

--- [6] Uji Konektivitas Langsung Endpoint DummyJSON Recipes API ---
[LIVE API SKIPPED] Lingkungan eksekusi saat ini tidak memiliki akses jaringan eksternal (offline/sandbox). Verifikasi API mengacu pada kode sumber dan bukti eksekusi tangkapan layar aplikasi.

======================================================================
  HASIL VERIFIKASI LOKAL: 7/7 PEMERIKSAAN LULUS (100%)
======================================================================
```
