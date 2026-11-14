# PERANCANGAN SPESIFIKASI REST API BACKEND – DAILYTASK

> **Catatan Penting:**  
> Dokumen ini memuat **rancangan kontrak REST API Backend** untuk proyek aplikasi **DailyTask – Aplikasi Manajemen Aktivitas Harian**. Seluruh *endpoint* di bawah ini merupakan rancangan spesifikasi arsitektur backend untuk proyek DailyTask, **bukan** API publik eksternal yang sudah tersedia di internet.

---

## 1. Standar Protokol, Format Pertukaran Data, dan Autentikasi
* **Base URL Rancangan:** `https://api.dailytask-app.id/api`
* **Format Pertukaran Data:** `JSON (application/json)`
* **Mekanisme Autentikasi:** **JWT (*JSON Web Token*) Bearer Authentication**.
  * Setiap permintaan pada *endpoint* yang dilindungi wajib menyertakan header:
    `Authorization: Bearer <access_token>`

---

## 2. Daftar Lengkap Endpoint REST API

### A. Modul Authentication
| HTTP Method | Endpoint | Fungsi | Parameter | Status Code |
| :---: | :--- | :--- | :--- | :---: |
| **`POST`** | `/api/register` | Registrasi pengguna baru | Body: `name`, `email`, `password`, `password_confirmation` | `201 Created`, `422 Unprocessable Entity` |
| **`POST`** | `/api/login` | Login pengguna & penerbitan JWT | Body: `email`, `password` | `200 OK`, `401 Unauthorized` |
| **`POST`** | `/api/logout` | Mengakhiri sesi login & mencabut token | Header: `Authorization: Bearer <token>` | `200 OK`, `401 Unauthorized` |

### B. Modul Tasks (Manajemen Tugas Harian)
| HTTP Method | Endpoint | Fungsi | Parameter | Status Code |
| :---: | :--- | :--- | :--- | :---: |
| **`GET`** | `/api/tasks` | Mengambil daftar tugas milik pengguna | Query: `status`, `priority`, `search` | `200 OK`, `401 Unauthorized` |
| **`GET`** | `/api/tasks/{id}` | Mengambil detail lengkap satu tugas | Path: `id` (Task ID) | `200 OK`, `404 Not Found` |
| **`POST`** | `/api/tasks` | Menambahkan tugas baru | Body: `title`, `description`, `priority`, `due_date` | `201 Created`, `422 Unprocessable Entity` |
| **`PUT`** | `/api/tasks/{id}` | Mengubah data tugas / menandai tugas selesai | Path: `id`; Body: `title`, `description`, `priority`, `due_date`, `status` | `200 OK`, `404 Not Found` |
| **`DELETE`** | `/api/tasks/{id}` | Menghapus tugas secara permanen | Path: `id` (Task ID) | `200 OK`, `404 Not Found` |

### C. Modul Profile
| HTTP Method | Endpoint | Fungsi | Parameter | Status Code |
| :---: | :--- | :--- | :--- | :---: |
| **`GET`** | `/api/profile` | Mengambil profil & statistik pengguna aktif | Header: `Authorization: Bearer <token>` | `200 OK`, `401 Unauthorized` |
| **`PUT`** | `/api/profile` | Memperbarui nama lengkap / password pengguna | Body: `name`, `current_password`, `new_password` | `200 OK`, `422 Unprocessable Entity` |

---

## 3. Contoh Payload Request dan Response JSON

### 1. `POST /api/register`
**Request Body:**
```json
{
  "name": "Budi Santoso",
  "email": "budi.santoso@mahasiswa.undira.ac.id",
  "password": "PasswordAman123!",
  "password_confirmation": "PasswordAman123!"
}
```
**Response (`201 Created`):**
```json
{
  "status": "success",
  "message": "Registrasi akun berhasil dilakukan",
  "data": {
    "user": {
      "id": 101,
      "name": "Budi Santoso",
      "email": "budi.santoso@mahasiswa.undira.ac.id",
      "created_at": "2026-11-14T08:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer"
  }
}
```

### 2. `POST /api/login`
**Request Body:**
```json
{
  "email": "budi.santoso@mahasiswa.undira.ac.id",
  "password": "PasswordAman123!"
}
```
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "user": {
      "id": 101,
      "name": "Budi Santoso",
      "email": "budi.santoso@mahasiswa.undira.ac.id"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 86400
  }
}
```

### 3. `POST /api/logout`
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Sesi berhasil diakhiri (Logout berhasil)"
}
```

