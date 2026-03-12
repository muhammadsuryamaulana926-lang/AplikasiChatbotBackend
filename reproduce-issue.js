
const aiOrchestrator = require('./core/ai-orchestrator');

async function testPrompt() {
    console.log("=== Testing AI Prompt (Grounding & Instructions) ===");
    
    const query = "tampilkan ki yang fttm";
    const schema = {
        "itb_db": {
            "kekayaan_intelektual": {
                "columns": "id, judul, inventor, fakultas_inventor, tgl_pendaftaran",
                "sample_rows": [{ "judul": "Tes KI", "fakultas_inventor": "FTI" }]
            }
        }
    };
    
    const prompt = aiOrchestrator.buildUnifiedPrompt(
        query,
        schema,
        "Context history...",
        "itb_db: kekayaan_intelektual",
        { lastQuestion: "siapa inventor FTI?" }
    );
    
    console.log("\nPROMPT OUTPUT (First 1500 chars):\n");
    console.log(prompt.substring(0, 1500) + "...");
}

testPrompt().catch(console.error);
