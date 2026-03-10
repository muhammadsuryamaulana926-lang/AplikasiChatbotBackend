const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'chatbot_db',
  port: 3306
};

async function createAdminUser() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    const email = 'chatbotaiasistent@gmail.com';
    const password = 'admin123'; // Ganti dengan password yang Anda inginkan
    
    // Cek apakah user sudah ada
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existing.length > 0) {
      console.log('✅ User admin sudah ada!');
      console.log('Email:', existing[0].email);
      console.log('Status:', existing[0].status);
      console.log('\n🔑 Untuk login gunakan:');
      console.log('Email:', email);
      console.log('Password: (password yang sudah Anda set sebelumnya)');
      return;
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);
    
    // Insert user admin
    await connection.execute(
      'INSERT INTO users (email, kata_sandi, status, nama, telepon) VALUES (?, ?, ?, ?, ?)',
      [email, hashedPassword, 'active', 'Admin', '']
    );
    
    console.log('✅ User admin berhasil dibuat!');
    console.log('\n🔑 Kredensial login:');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('\n⚠️  PENTING: Segera ganti password setelah login pertama!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 MySQL tidak berjalan. Pastikan MySQL/XAMPP sudah running!');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database "chatbot_db" tidak ditemukan. Buat database terlebih dahulu!');
    }
  } finally {
    if (connection) await connection.end();
  }
}

createAdminUser();
