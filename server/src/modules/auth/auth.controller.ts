import { Context } from "hono";
import type { BASE_RESPONSE } from "../../../../shared/types/base/base.types.js";
import type {
    LOGIN_DTO,
    LOGIN_RESPONSE,
    REGISTER_DTO,
    REGISTER_RESPONSE,
} from "../../../../shared/types/auth/auth.types.js";
import { StatusCodes } from "http-status-codes";
import AuthService from "./auth.service.js";
import { deleteCookie, setCookie } from "hono/cookie";
import { COOKIE_OPTIONS, COOKIE_TOKE_NAME } from "../../constants/cookie.js";
import PasswordService from "../../utils/password.js";

const authService = new AuthService();

export default class AuthController {
    public static async healthCheck(context: Context) {
        const _ = authService.healthCheck();
        return context.json(
            {
                success: true,
                message: "Auth Service Working Fine!",
            } satisfies BASE_RESPONSE,
            StatusCodes.OK,
        );
    }

    public static async register(context: Context) {
        try {
            const {
                username,
                email,
                firstName,
                lastName,
                password,
                // @ts-ignore
            }: REGISTER_DTO = context.req.valid("json");

            // Hash Password
            const hashedPassword = await PasswordService.hashPassword(password);

            // Creating User and Token
            const data = await authService.register({
                username,
                email,
                firstName,
                lastName,
                password: hashedPassword,
            });

            // Inserting Toke To Cookie
            setCookie(context, COOKIE_TOKE_NAME, data.token, COOKIE_OPTIONS);

            // Sending Response
            return context.json(
                {
                    success: true,
                    message: "User Created Successfully",
                    user: data.user,
                    errors: null,
                } satisfies REGISTER_RESPONSE,
                StatusCodes.CREATED,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "User Creation Failed!",
                    user: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies REGISTER_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }


    // "/auth/login" User Login
    public static async login(context: Context) {
        try {
            //@ts-ignore
            const { username, password }: LOGIN_DTO = context.req.valid("json");

            const data = await authService.login({ username, password });

            setCookie(context, COOKIE_TOKE_NAME, data.token, COOKIE_OPTIONS);

            return context.json(
                {
                    success: true,
                    message: "User Loggedin!",
                    user: data.user,
                    errors: null,
                } satisfies LOGIN_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "User Login Failed!",
                    user: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies LOGIN_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }


    // "/auth/logout" User Logout
    public static async logout(context: Context) {
        deleteCookie(context, COOKIE_TOKE_NAME);
        return context.json(
            {
                success: true,
                message: "User Logged Out!",
            } satisfies BASE_RESPONSE,
            StatusCodes.OK,
        );
    }
}
