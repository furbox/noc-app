import { PrismaClient } from "@prisma/client";
import { envs } from "./config/envs";
import { LogModel, MongoDatabase } from "./data/mongo";
import { Server } from "./presentation/server";

(async () => {
    main();
})();

async function main() {
    await MongoDatabase.connect({
        mongoUrl: envs.MONGO_URL,
        dbName: envs.MONGO_DB_NAME
    });

    const prisma = new PrismaClient();

    const log = await prisma.logModel.create({
        data: {
            message: 'Server started',
            origin: 'app.ts',
            level: 'LOW'
        }
    });

    const newLog = await LogModel.create({
        message: 'Server started',
        origin: 'app.ts',
        level: 'low'
    });

    await newLog.save();

    Server.start();
}