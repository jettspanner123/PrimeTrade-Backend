import { ta } from "zod/locales";
import {
    BASE_TASK,
    CREATE_TASK_DTO,
    DELETE_TASK_DTO,
    RESTORE_TASK_DTO,
    TASK_RESPONSE,
    TASKS_RESPONSE,
    UPDATE_TASK_DTO,
    UPDATE_TASK_SERVICE_RESPONSE,
} from "../../../../shared/types/task/task.types.js";
import DatabaseService from "../../db/client.js";

const db = DatabaseService.getInstance();

export default class TaskService {
    // Check Health Ofc
    async healthCheck(): Promise<boolean> {
        return true;
    }

    // Creating Task
    async createTask(taskDetails: CREATE_TASK_DTO): Promise<BASE_TASK> {
        const { title, description, userId } = taskDetails;

        await TaskHelperService.checkIfUserIdExists(userId);

        const task = await db.task.create({
            data: {
                userId,
                title,
                description,
            },
        });
        return task;
    }

    // Get All Task for a user id.
    async getTasksForId(userId: string): Promise<Array<BASE_TASK>> {
        await TaskHelperService.checkIfUserIdExists(userId);
        const tasks = await db.task.findMany({ where: { userId } });
        return tasks.filter((task) => task.deletionStatus !== "SOFT_DELETED");
    }

    async getRecentlyDeletedTasksForId(
        userId: string,
    ): Promise<Array<BASE_TASK>> {
        await TaskHelperService.checkIfUserIdExists(userId);
        const tasks = await db.task.findMany({
            where: { userId, deletionStatus: "SOFT_DELETED" },
        });
        return tasks;
    }

    async restoreDeletedTaskForId(
        taskDetails: RESTORE_TASK_DTO,
    ): Promise<BASE_TASK> {
        const { userId, taskId } = taskDetails;

        await TaskHelperService.checkIfTaskIdExists({ userId, taskId });

        const task = await db.task.update({
            where: {
                id: taskId,
                userId,
            },
            data: {
                deletedAt: null,
                deletionStatus: "NOT_DELETED",
            },
        });

        return task;
    }

    // Delete a task for a user id.
    async deleteTask(taskDetails: DELETE_TASK_DTO): Promise<BASE_TASK> {
        const { userId, taskId } = taskDetails;
        await TaskHelperService.checkIfTaskIdExists({ userId, taskId });

        const task = await db.task.update({
            where: {
                id: taskId,
                userId,
            },
            data: {
                deletionStatus: "SOFT_DELETED",
                deletedAt: new Date(),
            },
        });
        return task;
    }

    async updateTask(
        taskDetails: UPDATE_TASK_DTO,
    ): Promise<UPDATE_TASK_SERVICE_RESPONSE> {
        const { userId, taskId, task: toUpdateDetails } = taskDetails;
        const { description, title } = toUpdateDetails;
        const previousTask = await TaskHelperService.checkIfTaskIdExists({
            userId,
            taskId,
        });

        const task = await db.task.update({
            where: { userId, id: taskId },
            data: {
                title,
                description,
            },
        });

        return {
            previousTask,
            currentTask: task,
        };
    }
}

class TaskHelperService {
    // Check if the user exists or not.
    public static async checkIfUserIdExists(userId: string): Promise<boolean> {
        const user = await db.user.findFirst({ where: { id: userId } });
        if (!user) throw new Error("User Id does not exist!");
        return true;
    }

    // Check if the tasks exists or not.
    public static async checkIfTaskIdExists(
        userDetails: DELETE_TASK_DTO,
    ): Promise<BASE_TASK> {
        const { taskId, userId } = userDetails;
        const task = await db.task.findFirst({ where: { id: taskId, userId } });
        if (!task)
            throw new Error(
                `Task does not exists for id: ${taskId}, userId: ${userId}`,
            );
        return task;
    }
}
