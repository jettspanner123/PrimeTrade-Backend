import {
    BASE_USER,
    PARTIAL_USER_DTO,
    SAFE_USER,
    UPDATE_USER_RESPONSE,
    UPDATE_USER_SERVICE_RESPONSE,
    USERS_RESPONSE,
} from "../../../../shared/types/user/user.types.js";
import DatabaseService from "../../db/client.js";

const db = DatabaseService.getInstance();

export default class UserService {
    async healthCheck(): Promise<boolean> {
        return true;
    }

    async getAllUsers(): Promise<Array<SAFE_USER>> {
        return await db.user.findMany({ omit: { password: true } });
    }

    async getUserByUsername(username: string): Promise<SAFE_USER> {
        const user = await db.user.findUnique({
            where: { username },
            omit: { password: true },
        });
        if (!user) throw new Error("Username not found!");
        return user;
    }

    async updateUser(
        currentUserId: string,
        userUpdateDetails: PARTIAL_USER_DTO,
    ): Promise<UPDATE_USER_SERVICE_RESPONSE> {
        const { email, firstName, lastName, username } = userUpdateDetails;
        const user = await db.user.findFirst({
            where: {
                id: currentUserId,
            },
        });

        if (!user) throw new Error(`User not found!`);

        if (!UserHelperService.checkChangesForUpdation(user, userUpdateDetails))
            throw new Error("Cannot update if the username is the same!");

        const updatedUser = await db.user.update({
            where: { id: currentUserId },
            data: {
                email,
                firstName,
                lastName,
                username,
            },
        });

        return {
            currentUser: updatedUser,
            previousUser: user,
        };
    }
}

class UserHelperService {
    public static checkChangesForUpdation(
        currentUser: BASE_USER,
        userUpdateDetails: Partial<BASE_USER>,
    ): boolean {
        return Object.keys(userUpdateDetails).some((key) => {
            const k = key as keyof BASE_USER;
            return userUpdateDetails[k] !== currentUser[k];
        });
    }
}
