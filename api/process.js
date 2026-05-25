import { GoogleGenAI } from '@google/genai';

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

// Handler del Servidor de Vercel
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido.' });
    }

    const { proposal } = req.body;

    // Validaciones básicas usando la clase
    const handlerInstance = new AIRequestHandler(proposal);
    const wordCount = handlerInstance.getWordCount();

    if (wordCount < 10) {
        return res.status(400).json({ 
            error: `La propuesta es muy corta. Tiene ${wordCount} palabras y se requieren mínimo 10.` 
        });
    }

    try {
        // Seguridad (5.6): Leer la API Key desde las variables de entorno del sistema
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ error: 'Error de configuración: Clave de API no encontrada.' });
        }

        // Consumo del Servicio SaaS/API de Gemini
        const ai = new GoogleGenAI({ apiKey: apiKey });
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analiza de forma muy breve la viabilidad técnica de la siguiente propuesta tecnológica: "${handlerInstance.sanitizedText}". Da tu respuesta en un máximo de tres renglones.`,
        });

        // Mandar la respuesta de la IA de regreso a la interfaz
        return res.status(200).json({
            message: "¡Análisis de Gemini completado con éxito!",
            wordCount: wordCount,
            aiResponse: response.text
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al conectar con el servicio de Gemini en la nube.' });
    }
}