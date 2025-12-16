import CustomLogger from "./middleware/logger.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import ApiV1 from "./routes/v1/index.js";

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
app.route("/api/v1", ApiV1)

export default app;
