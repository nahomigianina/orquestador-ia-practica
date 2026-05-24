// Definición de la Clase (Subtema 4.5)
class AIRequestHandler {
    constructor(rawText) {
        this.rawText = rawText;
        this.sanitizedText = this.sanitize(rawText);
    }

    // Método para limpiar caracteres especiales usando expresiones regulares
    sanitize(text) {
        if (!text) return "";
        // Elimina caracteres extraños manteniendo letras, números, espacios y acentos comunes
        return text.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ .,;:!?]/g, '').trim();
    }

    // Método para contar palabras usando estructuras de control
    getWordCount() {
        if (!this.sanitizedText) return 0;
        const words = this.sanitizedText.split(/\s+/);
        return words.filter(word => word.length > 0).length;
    }
}

// Handler del Servidor para Vercel (Manejo de peticiones POST - 4.4)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    }

    const { proposal } = req.body;

    // Validación mediante estructuras de control (4.1, 4.2)
    if (!proposal || typeof proposal !== 'string') {
        return res.status(400).json({ error: 'La propuesta está vacía o es inválida.' });
    }

    // Instanciación del objeto
    const handlerInstance = new AIRequestHandler(proposal);
    const wordCount = handlerInstance.getWordCount();

    // Validación de extensión mínima (Mínimo 10 palabras)
    if (wordCount < 10) {
        return res.status(400).json({ 
            error: `La propuesta es muy corta. Tiene ${wordCount} palabras y el mínimo requerido son 10.` 
        });
    }

    // Respuesta exitosa del objeto del servidor (4.4)
    return res.status(200).json({
        message: "¡Listos para Gemini API!",
        wordCount: wordCount,
        sanitizedText: handlerInstance.sanitizedText
    });
}