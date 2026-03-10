const axios = require('axios');

async function test() {
    try {
        const res = await axios.get('http://localhost:3000/api/users');
        console.log('Users:', res.data);
        const res2 = await axios.get('http://localhost:3000/api/chat-history');
        console.log('Chat History:', res2.data);
        const res3 = await axios.get('http://localhost:3000/api/api-keys');
        console.log('API Keys:', res3.data);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

test();
