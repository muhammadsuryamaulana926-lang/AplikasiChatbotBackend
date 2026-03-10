const dbProfiler = require('./db-profiler');

class DatabaseRouter {
    constructor() {
        this.aiHandler = null; // Will be injected
    }

    setAIHandler(handler) {
        this.aiHandler = handler;
    }

    async routeQuery(query, lastDatabase = null) {
        const profiles = dbProfiler.getProfiles();
        const dbNames = Object.keys(profiles);

        if (dbNames.length === 0) return lastDatabase;
        if (dbNames.length === 1) return dbNames[0];

        // 1. Heuristic Matching (Fast)
        const queryLower = query.toLowerCase();
        const scoredDbs = dbNames.map(db => {
            let score = 0;
            const profile = profiles[db];

            // Boost based on keywords
            profile.keywords.forEach(kw => {
                if (queryLower.includes(kw)) score += 2;
            });

            // Boost if it's the last database (contextual continuity)
            if (db === lastDatabase) score += 1;

            return { db, score };
        });

        scoredDbs.sort((a, b) => b.score - a.score);

        // 2. AI Routing (If heuristic is ambiguous or query is complex)
        if (scoredDbs[0].score < 2 || (scoredDbs[0].score === scoredDbs[1]?.score)) {
            console.log('🤖 Heuristic ambiguous, calling AI Router...');
            const routingPrompt = `Berdasarkan pertanyaan user, pilih database yang paling relevan.
            Pertanyaan: "${query}"
            Latar Belakang Databases:
            ${JSON.stringify(profiles, null, 2)}
            
            Jawab HANYA dengan nama database-nya saja (string).`;

            try {
                const aiResponse = await this.aiHandler(routingPrompt, 0, 0, 0.1);
                const cleaned = aiResponse.trim().replace(/['"`]/g, '');
                if (dbNames.includes(cleaned)) return cleaned;
            } catch (error) {
                console.error('AI Routing Error:', error);
            }
        }

        return scoredDbs[0].db;
    }
}

module.exports = new DatabaseRouter();
