# JAWABAN SOAL 1: ANALISIS KONSEP REACT NATIVE DAN ARSITEKTUR APLIKASI E-COMMERCE

**Mata Kuliah:** Pemrograman Mobile Lanjut (412573401)  
**Bobot Penilaian:** 20% (CPMK 1: Memahami arsitektur aplikasi dan komponen lanjutan pada React Native)  
**Studi Kasus:** Pengembangan Aplikasi Mobile E-Commerce Berbasis React Native  

---

## PENDAHULUAN STUDI KASUS

Sebuah aplikasi *e-commerce* modern yang dibangun menggunakan **React Native** menuntut pemisahan tanggung jawab (*Separation of Concerns*) yang tegas antara tampilan antarmuka (*User Interface*), logika bisnis (*Business Logic*), serta pengelolaan dan sinkronisasi data (*Data Management*). Dalam skenario pengguna melihat daftar produk, mencari produk, memeriksa detail produk, hingga mengelola keranjang belanja (*shopping cart*), aplikasi harus mampu berinteraksi secara asinkron dengan *backend server* melalui **REST API** sekaligus menjaga performa antarmuka tetap responsif pada kecepatan *frame rate* 60–120 FPS.

Dokumen ini menguraikan secara komprehensif keempat aspek fundamental arsitektur aplikasi *e-commerce* pada React Native sesuai instruksi soal dan rubrik penilaian.

---

## 1. ARSITEKTUR REACT NATIVE DAN INTERAKSI ANTARKOMPONEN (Bobot: 20%)

### 1.1. Konsep Arsitektur Berlapis (*Layered Architecture*) pada Aplikasi React Native

Untuk memastikan kode mudah dipelihara (*maintainable*), dapat diuji (*testable*), dan berskala besar (*scalable*), aplikasi *e-commerce* React Native dirancang menggunakan arsitektur tiga lapis (*Three-Tier Mobile Architecture*) yang terdiri atas **UI Layer**, **Logic Layer**, dan **Data Layer**, serta ditopang oleh mekanisme internal mesin React Native (*Threads & Rendering Pipeline*).

```mermaid
flowchart TD
    subgraph UI_LAYER ["1. UI LAYER (Presentation Layer)"]
        A["ProductListScreen / HomeScreen"]
        B["Komponen Inti React Native<br/>(FlatList, View, Text, Image, TextInput, Pressable)"]
        C["Komponen State Visual<br/>(Skeleton / ActivityIndicator, ErrorView, EmptyState)"]
        A --> B
        A --> C
    end

    subgraph LOGIC_LAYER ["2. LOGIC LAYER (Business Logic & State Management)"]
        D["Custom Hooks<br/>(useProducts, useSearchProducts, useCart)"]
        E["Server State Manager<br/>(TanStack Query: QueryClient, Cache, Stale/Retry Engine)"]
        F["Client / Global State Manager<br/>(Context API / Redux Toolkit: Cart, Auth, Filter UI)"]
        D --> E
        D --> F
    end

    subgraph DATA_LAYER ["3. DATA LAYER (Service & Network Layer)"]
        G["API Service Module<br/>(productApi.js, cartApi.js)"]
        H["HTTP Client Engine<br/>(Axios Instance, Interceptors, Timeout & Header Config)"]
        I["Local Persistence<br/>(AsyncStorage / MMKV untuk Token & Offline Cache)"]
        G --> H
        G --> I
    end

    subgraph BACKEND ["EXTERNAL SYSTEM (Backend E-Commerce)"]
        J[("REST API Server<br/>(JSON over HTTPS)")]
        K[("Database Produk & Transaksi")]
        J --> K
    end

    UI_LAYER <-->|"Props, Events, State Subscription"| LOGIC_LAYER
    LOGIC_LAYER <-->|"Async Function Calls & Normalized JSON"| DATA_LAYER
    H <-->|"HTTP GET, POST, PUT, DELETE (JSON)"| J
```

### 1.2. Peran Setiap Bagian dalam Arsitektur

1. **UI Layer (*Presentation Layer*)**
   * **Tanggung Jawab:** Bertugas merender elemen visual ke layar perangkat pengguna dan menangkap interaksi sentuhan (*touch events*) atau masukan teks (*input events*). Lapisan ini bersifat *declarative*—artinya UI hanya mendeklarasikan apa yang harus tampil berdasarkan *state* saat ini (`UI = f(state)`), tanpa mengetahui detail bagaimana data diambil dari jaringan.
   * **Komponen React Native yang Terlibat:**
     * `View`: Kontainer dasar yang memetakan langsung ke komponen *native* (`android.view.View` pada Android atau `UIView` pada iOS) dengan tata letak berbasis Flexbox (melalui mesin *Yoga Layout*).
     * `Text`: Komponen untuk menampilkan teks nama produk, harga, diskon, dan deskripsi (`TextView` / `UILabel`).
     * `Image`: Komponen untuk memuat dan menampilkan foto produk dari URL jarak jauh (*remote URI*) dengan dukungan *caching* gambar.
     * `FlatList`: Komponen daftar berkinerja tinggi yang mengimplementasikan **virtualisasi (*windowing*)**. Pada katalog *e-commerce* yang memiliki ribuan produk, `FlatList` hanya merender item yang sedang terlihat di layar (*viewport*) ditambah sedikit *buffer* (`initialNumToRender`, `windowSize`), sehingga konsumsi memori RAM tetap rendah.
     * `TextInput`: Komponen input pencarian produk (*search bar*).
     * `Pressable` / `TouchableOpacity`: Komponen interaktif untuk memilih kartu produk (*Product Card*) atau menekan tombol *"Tambah ke Keranjang"*.
     * `ActivityIndicator` & `RefreshControl`: Komponen indikator *loading* dan fitur tarik-untuk-memuat-ulang (*pull-to-refresh*).

