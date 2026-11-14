# DOKUMENTASI PENGUJIAN DAN QUALITY ASSURANCE (QA) – APLIKASI RECIPEKU

**Mata Kuliah:** Pemrograman Mobile Lanjut (412573401)  
**Nama Aplikasi:** RecipeKu – Indonesian Recipe Explorer (Soal 2)  
**Metode Pengujian:** *Black-Box Functional Testing* & *Automated API/State Verification*  
**Tanggal Pengujian:** 14 November 2026  

---

## 1. Lingkungan Pengujian (*Test Environment*)

* **Runtime & Bundler:** Node.js `v24.12.0`, npm `11.6.2`, Expo SDK `52` (Metro Bundler `590 modules`).
* **State & Network Library:** `@tanstack/react-query` `^5.66.0`, `axios` `^1.7.9`, `@react-navigation/native` `^7.0.14`.
* **Target Platform Uji:** Expo Web Runtime (`react-native-web` dengan proporsi layar mobile) & Integrasi Langsung REST API DummyJSON (`https://dummyjson.com/recipes`).

---

## 2. Tabel Hasil Pengujian (*Test Cases*)

Seluruh 14 skenario pengujian berikut telah dieksekusi terhadap aplikasi **RecipeKu** dan diverifikasi terhadap respons asli server **DummyJSON Recipes API**:

