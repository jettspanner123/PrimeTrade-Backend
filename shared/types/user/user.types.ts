import { zValidator } from "@hono/zod-validator";
import { UserModel } from "../../../server/src/db/generated/prisma/models";
import { BASE_RESPONSE } from "../base/base.types";
import { z } from "zod";
import { StatusCodes } from "http-status-codes";
import { registerSchema } from "../auth/auth.types";

// MARK: Exported Schemas
const getUserByUsernameSchema = z.object({
    username: z
        .string({ error: "Username not provided!" })
        .min(8, { error: "Username should be atleast 8 characters!" }),
});

const updateUserSchemaForId = z.object({
    id: z.string({ error: "Id not provided!" }),
});
const updateUserSchema = z.object({
    user: registerSchema.partial(),
});

// MARK: Exported Types
export type BASE_USER = UserModel;
export type SAFE_USER = Omit<UserModel, "password">;
export type PARTIAL_USER_DTO = Partial<SAFE_USER>;
export type UPDATE_USER_FOR_ID_DTO = z.infer<typeof updateUserSchemaForId>;
export type UPDATE_USER_DTO = z.infer<typeof updateUserSchema>;
export interface USERS_RESPONSE extends BASE_RESPONSE {
    users: Array<SAFE_USER> | null;
    errors: Array<string> | string | null;
}
export interface USER_RESPONSE extends BASE_RESPONSE {
    user: SAFE_USER | null;
    errors: Array<string> | string | null;
}

export type UPDATE_USER_SERVICE_RESPONSE = {
    previousUser: SAFE_USER | null;
    currentUser: SAFE_USER | null;
};
export interface UPDATE_USER_RESPONSE extends BASE_RESPONSE {
    previousUser: SAFE_USER | null;
    currentUser: SAFE_USER | null;
    errors: Array<string> | string | null;
}
export type GET_USER_BY_USERNAME_DTO = z.infer<typeof getUserByUsernameSchema>;

// MARK: Exported Validators
export const GET_USER_BY_USERNAME_VALIDATOR = zValidator(
    "param",
    getUserByUsernameSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invalid JSON Input!",
                    user: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies USER_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);

export const UPDATE_USER_VALIDATOR_FOR_ID = zValidator(
    "param",
    updateUserSchemaForId,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invalid JSON Input!",
                    currentUser: null,
                    previousUser: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies UPDATE_USER_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);
export const UPDATE_USER_VALIDATOR = zValidator(
    "json",
    updateUserSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invalid JSON Input!",
                    currentUser: null,
                    previousUser: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies UPDATE_USER_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);
