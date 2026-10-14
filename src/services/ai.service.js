import ai from "../config/ai.config.js";

const generateAIResponse = async (message)=>{
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: message,
    });

    return response.text;
};

export default generateAIResponse;