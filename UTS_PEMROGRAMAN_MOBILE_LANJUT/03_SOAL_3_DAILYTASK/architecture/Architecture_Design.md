# PERANCANGAN ARSITEKTUR REACT NATIVE – DAILYTASK

Dokumen ini menjelaskan arsitektur aplikasi **DailyTask** berbasis React Native yang mencakup **Presentation Layer**, **Business Logic Layer**, **Data Layer**, **Navigation**, **State Management**, **API Service**, dan **Database**, beserta struktur folder proyek yang direkomendasikan.

---

## 1. Diagram Arsitektur Aplikasi DailyTask

```mermaid
flowchart TB
    subgraph PRESENTATION ["1. PRESENTATION LAYER (UI & Navigation)"]
        Nav["Navigation Module<br/>(RootNavigator, AuthStack, MainBottomTab, TaskStack)"]
        Screens["Screens (9 Halaman):<br/>Login, Register, Dashboard, TaskList,<br/>AddTask, EditTask, TaskDetail, History, Profile"]
        UIComp["Reusable UI Components:<br/>TaskCard, PriorityBadge, ProgressCard,<br/>AppInput, AppButton, EmptyState, ErrorState"]
        Nav --> Screens
        Screens --> UIComp
    end

    subgraph BUSINESS_LOGIC ["2. BUSINESS LOGIC LAYER (State Management & Custom Hooks)"]
        AuthCtx["Client State (AuthContext / Redux):<br/>User Session, JWT Token, Auth Status"]
        QueryHooks["Server State (TanStack Query):<br/>useTasksQuery, useTaskDetailQuery,<br/>useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation"]
        Domain["Domain Helpers & Validators:<br/>Input Validation, Priority Sorting, DueDate Countdown"]
    end

    subgraph DATA_LAYER ["3. DATA LAYER (API Service & Local Persistence)"]
        APIService["API Service Modules:<br/>authApi.js, taskApi.js, profileApi.js"]
        HttpClient["Axios HTTP Client:<br/>Request Interceptor (Bearer Token)<br/>Response Interceptor (Global Error / 401)"]
        Storage["Local Persistence:<br/>Expo SecureStore (Token JWT)<br/>AsyncStorage (Offline Query Cache)"]
        APIService --> HttpClient
    end

    subgraph BACKEND ["4. BACKEND REST API & DATABASE"]
        RestServer["REST API Server<br/>(/api/register, /api/login, /api/tasks, /api/profile)"]
        Database[("Relational Database<br/>(Tabel users & Tabel tasks)")]
        RestServer --> Database
    end

    PRESENTATION <-->|"Props, Events, State Subscription"| BUSINESS_LOGIC
    BUSINESS_LOGIC <-->|"Async Calls & Normalized Data"| DATA_LAYER
    HttpClient <-->|"HTTPS JSON (GET, POST, PUT, DELETE)"| RestServer
```

---

## 2. Penjelasan Komponen Arsitektur

1. **Presentation Layer:** Mengatur tampilan visual (9 halaman aplikasi), komponen *reusable* (`TaskCard`, `PriorityBadge`, `DailyProgressCard`), dan perpindahan antarhalaman menggunakan React Navigation (`AuthStack`, `BottomTab`, dan `NativeStack`).
2. **Business Logic Layer:** Mengoordinasikan logika aplikasi melalui pemisahan **Client State** (`AuthContext` untuk sesi login pengguna) dan **Server State** (**TanStack Query** untuk pengambilan daftar tugas, *caching*, serta mutasi tambah/ubah/hapus/selesai tugas dengan *automatic cache invalidation*).
3. **Data Layer:** Bertanggung jawab atas komunikasi HTTP melalui **Axios** (`authApi.js`, `taskApi.js`, `profileApi.js`) dengan penyisipan otomatis *header* `Authorization: Bearer <token>` dari `Expo SecureStore`.
4. **Backend REST API & Database:** Menyediakan layanan *endpoint* autentikasi, manajemen tugas, dan profil yang terhubung ke basis data relasional (`users` dan `tasks`).

---

## 3. Struktur Folder Proyek React Native yang Direkomendasikan

```text
DailyTask/
├── src/
│   ├── api/
│   │   ├── axiosClient.js
│   │   ├── authApi.js
│   │   ├── taskApi.js
│   │   └── profileApi.js
│   ├── components/
│   │   ├── common/
│   │   │   ├── AppButton.js
│   │   │   ├── AppInput.js
│   │   │   ├── LoadingOverlay.js
│   │   │   ├── ErrorState.js
│   │   │   └── EmptyState.js
│   │   └── tasks/
│   │       ├── TaskCard.js
│   │       ├── PriorityBadge.js
│   │       ├── StatusBadge.js
│   │       └── DailyProgressCard.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useTasks.js
│   │   └── useDebounce.js
│   ├── navigation/
│   │   ├── RootNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── MainNavigator.js
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── RegisterScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── TaskListScreen.js
│   │   ├── AddTaskScreen.js
│   │   ├── EditTaskScreen.js
│   │   ├── TaskDetailScreen.js
│   │   ├── HistoryScreen.js
│   │   └── ProfileScreen.js
│   ├── constants/
│   │   ├── colors.js
│   │   └── priorities.js
│   └── utils/
│       ├── dateFormatter.js
│       └── storage.js
├── App.js
├── package.json
└── README.md
```

