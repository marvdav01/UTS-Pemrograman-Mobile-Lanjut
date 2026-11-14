# PERANCANGAN WIREFRAME UI/UX (9 HALAMAN) – DAILYTASK

Dokumen ini menjelaskan rancangan visual antarmuka (*Wireframe & High-Fidelity Mockup*) untuk seluruh **9 halaman** aplikasi **DailyTask – Aplikasi Manajemen Aktivitas Harian**.

Seluruh visual wireframe dirancang dengan proporsi layar *smartphone* modern (**375 × 812 px**) dan tersedia dalam dua format visual yang dapat diperiksa langsung:
1. **Kanvas Showcase HTML/CSS Interaktif (Seluruh 9 Layar Smartphone):** [`wireframe_dailytask.html`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/wireframe_dailytask.html)
2. **Gambar Wireframe SVG Individual per Halaman:**
   * [`01_login.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/01_login.svg) – Halaman Login
   * [`02_register.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/02_register.svg) – Halaman Registrasi
   * [`03_dashboard.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/03_dashboard.svg) – Halaman Dashboard
   * [`04_task_list.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/04_task_list.svg) – Halaman Daftar Tugas
   * [`05_add_task.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/05_add_task.svg) – Halaman Tambah Tugas
   * [`06_edit_task.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/06_edit_task.svg) – Halaman Edit Tugas
   * [`07_task_detail.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/07_task_detail.svg) – Halaman Detail Tugas
   * [`08_history.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/08_history.svg) – Halaman Riwayat Aktivitas
   * [`09_profile.svg`](file:///c:/Users/User/OneDrive/Documents/UTS%20Mobile/UTS_PEMROGRAMAN_MOBILE_LANJUT/03_SOAL_3_DAILYTASK/wireframe/09_profile.svg) – Halaman Profil Pengguna

---

## Deskripsi Fungsi & Komponen UI Setiap Halaman

### 1. Login Screen (`01_login.svg`)
* **Fungsi Halaman:** Pintu masuk autentikasi pengguna menggunakan alamat email dan kata sandi terdaftar.
* **Komponen UI:** Status bar, Logo & Judul `DailyTask`, `TextInput` Email, `TextInput` Password (`secureTextEntry`), Checkbox *Ingat Saya*, Tombol Primer **"Masuk Sekarang"**, dan tautan navigasi **"Belum punya akun? Daftar"**.

### 2. Register Screen (`02_register.svg`)
* **Fungsi Halaman:** Pendaftaran akun baru bagi mahasiswa, pekerja, atau masyarakat umum yang belum memiliki akun.
* **Komponen UI:** Header kembali (`←`), Judul *"Buat Akun Baru"*, `TextInput` Nama Lengkap, `TextInput` Email, `TextInput` Password, `TextInput` Konfirmasi Password, Tombol Primer **"Daftar Akun"**, dan tautan **"Sudah punya akun? Masuk"**.

### 3. Dashboard Screen (`03_dashboard.svg`)
* **Fungsi Halaman:** Menampilkan ringkasan progres harian, statistik jumlah tugas berdasarkan status, dan daftar tugas berprioritas tinggi yang jatuh tempo hari ini.
* **Komponen UI:** Header sapaan pengguna & tanggal, Kartu *Daily Progress* (persentase selesai + progress bar), 3 Kartu Ringkasan Status (*Pending*, *In Progress*, *Completed*), Daftar *Tugas Prioritas Hari Ini*, tombol mengambang **FAB (`+`)**, dan **Bottom Tab Bar**.

### 4. Daftar Tugas / Task List Screen (`04_task_list.svg`)
* **Fungsi Halaman:** Menampilkan seluruh daftar tugas pengguna dengan kemampuan pencarian judul, filter status, dan filter tingkat prioritas.
* **Komponen UI:** Header judul + tombol **`+ Baru`**, `SearchBar` pencarian tugas, Chip filter status (*Semua*, *Pending*, *Proses*, *Selesai*), Chip filter prioritas (*High*, *Medium*, *Low*), `FlatList` kartu tugas dengan checkbox selesai cepat, dan **Bottom Tab Bar**.

### 5. Tambah Tugas / Add Task Screen (`05_add_task.svg`)
* **Fungsi Halaman:** Formulir input untuk menambahkan tugas baru ke dalam sistem.
* **Komponen UI:** Header `← Tambah Tugas Baru`, `TextInput` Judul Tugas, `TextInput` Deskripsi multiline, Pemilih 3 Tombol Prioritas (*Low / Rendah*, *Medium / Sedang*, *High / Tinggi*), Pemilih Tanggal & Jam Tenggat (`Due Date Picker`), serta Tombol Primer **"Simpan Tugas Baru"**.

### 6. Edit Tugas / Edit Task Screen (`06_edit_task.svg`)
* **Fungsi Halaman:** Formulir untuk mengubah data tugas yang sudah ada (judul, deskripsi, prioritas, tenggat waktu, maupun status).
* **Komponen UI:** Header `← Edit Tugas`, Form terisi otomatis (*pre-filled*) dengan data tugas saat ini, Pemilih Prioritas, Pemilih Status (*Pending*, *In Progress*, *Completed*), Pemilih Tanggal Tenggat, Tombol Primer **"Simpan Perubahan"**, dan Tombol Sekunder **"Batal"**.

### 7. Detail Tugas / Task Detail Screen (`07_task_detail.svg`)
* **Fungsi Halaman:** Menampilkan rincian informasi lengkap dari satu tugas beserta tombol aksi penyelesaian, pengeditan, atau penghapusan.
* **Komponen UI:** Header `← Detail Tugas` + tombol `✏️ Edit`, Badge Prioritas (*HIGH PRIORITY*) & Badge Status (*PENDING*), Judul Lengkap Tugas, Kartu Informasi Waktu Tenggat & Waktu Dibuat, Kotak Deskripsi Lengkap, Tombol Hijau **"✓ Tandai Tugas Selesai"**, dan Tombol Merah **"🗑️ Hapus Tugas"**.

### 8. Riwayat Aktivitas / History Screen (`08_history.svg`)
* **Fungsi Halaman:** Menampilkan log kronologis dan arsip tugas-tugas yang telah diselesaikan oleh pengguna sebagai evaluasi produktivitas.
* **Komponen UI:** Header *Riwayat Aktivitas*, Kartu Statistik Mingguan (*19 Tugas Selesai Minggu Ini*), Filter Periode (*Hari Ini*, *7 Hari Terakhir*, *Bulan Ini*), Daftar Timeline Tugas Selesai lengkap dengan jam penyelesaian, serta **Bottom Tab Bar**.

### 9. Profil Pengguna / Profile Screen (`09_profile.svg`)
* **Fungsi Halaman:** Menampilkan identitas akun pengguna, ringkasan capaian produktivitas, pengaturan profil, dan tombol *Logout*.
* **Komponen UI:** Avatar Inisial (`BS`), Nama Lengkap & Email Pengguna, Kartu Statistik Akun (*Total Tugas Dibuat*, *Tugas Selesai*, *Rasio Produktivitas*), Form Ubah Nama & Kata Sandi, Tombol **"Simpan Profil"**, Tombol Merah **"Keluar dari Akun (Logout)"**, serta **Bottom Tab Bar**.

