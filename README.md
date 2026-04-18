# Job Application Tracker

> A modern, full-stack Job Application Tracker built with React and NestJS. Features a drag-and-drop Kanban pipeline, interview note management, dynamic analytic dashboards, and a robust dual-database architecture (PostgreSQL + MongoDB).

This is a monolithic repository containing both the frontend interface and the backend server API architecture.

## Architecture & Submodules

- **[Frontend (React + Vite)](./frontend/README.md)**: A radically responsive, minimalist React UI utilizing CSS grids, lightweight state management, and optimized Drag & Drop interfaces.
- **[Backend (NestJS)](./backend/README.md)**: A robust TypeScript backend API leveraging a dual-database pattern via TypeORM (PostgreSQL) and Mongoose (MongoDB) to enforce stateless JWT authentication and relational job logging pipelines.

## Quick Start
Ensure you have Docker running locally to spin up the required PostgreSQL and MongoDB persistence layers.

```bash
# Spin up the databases
docker-compose up -d
```

### Building the Backend
You can populate `backend/.env` with your secrets or directly inject a standard `DATABASE_URL`.

```bash
cd backend
npm install
npm run start:dev
```

### Building the Frontend
Once your API is live on port 3000, spin up the React Vite interface!

```bash
cd frontend
npm install
npm run dev
```
