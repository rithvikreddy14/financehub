# 📊 FinanceHub Dashboard

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61dafb.svg?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?logo=fastapi)

## Description
FinanceHub is a modern, full-stack SaaS application designed for personal and small business financial tracking. It features a robust Role-Based Access Control (RBAC) system, interactive data visualizations, and secure record management.

## Overview
This project consists of a React/Vite frontend styled with Tailwind CSS, and a Python backend powered by FastAPI and SQLAlchemy. It allows users to track income and expenses, view dynamic monthly trends, and manage user roles (Admin, Analyst, Viewer).

## Problem Statement
Managing daily financial transactions across multiple users often requires complex, paid SaaS tools or messy spreadsheets. Organizations need a simple, self-hosted, and role-restricted dashboard to input and visualize financial health securely.

## Solution
FinanceHub provides a lightweight, instantly deployable solution. With secure JWT authentication, strict Pydantic validation, and beautiful Recharts visualizations, teams can seamlessly track financial metrics with zero steep learning curves.

---

# 🚀 Getting Started

## Prerequisites
Before you begin, ensure you have met the following requirements:
* **Node.js** (v18.0.0 or higher)
* **Python** (v3.9 or higher)
* **npm** or **yarn** package manager

## Installation

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the virtual environment:
   * Windows: `.\venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`

## Configuration & Environment Variables
Currently, the application runs on default local ports.  
* **Backend:** Runs on `http://127.0.0.1:8000` (SQLite database auto-generates as `finance.db`).
* **Frontend:** Runs on `http://localhost:5173`.
* *Note: For production, create a `.env` file in the backend to store secure `SECRET_KEY` and database URLs.*

---

# ▶️ Usage

## How to Use
1. Open the application in your browser.
2. Navigate to the **Register** page to create an account.
3. **Important:** The first user should be created with the **Admin** role to unlock all features (Record CRUD operations and User Management).
4. Use the **Dashboard** to view financial summaries and the **Records** page to add/edit transactions.

## Demo & Screenshots
*(Replace these links with actual screenshots of your application)*
* [Dashboard View](./docs/dashboard.png)
* [Records Management](./docs/records.png)
* [User Management](./docs/users.png)

---

# 🧩 Features & Functionality

## Key Features
* **Role-Based Access Control (RBAC):** Admins can edit data and manage users; Viewers are restricted to read-only dashboard access.
* **Dynamic Visualizations:** Interactive Pie Charts (Expense Breakdown) and Line Charts (Monthly Trends) using Recharts.
* **Secure Authentication:** JWT-based login with bcrypt password hashing.
* **Robust CRUD Operations:** Strict payload validation using Pydantic schemas.
* **Dark/Light Mode Ready:** Built with Tailwind CSS for highly customizable UIs.

## Roadmap & Future Enhancements
* [ ] Implement Dark Mode toggle.
* [ ] Add CSV/Excel export functionality for records.
* [ ] Integrate email notifications for weekly financial summaries.
* [ ] Migrate from SQLite to PostgreSQL for production environments.

---

# 🏗️ Project Structure

## Folder Structure
```text
finance-dashboard/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── security.py          # JWT and hashing logic
│   ├── routers/             # API route handlers
│   └── services/            # Business logic and DB queries
└── frontend/
    ├── src/
    │   ├── api/             # Axios configuration
    │   ├── components/      # Reusable UI components (Sidebar, Layout)
    │   ├── context/         # React Context (AuthContext)
    │   └── pages/           # Page views (Dashboard, Records, Users)
    ├── tailwind.config.js   # Tailwind styling rules
    └── vite.config.js       # Vite build configuration
```

## Architecture & Design Decisions
**FastAPI:** Chosen for its auto-generated Swagger documentation and extreme speed.  
**React + Vite:** Chosen for rapid hot-module reloading and modern component-based architecture.  
**Tailwind CSS:** Allows for utility-first styling without writing custom CSS files.

---

# 🛠️ Development

## Running Locally

Start the Backend server:
```bash
cd backend
uvicorn main:app --reload
```

Start the Frontend server:
```bash
cd frontend
npm run dev
```

## Build & Scripts

To build the frontend for production:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

## Testing & Linting
* Backend tests can be run using pytest (setup required).
* Code style is enforced via standard ESLint rules in the Vite React template.

---

# 🔌 API & Integrations

## API Documentation
Once the backend is running, the interactive API documentation is automatically generated.  
Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)  
ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

## Key Endpoints
* `POST /api/auth/register` - Create a new user.
* `POST /api/auth/token` - Login to receive JWT.
* `GET /api/dashboard/summary` - Retrieve aggregated financial data.
* `GET /api/records/` - Retrieve paginated financial records.
* `PUT /api/records/{id}` - Update a specific record.

---

# 🚢 Deployment

## CI/CD & Hosting
* **Frontend:** Can be easily deployed to Vercel, Netlify, or GitHub Pages.
* **Backend:** Recommended to deploy via Docker to platforms like Render, Railway, or AWS EC2.

## Production Setup
For production, ensure:
* CORS origins in `main.py` are updated to match your live frontend URL.
* The SQLite database is replaced with a robust DB (PostgreSQL).
* The `SECRET_KEY` in `security.py` is loaded securely from environment variables.

---

# 📦 Dependencies

## Tech Stack & Libraries Used

### Frontend
* React 18  
* Vite  
* Tailwind CSS (Styling)  
* Recharts (Data Visualization)  
* Lucide React (Icons)  
* Axios (HTTP Client)  
* React Router DOM (Navigation)  
* React Hot Toast (Notifications)  

### Backend
* FastAPI  
* Uvicorn (ASGI server)  
* SQLAlchemy (ORM)  
* Pydantic (Data validation)  
* Passlib & Bcrypt (Password Hashing)  
* Python-Jose (JWT generation)  

---

# 🤝 Contribution

## Contributing & Guidelines
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

1. Fork the Project  
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the Branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## Code of Conduct
Please ensure your code follows the existing style, includes appropriate comments, and passes all existing functionality checks before submitting a PR.

---

# 🐞 Issues & Support

## Troubleshooting & FAQ
**Issue:** 422 Unprocessable Entity when saving a record.  
**Solution:** Ensure you are inputting valid numbers for amounts. The frontend handles parsing, but extreme values or letters will trigger a rejection.

**Issue:** Blank white screen on the frontend.  
**Solution:** Ensure your `postcss.config.js` exists and Tailwind is compiling correctly.

## Support
If you encounter any unresolved issues, please open an issue in the repository's "Issues" tab.

---

# 🔐 Security & Compliance

## Security & Vulnerabilities
* Passwords are never stored in plain text.  
* Protected endpoints require a valid JWT Bearer token.  
* RBAC strictly validates user IDs before allowing PUT or DELETE requests.  

If you discover a vulnerability, please do not open a public issue. Email the repository owner directly.

---

# 📄 Legal

## License
Distributed under the MIT License. See `LICENSE` file for more information.

## Terms of Use
This software is provided "as is", without warranty of any kind.

---

# 👥 Credits & Acknowledgments

## Authors
* Your Name/Handle - Initial work & architecture

## Acknowledgments
* Mockup inspiration from modern SaaS financial designs.  
* Icons provided by [Lucide](https://lucide.dev/).

---

# 📊 Project Status

## Status & Changelog
**Current Version:** 1.0.0  

**[v1.0.0] - Initial Release**  
Implemented Auth, Dashboard Analytics, Record CRUD, and User Management toggles.