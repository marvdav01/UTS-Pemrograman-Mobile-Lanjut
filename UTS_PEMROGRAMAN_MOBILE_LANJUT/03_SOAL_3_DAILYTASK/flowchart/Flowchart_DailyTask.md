# PERANCANGAN FLOWCHART & ACTIVITY DIAGRAM – DAILYTASK

Dokumen ini memuat diagram alir penggunaan aplikasi **DailyTask – Aplikasi Manajemen Aktivitas Harian** secara menyeluruh, mulai dari pengguna membuka aplikasi, autentikasi (Login/Registrasi), melihat Dashboard, memilih menu, melihat daftar tugas, menambah tugas, mengubah tugas, menghapus tugas, menyelesaikan tugas, melihat riwayat aktivitas, hingga Logout.

---

## 1. Flowchart Keseluruhan Alur Penggunaan Aplikasi

```mermaid
flowchart TD
    Start(["Mulai"]) --> OpenApp["Membuka Aplikasi DailyTask"]
    OpenApp --> CheckToken{"Token Sesi Login<br/>Tersedia & Valid?"}

    CheckToken -- "Tidak" --> HasAccount{"Sudah Memiliki<br/>Akun?"}
    HasAccount -- "Belum" --> RegisterScreen["Halaman Registrasi:<br/>Input Nama, Email, Password"]
    RegisterScreen --> ValidateReg{"Data Registrasi<br/>Valid?"}
    ValidateReg -- "Tidak" --> RegError["Tampilkan Pesan Validasi Error"] --> RegisterScreen
    ValidateReg -- "Ya (POST /api/register)" --> SaveUser["Simpan Akun Baru ke Database"] --> LoginScreen

    HasAccount -- "Sudah" --> LoginScreen["Halaman Login:<br/>Input Email & Password"]
    LoginScreen --> ValidateLogin{"Kredensial Valid?<br/>(POST /api/login)"}
    ValidateLogin -- "Tidak" --> LoginError["Tampilkan Pesan Email/Password Salah"] --> LoginScreen
    ValidateLogin -- "Ya" --> SaveToken["Simpan JWT Token ke Secure Storage"] --> Dashboard

    CheckToken -- "Ya" --> Dashboard["Menampilkan Dashboard Screen:<br/>Ringkasan Progres & Tugas Hari Ini"]

    Dashboard --> SelectMenu{"Memilih Menu / Aksi Navigasi"}

    SelectMenu -- "Menu Daftar Tugas" --> ViewTaskList["Task List Screen:<br/>Melihat Daftar Tugas (GET /api/tasks)"]
    SelectMenu -- "Tombol + Tambah Tugas" --> AddTask["Add Task Screen:<br/>Input Judul, Deskripsi, Prioritas, Due Date"]
    SelectMenu -- "Menu Riwayat" --> ViewHistory["History Screen:<br/>Melihat Riwayat Tugas Selesai"]
    SelectMenu -- "Menu Profil" --> ViewProfile["Profile Screen:<br/>Lihat/Ubah Profil & Tombol Logout"]

    AddTask --> ValidateTask{"Input Tugas<br/>Valid?"}
    ValidateTask -- "Tidak" --> TaskError["Tampilkan Peringatan Kolom Wajib"] --> AddTask
    ValidateTask -- "Ya (POST /api/tasks)" --> SaveNewTask["Simpan Tugas Baru & Invalidate Cache"] --> ViewTaskList

    ViewTaskList --> TaskAction{"Pilih Aksi pada Tugas"}
    TaskAction -- "Pilih Item Tugas" --> TaskDetail["Task Detail Screen:<br/>Melihat Detail Lengkap Tugas (GET /api/tasks/{id})"]
    TaskAction -- "Centang Selesai" --> CompleteTask["Ubah Status Menjadi 'completed'<br/>(PUT /api/tasks/{id})"]
    TaskAction -- "Kembali ke Beranda" --> Dashboard

    TaskDetail --> DetailDecision{"Aksi pada Detail Tugas"}
    DetailDecision -- "Ubah Tugas" --> EditTask["Edit Task Screen:<br/>Perbarui Data & Prioritas Tugas"]
    EditTask --> SaveEdit["Simpan Perubahan (PUT /api/tasks/{id})"] --> TaskDetail

    DetailDecision -- "Selesaikan Tugas" --> CompleteTask
    CompleteTask --> UpdateHistory["Catat ke Riwayat Aktivitas & Perbarui Progres"] --> ViewTaskList

    DetailDecision -- "Hapus Tugas" --> ConfirmDelete{"Konfirmasi Hapus?"}
    ConfirmDelete -- "Batal" --> TaskDetail
    ConfirmDelete -- "Ya (DELETE /api/tasks/{id})" --> DeleteTask["Hapus Tugas dari Database & Cache"] --> ViewTaskList

    ViewHistory --> Dashboard
    ViewProfile --> LogoutDecision{"Tekan Tombol<br/>Logout?"}
    LogoutDecision -- "Tidak (Kembali)" --> Dashboard
    LogoutDecision -- "Ya (POST /api/logout)" --> ClearSession["Hapus Token Sesi Lokal"] --> End(["Selesai"])
```

---

## 2. Activity Diagram Swimlane (Pengguna vs Aplikasi React Native vs REST API Backend)

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant App as Aplikasi React Native (DailyTask)
    participant API as Backend REST API & Database

    User->>App: Membuka Aplikasi
    alt Belum Memiliki Akun
        User->>App: Buka Register Screen & isi Nama, Email, Password
        App->>API: POST /api/register
        API-->>App: 201 Created (Data User + Token)
    else Sudah Memiliki Akun
        User->>App: Isi Email & Password di Login Screen
        App->>API: POST /api/login
        API-->>App: 200 OK (JWT Access Token)
    end
    App->>App: Simpan Token & Arahkan ke Dashboard Screen
    App->>API: GET /api/tasks (Ambil ringkasan & daftar tugas)
    API-->>App: 200 OK (JSON Daftar Tugas)
    App-->>User: Tampilkan Dashboard & Progres Harian

    User->>App: Tambah Tugas Baru (Judul, Prioritas, Due Date)
    App->>API: POST /api/tasks
    API-->>App: 201 Created
    App-->>User: Perbarui Daftar Tugas & Dashboard

    User->>App: Buka Detail Tugas -> Ubah Tugas / Tandai Selesai
    App->>API: PUT /api/tasks/{id}
    API-->>App: 200 OK (Status: completed)
    App-->>User: Pindahkan ke Riwayat Aktivitas

    User->>App: Hapus Tugas
    App->>API: DELETE /api/tasks/{id}
    API-->>App: 200 OK

    User->>App: Tekan Tombol Logout di Profile Screen
    App->>API: POST /api/logout
    API-->>App: 200 OK
    App->>App: Hapus Token & Kembali ke Login Screen
```

