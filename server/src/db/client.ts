import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client.js";

export default class DatabaseService {
    public static prisma: PrismaClient;

    public static getInstance(): PrismaClient {
        if (!DatabaseService.prisma) {
            DatabaseService.prisma = new PrismaClient({
                adapter: new PrismaPg({
                    connectionString: process.env.DATABASE_URL!,
                }),
            });
        }
        return DatabaseService.prisma;
    }
}
