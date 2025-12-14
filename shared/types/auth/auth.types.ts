import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { BASE_USER } from "../user/user.types";
import { BASE_RESPONSE } from "../base/base.types";
import { StatusCodes } from "http-status-codes";

// MARK: Exported Schemas
export const registerSchema = z.object({
    username: z
        .string({ error: "Username not provided!" })
        .min(8, { error: "Username should be atleast 8 characters long." }),
    firstName: z
        .string({ error: "First Name not provided!" })
        .min(1, { error: "First Name should be atleast 1 character long." }),
    lastName: z.string({ error: "Last Name not provided!" }).optional(),
    email: z.email({ error: "Email not provided!" }),
    password: z
        .string({ error: "Password not provided!" })
        .min(8, { error: "Password should be atleast 8 characters!" }),
});

export const loginSchema = z.object({
    username: z
        .string({ error: "Username not provided!" })
        .min(8, { error: "Username should be atleast 8 characters long." }),
    password: z
        .string({ error: "Password not provided!" })
        .min(8, { error: "Password should be atleast 8 characters!" }),
});

// MARK: Exported Types
export type REGISTER_DTO = z.infer<typeof registerSchema>;
export type LOGIN_DTO = z.infer<typeof loginSchema>;
export type REGISTER_SERVICE_RESPONSE = {
    token: string;
    user: BASE_USER;
};
export type LOGIN_SERVICE_RESPONSE = REGISTER_SERVICE_RESPONSE;
export interface REGISTER_RESPONSE extends BASE_RESPONSE {
    user: BASE_USER | null;
    errors: Array<string> | string | null;
}
export type LOGIN_RESPONSE = REGISTER_RESPONSE;

// MARK: Exported Validators
export const REGISTER_VALIDATOR = zValidator(
    "json",
    registerSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Wrong JSON Input!",
                    user: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies REGISTER_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);

export const LOGIN_VALIDATOR = zValidator(
    "json",
    loginSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Wrong JSON Input!",
                    user: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies LOGIN_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);
