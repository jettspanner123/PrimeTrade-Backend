import { Hono } from "hono";
import AuthController from "./auth.controller.js";
import {
    LOGIN_VALIDATOR,
    REGISTER_VALIDATOR,
} from "../../../../shared/types/auth/auth.types.js";

const authRoute = new Hono();

authRoute.get("/health", AuthController.healthCheck);
authRoute.post("/register", REGISTER_VALIDATOR, AuthController.register);
authRoute.post("/login", LOGIN_VALIDATOR, AuthController.login);
authRoute.post("/logout", AuthController.logout);

export default authRoute;