2. **Logic Layer (*Business Logic & State Management Layer*)**
   * **Tanggung Jawab:** Menjadi jembatan penghubung antara tampilan (UI) dan sumber data (Data Layer). Lapisan ini memproses aturan bisnis (*business rules*) seperti pemformatan harga mata uang (misalnya `Rp 150.000`), validasi ketersediaan stok sebelum masuk keranjang, *debouncing* input pencarian, serta pengelolaan siklus hidup data (*loading*, *caching*, *error state*, dan *optimistic update*).
   * **Implementasi:** Diwujudkan melalui *Custom Hooks* (seperti `useProducts()`, `useCart()`), *Server State Manager* (**TanStack Query**), serta *Global Client State* (**Context API** atau **Redux Toolkit**).

3. **Data Layer (*Service & Network Layer*)**
   * **Tanggung Jawab:** Mengabstraksi seluruh komunikasi eksternal dan penyimpanan lokal. Lapisan ini menyusun *HTTP Request* (URL *endpoint*, *method*, *query parameters*, *headers* autentikasi `Authorization: Bearer <token>`, dan *request body*), mengirimkannya ke server, lalu melakukan deserialisasi respons JSON menjadi objek JavaScript yang siap dikonsumsi oleh *Logic Layer*.
   * **Implementasi:** Diwujudkan melalui modul layanan terpisah (`api/productService.js`) menggunakan pustaka HTTP seperti **Axios** atau `fetch` API, serta penyimpanan lokal seperti `AsyncStorage` atau `react-native-mmkv`.

4. **REST API (*Representational State Transfer Application Programming Interface*)**
   * **Tanggung Jawab:** Antarmuka komunikasi standar berbasis protokol HTTP/HTTPS yang menghubungkan aplikasi *client* React Native dengan *server backend* *e-commerce*. Seluruh data katalog produk, stok, harga, dan keranjang belanja dipertukarkan secara *stateless* menggunakan format teks ringan **JSON (*JavaScript Object Notation*)**.

5. **Arsitektur Internal Mesin React Native (JavaScript Thread vs UI Thread)**
   * Di balik layar, React Native memisahkan eksekusi logika JavaScript (**JS Thread** yang dijalankan oleh mesin **Hermes**) dari perenderan antarmuka asli (**Main/UI Thread**).
   * Ketika *Data Layer* memanggil REST API, operasi jaringan berjalan secara asinkron (*non-blocking*) melalui modul *native* jaringan sehingga tidak membekukan *UI Thread* maupun *JS Thread*.
   * Setelah JSON diterima dan diolah di *JS Thread*, React menghitung perubahan pohon komponen (*reconciliation*), menghitung tata letak Flexbox melalui **Shadow Thread (Yoga Engine)**, lalu mengirimkan instruksi pembaruan tampilan ke **UI Thread** (melalui *Bridge* pada arsitektur lama atau secara sinkron/langsung melalui **JSI [JavaScript Interface] & Fabric Renderer** pada *New Architecture* React Native).

---

### 1.3. Alur Proses Pengambilan dan Penampilan Data Produk (*End-to-End Sequence*)

Ketika pengguna membuka halaman **Daftar Produk (*Product List Screen*)**, urutan interaksi antarbagian berjalan secara sistematis melalui tahapan berikut:

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant UI as UI Layer<br/>(ProductListScreen & FlatList)
    participant Logic as Logic Layer<br/>(useProducts / TanStack Query)
    participant Data as Data Layer<br/>(Axios / productApi.js)
    participant API as REST API Server<br/>(Backend E-Commerce)

    User->>UI: Membuka halaman Daftar Produk
    UI->>Logic: Memanggil useProducts({ page: 1, category: 'electronics' })
    Logic->>Logic: Cek Cache berdasarkan queryKey ['products', 1, 'electronics']
    
    alt Data belum ada di Cache (Initial Load)
        Logic-->>UI: Mengembalikan status { isLoading: true, data: undefined }
        UI-->>User: Merender ActivityIndicator / Skeleton Shimmer
        Logic->>Data: Memanggil fetchProducts(params)
        Data->>API: HTTP GET /api/v1/products?page=1&category=electronics
        API-->>Data: HTTP 200 OK (Payload JSON Daftar Produk)
        Data->>Data: Deserialisasi JSON & Normalisasi Data
        Data-->>Logic: Mengembalikan Array Objek Produk
        Logic->>Logic: Menyimpan data ke Cache & set isLoading = false
        Logic-->>UI: Memicu Re-render dengan { isLoading: false, data: [...] }
        UI->>UI: FlatList memvirtualisasi & merender ProductCard
        UI-->>User: Menampilkan daftar produk (Gambar, Nama, Harga, Rating)
    else Data sudah ada di Cache & masih Fresh
        Logic-->>UI: Langsung mengembalikan data dari Cache ({ isLoading: false, data })
        UI-->>User: Menampilkan daftar produk secara instan (0 ms network delay)
    end
