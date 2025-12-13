import { StatusCodes } from "http-status-codes";
import {
    BASE_RESPONSE,
    PARAM_ID_DTO,
} from "../../../../shared/types/base/base.types.js";
import TaskService from "./task.service.js";
import { Context } from "hono";
import {
    CREATE_TASK_DTO,
    DELETE_TASK_DTO,
    TASK_RESPONSE,
    TASKS_RESPONSE,
    UPDATE_TASK_DTO,
    UPDATE_TASK_RESPONSE,
} from "../../../../shared/types/task/task.types.js";

const taskService = new TaskService();

export default class TaskController {
    // "/health", Health Check
    public static async healthCheck(context: Context) {
        const _ = await taskService.healthCheck();
        return context.json(
            {
                success: true,
                message: "Task Service Working Fine!",
            } satisfies BASE_RESPONSE,
            StatusCodes.OK,
        );
    }

    // "POST /", Create Task
    public static async createTask(context: Context) {
        try {
            const { title, description, userId }: CREATE_TASK_DTO =
                //@ts-ignore
                context.req.valid("json");

            const task = await taskService.createTask({
                title,
                description,
                userId,
            });

            return context.json(
                {
                    success: true,
                    message: "Task Created Successfully!",
                    task,
                    errors: null,
                } satisfies TASK_RESPONSE,
                StatusCodes.CREATED,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "Task Creation Failed!",
                    task: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies TASK_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // "GET /:id", Get Task with id.
    public static async getTasksForId(context: Context) {
        try {
            //@ts-ignore
            const { id }: PARAM_ID_DTO = context.req.valid("param");

            const tasks = await taskService.getTasksForId(id);

            return context.json(
                {
                    success: true,
                    message: "Here are the tasks!",
                    tasks,
                    errors: null,
                } satisfies TASKS_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "Failed to get task!",
                    tasks: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies TASKS_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // "DELETE /", Delete Task with id.
    public static async deleteTask(context: Context) {
        try {
            const { userId, taskId }: DELETE_TASK_DTO =
                // @ts-ignore
                context.req.valid("json");

            const task = await taskService.deleteTask({ userId, taskId });

            return context.json(
                {
                    success: true,
                    message: "Task Deleted Successfuly!",
                    task,
                    errors: null,
                } satisfies TASK_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "Task Deletion Failed!",
                    task: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies TASK_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }

    public static async updateTask(context: Context) {
        try {
            const { userId, task: toUpdateTask, taskId }: UPDATE_TASK_DTO =
                //@ts-ignore
                context.req.valid("json");

            const { previousTask, currentTask } = await taskService.updateTask({
                userId,
                task: toUpdateTask,
                taskId,
            });

            return context.json(
                {
                    success: true,
                    message: "Task Updated Successfully!",
                    previousTask,
                    currentTask,
                    errors: null,
                } satisfies UPDATE_TASK_RESPONSE,
                StatusCodes.OK,
            );
        } catch (err: any) {
            return context.json(
                {
                    success: false,
                    message: "Task Updation Filed!",
                    previousTask: null,
                    currentTask: null,
                    errors: err instanceof Error ? err.message : err,
                } satisfies UPDATE_TASK_RESPONSE,
                StatusCodes.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
