import EvValidator from "../utils/env.js";
import { sign } from "hono/jwt";

export default class JwtService {
    public static async generateToken(userId: string): Promise<string> {
        const secret = EvValidator.getValue("JWT_SECRET");
        const payload = JwtHelperService.generatePayload(userId);
        return await sign(payload, secret);
    }
}

class JwtHelperService {
    public static generatePayload(userId: string): {
        sub: string;
        iat: number;
        exp: number;
    } {
        return {
            sub: userId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) * 1 * 60 * 60,
        };
    }
}
