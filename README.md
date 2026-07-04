# 📋 TaskFlow

> Gestor de proyectos Kanban · Full Stack · PWA instalable en Android

![CI](https://github.com/franyer98/taskflow/actions/workflows/ci.yml/badge.svg)

TaskFlow es una aplicación web progresiva para gestionar proyectos con tableros Kanban: crea tableros, organiza tareas por columnas con **drag & drop**, asigna prioridades y fechas límite. Instalable en Android como app nativa.

## ✨ Características

- 🔐 Autenticación segura con JWT (access + refresh tokens) y bcrypt
- 📋 Tableros ilimitados con columnas *Por hacer / En progreso / Hecho*
- 🖱️ Drag & drop fluido (mouse y táctil) con actualizaciones optimistas
- 🏷️ Prioridades (baja/media/alta) y fechas límite por tarea
- 📱 PWA: instalable en Android, tema oscuro, 100% responsive
- 📖 API REST autodocumentada con Swagger (`/docs`)
- ✅ Tests automatizados + CI con GitHub Actions

## 🛠️ Stack

| Capa | Tecnologías |
|---|---|
| Frontend | React 18 · Vite · TailwindCSS · Zustand · dnd-kit · vite-plugin-pwa |
| Backend | FastAPI · SQLAlchemy 2.0 · Pydantic v2 · python-jose (JWT) |
| Base de datos | SQLite (desarrollo) / PostgreSQL (producción) |
| DevOps | GitHub Actions · Vercel (frontend) · Render (backend) · Neon (BD) |

## 🚀 Ejecución local

### Backend

```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

API en **http://localhost:8000** · Documentación interactiva en **http://localhost:8000/docs**

> 💡 Sin configuración extra usa SQLite automáticamente. Para PostgreSQL, pega tu URL de conexión en `.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App en **http://localhost:5173**

### Tests

```bash
cd backend && python -m pytest tests -v
```

## ☁️ Despliegue gratuito

1. **Base de datos** → crea un proyecto en [Neon](https://neon.tech) y copia la URL de conexión.
2. **Backend** → despliega `backend/` en [Render](https://render.com) con el comando `uvicorn app.main:app --host 0.0.0.0 --port $PORT` y las variables `DATABASE_URL` y `SECRET_KEY`.
3. **Frontend** → despliega `frontend/` en [Vercel](https://vercel.com) con la variable `VITE_API_URL` apuntando a tu backend.

## 📁 Estructura

```
taskflow/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── core/     # Configuración y seguridad (JWT, bcrypt)
│   │   ├── db/       # Conexión y sesión de base de datos
│   │   ├── models/   # Modelos SQLAlchemy
│   │   ├── schemas/  # Schemas Pydantic
│   │   └── routers/  # Endpoints: auth, boards, tasks
│   └── tests/        # Tests con pytest
├── frontend/         # SPA React + PWA
│   └── src/
│       ├── api/        # Cliente Axios con refresh automático
│       ├── store/      # Estado global (Zustand)
│       ├── pages/      # Login, Register, Dashboard, Board
│       └── components/ # Kanban: columnas, tarjetas, modal
├── docs/             # Arquitectura del sistema
└── .github/          # CI: tests + build en cada push
```

## 📄 Licencia

MIT — Franyer ([@franyer98](https://github.com/franyer98))
