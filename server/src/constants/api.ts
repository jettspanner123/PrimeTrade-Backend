import {
    LOGIN_DTO,
    LOGIN_RESPONSE,
    LOGIN_SERVICE_RESPONSE,
} from "../../../shared/types/auth/auth.types.js";

export const BASE_API_ROUTE: string = "http://localhost:3000";
export const AIPRoutes = {
    AUTH_ROUTE: "/auth",
    USER_ROUTE: "/user",
    TASK_ROUTE: "/task",
} as const;