```

**Penjelasan Tahapan Alur:**
1. **Inisiasi Siklus Hidup (*Component Mount*):** Pengguna membuka `ProductListScreen`. Komponen React dieksekusi dan memanggil *custom hook* di *Logic Layer*, misalnya `const { data, isLoading, isError, refetch } = useProducts()`.
2. **Evaluasi Cache & State Awal:** *Logic Layer* memeriksa apakah data untuk kunci kueri (`queryKey: ['products']`) sudah tersedia di dalam memori *cache*. Jika belum ada, *Logic Layer* mengatur `isLoading: true` dan memberi tahu *UI Layer* untuk menampilkan `ActivityIndicator` atau *Skeleton Loader*.
3. **Eksekusi Request pada Data Layer:** *Logic Layer* memanggil fungsi `getProducts()` pada *Data Layer*. Modul Axios menyusun permintaan `GET https://api.tokoku.id/v1/products` beserta *header* `Accept: application/json` dan mengirimkannya secara asinkron melalui jaringan.
4. **Pemrosesan Respons JSON:** Server REST API memproses permintaan, mengambil data dari database, dan mengirimkan respons berstatus `200 OK` dengan *body* berformat JSON. Axios menerima paket tersebut dan secara otomatis mengonversi teks JSON menjadi objek/array JavaScript.
5. **Pembaruan State & Rekonsiliasi UI:** *Logic Layer* menyimpan hasil respons ke dalam *cache*, mengubah status menjadi `isLoading: false` dan `isSuccess: true`, lalu mengirimkan referensi `data` terbaru ke *UI Layer*.
6. **Perenderan Teroptimasi dengan `FlatList`:** Perubahan *state* memicu *re-render* pada `ProductListScreen`. Komponen `FlatList` menerima prop `data={products}` dan mengeksekusi fungsi `renderItem` untuk setiap produk yang masuk ke area pandang layar, merender `Image` (foto produk), `Text` (nama & harga produk), serta tombol aksi ke layar pengguna.

---

## 2. LOCAL STATE, SERVER STATE, DAN PERAN CONTEXT API / REDUX (Bobot: 25%)

Ketika pengguna memilih produk dan menambahkannya ke keranjang belanja (*shopping cart*), aplikasi harus mengelola dua jenis *state* yang memiliki karakteristik sangat berbeda: **Local State (Client State)** dan **Server State**.

### 2.1. Pengertian Local State (*Client State*)
**Local State** (atau *Client/UI State*) adalah data yang sepenuhnya dimiliki, dibuat, dan dikendalikan di dalam memori aplikasi *client* (perangkat pengguna), bersifat sinkron, tidak disimpan secara permanen di server eksternal, dan umumnya hanya relevan bagi satu komponen atau sesi tampilan pengguna saat itu.
* **Karakteristik Utama:**
  * Pembaruannya bersifat instan dan sinkron (tanpa jeda jaringan).
  * Selalu mutakhir (*always up-to-date*) karena hanya diubah oleh interaksi pengguna pada perangkat tersebut.
  * Dikelola menggunakan *hook* bawaan React seperti `useState` atau `useReducer` untuk cakupan komponen lokal, serta **Context API** atau **Redux** jika perlu diakses lintas banyak halaman (*Global Client State*).

### 2.2. Pengertian Server State
**Server State** adalah data yang sumber kebenaran utamanya (*Single Source of Truth*) berada di server jarak jauh (*remote backend database*), diambil melalui protokol jaringan (REST API / GraphQL) secara asinkron, dan dapat diubah oleh pengguna lain atau sistem lain kapan saja tanpa sepengetahuan aplikasi *client* saat itu.
* **Karakteristik Utama:**
  * Bersifat asinkron (*asynchronous*) dan bergantung pada kondisi jaringan (memiliki status *loading*, *success*, atau *error*).
  * Memiliki risiko menjadi usang (*stale* / *out-of-date*)—misalnya stok barang di server berubah dari `5` menjadi `0` karena dibeli oleh pengguna lain detik itu juga.
  * Membutuhkan manajemen siklus hidup khusus seperti *caching*, *deduplication*, *background refetching*, *pagination*, dan *cache invalidation* (dikelola menggunakan pustaka seperti **TanStack Query / React Query** atau **RTK Query**).

