# PrimeTrade-Backend 🚀

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

## 🌟 Project Overview

PrimeTrade-Backend is a robust and scalable full-stack application designed to manage and track tasks efficiently. It leverages modern web technologies to provide a seamless user experience with a powerful backend for data management.

## ✨ Features

- **User Authentication**: Secure user registration, login, and session management.
- **Task Management**: Create, read, update, and delete tasks.
- **Intuitive UI**: A responsive and modern user interface built with Next.js and Tailwind CSS.
- **State Management**: Efficient state management using Zustand and Tanstack Query.
- **Database Integration**: Persistent data storage with PostgreSQL and Prisma ORM.

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js](https://nextjs.org/) (React Framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-bear.github.io/zustand/)
- **Data Fetching**: [Tanstack Query](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) resolvers
- **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: [Sonner](https://sonner.emilkowalski.no/)

### Backend

- **Framework**: [Hono](https://hono.dev/) (Fast, lightweight web framework)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Authentication**: [JSON Web Token](https://www.jwt.io/) for password hashing
- **Package Manager**: [Bun](https://bun.sh/)

### Development Tools

- **Package Manager**: [Bun](https://bun.sh/)
- **Type Checker**: [TypeScript](https://www.typescriptlang.org/)
- **Linter**: [ESLint](https://eslint.org/)
- **Formatter**: [Prettier](https://prettier.io/)
- **Deployment**: [Vercel](https://vercel.com/)

## 🚀 API Documentation

The backend API is built with Hono and Prisma, providing a clear and efficient way to interact with the task management system.

### Base URL

`/api/v1`

### Authentication Endpoints

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Authenticate and log in a user.

### User Endpoints

Every endpoint in the user route is protected by a auth middleware.

- `GET /user/health`: Check if user service is up.
- `GET /user`: Get all users
- `GET /user/:username`: Get user by username
- `GET /user/:id`: Get user by id

### Task Endpoints

- `GET /task/health`: Check if the task service is up.
- `GET /task/:id`: Get task by id.
- `GET /task/recently-deleted/:id`: Get a recently deleated task by id.
- `GET /task/archived/:id`: Get archived task by id.
- `GET /task/stats/:id`: Delete a task.
- `POST /task`: Create task.
- `POST /task/restore`: Restore recently deletead task.
- `DELETE /task`: Delete task.
- `PUT /task`: Update task

## ⚙️ Setup Guide

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Bun](https://bun.sh/)

### clonning the project

```bash
git clone https://github.com/jettspanner123/PrimeTrade-Backend.git
cd PrimeTrade-Backend
```

### 📦 Installation

1.  **Backend Setup**:

    ```bash
    cd server
    bun install
    ```

2.  **Database Setup**:
    Create a `.env` file in the `server` directory and add your PostgreSQL connection string:

    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    JWT_SECRET="your_jwt_secret"
    ```

    Run Prisma migrations to set up your database schema:

    ```bash
    bun prisma migrate dev --name init
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../client
    bun install
    ```
    Create a `.env.local` file in the `client` directory:
    ```
    NEXT_PUBLIC_API_URL="http://localhost:3000/api/v1"
    ```

### ▶️ Running the Application

1.  **Start Backend Server**:

    ```bash
    cd server
    bun run dev
    ```

    The backend server will run on `http://localhost:3000`.

2.  **Start Frontend Development Server**:

    ```bash
    cd client
    bun run dev
    ```

    The frontend application will run on `http://localhost:3001` (or another port if 3000 is taken). Open your browser to view the application.

    ---------- Or ----------

3.  **User Turbo**:

    ```bash
    turbo dev
    ```

    (Optional) This will only work if you have already instaled turbo. Using turbo you don't have to run the project in 2 different instances of the terminal.
