import { Context } from "hono";
import UserService from "./user.service.js";
import { BASE_RESPONSE } from "../../../../shared/types/base/base.types.js";
import { StatusCodes } from "http-status-codes";
import {
    USERS_RESPONSE,
    GET_USER_BY_USERNAME_DTO,
    USER_RESPONSE,
    UPDATE_USER_FOR_ID_DTO,
    UPDATE_USER_DTO,
    UPDATE_USER_RESPONSE,
} from "../../../../shared/types/user/user.types.js";

const userService = new UserService();

export default class UserController {
    public static async healthCheck(context: Context) {
        const _ = await userService.healthCheck();
        return context.json(
            {
                success: true,
                message: "User Service Working Fine!",
            } satisfies BASE_RESPONSE,
            StatusCodes.OK,
        );
    }

    public static async getAllUsers(context: Context) {
        try {
            const users = await userService.getAllUsers();
            return context.json(
                {
                    success: true,
                    message: "List Of Users!",
                    users,
                    errors: null,
                } satisfies USERS_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: true,
                    message: "List Of Users!",
                    users: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies USERS_RESPONSE,
                StatusCodes.OK,
            );
        }
    }

    public static async getUserByUsername(context: Context) {
        try {
            const { username }: GET_USER_BY_USERNAME_DTO =
                //@ts-ignore
                context.req.valid("param");
            const user = await userService.getUserByUsername(username);
            return context.json(
                {
                    success: true,
                    message: "Here is the user!",
                    user,
                    errors: null,
                } satisfies USER_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "Crap! Some Error Occured!",
                    user: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies USER_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async updateUser(context: Context) {
        try {
            //@ts-ignore
            const { id }: UPDATE_USER_FOR_ID_DTO = context.req.valid("param");
            //@ts-ignore
            const { user }: UPDATE_USER_DTO = context.req.valid("json");

            const { previousUser, currentUser } = await userService.updateUser(
                id,
                user,
            );

            return context.json(
                {
                    success: true,
                    message: "User updated successfully!",
                    previousUser,
                    currentUser,
                    errors: null,
                } satisfies UPDATE_USER_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "User updation failed!",
                    previousUser: null,
                    currentUser: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies UPDATE_USER_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}