### 2.3. Tabel Perbandingan Local State vs Server State

| Aspek Perbandingan | Local State (*Client State*) | Server State (*Remote State*) |
| :--- | :--- | :--- |
| **Lokasi Sumber Data (*Source of Truth*)** | Memori lokal perangkat pengguna (di dalam aplikasi React Native). | Database pada *server backend* yang diakses melalui REST API. |
| **Sifat Akses & Pembaruan** | Sinkron (*synchronous*) dan instan. | Asinkron (*asynchronous*), membutuhkan waktu tunggu jaringan (*network latency*). |
| **Kepemilikan Data** | Eksklusif milik satu pengguna/perangkat yang sedang membuka aplikasi. | Dibagikan (*shared*) ke ribuan pengguna; dapat berubah di luar kendali aplikasi *client*. |
| **Konsistensi Data** | Selalu akurat sesuai interaksi terakhir pengguna di layar. | Berpotensi usang (*stale*) sehingga memerlukan mekanisme *refetching* & *invalidation*. |
| **Kebutuhan Penanganan Kegagalan** | Sangat minim (tidak terpengaruh sinyal internet). | Wajib menangani *network timeout*, *offline*, HTTP 4xx/5xx, dan *retry*. |
| **Alat Pengelola (*Tools*)** | `useState`, `useReducer`, **Context API**, **Redux Toolkit**, Zustand. | **TanStack Query (React Query)**, SWR, Apollo Client, RTK Query. |
| **Contoh pada Aplikasi E-Commerce** | Kata kunci di kotak pencarian, status buka/tutup *BottomSheet* varian ukuran, tab aktif, tema *Dark/Light Mode*, input jumlah barang sebelum menekan tombol beli. | Daftar katalog produk, detail spesifikasi & harga produk, sisa stok gudang *real-time*, daftar ulasan pembeli, status pengiriman pesanan. |

### 2.4. Contoh Penerapan pada Kasus Memilih Produk & Menambah ke Keranjang

Saat pengguna berada di halaman **Detail Produk (`ProductDetailScreen`)** dan hendak memasukkan sepatu ke keranjang belanja:
1. **Penerapan Local State (`useState`):**
   * Pengguna memilih ukuran sepatu (`size: 42`), warna (`color: 'Hitam'`), dan mengatur jumlah barang yang ingin dibeli menggunakan tombol `+` / `-` (`selectedQty: 2`) sebelum menekan tombol *"Tambah ke Keranjang"*.
   * Status apakah *modal* konfirmasi terbuka (`isModalOpen: true/false`) juga merupakan *Local State*. Data ini tidak perlu dikirim ke server setiap kali pengguna mengganti pilihan warna di layar.
2. **Penerapan Server State (`useQuery` & `useMutation`):**
   * Informasi produk itu sendiri (nama sepatu, harga Rp 450.000, dan sisa stok di gudang sebanyak 8 pasang) yang diambil dari `GET /api/products/101` adalah **Server State**.
   * Saat pengguna menekan tombol *"Tambah ke Keranjang"* dan data dikirim ke server melalui `POST /api/cart`, hasil sinkronisasi keranjang belanja di server beserta validasi apakah stok masih mencukupi merupakan **Server State**.

### 2.5. Peran Context API dan Redux dalam Pengelolaan State Aplikasi & Keranjang Belanja

Dalam aplikasi *e-commerce*, data **Keranjang Belanja (*Shopping Cart*)** dan **Status Autentikasi Pengguna** harus dapat diakses oleh banyak komponen yang tersebar di berbagai level hierarki layar—mulai dari *Header Badge* (ikon keranjang dengan angka jumlah barang di pojok kanan atas), `HomeScreen`, `ProductDetailScreen`, `CartScreen`, hingga `CheckoutScreen`.

Jika hanya menggunakan `useState` biasa, pengembang harus meneruskan data secara berantai melewati banyak komponen perantara yang tidak membutuhkannya (masalah **Prop Drilling**). Di sinilah **Context API** dan **Redux (Redux Toolkit)** berperan:

```mermaid
flowchart LR
    subgraph GLOBAL_STORE ["Global Store (Redux Toolkit / Context API)"]
        CartState["Cart State<br/>items: [{ id, name, price, qty, checked }]<br/>totalItems: 3<br/>totalPrice: Rp 650.000"]
    end

    ProductDetail["ProductDetailScreen"] -->|"dispatch(addToCart(item))"| CartState
    CartScreen["CartScreen"] -->|"dispatch(updateQty({id, qty}))<br/>dispatch(removeFromCart(id))"| CartState
    
    CartState -->|"useSelector / useContext"| HeaderBadge["Header Cart Badge (3)"]
    CartState -->|"useSelector / useContext"| CartList["Daftar Item di CartScreen"]
    CartState -->|"useSelector / useContext"| Checkout["Ringkasan Harga di CheckoutScreen"]
```

