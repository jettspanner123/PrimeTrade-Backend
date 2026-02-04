import { Hono } from "hono";
import {
    GET_USER_BY_USERNAME_VALIDATOR,
    UPDATE_USER_VALIDATOR,
    UPDATE_USER_VALIDATOR_FOR_ID,
} from "../../../../shared/types/user/user.types.js";
import UserController from "./user.controller.js";

import { AuthMiddleware } from '../../middleware/auth.js';

const userRoute = new Hono();

// MARK: Auth Middleware
userRoute.use("*", AuthMiddleware);

// MARK: Get User Controller Health Check
userRoute.get("/health", UserController.healthCheck);

// MARK: Get All Users, [ Test Route ]
userRoute.get("/", UserController.getAllUsers);

// MARK: Get User By Username
userRoute.get(
    "/:username",
    GET_USER_BY_USERNAME_VALIDATOR,
    UserController.getUserByUsername,
);

// MARK: Update User by Id
userRoute.put(
    "/:id",
    UPDATE_USER_VALIDATOR,
    UPDATE_USER_VALIDATOR_FOR_ID,
    UserController.updateUser,
);

export default userRoute;
