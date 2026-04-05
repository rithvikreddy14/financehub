<div align="center">

<img src="https://img.shields.io/badge/FinanceHub-1.0.0-1a6bff?style=for-the-badge&logoColor=white" alt="Version" />
<img src="https://img.shields.io/badge/Status-Live_in_Production-28c87a?style=for-the-badge" alt="Status" />
<img src="https://img.shields.io/badge/License-MIT-f5a524?style=for-the-badge" alt="License" />

<br/><br/>

# 📊 FinanceHub

### A production-ready, full-stack financial dashboard with JWT authentication, hierarchical Role-Based Access Control, and real-time analytics — deployed and live.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-financehub--lake.vercel.app-1a6bff?style=flat-square)](https://financehub-lake.vercel.app/)
&nbsp;
[![GitHub](https://img.shields.io/badge/⌥_Source_Code-rithvikreddy14/financehub-24292e?style=flat-square)](https://github.com/rithvikreddy14/financehub)

<br/>

![React](https://img.shields.io/badge/React-18.2-61dafb?style=flat-square&logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=flat-square&logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Production-336791?style=flat-square&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?style=flat-square&logo=render&logoColor=black)

</div>

---

## 🎯 What Is This?

FinanceHub is a **SaaS-style financial management application** built to demonstrate enterprise-grade backend engineering. It allows organizations to track income and expenses with **strict, server-enforced access control** — different users see and do different things based on their role.

The system was built around three core engineering goals:

- **Security first** — RBAC enforced at the API layer (not just the UI), stateless JWT auth, bcrypt password hashing
- **Backend intelligence** — SQL aggregations computed server-side for dashboard analytics, not raw data dumps to the client
- **Production quality** — Pydantic validation, proper HTTP status codes, soft deletes, auto-generated Swagger docs, dual-DB strategy (SQLite dev / PostgreSQL prod)

---

## ✨ Features at a Glance

| Feature | Details |
|---|---|
| 🔐 **JWT Authentication** | Stateless Bearer tokens, Bcrypt password hashing via Passlib |
| 🛡️ **Role-Based Access Control** | `Admin` / `Analyst` / `Viewer` — enforced server-side via FastAPI dependency injection |
| 📊 **Dashboard Analytics** | SQL-level aggregations: net balance, income/expense totals, category breakdowns, monthly trends |
| 📈 **Interactive Charts** | Recharts-powered Line Charts (monthly trends) and Pie Charts (expense breakdown) |
| 📝 **Full CRUD on Records** | Create, read, update, delete financial entries — gated by role |
| 🔍 **Advanced Filtering** | Filter records by type, category, date range, and free-text search |
| 🗑️ **Soft Deletes** | Records marked `is_deleted=True`; users toggled `is_active=False` — no data is permanently lost |
| ✅ **Pydantic Validation** | Strict schema enforcement on all request payloads with descriptive error responses |
| 📖 **Auto-generated API Docs** | Swagger UI at `/docs`, ReDoc at `/redoc` — available instantly on local run |

---

## 🛡️ Access Control Matrix

> RBAC is enforced at the **FastAPI dependency level**, not the frontend. Sending a raw API request as a Viewer to create a record returns `403 Forbidden`.

| Permission | 🛡️ Admin | 📊 Analyst | 👀 Viewer |
|---|:---:|:---:|:---:|
| View dashboard & analytics | ✅ | ✅ | ✅ |
| View financial records | ✅ | ✅ | ❌ |
| Create & edit records | ✅ | ❌ | ❌ |
| Delete records | ✅ | ❌ | ❌ |
| Manage users (activate/deactivate) | ✅ | ❌ | ❌ |

---

## 🧪 Live Demo & Test Credentials

> **Try it now →** [https://financehub-lake.vercel.app/](https://financehub-lake.vercel.app/)

Use these credentials to explore each access level:

| Role | Email | Password | What You Can Do |
|---|---|---|---|
| 🛡️ **Admin** | `admin@finance.com` | `000000` | Full access — dashboard, records CRUD, user management |
| 📊 **Analyst** | `analyst@finance.com` | `000000` | Read & write — dashboard + add/edit/delete records |
| 👀 **Viewer** | `viewer@finance.com` | `000000` | Read-only — dashboard analytics only |

---

## 🏗️ Architecture & Tech Stack

```
financehub/
├── backend/                        # Python / FastAPI
│   ├── main.py                     # App entry, CORS config
│   ├── database.py                 # SQLAlchemy engine + dynamic DB routing (SQLite ↔ PostgreSQL)
│   ├── models.py                   # ORM table definitions
│   ├── schemas.py                  # Pydantic request/response models
│   ├── security.py                 # JWT generation, Bcrypt hashing, token validation
│   ├── routers/                    # Route controllers
│   │   ├── auth.py                 # /api/auth/register, /api/auth/token
│   │   ├── records.py              # /api/records/ (CRUD)
│   │   ├── dashboard.py            # /api/dashboard/summary
│   │   └── users.py                # /api/users/ (Admin only)
│   └── services/                   # Business logic & DB queries
│
└── frontend/                       # React 18 / Vite
    ├── src/
    │   ├── api/                    # Axios instance with JWT interceptors
    │   ├── components/             # Sidebar, Layout, shared UI
    │   ├── context/                # AuthContext — global auth state
    │   └── pages/                  # Dashboard, Records, Users, Login
    ├── tailwind.config.js
    └── vercel.json                 # SPA routing rules for Vercel
```

### Frontend

| Library | Role |
|---|---|
| **React 18 + Vite** | Component rendering with blazing-fast HMR |
| **Tailwind CSS** | Utility-first responsive styling |
| **Recharts** | Line charts (trends) and pie charts (breakdowns) |
| **Axios** | HTTP client with custom interceptors for JWT attachment and global error handling |
| **React Hot Toast** | User-facing error and success notifications |

### Backend

| Library | Role |
|---|---|
| **FastAPI** | High-performance async API framework |
| **SQLAlchemy** | ORM for relational data management |
| **Pydantic v2** | Request/response schema validation |
| **Passlib + Bcrypt** | Secure password hashing |
| **Python-Jose** | JWT token generation and verification |
| **Uvicorn** | ASGI server |

### Database & Deployment

| Layer | Technology |
|---|---|
| **Dev Database** | SQLite (zero-config, auto-created as `finance.db`) |
| **Prod Database** | PostgreSQL (via Render managed DB) |
| **Frontend Hosting** | Vercel (with `vercel.json` for SPA routing) |
| **Backend Hosting** | Render (dynamic CORS + PostgreSQL integration) |

---

## 🔌 API Reference

> Full interactive docs available at `http://localhost:8000/docs` when running locally.

### Authentication

```
POST  /api/auth/register        Create a new user (with role assignment)
POST  /api/auth/token           Login → returns JWT Bearer token
```

### Financial Records

```
GET    /api/records/            List records (with filters: type, category, date range, search)
POST   /api/records/            Create a record            [Analyst+ only]
PUT    /api/records/{id}        Update a record            [Analyst+ only]
DELETE /api/records/{id}        Soft-delete a record       [Admin only]
```

### Dashboard

```
GET    /api/dashboard/summary   Returns: total income, total expenses, net balance,
                                category-wise totals, monthly trends
```

### User Management

```
GET    /api/users/              List all users             [Admin only]
PATCH  /api/users/{id}/status   Toggle active/inactive     [Admin only]
```

### HTTP Status Codes in Use

| Code | Meaning |
|---|---|
| `200 OK` | Successful read |
| `201 Created` | Resource created |
| `401 Unauthorized` | Missing or invalid JWT |
| `403 Forbidden` | Authenticated but insufficient role |
| `404 Not Found` | Resource doesn't exist |
| `422 Unprocessable Entity` | Pydantic validation failed |

---

## 🚀 Running Locally

### Prerequisites

- **Node.js** v18+
- **Python** v3.9+

### 1. Clone the repository

```bash
git clone https://github.com/rithvikreddy14/financehub.git
cd financehub
```

### 2. Start the backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: .\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**
Interactive API docs at **http://localhost:8000/docs**

### 3. Start the frontend

```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

### 4. Environment notes

- SQLite database auto-generates as `finance.db` on first run — no setup required
- For production, set `SECRET_KEY`, `DATABASE_URL` (PostgreSQL), and update CORS origins in `main.py`

---

## 🔐 Security Considerations

- **No plain-text passwords** — all passwords hashed with Bcrypt before storage
- **Stateless auth** — JWTs contain only the user ID and expiry; no session state on the server
- **Server-side RBAC** — roles checked inside FastAPI dependencies, not just the React UI
- **Inactive users blocked instantly** — toggling `is_active=False` prevents login on next request without touching the token
- **Input sanitized** — Pydantic rejects malformed payloads before they hit the database

---

## 🗺️ Roadmap

- [ ] Dark mode toggle
- [ ] CSV / Excel export for records
- [ ] Pagination on record listing
- [ ] Weekly financial summary email notifications
- [ ] Unit tests with `pytest` + `httpx`
- [ ] Rate limiting on auth endpoints

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push the branch: `git push origin feature/your-feature`
5. Open a Pull Request

For bugs or feature requests, please use the [Issues](https://github.com/rithvikreddy14/financehub/issues) tab.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">

Built with FastAPI · React · PostgreSQL · Deployed on Vercel + Render

**[Live Demo](https://financehub-lake.vercel.app/)** · **[Source Code](https://github.com/rithvikreddy14/financehub)**

</div>