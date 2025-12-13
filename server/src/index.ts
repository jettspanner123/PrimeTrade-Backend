import { Hono } from "hono";
import AuthRoute from "./modules/auth/auth.route.js";
import UserRoute from "./modules/user/user.route.js";
import TaskRoute from "./modules/task/task.route.js";
import CustomLogger from "./middleware/logger.js";

const app = new Hono();

// Middleware
app.use("*", CustomLogger);

// Routes
app.route("/auth", AuthRoute);
app.route("/user", UserRoute);
app.route("/task", TaskRoute);

export default app;
