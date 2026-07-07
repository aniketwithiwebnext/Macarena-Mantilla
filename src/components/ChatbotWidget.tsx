import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Sparkles, CornerDownLeft } from "lucide-react";
import { ChatMessage } from "../types";

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "Welcome Girlies! ✨ I'm Macarena's brand companion. Ask me anything about her poetry journals, creative writing guides, acoustic demos, beauty secrets, or how to join our feminine writing circle!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const chatHistoryForAPI = [...messages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistoryForAPI })
      });

      if (!res.ok) {
        throw new Error("API call failed");
      }

      const data = await res.json();
      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: data.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "model",
        content: "Oh, it seems like my creative gears hit a tiny snag. Please ensure the server is fully running and your API secrets are configured. 🌸",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(inputValue);
  };

  const starterPrompts = [
    "Tell me about Macarena",
    "What's in her beauty routine?",
    "Tell me about her latest EP",
    "How to join Premium Membership?"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] rounded-3xl shadow-2xl glass mb-4 flex flex-col overflow-hidden pointer-events-auto border border-white/40"
            id="chatbot-window"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-pastel-blue via-pastel-pink to-pastel-teal border-b border-white/50 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-baby-teal border border-white flex items-center justify-center font-serif text-charcoal font-medium text-sm">
                    MM
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-400 border-2 border-white rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold tracking-wide text-charcoal flex items-center gap-1">
                    Macarena's Assistant <Sparkles className="w-3 h-3 text-cyan-700" />
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">Curator of Aesthetic</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/40 transition-colors text-slate-500 hover:text-slate-800"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/20"
              id="chatbot-messages"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "bg-slate-800 text-white rounded-tr-none"
                        : "bg-white/80 text-charcoal rounded-tl-none border border-white/50"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        msg.role === "user" ? "text-slate-300 text-right" : "text-slate-400 text-left font-mono"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/80 border border-white/50 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Starter Prompts */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 bg-white/10 border-t border-white/30 flex flex-wrap gap-1.5 pointer-events-auto">
                {starterPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="text-[10px] text-slate-700 hover:text-charcoal bg-white/70 hover:bg-white border border-white/60 rounded-full px-2.5 py-1 transition-all shadow-sm hover:shadow"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleFormSubmit}
              className="p-3 bg-white/50 border-t border-white/30 flex items-center gap-2 pointer-events-auto"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type a creative message..."
                className="flex-1 bg-white/90 border border-white/60 rounded-full px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-baby-teal placeholder-slate-400 text-charcoal shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all shadow"
                aria-label="Send Message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 rounded-full shadow-lg glass pointer-events-auto border border-white/60 text-charcoal hover:text-slate-800 flex items-center justify-center cursor-pointer transition-shadow"
        style={{
          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)"
        }}
        id="chatbot-toggle"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X className="w-5.5 h-5.5" /> : <MessageSquare className="w-5.5 h-5.5" />}
      </motion.button>
    </div>
  );
}
