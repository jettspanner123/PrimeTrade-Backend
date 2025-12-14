import type {
    LOGIN_RESPONSE,
    LOGIN_DTO,
    REGISTER_DTO,
    REGISTER_RESPONSE,
} from "../../../shared/types/auth/auth.types";
import { BASE_API_ROUTE } from "../../../server/src/constants/api";

export default class APIService {
    public static async login(userDetails: LOGIN_DTO): Promise<LOGIN_RESPONSE> {
        const { username, password } = userDetails;
        console.log(userDetails);
        const res = await fetch(APIHelperService.getAuthEndpoint("/login"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username,
                password,
            }),
        });
        return (await res.json()) as LOGIN_RESPONSE;
    }

    public static async register(userDetails: REGISTER_DTO): Promise<REGISTER_RESPONSE> {
        const { firstName, lastName, username, email, password } = userDetails;
        const res = await fetch(APIHelperService.getAuthEndpoint("/register"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                firstName,
                lastName,
                email,
                username,
                password,
            }),
        });
        return await res.json();
    }
}

class APIHelperService {
    public static getAuthEndpoint(extension: string = ""): string {
        return extension.length == 0
            ? `${BASE_API_ROUTE}/auth`
            : `${BASE_API_ROUTE}/auth${extension}`;
    }
}
