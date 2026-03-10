const express = require('express');
const app = express();
const chatHistoryRouter = require('./chat-history');
const historyDropdownRouter = require('./history-dropdown');

app.use('/api', chatHistoryRouter);
app.use('/api/chat', historyDropdownRouter);

console.log('Routes in /api:');
chatHistoryRouter.stack.forEach(r => {
    if (r.route) {
        console.log(`  ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
    }
});

console.log('Routes in /api/chat:');
historyDropdownRouter.stack.forEach(r => {
    if (r.route) {
        console.log(`  ${Object.keys(r.route.methods).join(',').toUpperCase()} ${r.route.path}`);
    }
});

// Simulate a request
const request = require('supertest');
const testApp = express();
testApp.use('/api', chatHistoryRouter);
testApp.use('/api/chat', historyDropdownRouter);

async function check() {
    const res = await request(testApp).get('/api/chat/history/test');
    console.log('GET /api/chat/history/test ->', res.status);
}
check();
