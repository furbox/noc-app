import { CheckService } from "../domain/use-cases/checks/check-service";
import { CheckServiceMulti } from "../domain/use-cases/checks/check-service-multi";
import { SendEmailLogs } from "../domain/use-cases/email/email-service";
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasources/postgres-log.datasource";
import { LogRepositoryimpl } from "../infrastructure/repositories/log-impl.repository";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email-service";

const fslogRepository = new LogRepositoryimpl(
    new FileSystemDatasource()
);

const mongologRepository = new LogRepositoryimpl(
    new MongoLogDatasource()
);

const postgreslogRepository = new LogRepositoryimpl(
    new PostgresLogDatasource()
);

const emailService = new EmailService();
export class Server {

    public static start() {
        console.log('Server started!!');
        //enviar email
        //new SendEmailLogs(emailService, fileSystemLogRepository).execute(['ventastourlist@gmail.com']);
        /*
        *Enviar email a un destinatario
        emailService.sendEmail({
            to: 'ventastourlist@gmail.com',
            subject: 'Hello from Node.js',
            htmlBody: '<h1>Hello from Node.js</h1>'
        });
        */
        //enviar email con logs
        //emailService.sendEmailWithLogs(['ventastourlist@gmail.com']);

        
        CronService.createJob('*/5 * * * * *', () => {
            const url = 'https://www.google.com';
            new CheckServiceMulti(
                [fslogRepository, mongologRepository, postgreslogRepository],
                () => console.log(`Success: ${url}`),
                (error) => console.error(error)
            ).execute(url);
        });
        
    }
}