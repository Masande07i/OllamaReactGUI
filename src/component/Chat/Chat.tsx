import { useState } from "react";
import styles from "./Chat.module.css";
import { sendMessage } from "../../services/ollamaService";

type Message = {
    role: "user" | "assistant";
    content: string;
};

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        setMessages((previous) => [
            ...previous,
            { role: "user", content: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await sendMessage(userMessage);

            setMessages((previous) => [
                ...previous,
                { role: "assistant", content: response }
            ]);
        } catch (error) {
            console.error(error);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: "Sorry, something went wrong. Please try again."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.chat}>
            <header>
                <h1>LUMORA</h1>
                <p>Your Personal AI Companion</p>
            </header>

            <div className={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles[msg.role]}>
                        <p>{msg.content}</p>
                    </div>
                ))}

                {loading && <p> LUMORA is thinking...</p>}
            </div>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask LUMORA anything..."
                />

                <button type="submit" disabled={loading}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default Chat;