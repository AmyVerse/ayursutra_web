import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
  sender: "user" | "bot";
  text: string;
  suggested_medicines?: string[];
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const appendMessage = (
    sender: "user" | "bot",
    text: string,
    suggestedMedicines?: string[]
  ) => {
    const newMessage: Message = { sender, text };
    if (suggestedMedicines && suggestedMedicines.length > 0) {
      newMessage.suggested_medicines = suggestedMedicines;
    }
    setMessages((prev) => [...prev, newMessage]);
  };

  const fetchBotReply = async (message: string) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) {
        throw new Error("API error: " + res.status);
      }
      const data = await res.json();
      return {
        response: data.response || "[No response]",
        suggested_medicines: data.suggested_medicines,
      };
    } catch (err) {
      return {
        response: "Error: " + (err as Error).message,
        suggested_medicines: undefined,
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userMsg = input.trim();
    if (!userMsg || loading) return;

    appendMessage("user", userMsg);
    setInput("");
    setLoading(true);

    const { response, suggested_medicines } = await fetchBotReply(userMsg);
    appendMessage("bot", response, suggested_medicines);

    setLoading(false);
  };

  return (
    <div className="chat-container flex flex-col h-full">
      <div
        ref={chatBoxRef}
        className="messages flex-1 overflow-y-auto p-3 space-y-3 bg-emerald-50"
      >
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8 animate-in fade-in slide-in-from-top-4 duration-500">
            👋 Welcome to Ayursutra AI! Ask me about your health concerns.
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <div
              className={`rounded-lg px-3 py-2 max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-emerald-500 text-white"
                  : "bg-white border border-emerald-100 text-gray-800"
              }`}
            >
              <strong className="text-xs opacity-75">
                {msg.sender === "user" ? "You" : "Ayursutra AI"}:
              </strong>
              <div className="mt-1 text-sm prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 mb-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-4 mb-2">{children}</ol>
                    ),
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto mb-2">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              {msg.suggested_medicines &&
                msg.suggested_medicines.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-semibold text-emerald-700 text-xs mb-1">
                      Suggested Medicines:
                    </h4>
                    <ul className="list-disc pl-4 text-xs">
                      {msg.suggested_medicines.map((med: string, i: number) => (
                        <li key={i}>{med}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message flex justify-start animate-in slide-in-from-bottom-2 fade-in duration-300">
            <div className="inline-block bg-white border border-emerald-100 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-1">
                <div className="text-sm text-gray-500">
                  Ayursutra AI is typing
                </div>
                <div className="flex space-x-1">
                  <div
                    className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="input-area flex items-center gap-2 p-3 border-t bg-white"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 rounded-lg border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
