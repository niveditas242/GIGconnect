import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm your GIGconnect assistant. I can help you with:\n\n• Finding freelance gigs\n• Building your portfolio\n• Payment questions\n• Account setup\n• Client communication\n\nWhat would you like to know about freelancing?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey")
    ) {
      return "👋 Hi there! Welcome to GIGconnect - your gateway to freelance success! How can I assist you today?";
    } else if (message.includes("help") || message.includes("support")) {
      return "🛠️ I can help you with:\n\n• **Finding Gigs** - Discover perfect projects\n• **Portfolio Setup** - Showcase your work\n• **Payments** - Secure transactions\n• **Profile Optimization** - Get more clients\n• **Client Communication** - Professional messaging\n\nWhich area do you need help with?";
    } else if (
      message.includes("gig") ||
      message.includes("job") ||
      message.includes("work")
    ) {
      return "💼 **Find Gigs on GIGconnect:**\n\n1. **Browse** - Explore available projects\n2. **Filter** - By skills, budget, location\n3. **Apply** - Submit compelling proposals\n4. **Communicate** - Chat with clients directly\n5. **Get Hired** - Start working & earning\n\nNeed tips for winning proposals?";
    } else if (message.includes("portfolio") || message.includes("profile")) {
      return "🎨 **Build Your Portfolio:**\n\n• Add your best projects\n• Showcase skills & expertise\n• Include client testimonials\n• Set your hourly rate\n• Highlight specialties\n\nVisit the Portfolio Builder to get started!";
    } else if (
      message.includes("payment") ||
      message.includes("money") ||
      message.includes("fee")
    ) {
      return "💰 **Payment Info:**\n\n• **Service Fee**: 10% on completed gigs\n• **Secure Payments**: Escrow protection\n• **Multiple Methods**: Bank transfer, PayPal, etc.\n• **Timely Payouts**: After client approval\n• **No Hidden Fees**: Transparent pricing";
    } else if (
      message.includes("contact") ||
      message.includes("email") ||
      message.includes("phone")
    ) {
      return "📞 **Support Options:**\n\n• **Email**: support@gigconnect.com\n• **Phone**: +1-234-567-8900\n• **Live Chat**: Available now!\n• **Help Center**: 24/7 resources\n• **Business Hours**: Mon-Fri 9AM-6PM EST";
    } else if (message.includes("thank") || message.includes("thanks")) {
      return "🌟 You're welcome! Happy to help you succeed on GIGconnect. Is there anything else you'd like to know about freelancing?";
    } else if (
      message.includes("feature") ||
      message.includes("what can") ||
      message.includes("how does")
    ) {
      return "🚀 **GIGconnect Features:**\n\n• Smart gig matching\n• Portfolio builder\n• Secure payments\n• Client reviews\n• Skill development\n• Community support\n• Real-time chat\n• Project management\n\nWhich feature interests you most?";
    } else if (
      message.includes("start") ||
      message.includes("begin") ||
      message.includes("new")
    ) {
      return "🎯 **Getting Started:**\n\n1. Complete your profile\n2. Build your portfolio\n3. Set your rates\n4. Browse available gigs\n5. Submit proposals\n6. Start earning!\n\nReady to begin your freelance journey?";
    } else {
      return (
        "🤔 I understand you're asking about freelancing on GIGconnect. For detailed assistance with \"" +
        userMessage +
        '", I recommend:\n\n• Checking our Help Center\n• Contacting our support team\n• Browsing our community forums\n\nIs there anything specific about gigs, portfolios, or payments I can help with?'
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickReplies = [
    "How to find gigs?",
    "Portfolio setup help",
    "Payment questions",
    "Contact support",
  ];

  const handleQuickReply = (text: string) => {
    setInputMessage(text);
    // Auto-send after a brief delay
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="chatbot-container">
      <div className="chatbot-window">
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar">
            <span>💼</span>
          </div>
          <div className="chatbot-info">
            <h3>GIGconnect Assistant</h3>
            <span className="status online">Online • Ready to help</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.sender === "user" ? "user-message" : "bot-message"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="quick-replies">
            <p>Quick Help:</p>
            <div className="quick-reply-buttons">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about gigs, portfolio, payments..."
            className="message-input"
          />
          <button
            onClick={handleSendMessage}
            className="send-btn"
            disabled={!inputMessage.trim()}
          >
            <span>↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
