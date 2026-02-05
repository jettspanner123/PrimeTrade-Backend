# PrimeTrade-Backend

## Installation

**Frontend**

```bash
cd client
bun install
```

**Backend**

```bash
cd server
bun install
```

**Running everything**

From the root of the repo, use:

```bash
bun turbo dev
```

or `turbo dev` if you've got turbo installed globally. That spins up both client and server.

---

## API Routes

Everything lives under `/api/v1`.

### Auth — `/api/v1/auth`

- `GET /health` — health check
- `POST /register` — sign up
- `POST /login` — login
- `POST /logout` — logout

### User — `/api/v1/user`

Requires auth on all routes.

- `GET /health`
- `GET /` — list all users
- `GET /:username` — get one user by username
- `PUT /:id` — update user

### Task — `/api/v1/task`

Requires auth on all routes.

- `GET /health`
- `GET /:id` — get task by id
- `GET /recently-deleted/:id` — get a recently deleted task
- `GET /archived/:id` — get archived task
- `GET /stats/:id` — task stats for a user
- `POST /` — create task
- `POST /restore` — restore a recently deleted task
- `DELETE /` — delete task
- `PUT /` — update task
