import {
    LOGIN_DTO,
    LOGIN_SERVICE_RESPONSE,
    REGISTER_DTO,
    REGISTER_SERVICE_RESPONSE,
} from "../../../../shared/types/auth/auth.types.js";
import DatabaseService from "../../db/client.js";
import JwtService from "../../utils/jwt.js";
import PasswordService from "../../utils/password.js";

const db = DatabaseService.getInstance();

export default class AuthService {
    public healthCheck(): boolean {
        return true;
    }

    async register(
        userDetails: REGISTER_DTO,
    ): Promise<REGISTER_SERVICE_RESPONSE> {
        const { username, password, email, firstName, lastName } = userDetails;

        // Fallback
        const user_t = await db.user.findUnique({ where: { email } });
        if (user_t)
            throw new Error("User Already Exists! Try different email!");

        // Create User
        const user = await db.user.create({
            data: {
                username,
                firstName,
                lastName,
                password,
                email,
            },
        });

        // Create Token
        const token = await JwtService.generateToken(user.id);

        return { token, user };
    }

    async login(userData: LOGIN_DTO): Promise<LOGIN_SERVICE_RESPONSE> {
        const { username, password } = userData;

        // Fallback
        const user = await db.user.findUnique({ where: { username } });
        if (!user) throw new Error("User does not exist!");

        const isPasswordSame = await PasswordService.comparePassword(
            user.password,
            password,
        );

        if (!isPasswordSame) throw new Error("Wrong Password!");

        // Creating Token
        const token = await JwtService.generateToken(user.id);

        return {
            token,
            user,
        };
    }
}
