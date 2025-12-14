import { z } from "zod";
import { TaskModel } from "../../../server/src/db/generated/prisma/models";
import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { BASE_RESPONSE } from "../base/base.types";

// MARK: Exported Schemas
export const createTaskSchema = z.object({
    userId: z.string({ error: "User ID is required" }),
    title: z
        .string({ error: "Title is required" })
        .min(1, { message: "Title cannot be empty" }),
    description: z.string().optional(),
});

export const deleteTaskSchema = z.object({
    userId: z.string(),
    taskId: z.string(),
});

export const updateTaskSchema = z.object({
    taskId: z.string(),
    userId: z.string(),
    task: createTaskSchema
        .omit({
            userId: true,
        })
        .partial(),
});

// MARK: Exported Types
export type BASE_TASK = TaskModel;
export type PARTIAL_TASK = Partial<BASE_TASK>;
export type CREATE_TASK_DTO = z.infer<typeof createTaskSchema>;
export type DELETE_TASK_DTO = z.infer<typeof deleteTaskSchema>;
export type UPDATE_TASK_DTO = z.infer<typeof updateTaskSchema>;
export interface TASK_RESPONSE extends BASE_RESPONSE {
    task: BASE_TASK | null;
    errors: Array<string> | string | null;
}
export interface TASKS_RESPONSE extends BASE_RESPONSE {
    tasks: Array<BASE_TASK> | null;
    errors: Array<string> | string | null;
}
export type UPDATE_TASK_SERVICE_RESPONSE = {
    previousTask: BASE_TASK | null;
    currentTask: BASE_TASK | null;
};
export interface UPDATE_TASK_RESPONSE
    extends BASE_RESPONSE, UPDATE_TASK_SERVICE_RESPONSE {
    errors: Array<string> | string | null;
}

// MARK: Exported Validators
export const CREATE_TASK_VALIDATOR = zValidator(
    "json",
    createTaskSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invlid JSON Input!",
                    tasks: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies TASKS_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);

export const DELETE_TASK_VALIDATOR = zValidator(
    "json",
    deleteTaskSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invalid JSON Input!",
                    task: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies TASK_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);

export const UPDATE_TASK_VALIDATOR = zValidator(
    "json",
    updateTaskSchema,
    (result, context) => {
        if (!result.success) {
            return context.json(
                {
                    success: false,
                    message: "Invalid JSON Input!",
                    task: null,
                    errors: result.error.issues.map((err) => err.message),
                } satisfies TASK_RESPONSE,
                StatusCodes.BAD_REQUEST,
            );
        }
    },
);
