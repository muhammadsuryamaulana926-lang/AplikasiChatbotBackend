const dbProfiler = require('./db-profiler');

class DatabaseRouter {
    constructor() {
        this.aiHandler = null; // Will be injected
    }

    setAIHandler(handler) {
        this.aiHandler = handler;
    }

    async routeQuery(query, lastDatabase = null, databaseHint = null) {
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
                const regex = new RegExp(`\\b${kw}\\b`, 'i');
                if (regex.test(queryLower)) score += 5; // Increased from 2
            });

            // Minor boost for context continuity (Sticky DB)
            // But much less than keywords to allow switching
            if (db === lastDatabase) score += 0.5; // Reduced from 1

            // HUGE BOOST if AI successfully found a hint
            if (db === databaseHint) score += 12;

            // EXPLICIT MENTION in query (Absolute boost)
            if (queryLower.includes(db.toLowerCase())) score += 20;

            return { db, score };
        });

        scoredDbs.sort((a, b) => b.score - a.score);

        // 3. Ambiguity Check (Phase 7 Fix)
        if (scoredDbs.length > 1) {
            const diff = scoredDbs[0].score - scoredDbs[1].score;
            if (diff < 4 && scoredDbs[0].score > 0) {
                console.log(`⚠️ Database routing ambiguous (diff: ${diff}). Flagging for AI confirmation.`);
                // Return top DB but with a flag
                return { 
                    database: scoredDbs[0].db, 
                    isAmbiguous: true, 
                    alternatives: scoredDbs.slice(1, 3).map(d => d.db) 
                };
            }
        }

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
