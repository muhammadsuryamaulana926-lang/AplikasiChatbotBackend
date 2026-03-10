const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendReport(to, subject, text, attachments = []) {
        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to,
                subject,
                text,
                attachments, // e.g., [{ filename: 'report.pdf', path: './reports/report.pdf' }]
            });
            console.log('Email sent: %s', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }
}

module.exports = new EmailService();
