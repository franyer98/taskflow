# 🏗️ TaskFlow — Arquitectura de Software

> Gestor de proyectos tipo Kanban · Full Stack · PWA
> **Stack:** React + FastAPI + PostgreSQL

---

## 1. Visión General

TaskFlow es una aplicación web progresiva (PWA) para gestión de tareas con tableros Kanban, diseñada para demostrar competencias full stack: frontend moderno, API REST robusta, base de datos relacional, autenticación segura y despliegue en la nube.

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser / Android PWA)     │
│  ┌────────────────────────────────────────────────────┐ │
│  │  React 18 + Vite + TailwindCSS                     │ │
│  │  · React Router · Zustand (estado global)          │ │
│  │  · dnd-kit (drag & drop) · Service Worker (PWA)    │ │
│  └──────────────────────┬─────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTPS / JSON (REST)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND — FastAPI                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │  Auth    │ │  Boards  │ │  Tasks   │ │  Users     │  │
│  │  (JWT)   │ │  Router  │ │  Router  │ │  Router    │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬──────┘  │
│       └────────────┴─────┬──────┴─────────────┘         │
│                 ┌────────▼────────┐                     │
│                 │  Service Layer  │  (lógica de negocio)│
│                 └────────┬────────┘                     │
│                 ┌────────▼────────┐                     │
│                 │ SQLAlchemy ORM  │  + Alembic          │
│                 └────────┬────────┘                     │
└──────────────────────────┼──────────────────────────────┘
                           ▼
                  ┌─────────────────┐
                  │   PostgreSQL    │
                  └─────────────────┘
```

---

## 2. Frontend

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework | React 18 + Vite | Estándar de industria, build rápido |
| Estilos | TailwindCSS | Desarrollo ágil, diseño responsive |
| Estado global | Zustand | Más simple que Redux, ideal para este alcance |
| Drag & Drop | dnd-kit | Accesible, moderno, soporta touch (móvil) |
| Ruteo | React Router v6 | SPA con rutas protegidas |
| HTTP | Axios + interceptores | Refresh automático de tokens JWT |
| PWA | vite-plugin-pwa | Instalable en Android, funciona offline |

### Estructura de carpetas

```
frontend/
├── src/
│   ├── api/            # Cliente Axios, endpoints
│   ├── components/     # UI reutilizable (Button, Modal, Card...)
│   ├── features/
│   │   ├── auth/       # Login, registro, contexto de sesión
│   │   ├── boards/     # Lista de tableros, CRUD
│   │   └── tasks/      # Columnas Kanban, tarjetas, drag & drop
│   ├── hooks/          # useAuth, useBoards, useDragDrop
│   ├── store/          # Zustand stores
│   ├── pages/          # Dashboard, Board, Login, Register
│   └── App.jsx
├── public/manifest.json  # Config PWA
└── vite.config.js
```

---

## 3. Backend

| Componente | Tecnología | Justificación |
|---|---|---|
| Framework | FastAPI | Async, documentación automática (Swagger), tipado |
| ORM | SQLAlchemy 2.0 | Estándar Python, queries seguras |
| Migraciones | Alembic | Versionado del esquema de BD |
| Auth | JWT (access + refresh) + bcrypt | Seguridad estándar de industria |
| Validación | Pydantic v2 | Schemas de entrada/salida tipados |
| Tests | pytest + httpx | Cobertura de endpoints críticos |

### Estructura de carpetas

```
backend/
├── app/
│   ├── main.py           # Punto de entrada, CORS, routers
│   ├── core/
│   │   ├── config.py     # Variables de entorno (Pydantic Settings)
│   │   └── security.py   # JWT, hashing de contraseñas
│   ├── models/           # Modelos SQLAlchemy (User, Board, Column, Task)
│   ├── schemas/          # Schemas Pydantic (request/response)
│   ├── routers/          # auth.py, boards.py, tasks.py, users.py
│   ├── services/         # Lógica de negocio separada de los routers
│   └── db/               # Sesión, conexión
├── alembic/              # Migraciones
├── tests/
└── requirements.txt
```

### Endpoints principales (API REST)

```
POST   /auth/register          → Crear cuenta
POST   /auth/login             → Obtener JWT (access + refresh)
POST   /auth/refresh           → Renovar access token

