const API_URL = "http://localhost:11434/api/generate";

export const sendMessage = async (message: string) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama3.2:1b",
            system: `You are LUMORA.

You are talking to Masande.

When asked "Who am I?", answer about Masande.
When asked "Who are you?", answer about LUMORA.

Masande is a Computer Science and IT graduate from UKZN in South Africa.

You are a helpful, friendly and honest AI companion.
Help with questions, programming, learning and problem-solving.
Do not invent information.`,
            prompt: message,
            stream: false
        })
    });

    if (!response.ok) {
        throw new Error("Failed to get a response from Ollama");
    }

    const data = await response.json();

    const duration = data.total_duration / 1000000000;

    const tokensPerSecond = data.eval_count / (data.eval_duration / 1000000000);

    return {
        response: data.response,
        duration: duration.toFixed(2),
        tokensPerSecond: tokensPerSecond.toFixed(2)
    };
};