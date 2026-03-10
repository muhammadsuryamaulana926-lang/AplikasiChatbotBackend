const axios = require('axios');

async function test(path) {
    try {
        const res = await axios.get(`http://localhost:3000${path}`);
        console.log(`PASS ${path}:`, typeof res.data === 'object' ? 'JSON' : 'OTHER');
    } catch (e) {
        console.log(`FAIL ${path}:`, e.response?.status || e.message);
    }
}

async function run() {
    await test('/api/users');
    await test('/api/chat-history');
    await test('/api/chat/history/test@example.com');
    await test('/api/api-keys');
    await test('/api/databases');
    await test('/api/databases/active');
}

run();