1. **Peran React Context API:**
   * Menyediakan mekanisme berbagi data (*state provider*) lintas pohon komponen tanpa *prop drilling*.
   * Sangat cocok untuk *state* global dengan frekuensi perubahan rendah hingga menengah, seperti informasi profil pengguna yang sedang *login* (`AuthContext`), pengaturan tema (`ThemeContext`), atau keranjang belanja sederhana pada aplikasi berskala kecil-menengah (`CartContext`).
2. **Peran Redux (Redux Toolkit / RTK):**
   * Menyediakan wadah penyimpanan terpusat (*Centralized Store*) dengan pola aliran data satu arah (*Unidirectional Data Flow*: `Action -> Reducer -> Store -> View`) yang terprediksi.
   * Sangat unggul untuk pengelolaan **Keranjang Belanja (*Shopping Cart*)** yang kompleks pada aplikasi *e-commerce* skala besar karena:
     * **Logika Perhitungan Terpusat (*Selectors*):** Menghitung subtotal per toko, diskon *voucher*, pajak PPN, berat total pengiriman, dan item yang dicentang (*checked items*) secara teroptimasi menggunakan *memoized selector* (`createSelector`).
     * **Persistensi Lokal (*Redux Persist*):** Keranjang belanja pengguna yang belum *login* (*Guest Cart*) dapat disimpan otomatis ke `AsyncStorage` sehingga tidak hilang saat aplikasi ditutup.
     * **Integrasi dengan Server State (*Hybrid Cart Pattern*):** Saat pengguna menekan *"Tambah ke Keranjang"*, Redux / Context memperbarui angka *badge* keranjang di UI secara instan (**Optimistic UI Update**), sementara di latar belakang layanan API mengirimkan `POST /api/cart` untuk menyinkronkan data keranjang tersebut ke database server pengguna.

---

## 3. INTEGRASI REST API DAN PERTUKARAN DATA JSON (Bobot: 30%)

### 3.1. Peran JSON (*JavaScript Object Notation*) sebagai Format Pertukaran Data
**JSON** adalah format pertukaran data berbasis teks yang ringan, mudah dibaca manusia, dan sangat kompatibel secara alami dengan objek JavaScript di React Native.
* **Serialisasi (*Serialization*):** Saat aplikasi React Native mengirimkan data ke server (pada method `POST` atau `PUT`), objek JavaScript di memori dikonversi menjadi untaian teks JSON menggunakan `JSON.stringify(payload)` dengan menyertakan *HTTP Header* `Content-Type: application/json`.
* **Deserialisasi (*Deserialization*):** Saat server merespons permintaan aplikasi, server mengirimkan teks JSON dengan header `Content-Type: application/json`. Pustaka seperti **Axios** secara otomatis menjalankan `JSON.parse(responseBody)` sehingga *Logic Layer* langsung menerima struktur Array/Object JavaScript yang siap dirender oleh komponen React Native.

### 3.2. Ringkasan Penggunaan HTTP Method pada Kasus E-Commerce

| HTTP Method | Endpoint REST API | Operasi CRUD | Fungsi pada Kasus E-Commerce | Sifat Idempoten |
| :---: | :--- | :---: | :--- | :---: |
| **`GET`** | `/api/v1/products` | *Read* | Mengambil daftar katalog produk dari server (mendukung filter & pencarian). | Ya (Aman) |
| **`POST`** | `/api/v1/cart/items` | *Create* | Menambahkan item produk baru ke dalam keranjang belanja pengguna. | Tidak |
| **`PUT`** | `/api/v1/cart/items/{itemId}` | *Update* | Memperbarui jumlah (*quantity*) atau catatan produk yang sudah ada di keranjang. | Ya |
| **`DELETE`** | `/api/v1/cart/items/{itemId}` | *Delete* | Menghapus item produk tertentu dari keranjang belanja pengguna. | Ya |

---

### 3.3. Rincian Implementasi & Contoh Request–Response JSON per HTTP Method

#### A. Method `GET` – Mengambil Daftar Produk
Digunakan ketika pengguna membuka halaman katalog atau melakukan pencarian produk. Data dikirim melalui *URL Query Parameters* (tidak menggunakan *Request Body*).

* **Contoh HTTP Request:**
```http
GET /api/v1/products?category=smartphone&limit=2&page=1 HTTP/1.1
Host: api.ecommerce-nusantara.id
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

* **Contoh HTTP Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Daftar produk berhasil diambil",
  "meta": {
    "currentPage": 1,
    "perPage": 2,
    "totalItems": 48,
    "totalPages": 24
  },
  "data": [
    {
      "id": "PRD-1001",
      "name": "Smartphone Nusantara Pro 5G 256GB",
      "category": "smartphone",
      "price": 6499000,
      "discountPercentage": 10,
      "finalPrice": 5849100,
      "stock": 15,
      "rating": 4.9,
      "thumbnail": "https://cdn.ecommerce-nusantara.id/products/prd-1001.jpg"
    },
    {
      "id": "PRD-1002",
      "name": "Earbuds Wireless Active Noise Cancelling",
      "category": "audio",
      "price": 899000,
      "discountPercentage": 0,
      "finalPrice": 899000,
      "stock": 42,
      "rating": 4.7,
      "thumbnail": "https://cdn.ecommerce-nusantara.id/products/prd-1002.jpg"
    }
  ]
}
```

