import React from "react";
import "./ChatTrigger.css";

interface ChatTriggerProps {
  onClick: () => void;
}

const ChatTrigger: React.FC<ChatTriggerProps> = ({ onClick }) => {
  return (
    <button className="chat-trigger" onClick={onClick}>
      <div className="chat-trigger-icon">
        <span>💬</span>
        <div className="pulse-animation"></div>
      </div>
      <span className="chat-trigger-text">Need help? Chat with us!</span>
    </button>
  );
};

export default ChatTrigger;
