import nodemailer from 'nodemailer';
import { envs } from '../../config/envs';

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[]
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    });

    public async sendEmail(options: SendMailOptions) {
        const { to, subject, htmlBody, attachments } = options;
       try {
            const info = await this.transporter.sendMail({
                from: envs.MAILER_EMAIL,
                to,
                subject,
                html: htmlBody,
                attachments
            });
            console.log(`Email sent: ${info.response}`);
        } catch (error) {
            console.error(`Failed to send email: ${error}`);
        }
    }

    public async sendEmailWithLogs(to: string | string[]): Promise<boolean> {
        const subject = 'Logs from Server Node.js';
        const htmlBody = '<h1>Logs from Server Node.js</h1>';
        const attachments:Attachment[] = [
            { filename: 'all-logs.log', path: './logs/all-logs.log' },
            { filename: 'high-logs.log', path: './logs/high-logs.log' },
            { filename: 'medium-logs.log', path: './logs/medium-logs.log' }
        ];
        await this.sendEmail({ to, subject, htmlBody, attachments });
        return true;
    }
}