#### B. Method `POST` – Menambahkan Produk ke Keranjang Belanja
Digunakan ketika pengguna menekan tombol **"+ Keranjang"** pada halaman produk. Aplikasi mengirimkan identitas produk, jumlah, dan varian di dalam *Request Body* berformat JSON.

* **Contoh HTTP Request:**
```http
POST /api/v1/cart/items HTTP/1.1
Host: api.ecommerce-nusantara.id
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "productId": "PRD-1001",
  "quantity": 1,
  "variant": {
    "color": "Midnight Black",
    "storage": "256GB"
  },
  "notes": "Tolong gunakan bubble wrap tebal"
}
```

* **Contoh HTTP Response (`201 Created`):**
```json
{
  "status": "success",
  "message": "Produk berhasil ditambahkan ke keranjang belanja",
  "data": {
    "cartItemId": "CART-ITEM-8821",
    "userId": "USR-309",
    "productId": "PRD-1001",
    "productName": "Smartphone Nusantara Pro 5G 256GB",
    "unitPrice": 5849100,
    "quantity": 1,
    "subtotal": 5849100,
    "variant": {
      "color": "Midnight Black",
      "storage": "256GB"
    },
    "notes": "Tolong gunakan bubble wrap tebal",
    "createdAt": "2026-11-14T08:15:30Z"
  }
}
```

#### C. Method `PUT` – Memperbarui Jumlah Produk di Keranjang
Digunakan ketika pengguna menekan tombol tambah (`+`) atau kurang (`-`) kuantitas barang di halaman Keranjang Belanja (`CartScreen`). Parameter `cartItemId` dikirim melalui *URL Path*, sedangkan kuantitas baru dikirim melalui *Request Body* JSON.

* **Contoh HTTP Request:**
```http
PUT /api/v1/cart/items/CART-ITEM-8821 HTTP/1.1
Host: api.ecommerce-nusantara.id
Content-Type: application/json
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "quantity": 3,
  "notes": "Tolong gunakan bubble wrap tebal dan asuransi"
}
```

* **Contoh HTTP Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Jumlah produk pada keranjang berhasil diperbarui",
  "data": {
    "cartItemId": "CART-ITEM-8821",
    "productId": "PRD-1001",
    "unitPrice": 5849100,
    "quantity": 3,
    "subtotal": 17547300,
    "notes": "Tolong gunakan bubble wrap tebal dan asuransi",
    "updatedAt": "2026-11-14T08:20:12Z"
  }
}
```

#### D. Method `DELETE` – Menghapus Produk dari Keranjang
Digunakan ketika pengguna menekan ikon tempat sampah (*Trash Icon*) pada salah satu baris item di keranjang belanja.

* **Contoh HTTP Request:**
```http
DELETE /api/v1/cart/items/CART-ITEM-8821 HTTP/1.1
Host: api.ecommerce-nusantara.id
Accept: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

* **Contoh HTTP Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Produk berhasil dihapus dari keranjang belanja",
  "data": {
    "deletedCartItemId": "CART-ITEM-8821",
    "remainingItemsCount": 1,
    "cartTotalAmount": 899000
  }
}
```

### 3.4. Contoh Implementasi Kode Service API pada React Native (Axios)

```javascript
// src/api/ecommerceApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.ecommerce-nusantara.id/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 1. GET: Mengambil daftar produk
export const getProducts = async ({ category, page = 1, limit = 10 }) => {
  const response = await apiClient.get('/products', {
    params: { category, page, limit },
  });
  return response.data;
};

// 2. POST: Menambahkan produk ke keranjang
export const addToCart = async (payload) => {
  const response = await apiClient.post('/cart/items', payload);
  return response.data;
};

// 3. PUT: Memperbarui jumlah produk di keranjang
export const updateCartItemQuantity = async ({ cartItemId, quantity, notes }) => {
  const response = await apiClient.put(`/cart/items/${cartItemId}`, {
    quantity,
    notes,
  });
  return response.data;
};

