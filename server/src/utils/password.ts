import bcrypt from "bcryptjs";

const SALT_ROUNDS: number = 10;

export default class PasswordService {
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  public static async comparePassword(
    ogPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(ogPassword, hashedPassword);
  }
}
