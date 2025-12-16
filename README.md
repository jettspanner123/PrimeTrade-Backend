# PrimeTrade-Backend 🚀

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)

## 🌟 Project Overview

PrimeTrade-Backend is a robust and scalable full-stack application designed to manage and track tasks efficiently. It leverages modern web technologies to provide a seamless user experience with a powerful backend for data management.

## ✨ Features

*   **User Authentication**: Secure user registration, login, and session management.
*   **Task Management**: Create, read, update, and delete tasks.
*   **Intuitive UI**: A responsive and modern user interface built with Next.js and Tailwind CSS.
*   **State Management**: Efficient state management using Zustand and Tanstack Query.
*   **Database Integration**: Persistent data storage with PostgreSQL and Prisma ORM.

## 🛠️ Tech Stack

### Frontend

*   **Framework**: [Next.js](https://nextjs.org/) (React Framework)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Radix UI](https://www.radix-ui.com/)
*   **State Management**: [Zustand](https://zustand-bear.github.io/zustand/)
*   **Data Fetching**: [Tanstack Query](https://tanstack.com/query/latest)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) resolvers
*   **Icons**: [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
*   **Notifications**: [Sonner](https://sonner.emilkowalski.no/)

### Backend

*   **Framework**: [Hono](https://hono.dev/) (Fast, lightweight web framework)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Database**: [PostgreSQL](https://www.postgresql.org/)
*   **Validation**: [Zod](https://zod.dev/)
*   **Authentication**: [Bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing
*   **Package Manager**: [Bun](https://bun.sh/)

### Development Tools

*   **Package Manager**: [Bun](https://bun.sh/)
*   **Type Checker**: [TypeScript](https://www.typescriptlang.org/)
*   **Linter**: [ESLint](https://eslint.org/)
*   **Formatter**: [Prettier](https://prettier.io/)
*   **Deployment**: [Vercel](https://vercel.com/)

## 🚀 API Documentation

The backend API is built with Hono and Prisma, providing a clear and efficient way to interact with the task management system.

### Base URL

`/api/v1`

### Authentication Endpoints

*   `POST /auth/register`: Register a new user.
*   `POST /auth/login`: Authenticate and log in a user.
*   `GET /auth/me`: Get current authenticated user details.

### User Endpoints

*   `GET /user/:id`: Retrieve user details by ID.
*   `PUT /user/:id`: Update user details.

### Task Endpoints

*   `POST /task`: Create a new task.
*   `GET /task`: Retrieve all tasks for the authenticated user.
*   `GET /task/:id`: Retrieve a specific task by ID.
*   `PUT /task/:id`: Update an existing task.
*   `DELETE /task/:id`: Delete a task.

## ⚙️ Setup Guide

Follow these steps to get the project up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Bun](https://bun.sh/)
*   [PostgreSQL](https://www.postgresql.org/download/)

### clonning the project

```bash
git clone https://github.com/your-username/PrimeTrade-Backend.git
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

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## 📄 License

This project is licensed under the MIT License.

