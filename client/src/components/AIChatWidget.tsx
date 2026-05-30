import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";

const LOGO_URL = "/manus-storage/amor-logo_5919afc4.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "Привет! 👋 Я AI-помощник Amor Skincare. Помогу подобрать уход для вашей кожи, расскажу о наших брендах и товарах. Чем могу помочь?",
};

const QUICK_QUESTIONS = [
  "Что подойдёт для сухой кожи?",
  "Расскажи о бренде Biodance",
  "Как работает Kaspi Red?",
  "Адреса магазинов",
];

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = trpc.chat.message.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
      setIsTyping(false);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Извините, произошла ошибка. Пожалуйста, напишите нам в WhatsApp: wa.me/7774779779",
        },
      ]);
      setIsTyping(false);
    },
  });

  useEffect(() => {
    if (isOpen) {
      setShowBadge(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content || isTyping) return;

    const userMessage: Message = { role: "user", content };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    chatMutation.mutate({
      messages: newMessages.filter((m) => m.role !== "assistant" || m !== WELCOME_MESSAGE),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-6 z-50 w-[340px] md:w-[380px] animate-scale-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col"
            style={{ height: "500px", maxHeight: "calc(100vh - 120px)" }}>
            {/* Header */}
            <div
              className="px-4 py-3 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, oklch(0.52 0.20 12), oklch(0.42 0.18 12))" }}
            >
              <div className="relative">
                <img src={LOGO_URL} alt="Amor" className="h-9 w-9 rounded-full object-cover border-2 border-white/30" />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm flex items-center gap-1">
                  Amor Skincare
                  <Sparkles className="h-3 w-3 text-white/70" />
                </div>
                <div className="text-white/70 text-xs">AI-помощник • Онлайн</div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  {msg.role === "assistant" && (
                    <img src={LOGO_URL} alt="" className="h-7 w-7 rounded-full object-cover mr-2 shrink-0 mt-0.5 border border-rose-100" />
                  )}
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "chat-bubble-user rounded-br-sm"
                        : "chat-bubble-ai rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <img src={LOGO_URL} alt="" className="h-7 w-7 rounded-full object-cover mr-2 shrink-0 border border-rose-100" />
                  <div className="chat-bubble-ai px-4 py-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-2 w-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length <= 1 && (
              <div className="px-3 pb-2">
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-3 py-1.5 rounded-full text-xs border border-rose-200 text-primary hover:bg-rose-50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-rose-100">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Напишите сообщение..."
                  disabled={isTyping}
                  className="flex-1 px-4 py-2.5 rounded-full border border-rose-200 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="h-10 w-10 rounded-full flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 active:scale-95"
                  style={{ background: "linear-gradient(135deg, oklch(0.58 0.18 10), oklch(0.72 0.14 10))" }}
                >
                  {isTyping ? (
                    <Loader2 className="h-4 w-4 text-white animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 md:right-6 z-50 h-14 w-14 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
        style={{ background: isOpen ? "oklch(0.45 0.18 12)" : "linear-gradient(135deg, oklch(0.52 0.20 12), oklch(0.62 0.18 15))", boxShadow: "0 8px 32px oklch(0.52 0.20 12 / 0.4)" }}
        aria-label="Открыть чат"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
        {showBadge && !isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">AI</span>
          </span>
        )}
      </button>
    </>
  );
}
