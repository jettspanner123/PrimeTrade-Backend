import AuthRoute from "./modules/auth/auth.route.js";
import UserRoute from "./modules/user/user.route.js";
import TaskRoute from "./modules/task/task.route.js";
import CustomLogger from "./middleware/logger.js";
import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono();

// Middleware
app.use("*", CustomLogger);
app.use(
    "*",
    cors({
        origin: "http://localhost:3001",
        allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowHeaders: ["Content-Type", "Authorization"],
        credentials: true,  
    }),
);

// Routes
app.route("/auth", AuthRoute);
app.route("/user", UserRoute);
app.route("/task", TaskRoute);

export default app;
