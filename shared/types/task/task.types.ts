import { z } from "zod";
import { TaskModel } from "../../../server/src/db/generated/prisma/models";
import { TaskStatus } from "../../../server/src/db/generated/prisma/enums";
import { zValidator } from "@hono/zod-validator";
import { StatusCodes } from "http-status-codes";
import { BASE_RESPONSE } from "../base/base.types";

// MARK: Exported Schemas
export const createTaskSchema = z.object({
    userId: z.string({ error: "User ID is required" }),
    title: z
        .string({ error: "Title is required" })
        .min(1, { message: "Title cannot be empty" })
        .max(120, { message: "Title should be under 120 characters" }),
    description: z
        .string()
        .max(500, { message: "Description should be under 500 characters" })
        .optional(),
});

export const deleteTaskSchema = z.object({
    userId: z.string({ error: "User ID not provided!" }),
    taskId: z.string({ error: "Task ID not provided!" }),
});
export const restoreTaskSchema = deleteTaskSchema;

export const updateTaskSchema = z
    .object({
        taskId: z.string({ error: "Task ID not provided!" }),
        userId: z.string({ error: "User ID not provided!" }),
        task: createTaskSchema
            .omit({
                userId: true,
            })
            .partial(),
    })
    .extend({
        status: z.enum([...Object.values(TaskStatus)], {
            error: "Task Status not provided!",
        }).optional(),
    });

// MARK: Exported Types
export type BASE_TASK = TaskModel;
export type PARTIAL_TASK = Partial<BASE_TASK>;
export type CREATE_TASK_DTO = z.infer<typeof createTaskSchema>;
export type DELETE_TASK_DTO = z.infer<typeof deleteTaskSchema>;
export type UPDATE_TASK_DTO = z.infer<typeof updateTaskSchema>;
export type RESTORE_TASK_DTO = z.infer<typeof restoreTaskSchema>;

export interface TASK_RESPONSE extends BASE_RESPONSE {
    task: BASE_TASK | null;
    errors: Array<string> | string | null;
}

export interface TASKS_RESPONSE extends BASE_RESPONSE {
    tasks: Array<BASE_TASK> | null;
    errors: Array<string> | string | null;
}

export interface TASK_STATS {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    archivedTasks: number;
    deletedTasks: number;
}

export interface TASK_STATS_RESPONSE extends BASE_RESPONSE {
    stats: TASK_STATS | null;
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

export const RESTORE_TASK_VALIDATOR = zValidator(
    "json",
    restoreTaskSchema,
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
