export default class EnValidator {
  public static getValue(key: string): string {
    const secret = process.env[key];
    if (!secret) throw new Error(`Cannot find env: ${key}`);
    return secret;
  }
}
