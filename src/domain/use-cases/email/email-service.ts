import { log } from "console";
import { EmailService } from "../../../presentation/email/email-service";
import { LogRepository } from "../../repository/log.repository";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";

interface SendLogEmailUseCase {
    execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {
    constructor(
        private readonly emailService: EmailService,
        private readonly logRepository: LogRepository
    ) { }

    async execute(to: string | string[]) {
        try {
            const send = await this.emailService.sendEmailWithLogs(to);
            if (!send) {
                const log = new LogEntity({
                    message: `Email don't sent to: ${to.toString()}`,
                    level: LogSeverityLevel.high,
                    origin: 'EmailServiceUseCase',
                });
                this.logRepository.saveLog(log);
                return false;
            }
            const log = new LogEntity({
                message: `Email sent to: ${to.toString()}`,
                level: LogSeverityLevel.low,
                origin: 'EmailServiceUseCase',
            });
            this.logRepository.saveLog(log);

        } catch (error) {
            console.error(`Failed to send email: ${error}`);
            const log = new LogEntity({
                message: `Email don't sent to: ${to.toString()}, error: ${error}`,
                level: LogSeverityLevel.high,
                origin: 'EmailServiceUseCase',

            });
            this.logRepository.saveLog(log);
            return false;
        }
        return true;
    };

}