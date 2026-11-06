import { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import { sendMessage } from "../../services/ollamaService";
import logo from "../../assets/lumoralogo.png"

type Message = {
    role: "user" | "assistant";
    content: string;
};

function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem("lumora-messages");

    return savedMessages ? JSON.parse(savedMessages) : [];
});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
    localStorage.setItem("lumora-messages", JSON.stringify(messages));
}, [messages]);

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

//     const handleClearChat = () => {
//     setMessages([]);
//     localStorage.removeItem("lumora-messages");
// };

    return (
        <div className={styles.chat}>
            <header>
                 <img src={logo} alt="Lumora Logo" className={styles.logo} />
                <p>Your Personal AI Companion</p>
                {/* <button className={styles.newChat} onClick={handleClearChat}>
                    + New Chat
                </button> */}
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