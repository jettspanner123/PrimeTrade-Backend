import { Hono } from "hono";
import {
    GET_USER_BY_USERNAME_VALIDATOR,
    UPDATE_USER_VALIDATOR,
    UPDATE_USER_VALIDATOR_FOR_ID,
} from "../../../../shared/types/user/user.types.js";
import UserController from "./user.controller.js";

import { AuthMiddleware } from '../../middleware/auth.js';

const userRoute = new Hono();

userRoute.use("*", AuthMiddleware);

userRoute.get("/health", UserController.healthCheck);
userRoute.get("/", UserController.getAllUsers);
userRoute.get(
    "/:username",
    GET_USER_BY_USERNAME_VALIDATOR,
    UserController.getUserByUsername,
);
userRoute.put(
    "/:id",
    UPDATE_USER_VALIDATOR,
    UPDATE_USER_VALIDATOR_FOR_ID,
    UserController.updateUser,
);

export default userRoute;
