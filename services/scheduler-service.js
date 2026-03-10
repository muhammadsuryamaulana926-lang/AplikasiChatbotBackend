const cron = require('node-cron');
const emailService = require('./email-service');
const path = require('path');
const fs = require('fs');

class SchedulerService {
    constructor(chatbotHandler) {
        this.chatbotHandler = chatbotHandler;
    }

    // Menjadwalkan laporan mingguan setiap Senin pukul 08:00
    init() {
        // Jalankan setiap Senin jam 08:00
        cron.schedule('0 8 * * 1', async () => {
            console.log('⏰ Running weekly proactive report...');
            await this.runWeeklyReport();
        });

        console.log('📅 Scheduler Service Initialized: Reports set for every Monday at 08:00 AM');
    }

    async runWeeklyReport() {
        try {
            // 1. Ambil list user dari DB 'chatbot_db'
            const mysql = require('mysql2/promise');
            const connUsers = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'chatbot_db'
            });
            const [users] = await connUsers.execute('SELECT email FROM users WHERE email IS NOT NULL AND email != ""');
            await connUsers.end();

            if (users.length === 0) {
                console.log('ℹ️ No users found to send report.');
                return;
            }

            // 2. Query data 1 minggu terakhir
            const query = "tampilkan data KI yang didaftarkan dalam 7 hari terakhir";

            const result = await this.chatbotHandler.handleDatabaseQuery(query, "system_scheduler", null, null, null, null, true);

            if (result && result.data && result.data.length > 0) {
                // 3. Generate PDF
                const pdfResult = await this.chatbotHandler.generatePDFResponse(result.data, query, "system_scheduler");
                const filename = pdfResult.message.match(/download\/(.*)\)/)[1];
                const filePath = path.join(process.cwd(), 'uploads', filename);

                // 4. Kirim Email ke semua user
                for (const user of users) {
                    const emailBody = `Halo,\n\nBerikut adalah laporan mingguan otomatis terkait perkembangan Kekayaan Intelektual (KI) di ITB untuk periode 7 hari terakhir.\n\nDitemukan ${result.data.length} data baru.\n\nSalam,\nITB AI Assistant`;

                    await emailService.sendReport(
                        user.email,
                        `📊 Laporan Mingguan KI ITB - ${new Date().toLocaleDateString('id-ID')}`,
                        emailBody,
                        [{ filename: 'Laporan_Mingguan_KI.pdf', path: filePath }]
                    );
                    console.log(`✅ Proactive report sent to ${user.email}`);
                }
            } else {
                console.log('ℹ️ No new data for weekly report.');
            }
        } catch (error) {
            console.error('❌ Scheduler Error:', error);
        }
    }
}

module.exports = SchedulerService;