GET    /boards                 → Listar tableros del usuario
POST   /boards                 → Crear tablero
PATCH  /boards/{id}            → Renombrar tablero
DELETE /boards/{id}            → Eliminar tablero

GET    /boards/{id}/tasks      → Tareas del tablero (agrupadas por columna)
POST   /tasks                  → Crear tarea
PATCH  /tasks/{id}             → Editar / mover tarea (columna + posición)
DELETE /tasks/{id}             → Eliminar tarea
```

---

## 4. Modelo de Datos

```
┌──────────┐       ┌──────────┐       ┌──────────┐       ┌──────────┐
│  users   │ 1───N │  boards  │ 1───N │ columns  │ 1───N │  tasks   │
├──────────┤       ├──────────┤       ├──────────┤       ├──────────┤
│ id (PK)  │       │ id (PK)  │       │ id (PK)  │       │ id (PK)  │
│ email    │       │ user_id  │       │ board_id │       │ column_id│
│ password │       │ title    │       │ title    │       │ title    │
│ name     │       │ created  │       │ position │       │ descr.   │
│ created  │       └──────────┘       └──────────┘       │ position │
└──────────┘                                             │ priority │
                                                         │ due_date │
                                                         └──────────┘
```

**Decisiones clave:**
- `position` (float o entero con gaps) permite reordenar tareas sin reescribir toda la columna.
- Índices en `user_id`, `board_id`, `column_id` para queries rápidas.
- `ON DELETE CASCADE` para limpieza automática al borrar tableros.

---

## 5. Autenticación (Flujo JWT)

```
1. Login → backend valida credenciales (bcrypt)
2. Backend emite: access_token (15 min) + refresh_token (7 días)
3. Frontend guarda tokens y añade "Authorization: Bearer" en cada request
4. Al expirar el access token → interceptor de Axios usa /auth/refresh
5. Logout → se descartan los tokens
```

---

## 6. Despliegue (gratis, ideal para portafolio)

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Vercel    │────▶│   Render /   │────▶│   Neon /     │
│  (frontend) │     │   Railway    │     │   Supabase   │
│             │     │  (FastAPI)   │     │ (PostgreSQL) │
└─────────────┘     └──────────────┘     └──────────────┘
        ▲
        │ CI/CD automático con GitHub Actions
        │ (tests + lint en cada push)
```

- **Frontend:** Vercel (deploy automático desde GitHub, HTTPS gratis).
- **Backend:** Render o Railway (plan gratuito, Docker opcional).
- **Base de datos:** Neon o Supabase (PostgreSQL serverless gratuito).
- **CI/CD:** GitHub Actions — corre pytest y ESLint en cada push (¡ya tienes experiencia con Actions!).

---

## 7. Roadmap de Desarrollo

| Fase | Alcance | Tiempo estimado |
|---|---|---|
| 1 | Backend: modelos, auth JWT, CRUD de boards/tasks | 1 semana |
| 2 | Frontend: login, dashboard, vista de tablero | 1 semana |
| 3 | Drag & drop + reordenamiento persistente | 3-4 días |
| 4 | PWA (manifest, service worker, instalable en Android) | 2 días |
| 5 | Deploy + CI/CD + README profesional con screenshots | 2-3 días |

### Extras para destacar (opcionales)
- 🌙 Modo oscuro (encaja con tu estilo de portafolio)
- 🔍 Búsqueda y filtros por prioridad/fecha
- 📊 Mini dashboard con estadísticas de tareas completadas
- 🤖 Bonus IA: sugerencia automática de prioridad con un modelo ligero — conecta con tu perfil de especialista en IA

---

## 8. Qué demuestra este proyecto

✅ Diseño de API REST con documentación automática (Swagger)
✅ Autenticación segura con JWT y hashing
✅ Modelado de base de datos relacional con migraciones
✅ Frontend moderno con estado global y drag & drop
✅ PWA instalable en Android
✅ CI/CD y despliegue en la nube
✅ Testing automatizado
