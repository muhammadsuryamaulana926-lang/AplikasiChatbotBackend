const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot_db',
  port: 3306
};

async function resetAdminPassword() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const email = 'chatbotaiasistent@gmail.com';
    const newPassword = 'admin123'; // Password baru
    
    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 8);
    
    // Update password
    const [result] = await connection.execute(
      'UPDATE users SET kata_sandi = ? WHERE email = ?',
      [hashedPassword, email]
    );
    
    if (result.affectedRows > 0) {
      console.log('✅ Password admin berhasil direset!');
      console.log('\n🔑 Kredensial login baru:');
      console.log('Email:', email);
      console.log('Password:', newPassword);
      console.log('\n⚠️  PENTING: Segera ganti password setelah login!');
    } else {
      console.log('❌ User tidak ditemukan!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

resetAdminPassword();
