import { GoogleGenAI } from '@google/genai';

// Tu clase original de la Unidad 4
class AIRequestHandler {
    constructor(rawText) {
        this.rawText = rawText;
        this.sanitizedText = this.sanitize(rawText);
    }

    sanitize(text) {
        if (!text) return "";
        return text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,;:!?]/g, '').trim();
    }

    getWordCount() {
        if (!this.sanitizedText) return 0;
        const words = this.sanitizedText.split(/\s+/);
        return words.filter(word => word.length > 0).length;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    const { proposal } = req.body;

    const handlerInstance = new AIRequestHandler(proposal);
    const wordCount = handlerInstance.getWordCount();

    if (wordCount < 10) {
        return res.status(400).json({ 
            error: `La propuesta es muy corta. Tiene ${wordCount} palabras y se requieren mínimo 10.` 
        });
    }

    try {
        // Leer la API Key desde Vercel
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'Error: Clave de API no configurada en Vercel.' });
        }

        // Inicialización correcta del SDK
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        // Llamada al modelo recomendado en Build with AI
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analiza de forma muy breve la viabilidad técnica de la siguiente propuesta tecnológica: "${handlerInstance.sanitizedText}". Da tu respuesta en un máximo de tres renglones.`,
        });

        return res.status(200).json({
            message: "¡Análisis de Gemini completado con éxito!",
            wordCount: wordCount,
            aiResponse: response.text
        });

    } catch (error) {
        // Esto nos ayudará a ver el error real en los Logs de Vercel si vuelve a fallar
        console.error("Error completo de Gemini:", error);
        return res.status(500).json({ error: `Error interno: ${error.message}` });
    }
}