const fs = require('fs');
const content = fs.readFileSync('d:/chatbot-backend/debug_sql_out.txt', 'utf8');
const matches = content.split('\n').filter(l => l.includes('CRITICAL_ERROR'));
matches.slice(-2).forEach(m => console.log(m));
