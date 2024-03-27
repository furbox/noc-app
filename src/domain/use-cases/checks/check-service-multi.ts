import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceMultiUseCase {
    execute(url: string): Promise<boolean>;

}

type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

export class CheckServiceMulti implements CheckServiceMultiUseCase {

    constructor(
        private readonly logRepository: LogRepository[],
        private successCallback: SuccessCallback,
        private errorCallback: ErrorCallback
    ) { }

    private callLogs(log: LogEntity) {
        this.logRepository.forEach((repo) => {
            repo.saveLog(log);
        });
    }

    async execute(url: string): Promise<boolean> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url} with status ${response.status}`);
            }
            const log = new LogEntity({
                level: LogSeverityLevel.low,
                message: `Service ${url} is up and running`,
                origin: 'check-service.ts'
            });
            this.callLogs(log);
            this.successCallback && this.successCallback();
            return true;
        } catch (error) {
            const log = new LogEntity({
                level: LogSeverityLevel.high,
                message: `${error}`,
                origin: 'check-service.ts'
            });
            this.callLogs(log);
            this.errorCallback && this.errorCallback(`${error}`);
            return false;
        }
    }
}