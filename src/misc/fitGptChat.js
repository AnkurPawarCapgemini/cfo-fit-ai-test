// BotMessages.js
import React from 'react';
import { SiProbot } from "react-icons/si";

export default function BotMessages({ messages, isTyping }) {
  console.log('messages', messages);
  return (
    <div className="messenger-messages">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message-wrapper ${msg.sender === "user" ? "user" : "bot"}`}
        >
          <div
            style={
              msg.sender === "bot"
                ? { display: "flex", flexDirection: "row-reverse", justifyContent: "flex-end" }
                : {}
            }
          >
            <span className='user_time'>{msg.time}</span>
            <span className="user_name">{msg.name}</span>
          </div>
          <div className="message-header">
            {msg.sender === 'user' ? (
              <img src='./images/user.png' alt={`${msg.name}'s avatar`} className="avatar" />
            ) : (
              <SiProbot style={{ color: "#fff" }} />
            )}
          </div>
          <div className={`messenger-message ${msg.sender}`}>
            {msg.component ? <msg.component /> : msg.text}
          </div>
        </div>
      ))}

      {isTyping && (
        <div className="typing-indicator">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}
    </div>
  );
}
