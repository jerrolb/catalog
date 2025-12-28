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
npm install
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

## Features

- Add, edit, and delete products via API
- Search products by name or description
- Pagination (30 products per page)
- BONUS: Low stock indicator for products with stock < 10

- Type-safe TypeScript throughout
- SQLite database with automatic schema initialization
- Full test coverage (unit + E2E)

## TODO

- Toaster notifications
- Improved form validation
- More compact/sleek layout
- Auth

## Assumptions

- This is an internal management tool (customer should not have rights to "Add Product" functionality)
- It is better UX to show a modal overlay than to redirect to a dedicated product url
- Single organization does not need horizontal database scaling for internal inventory management, making SQLite a great database for this use case

## Open Questions

- Would the app allow for customer, employee, manager user types with appropriate permissions?
- Will the catalog simply become it's own route inside of a larger organization's website?
- What is the standardized design library to prevent inconsistencies as developers are onboarded?
