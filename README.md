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

## Features

- Add products via API
- Simple, clean UI with header
- Type-safe TypeScript throughout
- SQLite database with automatic schema initialization

