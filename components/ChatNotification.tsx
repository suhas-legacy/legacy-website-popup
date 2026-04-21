"use client";

import { useState, useEffect } from "react";
import { BotMessageSquare } from "lucide-react";

export default function ChatNotification() {
  const [hasNewMessage, setHasNewMessage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasNewMessage(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleOpenChat = () => {
    setHasNewMessage(false);
    // Add chat opening logic here
  };

  return (
    <>
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4);
          }
          50% {
            box-shadow: 0 6px 24px rgba(201, 168, 76, 0.5);
          }
        }

        .floating-chat-icon {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9997;
          
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(201, 168, 76, 0.4);
          transition: all 0.3s;
          animation: bounce-subtle 2s ease-in-out infinite;
          padding: 14px;
        }

        .floating-chat-icon:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 24px rgba(201, 168, 76, 0.5);
        }

        .message-tooltip {
          position: fixed;
          bottom: 95px;
          right: 28px;
          z-index: 9997;
          background: linear-gradient(135deg, #0a1628 0%, #1a2f58 100%);
          border-radius: 12px;
          padding: 12px 16px;
          max-width: 200px;
          box-shadow: 0 4px 20px rgba(10, 22, 40, 0.45), 0 0 0 1px rgba(201, 168, 76, 0.3);
          animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .message-tooltip p {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          margin: 0;
          line-height: 1.4;
        }

        .message-tooltip::after {
          content: '';
          position: absolute;
          bottom: -8px;
          right: 20px;
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid #1a2f58;
        }

        @media (max-width: 480px) {
          .floating-chat-icon {
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
          }

          .message-tooltip {
            bottom: 80px;
            right: 20px;
            max-width: 180px;
          }
        }
      `}</style>

      {hasNewMessage && (
        <div className="message-tooltip">
          <p>You have a new message! Click here to chat.</p>
        </div>
      )}

      <div className="floating-chat-icon" onClick={handleOpenChat}>
        <BotMessageSquare size={28} color="#0a1628" strokeWidth={2} />
      </div>
    </>
  );
}
