"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chatbot Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          border: "none",
          background: theme.colors.green,
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(88, 204, 2, 0.3)",
          transition: "all 200ms ease",
          zIndex: 40,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(88, 204, 2, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(88, 204, 2, 0.3)";
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 24,
            width: 400,
            maxHeight: 600,
            borderRadius: 24,
            background: "white",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            animation: "slideUp 200ms ease",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.green} 0%, #4da600 100%)`,
              padding: 24,
              borderRadius: "24px 24px 0 0",
              color: "white",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, ...signlearnoText }}>
              SignLearn Assistant
            </h3>
            <p style={{ fontSize: 13, margin: "8px 0 0 0", opacity: 0.9, ...signlearnoText }}>
              How can we help you today?
            </p>
          </div>

          {/* Chat Area */}
          <div
            style={{
              flex: 1,
              padding: 24,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 16,
              background: "#F9FAFB",
            }}
          >
            {/* Bot Message */}
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: 16,
                  background: "white",
                  border: `1px solid ${theme.colors.border}`,
                  color: theme.colors.textStrong,
                  fontSize: 14,
                  lineHeight: "20px",
                  ...signlearnoText,
                }}
              >
                👋 Welcome! I'm your SignLearn assistant. How can I help you learn sign language today?
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: 16,
              borderTop: `1px solid ${theme.colors.border}`,
              display: "flex",
              gap: 8,
            }}
          >
            <input
              type="text"
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 12,
                border: `1px solid ${theme.colors.border}`,
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                ...signlearnoText,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = theme.colors.green;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = theme.colors.border;
              }}
            />
            <button
              type="button"
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: theme.colors.green,
                color: "white",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 200ms ease",
                ...signlearnoText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
