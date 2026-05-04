const { GoogleGenerativeAI } = require("@google/generative-ai");
const dashboardRepository = require("../repositories/dashboardRepository");
const kandangRepository = require("../repositories/kandangRepository");
// Import other repositories if needed

class AIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.modelName = "gemini-2.5-flash";
    this.model = this.genAI.getGenerativeModel({ model: this.modelName });
  }

  async generateContext() {
    try {
        // Fetch critical data to provide context to the AI
        const summary = await dashboardRepository.getSummary();
        const [kandangs] = await require("../config/db").query("SELECT * FROM kandang");
        const [lastProduction] = await require("../config/db").query(
        "SELECT p.*, k.nama as kandang_nama FROM produksi_harian p JOIN kandang k ON p.kandang_id = k.id ORDER BY p.tanggal DESC LIMIT 5"
        );
        const [lastKematian] = await require("../config/db").query(
        "SELECT m.*, k.nama as kandang_nama FROM kematian_harian m JOIN kandang k ON m.kandang_id = k.id ORDER BY m.tanggal DESC LIMIT 5"
        );

        return `
        You are a smart Farm Management Assistant. Use the following farm data to answer user questions:
        
        Summary Stats:
        - Total Kandang: ${summary.total_kandang}
        - Total Ayam Aktif: ${summary.total_ayam_aktif}
        - Produksi Hari Ini: ${summary.produksi_hari_ini} butir
        - Kematian Hari Ini: ${summary.kematian_hari_ini} ekor
        - Pakan Terpakai Hari Ini: ${summary.total_pakan_hari_ini} kg
        - Pendapatan Bulan Ini: Rp ${summary.total_pendapatan_bulan_ini.toLocaleString('id-ID')}

        Kandang List:
        ${kandangs.map(k => `- ${k.nama} (Kapasitas: ${k.kapasitas})`).join("\n")}

        Recent Production:
        ${lastProduction.map(p => `- ${p.tanggal.toISOString().split('T')[0]}: ${p.jumlah_telur} butir (${p.kandang_nama})`).join("\n")}

        Recent Mortality:
        ${lastKematian.map(m => `- ${m.tanggal.toISOString().split('T')[0]}: ${m.jumlah_mati} ekor (${m.kandang_nama}) - Cause: ${m.penyebab || 'Unknown'}`).join("\n")}

        Answer concisely and professionally. If the user asks for analysis, provide insights based on this data.
        `;
    } catch (error) {
        console.error("AI Error generating context:", error);
        return "You are a smart Farm Management Assistant. Use your general knowledge to answer questions professionally.";
    }
  }

  async chat(userMessage, history = []) {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        throw { statusCode: 400, message: "GEMINI_API_KEY is not configured. Please add it to your .env file." };
    }

    try {
        const systemContext = await this.generateContext();
        
        const chatSession = this.model.startChat({
        history: [
            { role: "user", parts: [{ text: systemContext }] },
            { role: "model", parts: [{ text: "Understood. I am ready to assist with your farm data." }] },
            ...history
        ],
        });

        const result = await chatSession.sendMessage(userMessage);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // If 2.0 Flash fails with 404, try falling back to 1.5 Flash
        if (error.message?.includes("404") && this.modelName !== "gemini-1.5-flash") {
            console.log("Falling back to gemini-1.5-flash...");
            this.modelName = "gemini-1.5-flash";
            this.model = this.genAI.getGenerativeModel({ model: this.modelName });
            return this.chat(userMessage, history);
        }

        if (error.message?.includes("404")) {
            throw { 
                statusCode: 404, 
                message: "AI Model not found. Please ensure the Gemini API is enabled in Google AI Studio and your API key is correct." 
            };
        }
        throw { statusCode: 500, message: "AI Assistant error: " + error.message };
    }
  }
}

module.exports = new AIService();
