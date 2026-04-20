# Task Manager API (NestJS + PostgreSQL + TypeORM)

Junior Backend test task: small REST API for managing tasks.

## Tech stack

- NestJS
- TypeORM
- PostgreSQL
- Swagger (`/api`)

## Requirements

- Node.js + npm
- PostgreSQL (local) or Docker

## Environment variables

Create `.env` file in the project root using `.env.example` as a template:

```bash
cp .env.example .env
```

Required variables:

```dotenv
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=secret
DATABASE_NAME=taskmanager
```

## Run PostgreSQL

### Option A: Docker

```bash
docker run --name taskmanager-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=taskmanager \
  -p 5432:5432 \
  -d postgres:16
```

### Option B: Local Postgres

Create the database (example):

```bash
createdb taskmanager
```

Ensure your `.env` credentials match your local Postgres user/password.

## Install dependencies

```bash
npm install
```

## Database migrations

Run migrations:

```bash
npm run migration:run
```

Revert last migration:

```bash
npm run migration:revert
```

Generate a new migration from entity changes:

```bash
npm run typeorm:ds -- migration:generate src/database/migrations/<Name> -p
```

## Run the app

Development (watch):

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`.

Swagger UI:

- `http://localhost:3000/api`

## API endpoints

- `POST /tasks`
- `GET /tasks` (query: `status`, `page`, `limit`)
- `GET /tasks/:id`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

## Tests

Run unit tests:

```bash
npm test
```
