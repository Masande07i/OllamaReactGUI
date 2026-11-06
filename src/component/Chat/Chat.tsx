import { useEffect, useState } from "react";
import styles from "./Chat.module.css";
import { sendMessage } from "../../services/ollamaService";
import logo from "../../assets/lumoralogo.png";

type Message = {
    role: "user" | "assistant";
    content: string;
    duration?: string;
    tokensPerSecond?: string;
};
type Conversation = {
    id: string;
    title: string;
    messages: Message[];
};

function Chat() {
    const [message, setMessage] = useState("");

    const [conversations, setConversations] = useState<Conversation[]>(() => {
        const savedConversations = localStorage.getItem("lumora-conversations");

        return savedConversations ? JSON.parse(savedConversations) : [];
    });

    const [currentChatId, setCurrentChatId] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem("lumora-conversations", JSON.stringify(conversations));
        }, [conversations]);

        useEffect(() => {
        if (!currentChatId || messages.length === 0) return;

        setConversations((previous) => {
            const existingChat = previous.find(
                (chat) => chat.id === currentChatId
            );

            const title = messages.find(
                (msg) => msg.role === "user"
            )?.content.slice(0, 30) || "New Chat";

            const updatedChat = {
                id: currentChatId,
                title,
                messages
            };

            if (existingChat) {
                return previous.map((chat) =>
                    chat.id === currentChatId ? updatedChat : chat
                );
            }

            return [updatedChat, ...previous];
        });
    }, [messages, currentChatId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!message.trim() || loading) return;

        const userMessage = message.trim();

        const chatId = currentChatId || Date.now().toString();

        if (!currentChatId) {
            setCurrentChatId(chatId);
        }

        setMessages((previous) => [
            ...previous,
            { role: "user", content: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const result = await sendMessage(userMessage);

            setMessages((previous) => [
                ...previous,
                {
                    role: "assistant",
                    content: result.response,
                    duration: result.duration,
                    tokensPerSecond: result.tokensPerSecond
                }
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

    const handleClearChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setMessage("");
};

    return (
        <div className={styles.chat}>
            <header>
                <img src={logo} alt="Lumora Logo" className={styles.logo} />
                <p>Your Personal AI Companion</p>

                <button className={styles.newChat} onClick={handleClearChat}>
                    + New Chat
                </button>
            </header>

            <div className={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} className={styles[msg.role]}>
                        <p>{msg.content}</p>

                        {msg.role === "assistant" && msg.duration !== undefined && (
                            <div className={styles.messageStats}>
                                <span>{msg.duration}s</span>
                                <span>{msg.tokensPerSecond} tokens/sec</span>
                            </div>
                        )}
                    </div>
                ))}

                {loading && <p>LUMORA is thinking...</p>}
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