// 4. DELETE: Menghapus produk dari keranjang
export const removeCartItem = async (cartItemId) => {
  const response = await apiClient.delete(`/cart/items/${cartItemId}`);
  return response.data;
};
```

---

## 4. SERVER STATE MANAGEMENT: CACHING, REFETCHING, LOADING, DAN ERROR HANDLING (Bobot: 25%)

Pengguna aplikasi *mobile* sering berada dalam kondisi jaringan seluler yang tidak stabil—misalnya saat berada di dalam gedung, kereta, atau daerah dengan sinyal lemah (*high latency / packet loss*). Pengelolaan **Server State** menggunakan pustaka seperti **TanStack Query (React Query)** memastikan aplikasi *e-commerce* tetap responsif, hemat kuota data, dan tangguh menghadapi gangguan koneksi melalui empat pilar utama:

```mermaid
stateDiagram-v2
    [*] --> CheckingCache: Pengguna membuka Halaman Produk
    CheckingCache --> InitialLoading: Cache Kosong (Hard Load)
    CheckingCache --> RenderFromCache: Cache Tersedia (Instant UI)

    InitialLoading --> SuccessState: API 200 OK (Simpan ke Cache)
    InitialLoading --> ErrorState: Koneksi Putus / Timeout setelah Retry

    RenderFromCache --> CheckStale: Cek staleTime (mis. 5 menit)
    CheckStale --> FreshData: Belum Stale (Tidak perlu request API)
    CheckStale --> BackgroundRefetch: Sudah Stale (Stale-While-Revalidate)

    BackgroundRefetch --> SuccessState: Data diperbarui diam-diam di background
    BackgroundRefetch --> RenderFromCache: Gagal sinyal? Tetap tampilkan data Cache lama

    ErrorState --> InitialLoading: Pengguna menekan tombol "Coba Lagi" (Retry) atau Sinyal Pulih
