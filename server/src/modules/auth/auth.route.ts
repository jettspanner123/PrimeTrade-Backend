import { Hono } from "hono";
import AuthController from "./auth.controller.js";
import {
    LOGIN_VALIDATOR,
    REGISTER_VALIDATOR,
} from "../../../../shared/types/auth/auth.types.js";

const authRoute = new Hono();


// MARK: Get Auth Controller Health Check
authRoute.get("/health", AuthController.healthCheck);

// MARK: Create USer
authRoute.post("/register", REGISTER_VALIDATOR, AuthController.register);

// MARK: Login User
authRoute.post("/login", LOGIN_VALIDATOR, AuthController.login);

// MARK: Logout User
authRoute.post("/logout", AuthController.logout);

export default authRoute;