### 4. `GET /api/tasks`
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Daftar tugas berhasil diambil",
  "summary": {
    "total_tasks": 8,
    "pending_count": 3,
    "in_progress_count": 1,
    "completed_count": 4,
    "completion_rate": 50
  },
  "data": [
    {
      "id": 501,
      "user_id": 101,
      "title": "Menyelesaikan Laporan UTS Pemrograman Mobile Lanjut",
      "description": "Menyusun jawaban Soal 1, aplikasi RecipeKu Soal 2, dan rancangan DailyTask Soal 3.",
      "priority": "high",
      "due_date": "2026-11-14T23:59:00Z",
      "status": "pending",
      "created_at": "2026-11-14T07:30:00Z",
      "updated_at": "2026-11-14T07:30:00Z"
    }
  ]
}
```

### 5. `GET /api/tasks/{id}`
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Detail tugas berhasil ditemukan",
  "data": {
    "id": 501,
    "user_id": 101,
    "title": "Menyelesaikan Laporan UTS Pemrograman Mobile Lanjut",
    "description": "Menyusun jawaban Soal 1, aplikasi RecipeKu Soal 2, dan rancangan DailyTask Soal 3.",
    "priority": "high",
    "due_date": "2026-11-14T23:59:00Z",
    "status": "pending",
    "created_at": "2026-11-14T07:30:00Z",
    "updated_at": "2026-11-14T07:30:00Z"
  }
}
```

### 6. `POST /api/tasks`
**Request Body:**
```json
{
  "title": "Rapat Koordinasi Proyek Akhir Semester",
  "description": "Membahas pembagian modul frontend React Native dan integrasi REST API.",
  "priority": "high",
  "due_date": "2026-11-16T14:00:00Z"
}
```
**Response (`201 Created`):**
```json
{
  "status": "success",
  "message": "Tugas baru berhasil ditambahkan",
  "data": {
    "id": 502,
    "user_id": 101,
    "title": "Rapat Koordinasi Proyek Akhir Semester",
    "description": "Membahas pembagian modul frontend React Native dan integrasi REST API.",
    "priority": "high",
    "due_date": "2026-11-16T14:00:00Z",
    "status": "pending",
    "created_at": "2026-11-14T09:10:00Z",
    "updated_at": "2026-11-14T09:10:00Z"
  }
}
```

### 7. `PUT /api/tasks/{id}`
**Request Body:**
```json
{
  "title": "Rapat Koordinasi Proyek Akhir Semester",
  "description": "Membahas pembagian modul frontend React Native dan integrasi REST API.",
  "priority": "medium",
  "due_date": "2026-11-16T15:30:00Z",
  "status": "completed"
}
```
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Data tugas berhasil diperbarui",
  "data": {
    "id": 502,
    "user_id": 101,
    "title": "Rapat Koordinasi Proyek Akhir Semester",
    "description": "Membahas pembagian modul frontend React Native dan integrasi REST API.",
    "priority": "medium",
    "due_date": "2026-11-16T15:30:00Z",
    "status": "completed",
    "created_at": "2026-11-14T09:10:00Z",
    "updated_at": "2026-11-14T11:45:00Z"
  }
}
```

### 8. `DELETE /api/tasks/{id}`
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Tugas berhasil dihapus secara permanen",
  "data": {
    "deleted_task_id": 502
  }
}
```

### 9. `GET /api/profile`
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Data profil pengguna berhasil diambil",
  "data": {
    "id": 101,
    "name": "Budi Santoso",
    "email": "budi.santoso@mahasiswa.undira.ac.id",
    "created_at": "2026-11-14T08:00:00Z",
    "statistics": {
      "total_created": 24,
      "total_completed": 19,
      "completion_percentage": 79.17
    }
  }
}
```

### 10. `PUT /api/profile`
**Request Body:**
```json
{
  "name": "Budi Santoso, S.Kom.",
  "current_password": "PasswordAman123!",
  "new_password": "PasswordBaru2026!"
}
```
**Response (`200 OK`):**
```json
{
  "status": "success",
  "message": "Profil pengguna berhasil diperbarui",
  "data": {
    "id": 101,
    "name": "Budi Santoso, S.Kom.",
    "email": "budi.santoso@mahasiswa.undira.ac.id",
    "updated_at": "2026-11-14T12:00:00Z"
  }
}
```