```

### 4.1. Caching (Penyimpanan Sementara Data Server)
* **Konsep Teknis:** *Caching* adalah mekanisme menyimpan hasil respons REST API di dalam memori aplikasi (atau *persistent storage*) menggunakan identitas unik berupa **`queryKey`** (contoh: `['products', { category: 'sepatu' }]` atau `['product-detail', 'PRD-1001']`). Di dalam TanStack Query, *caching* diatur oleh dua parameter krusial:
  1. **`staleTime` (Waktu Segar):** Durasi di mana data dianggap masih mutakhir (*fresh*). Selama periode ini (misalnya `5 menit`), jika pengguna berpindah dari halaman *Home* ke *Detail Produk* lalu menekan tombol *Back* kembali ke *Home*, aplikasi **tidak akan memanggil REST API sama sekali** dan langsung merender data dari memori dalam waktu 0 milidetik.
  2. **`gcTime` / `cacheTime` (Waktu Garbage Collection):** Durasi data yang sudah tidak aktif tetap disimpan di memori sebelum dihapus (misalnya `30 menit`).
* **Manfaat bagi Pengalaman Pengguna (UX) saat Koneksi Lambat/Terputus:**
  * Menghilangkan layar putih berulang (*no repetitive loading spinners*) saat pengguna bernavigasi maju-mundur membandingkan beberapa produk.
  * Menghemat konsumsi baterai dan kuota internet pengguna.
  * Ketika koneksi tiba-tiba terputus (*offline*), pengguna tetap dapat melihat katalog produk dan detail produk yang sebelumnya sudah pernah dibuka karena datanya masih tersimpan di dalam *cache*.

### 4.2. Refetching (Penyegaran Data Otomatis & Sinkronisasi)
* **Konsep Teknis:** Karena data di server *e-commerce* bersifat dinamis (harga promo *flash sale* dapat berubah atau stok barang habis terjual), data di dalam *cache* tidak boleh dibiarkan usang selamanya. *Refetching* menerapkan strategi **Stale-While-Revalidate (SWR)**: aplikasi langsung menampilkan data dari *cache* kepada pengguna agar UI terasa instan, sembari melakukan pengambilan data terbaru di latar belakang (*background fetching*).
* **Pemicu Refetching pada Aplikasi Mobile:**
  1. **Saat Koneksi Pulih (`refetchOnReconnect: true`):** Ketika sinyal pengguna sempat terputus di lift lalu kembali terhubung ke 4G/Wi-Fi, aplikasi otomatis menyinkronkan ulang daftar produk dan keranjang.
  2. **Saat Aplikasi Kembali Aktif (`AppState` / `refetchOnWindowFocus`):** Ketika pengguna berpindah dari aplikasi *chat* kembali ke aplikasi *e-commerce*, data stok diperbarui secara otomatis.
  3. **Tarik untuk Memuat Ulang (*Pull-to-Refresh*):** Pengguna menarik daftar `FlatList` ke bawah untuk memicu fungsi `refetch()` secara manual.
  4. **Invalidasi Pasca-Mutasi (`invalidateQueries`):** Sesaat setelah pengguna berhasil menambahkan barang ke keranjang (`POST /cart/items`), aplikasi memanggil `queryClient.invalidateQueries({ queryKey: ['cart'] })` agar data keranjang otomatis diambil ulang dan selalu sinkron dengan server.
* **Manfaat bagi Pengalaman Pengguna (UX):** Pengguna tidak pernah terjebak membeli barang yang stoknya sudah habis atau melihat harga yang sudah kedaluwarsa, tanpa harus mengorbankan kecepatan tampilan antarmuka.

### 4.3. Loading State (Manajemen Indikator Pemuatan Bertingkat)
* **Konsep Teknis:** Operasi jaringan membutuhkan waktu tunggu (*latency*). Pengelolaan *Server State* yang baik membedakan dua jenis status pemuatan:
  1. **`isLoading` (*Initial Hard Loading*):** Kondisi ketika aplikasi mengambil data untuk pertama kalinya dan **belum ada data sama sekali di dalam cache**. Pada kondisi ini, UI menampilkan *Skeleton Screen (Shimmer)* atau `ActivityIndicator` dengan pesan informatif *"Memuat katalog produk..."*.
  2. **`isFetching` / `isRefetching` (*Soft Background Loading*):** Kondisi ketika aplikasi sedang memperbarui data di latar belakang, tetapi **data lama sudah tersedia di cache**. Pada kondisi ini, aplikasi **tidak boleh** menghapus daftar produk di layar menjadi *spinner* kosong, melainkan tetap menampilkan daftar produk sambil memunculkan indikator kecil di bagian atas (`RefreshControl`).
* **Manfaat bagi Pengalaman Pengguna (UX) saat Koneksi Lambat:**
  * Memberikan kepastian visual (*system status visibility*) bahwa aplikasi sedang bekerja dan tidak mengalami *hang/freeze*.
  * Mencegah pergeseran tata letak yang mengganggu (*Layout Shift*) dan mencegah pengguna menekan tombol berkali-kali akibat kebingungan.

### 4.4. Error Handling (Penanganan Kegagalan Jaringan & Pemulihan)
* **Konsep Teknis:** Ketika koneksi internet terputus (`Network Error`), waktu tunggu habis (`ECONNABORTED / Timeout`), atau server mengalami gangguan (`HTTP 500 Internal Server Error`), aplikasi harus menangkap pengecualian (*exception*) tersebut secara terstruktur:
  1. **Automatic Retry dengan *Exponential Backoff*:** Sebelum menampilkan pesan gagal kepada pengguna, TanStack Query secara otomatis mencoba memanggil ulang API sebanyak 2–3 kali dengan jeda waktu yang meningkat (misalnya jeda 1 detik, 2 detik, lalu 4 detik). Jika gangguan sinyal hanya berlangsung sesaat (*micro-disconnect*), permintaan akan berhasil tanpa disadari pengguna.
  2. **Graceful Degradation (Pertahanan Cache):** Jika pengguna sudah memiliki data produk di *cache* dan proses *background refetch* gagal karena internet putus, aplikasi tetap menampilkan daftar produk dari *cache* dan hanya menampilkan *toast/banner* kecil: *"Anda sedang offline. Menampilkan data terakhir yang tersimpan."*
  3. **Dedicated Error UI & Tombol Retry:** Jika *Initial Load* gagal dan *cache* kosong, aplikasi tidak boleh menampilkan layar putih kosong (*blank screen*) atau mengalami *Force Close (Crash)*. Aplikasi merender komponen `ErrorState` khusus yang berisi ilustrasi/ikon, penjelasan bahasa manusia yang sopan (*"Koneksi internet terputus. Periksa jaringan Anda dan coba lagi"*), serta tombol **"Coba Lagi" (*Retry*)** yang memanggil fungsi `refetch()`.
* **Manfaat bagi Pengalaman Pengguna (UX):** Menjaga kepercayaan pengguna terhadap keandalan aplikasi *e-commerce*, mencegah hilangnya minat belanja akibat *crash*, dan memberikan kendali penuh kepada pengguna untuk memulihkan tampilan begitu koneksi internet mereka kembali stabil.

---

### 4.5. Ringkasan Dampak Keempat Konsep terhadap UX E-Commerce

| Konsep Server State | Skenario Koneksi Normal | Skenario Koneksi Lambat (*Slow 3G / High Latency*) | Skenario Koneksi Terputus (*Offline*) |
| :--- | :--- | :--- | :--- |
| **Caching** | Navigasi antarhalaman produk terasa instan (0 ms). | Halaman yang pernah dibuka langsung tampil tanpa menunggu *download* ulang. | Pengguna tetap dapat menelusuri produk yang sudah tersimpan di memori *cache*. |
| **Refetching** | Stok & harga selalu mutakhir secara transparan di latar belakang. | Data lama tetap tampil sementara *request* baru berjalan perlahan di *background*. | Menunda sinkronisasi dan otomatis melakukan *refetch* begitu sinyal kembali aktif. |
| **Loading** | Transisi mulus dengan *skeleton* singkat saat buka awal. | *Skeleton* / `ActivityIndicator` menjaga layar tetap komunikatif dan tidak terlihat *freeze*. | Berhenti dengan rapi setelah batas *timeout* tercapai dan beralih ke *Error State*. |
| **Error Handling** | Tidak terlihat karena permintaan sukses (`200 OK`). | *Automatic retry* menangani *timeout* sesaat tanpa mengganggu pengguna. | Menampilkan komponen *Error State* informatif + tombol **Coba Lagi** (tanpa *blank screen* / *crash*). |
