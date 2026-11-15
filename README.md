# UJIAN TENGAH SEMESTER (UTS) – PEMROGRAMAN MOBILE LANJUT

**Nama / NIM:** Marviel David (411231222)  
**Mata Kuliah:** 412573401 Pemrograman Mobile Lanjut (3 SKS)  
**Program Studi:** Teknik Informatika – Fakultas Teknik dan Informatika, Universitas Dian Nusantara  
**Dosen Pengampu:** Sahrial Ihsani Ishak, S.Kom., M.Kom  
**Tahun Akademik:** Ganjil 2026/2027  

---

## Struktur Direktori Pengumpulan UTS

Repositori ini disusun secara sistematis mengikuti instruksi dan rubrik penilaian UTS Pemrograman Mobile Lanjut untuk **Soal 1** dan **Soal 2**, lengkap dengan dokumentasi teknis dan pengujian Quality Assurance:

```text
UTS_PEMROGRAMAN_MOBILE_LANJUT/
│
├── 01_SOAL_1/
│   ├── Jawaban_Soal_1.md                 # Jawaban analisis arsitektur RN, State, REST API, & Server State
│   └── 01_Jawaban_Soal_1.md              # Salinan identik sesuai penamaan Bagian 2
│
├── 02_SOAL_2_RECIPEKU/
│   ├── source-code/                      # Proyek lengkap Expo React Native + TanStack Query
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
└── README.md                             # Panduan utama repositori UTS
```

---

## Ringkasan Pengerjaan Setiap Bagian

### 1. Soal 1 – Analisis Konsep React Native & Kasus E-Commerce
* **Lokasi File:** [`01_SOAL_1/Jawaban_Soal_1.md`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/01_SOAL_1/Jawaban_Soal_1.md)
* **Cakupan:**
  1. Arsitektur berlapis React Native (*UI Layer*, *Logic Layer*, *Data Layer*, komponen `FlatList`/`View`/`Text`/`Image`, dan alur pengambilan produk dari REST API).
  2. Perbedaan mendalam *Local State* vs *Server State* beserta tabel perbandingan, peran Context API & Redux Toolkit dalam manajemen keranjang belanja (*Shopping Cart*).
  3. Integrasi REST API menggunakan HTTP Method `GET`, `POST`, `PUT`, dan `DELETE` dengan contoh lengkap *Request* dan *Response* JSON.
  4. Manajemen *Server State* (*Caching*, *Refetching*, *Loading*, *Error Handling*) dan dampaknya terhadap kenyamanan pengguna (*UX*) saat jaringan lambat atau terputus.

### 2. Soal 2 – Aplikasi Resep Masakan: RecipeKu – Indonesian Recipe Explorer
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

