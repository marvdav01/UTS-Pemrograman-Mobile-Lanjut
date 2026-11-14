# UJIAN TENGAH SEMESTER (UTS) – PEMROGRAMAN MOBILE LANJUT

**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Program Studi:** Teknik Informatika – Fakultas Teknik dan Informatika, Universitas Dian Nusantara  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Tahun Akademik:** Ganjil 2026/2027  

---

## Struktur Direktori Pengumpulan UTS

Repositori ini disusun secara sistematis mengikuti seluruh instruksi dan rubrik penilaian UTS Pemrograman Mobile Lanjut (Soal 1, Soal 2, Soal 3, Dokumentasi, dan Pengujian Quality Assurance):

```text
UTS_PEMROGRAMAN_MOBILE_LANJUT/
│
├── 01_SOAL_1/
│   ├── Jawaban_Soal_1.md                 # Jawaban analisis arsitektur RN, State, REST API, & Server State (20%)
│   └── 01_Jawaban_Soal_1.md              # Salinan identik sesuai penamaan Bagian 2
│
├── 02_SOAL_2_RECIPEKU/
│   ├── source-code/                      # Proyek lengkap Expo React Native + TanStack Query (35%)
│   │   ├── src/
│   │   │   ├── api/recipeApi.js
│   │   │   ├── components/ (RecipeCard, SearchBar, Loading, ErrorState, EmptyState)
│   │   │   ├── screens/ (HomeScreen, SearchScreen, DetailScreen, IngredientsScreen, CookingInstructionsScreen)
│   │   │   ├── navigation/AppNavigator.js
│   │   │   ├── hooks/useRecipes.js
│   │   │   ├── constants/colors.js
│   │   │   └── utils/ (useDebounce.js, formatters.js)
│   │   ├── App.js
│   │   ├── package.json
│   │   └── README.md
│   ├── assets/                           # Aset visual aplikasi RecipeKu
│   ├── screenshots/                      # Tangkapan layar asli (screenshots) aplikasi RecipeKu yang berjalan
│   ├── dokumentasi/
│   │   ├── Dokumentasi_Teknis_RecipeKu.md
│   │   └── Hasil_Pengujian_QA_RecipeKu.md
│   └── README.md
│
├── 03_SOAL_3_DAILYTASK/
│   ├── dokumen-rancangan.md              # Dokumen utama perancangan proyek DailyTask (45%)
│   ├── flowchart/
│   │   ├── Flowchart_DailyTask.md
│   │   └── flowchart_dailytask.svg
│   ├── navigation/
│   │   ├── Navigation_Design.md
│   │   └── navigation_dailytask.svg
│   ├── wireframe/
│   │   ├── Wireframe_UI_UX.md
│   │   ├── wireframe_dailytask.html      # Showcase interaktif 9 layar smartphone DailyTask
│   │   ├── 01_login.svg s/d 09_profile.svg
│   │   └── wireframe_overview.png
│   ├── architecture/
│   │   ├── Architecture_Design.md
│   │   └── architecture_dailytask.svg
│   ├── database/
│   │   ├── Database_ERD_Design.md
│   │   ├── erd_dailytask.svg
│   │   └── schema.sql
│   └── api-design/
│       └── REST_API_Design.md
│
├── 04_LAPORAN_AKHIR/
│   ├── Laporan_UTS.md                    # Laporan akhir lengkap (Soal 1, Soal 2, Soal 3, QA, & Kesimpulan)
│   └── Laporan_UTS.pdf                   # Dokumen PDF siap kumpul hasil konversi Laporan_UTS
│
└── README.md                             # Panduan utama repositori UTS
```

---

## Ringkasan Pengerjaan Setiap Bagian

### 1. Soal 1 – Analisis Konsep React Native & Kasus E-Commerce (Bobot 20%)
* **Lokasi File:** [`01_SOAL_1/Jawaban_Soal_1.md`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/01_SOAL_1/Jawaban_Soal_1.md)
* **Cakupan:**
  1. Arsitektur berlapis React Native (*UI Layer*, *Logic Layer*, *Data Layer*, komponen `FlatList`/`View`/`Text`/`Image`, dan alur pengambilan produk dari REST API).
  2. Perbedaan mendalam *Local State* vs *Server State* beserta tabel perbandingan, peran Context API & Redux Toolkit dalam manajemen keranjang belanja (*Shopping Cart*).
  3. Integrasi REST API menggunakan HTTP Method `GET`, `POST`, `PUT`, dan `DELETE` dengan contoh lengkap *Request* dan *Response* JSON.
  4. Manajemen *Server State* (*Caching*, *Refetching*, *Loading*, *Error Handling*) dan dampaknya terhadap kenyamanan pengguna (*UX*) saat jaringan lambat atau terputus.

### 2. Soal 2 – Aplikasi Resep Masakan: RecipeKu – Indonesian Recipe Explorer (Bobot 35%)
* **Lokasi Kode Sumber:** [`02_SOAL_2_RECIPEKU/source-code/`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/02_SOAL_2_RECIPEKU/source-code)
* **Cara Menjalankan:**
  ```bash
  cd "02_SOAL_2_RECIPEKU/source-code"
  npm install --legacy-peer-deps
  npx expo start --web
  ```
* **Fitur Utama:**
  * Katalog resep (`FlatList`), filter kategori/tag, dan indikator waktu *Cache* TanStack Query.
  * Pencarian resep berdasarkan nama makanan (`GET https://dummyjson.com/recipes/search?q=Pizza`) dengan *Debounce* 450ms, tombol *Clear*, dan *Empty State*.
  * Detail resep (`GET https://dummyjson.com/recipes/{id}`) menampilkan gambar, deskripsi, *cuisine*, *rating*, waktu persiapan & memasak, porsi, kalori, ceklis bahan makanan, dan langkah memasak.
  * Pencarian resep berdasarkan bahan makanan (*Search by Ingredients*) menggunakan *client-side multi-ingredient filtering* di atas *cached Server State* (`GET /recipes?limit=50`) disertai penjelasan transparan keterbatasan API DummyJSON.
  * Penanganan *Loading State*, *Error State* dengan tombol *Retry*, serta *Caching* (`staleTime: 5 menit`, `gcTime: 30 menit`).

### 3. Soal 3 – Perancangan Proyek Aplikasi Mobile: DailyTask (Bobot 45%)
* **Lokasi Dokumen:** [`03_SOAL_3_DAILYTASK/dokumen-rancangan.md`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/dokumen-rancangan.md)
* **Cakupan:**
  * Identifikasi masalah, solusi, tujuan, manfaat, dan target pengguna.
  * Analisis 11 kebutuhan fungsional dan 6 kebutuhan nonfungsional beserta tabel spesifikasi.
  * Flowchart / Activity Diagram dan diagram navigasi 9 halaman.
  * Wireframe visual untuk 9 halaman smartphone (`Login`, `Register`, `Dashboard`, `Daftar Tugas`, `Tambah Tugas`, `Edit Tugas`, `Detail Tugas`, `Riwayat Aktivitas`, `Profil`) dalam format HTML/CSS dan SVG.
  * Arsitektur React Native, perancangan database relasional (`users` & `tasks`) beserta ERD dan SQL schema, serta rancangan 10 endpoint REST API backend.

