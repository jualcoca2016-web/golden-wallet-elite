const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

export const GeminiService = {
    classifyExpense: async (input) => {
        try {
            const prompt = `
        Clasifica el siguiente gasto en una de estas categorías: 
        Vivienda, Suministros, Hogar, Material Oficina, Transporte, Entretenimiento, Ahorro.
        Responde ÚNICAMENTE con un JSON en este formato: {"categoria": "Nombre", "monto": 0, "descripcion": "breve"}.
        Si no hay monto, pon 0.
        Entrada: "${input}"
      `;

            console.log('Classifying with Gemini:', input);

            // Example fetch:
            // const response = await fetch(\`\${API_URL}?key=\${GEMINI_API_KEY}\`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            // });
            // const data = await response.json();
            // return JSON.parse(data.candidates[0].content.parts[0].text);

            // Mock response for now
            return { categoria: "Hogar", monto: 5, descripcion: "Compra rápida" };
        } catch (error) {
            console.error('Error in GeminiService:', error);
            throw error;
        }
    }
};