| No | Fitur | Skenario Pengujian | Hasil yang Diharapkan | Hasil Aktual & Bukti Verifikasi | Status |
| :-: | :--- | :--- | :--- | :--- | :---: |
| **1** | **Pembukaan Aplikasi (App Launch)** | Membuka aplikasi `RecipeKu` dari *entry point* `App.js` (`QueryClientProvider` & `AppNavigator`). | Aplikasi berhasil dimuat tanpa *crash* maupun *error* pada terminal; menampilkan navigasi utama (`HomeScreen`) dengan *Header* **RecipeKu**. | Bundel berhasil dikompilasi (590 modul, 0 error) dan merender `HomeScreen` beserta *Bottom Tab Navigator* (`Beranda Resep`, `Cari Nama`, `Cari Bahan`). | **BERHASIL (PASS)** |
| **2** | **Pengambilan Daftar Resep (`GET /recipes`)** | Saat `HomeScreen` dibuka pertama kali, hook `useRecipesList('All')` memanggil `GET https://dummyjson.com/recipes?limit=50&skip=0`. | Daftar resep berhasil diambil dari REST API dan ditampilkan menggunakan komponen `FlatList` dan `RecipeCard`. | Server mengembalikan `HTTP 200 OK` berisi 50 resep (dimulai dari *Classic Margherita Pizza*, *Vegetarian Stir-Fry*, *Chocolate Chip Cookies*, dst.). | **BERHASIL (PASS)** |
| **3** | **Pemuatan Gambar Resep (*Image Rendering*)** | Memeriksa pemuatan gambar makanan (`recipe.image`) pada setiap `RecipeCard` di daftar resep maupun di halaman detail. | Gambar makanan dari CDN DummyJSON (`https://cdn.dummyjson.com/recipe-images/*.webp`) berhasil dimuat dengan proporsi `resizeMode="cover"`. | Seluruh gambar makanan tampil jelas dengan *overlay badge* kategori (*cuisine*) di kiri atas dan *badge rating* (`★ 4.6`) di kanan atas. | **BERHASIL (PASS)** |
| **4** | **Pencarian Resep Berhasil (`GET /recipes/search?q=`)** | Membuka `SearchScreen`, mengetik kata kunci `"Pizza"` pada `SearchBar` (`TextInput`), dan menunggu *debounce* 450ms selesai. | Aplikasi memanggil endpoint `GET https://dummyjson.com/recipes/search?q=Pizza` dan menampilkan daftar resep yang cocok. | Setelah jeda *debounce* 450ms, API mengembalikan 2 resep yang cocok (*Classic Margherita Pizza* dan *Italian Margherita Pizza*) serta tombol hapus pencarian (`✕`) aktif. | **BERHASIL (PASS)** |
| **5** | **Pencarian Tanpa Hasil (*Empty Search Result*)** | Mengetik kata kunci yang tidak ada di server, misalnya `"RendangSateKambingXYZ999"`, pada `SearchScreen`. | Aplikasi tidak *crash* dan menampilkan pesan khusus menggunakan komponen `EmptyState` beserta tombol **"Hapus Kata Kunci"**. | API mengembalikan `{ recipes: [], total: 0 }`; layar merender komponen `EmptyState` dengan judul *"Hasil Pencarian Tidak Ditemukan"* dan tombol reset. | **BERHASIL (PASS)** |
| **6** | **Pembukaan Detail Resep (`GET /recipes/{id}`)** | Menekan salah satu kartu resep (misalnya *Classic Margherita Pizza*, `id = 1`) dari `HomeScreen` atau `SearchScreen`. | Aplikasi bernavigasi ke `DetailScreen` dan menampilkan gambar, nama, deskripsi, *cuisine*, *rating*, *prep time*, *cook time*, *servings*, dan *calories*. | `DetailScreen` terbuka menampilkan *Classic Margherita Pizza* (`Italian`, `★ 4.6`, Persiapan `20 mnt`, Memasak `15 mnt`, `4 Porsi`, `300 kkal/Porsi`). | **BERHASIL (PASS)** |
| **7** | **Penampilan Daftar Bahan Makanan (*Ingredients*)** | Memeriksa bagian **Daftar Bahan Makanan** pada `DetailScreen` untuk resep yang dipilih (`id = 1`). | Seluruh item pada array `recipe.ingredients` tampil lengkap dan dapat dicentang (*interactive checklist*). | Menampilkan 6 bahan (*Pizza dough*, *Tomato sauce*, *Fresh mozzarella cheese*, *Fresh basil leaves*, *Olive oil*, *Salt and pepper to taste*) dengan fitur ceklis berfungsi. | **BERHASIL (PASS)** |
| **8** | **Penampilan Langkah-Langkah Memasak (*Instructions*)** | Memeriksa bagian **Langkah-Langkah Memasak** pada `DetailScreen` serta menekan tombol **"👨‍🍳 Mode Memasak"** (`CookingInstructionsScreen`). | Seluruh urutan langkah memasak (`recipe.instructions`) tampil berurutan dengan nomor langkah dan progres penyelesaian. | Menampilkan 6 langkah memasak secara berurutan dari Langkah 1 (*Preheat the oven to 475°F...*) hingga Langkah 6 (*Slice and serve hot*), serta halaman *Mode Memasak* interaktif berjalan lancar. | **BERHASIL (PASS)** |
| **9** | **Pencarian Berdasarkan Bahan (*Search by Ingredients*)** | Membuka tab **Cari Bahan (`IngredientsScreen`)** dan memilih chip bahan `"Garlic"` dan `"Chicken"`. | Aplikasi memfilter data resep dari cache `GET /recipes?limit=50` yang mengandung kedua bahan tersebut dan menampilkan bahan yang cocok pada kartu. | Menampilkan daftar resep yang mengandung *Garlic* + *Chicken* beserta kotak hijau *"✓ Bahan cocok"* dan penjelasan teknis keterbatasan endpoint DummyJSON. | **BERHASIL (PASS)** |
| **10** | **Tampilan Indikator Loading (`Loading.js`)** | Mengamati tampilan layar saat pengambilan data awal (*initial fetch* ketika cache masih kosong) atau saat memilih kategori baru. | Komponen `Loading` tampil dengan `ActivityIndicator`, pesan status, dan *skeleton card preview* sehingga layar tidak pernah tampak putih kosong. | Komponen `Loading.js` tampil dengan spinner hijau dan *skeleton card* sebelum data selesai dimuat. | **BERHASIL (PASS)** |
| **11** | **Penanganan Kegagalan API (*Error Handling*)** | Mengaktifkan simulasi kegagalan jaringan (menekan tombol **"🧪 Uji Error API"** pada `HomeScreen` atau memutus koneksi). | Aplikasi menangkap eksepsi dan merender komponen `ErrorState` berisi pesan ramah pengguna serta detail teknis tanpa menyebabkan aplikasi *crash*. | Komponen `ErrorState.js` tampil rapi dengan ikon peringatan `⚠️`, pesan *"Gagal Memuat Daftar Resep"*, dan tombol **"🔄 Coba Lagi"**. | **BERHASIL (PASS)** |
| **12** | **Pemulihan Koneksi via Tombol Retry** | Menekan tombol **"🔄 Coba Lagi (Pulihkan Koneksi)"** pada layar `ErrorState`. | Fungsi `refetch()` TanStack Query dipanggil ulang, koneksi pulih, dan daftar 50 resep kembali ditampilkan di layar. | Setelah tombol *Retry* ditekan, status `isError` berubah menjadi `isSuccess` dan daftar 50 resep langsung tampil kembali. | **BERHASIL (PASS)** |
| **13** | **Mekanisme Caching TanStack Query (`staleTime` & `gcTime`)** | Membuka `HomeScreen`, masuk ke `DetailScreen` resep #1, kembali ke `HomeScreen`, lalu membuka kembali resep #1 dalam kurun waktu < 5 menit (`staleTime`). | Data disajikan langsung dari memori *cache* TanStack Query (0 ms *loading*) tanpa menampilkan layar *loading* ulang, ditandai dengan indikator *"• Tersimpan di Cache"*. | Timestamp `Cache: HH:MM:SS` pada `HomeScreen` dan label *"• Tersimpan di Cache"* pada `DetailScreen` membuktikan data diambil dari memori *cache* secara instan. | **BERHASIL (PASS)** |
| **14** | **Filter Kategori Tag (`GET /recipes/tag/{tag}`)** | Menekan salah satu chip kategori kuliner pada `HomeScreen`, misalnya `"Italian"` atau `"Asian"`. | Hook `useRecipesList(selectedTag)` memanggil endpoint `/recipes/tag/{tag}` dan menyimpannya ke `queryKey: ['recipes', 'list', tag]`. | Kategori `"Italian"` menampilkan 6 resep khas Italia dan tersimpan di dalam cache tersendiri per kategori. | **BERHASIL (PASS)** |

