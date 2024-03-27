export enum LogSeverityLevel {
    low = 'low',
    medium = 'medium',
    high = 'high'
}

export interface LogEntityOptions {
    level: LogSeverityLevel;
    message: string;
    createdAt?: Date;
    origin: string;
}

export class LogEntity {
    public level: LogSeverityLevel; //enum ['info', 'error']
    public message: string;
    public createdAt: Date;
    public origin: string;

    constructor(options: LogEntityOptions) {
        const { level, message, createdAt = new Date(), origin } = options;
        this.level = level;
        this.message = message;
        this.createdAt = new Date();
        this.origin = origin;
    }

    static fromJson = (json: string): LogEntity => {
        json = (json === '') ? '{}' : json;
        const { level, message, createdAt } = JSON.parse(json);
        if (!level || !message || !createdAt) {
            throw new Error('Invalid log format');
        }
        const log = new LogEntity({ level, message, origin, createdAt });
        log.createdAt = new Date(createdAt);
        return log;
    }

    static fromObject = (obj: {[key: string]: any}): LogEntity => {
        const { level, message, createdAt, origin } = obj;
        if (!level || !message || !createdAt || !origin) {
            throw new Error('Invalid log format');
        }
        const log = new LogEntity({ level, message, origin, createdAt });
        log.createdAt = new Date(createdAt);
        return log;
    }
}