# Product Catalog

A full-stack product catalog application built with React, Hono, and SQLite.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Hono + TypeScript
- **Database**: SQLite (better-sqlite3)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

**Option 1: Run both servers together (recommended)**

From the root directory:
```bash
npm run dev
```

This will start both the backend (`http://localhost:3000`) and frontend (`http://localhost:5173`) concurrently.

**Option 2: Run servers separately**

1. Start the backend server (from `backend/` directory):
```bash
npm run dev
```

2. Start the frontend development server (from `frontend/` directory):
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
product_catalog/
├── backend/          # Hono API server
│   ├── src/
│   │   ├── db/      # Database setup and schema
│   │   ├── routes/  # API route handlers
│   │   └── index.ts # Server entry point
│   └── package.json
├── frontend/         # React SPA
│   ├── src/
│   │   ├── api/     # API client
│   │   ├── components/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Testing

### Unit Tests
Run backend unit tests:
```bash
cd backend
npm test
```

### E2E Tests
Run Playwright end-to-end tests:
```bash
npm run test:e2e
```

### All Tests
Run both unit and E2E tests:
```bash
npm run test:all
```

## CI/CD

GitHub Actions workflow is configured to run tests on push and pull requests. The workflow:
- Runs backend unit tests
- Builds both frontend and backend
- Runs Playwright E2E tests
- Uploads test reports as artifacts

## Features

- Add, edit, and delete products via API
- Search products by name or description
- Pagination (30 products per page)
- Low stock indicator for products with stock < 10
- Type-safe TypeScript throughout
- SQLite database with automatic schema initialization
- Full test coverage (unit + E2E)

