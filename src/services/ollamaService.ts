const API_URL = "http://localhost:11434/api/generate";

export const sendMessage = async (message: string) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "qwen2.5:0.5b",
            prompt: message,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error("Failed to get a response from Ollama");
    }

    const data = await response.json();

    return data.response;
};