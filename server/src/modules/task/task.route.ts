import TaskController from "./task.controller.js";
import { Hono } from "hono";
import {
    CREATE_TASK_VALIDATOR,
    DELETE_TASK_VALIDATOR, RESTORE_TASK_VALIDATOR,
    UPDATE_TASK_VALIDATOR
} from "../../../../shared/types/task/task.types.js";
import { PARAM_ID_VALIDTOR } from "../../../../shared/types/base/base.types.js";

const taskRoute = new Hono();

taskRoute.get("/health", TaskController.healthCheck);
taskRoute.get("/:id", PARAM_ID_VALIDTOR, TaskController.getTasksForId);
taskRoute.get("/recently-deleted/:id", PARAM_ID_VALIDTOR, TaskController.getRecentlyDeletedTasksForId)
taskRoute.post("/", CREATE_TASK_VALIDATOR, TaskController.createTask);
taskRoute.post("/restore", RESTORE_TASK_VALIDATOR, TaskController.restoreTaskById)
taskRoute.delete("/", DELETE_TASK_VALIDATOR, TaskController.deleteTask);
taskRoute.put(
    "/",
    UPDATE_TASK_VALIDATOR,
    TaskController.updateTask,
);

export default taskRoute;
