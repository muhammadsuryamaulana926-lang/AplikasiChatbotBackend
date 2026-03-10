const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class DashboardService {
    constructor() {
        this.cacheFile = path.join(__dirname, '../dashboard-cache.json');
        if (!fs.existsSync(this.cacheFile)) {
            fs.writeFileSync(this.cacheFile, JSON.stringify({}));
        }
    }

    saveDashboard(data, title) {
        const id = uuidv4();
        const cache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        cache[id] = {
            data,
            title,
            createdAt: new Date().toISOString()
        };

        // Clean up old dashboards (more than 24h)
        const now = new Date();
        for (const [key, value] of Object.entries(cache)) {
            if ((now - new Date(value.createdAt)) > (24 * 60 * 60 * 1000)) {
                delete cache[key];
            }
        }

        fs.writeFileSync(this.cacheFile, JSON.stringify(cache));
        return id;
    }

    getDashboard(id) {
        const cache = JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
        return cache[id] || null;
    }
}

module.exports = new DashboardService();