---

## 3. Log Eksekusi Pengujian Otomatis (`verify_recipeku_api.js`)

```text
=== MEMULAI PENGUJIAN OTOMATIS API & LOGIKA RECIPEKU ===

[PASS] Test 1 - GET /recipes: Berhasil mengambil 50 resep (Total di server: 50).
       Contoh Resep #1: Classic Margherita Pizza | Cuisine: Italian | Rating: 4.6 | Image: https://cdn.dummyjson.com/recipe-images/1.webp
[PASS] Test 2 - GET /recipes/search?q=Pizza: Ditemukan 2 resep (Classic Margherita Pizza, Italian Margherita Pizza).
[PASS] Test 3 - GET /recipes/search?q=RendangSateKambingXYZ999: Ditemukan 0 resep (EmptyState terpicu dengan benar).
[PASS] Test 4 - GET /recipes/1: "Classic Margherita Pizza" | Prep: 20m | Cook: 15m | Servings: 4 | Calories: 300
       Jumlah Bahan: 6 bahan | Jumlah Langkah: 6 langkah.
[PASS] Test 5 - GET /recipes/tags & /recipes/tag/Italian: Total 87 tag tersedia, kategori Italian memiliki 6 resep.
[PASS] Test 6a - Error Handling: Eksepsi jaringan tertangkap dengan pesan: "Gagal terhubung ke server DummyJSON API. Periksa koneksi internet Anda atau coba beberapa saat lagi."
[PASS] Test 6b - Retry Recovery: Pemanggilan ulang berhasil memulihkan 5 resep.

=== SELURUH PENGUJIAN API & LOGIKA BERHASIL (100% PASS) ===
```

