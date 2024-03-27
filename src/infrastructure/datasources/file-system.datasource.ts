import fs from 'node:fs';
import { LogDataSource } from "../../domain/datasources/log.datasource";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

export class FileSystemDatasource implements LogDataSource {

    private readonly logPath = 'logs/';
    private readonly allLogsPath = `${this.logPath}all-logs.log`;
    private readonly mediumLogsPath = `${this.logPath}medium-logs.log`;
    private readonly highLogsPath = `${this.logPath}high-logs.log`;

    constructor() {
        this.createLogsFiles();
    }

    private createLogsFiles = () => {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath);
        }
        [
            this.allLogsPath,
            this.mediumLogsPath,
            this.highLogsPath
        ].forEach((path) => {
            if (fs.existsSync(path)) return;
            fs.writeFileSync(path, '');
        });
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = JSON.stringify(newLog);
        fs.appendFileSync(this.allLogsPath, `${logAsJson}\n`);
        //guardar logs segun su nivel
        //si el log es de nivel bajo no se guarda
        if (newLog.level === LogSeverityLevel.low) {
            return;
        }

        //si el log es de nivel medio o alto se guarda en su respectivo archivo
        if (newLog.level === LogSeverityLevel.medium) {
            fs.appendFileSync(this.mediumLogsPath, `${logAsJson}\n`);
        } else {
            fs.appendFileSync(this.highLogsPath, `${logAsJson}\n`);
        }
    }

    private getLogsFromFile = (path: string): Promise<LogEntity[]> => {        
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    return reject(err);
                }
                const logs = data.split('\n').filter(Boolean).map((log: string) => LogEntity.fromJson(log));
                resolve(logs);
            }
            );
        }
        );
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        switch (severityLevel) {
            case LogSeverityLevel.low:
                return Promise.resolve([]);
            case LogSeverityLevel.medium:
                return this.getLogsFromFile(this.mediumLogsPath);
            case LogSeverityLevel.high:
                return this.getLogsFromFile(this.highLogsPath);
            default:
                return this.getLogsFromFile(this.allLogsPath);
        }
    }

}