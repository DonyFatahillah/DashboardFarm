import { useState, useRef, useEffect } from "react";
import axios from "../services/axios";
import { Send, Bot, User, X, Minimize2, Maximize2, Loader2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export default function AIChatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    const userMessage = { role: "user", parts: [{ text: message }] };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("ai/chat", {
        message: message,
        history: chatHistory,
      });

      const aiMessage = { role: "model", parts: [{ text: response.data.data.response }] };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (error) {
      toast.error("Failed to get AI response");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatMessage = (text) => {
    if (!text) return "";
    
    // Split by bold pattern **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      
      // Handle line breaks
      return part.split('\n').map((line, lineIndex) => (
        <span key={`${index}-${lineIndex}`}>
          {line}
          {lineIndex < part.split('\n').length - 1 && <br />}
        </span>
      ));
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-primary-700 transition-all z-50 animate-bounce"
      >
        <Bot className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col z-50 transition-all ${
        isMinimized ? "h-16" : "h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-primary-600 text-white rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="font-bold">Farm AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/20 rounded">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat History */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {chatHistory.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p className="text-sm italic">Tanya saya apa saja tentang data peternakan Anda!</p>
              </div>
            )}
            {chatHistory.map((chat, idx) => (
              <div key={idx} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    chat.role === "user"
                      ? "bg-primary-600 text-white rounded-tr-none"
                      : "bg-white text-gray-700 border border-gray-100 shadow-sm rounded-tl-none"
                  }`}
                >
                  {formatMessage(chat.parts[0].text)}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                  <span className="text-xs text-gray-400">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-50 bg-white rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Tanya tentang produksi, kematian, dll..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                disabled={loading}
                className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
