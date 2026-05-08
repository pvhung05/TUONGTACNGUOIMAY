"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText } from "@/components/signlearno/theme";
import { usePathname } from "next/navigation";

const FAB_SIZE = 60;
const FAB_RIGHT = 24;
/** Giữ nút dưới header ~88px */
const NAV_OFFSET = 88;
const STORAGE_KEY = "signlearno-chat-fab-bottom";
const DRAG_THRESHOLD_PX = 8;

export function ChatbotBubble() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [fabBottom, setFabBottom] = useState(24);
  const [viewportH, setViewportH] = useState(
    typeof window !== "undefined" ? window.innerHeight : 720,
  );

  type Message = {
    role: "user" | "assistant";
    content: string;
  };

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Xin chào! Mình là trợ lý SignLearn. Mình có thể giúp gì cho bạn hôm nay?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const draggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const pointerStartYRef = useRef(0);
  const bottomStartRef = useRef(24);
  const [isDraggingUi, setIsDraggingUi] = useState(false);

  const clampBottom = useCallback(
    (raw: number) => {
      const padTop = 12;
      const padBottom = 16;
      const minB = padBottom;
      const maxB = Math.max(minB, viewportH - NAV_OFFSET - FAB_SIZE - padTop);
      return Math.round(Math.min(Math.max(raw, minB), maxB));
    },
    [viewportH],
  );

  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const v = Number(saved);
        if (!Number.isNaN(v)) setFabBottom(v);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setFabBottom((prev) => clampBottom(prev));
  }, [clampBottom, viewportH]);

  const persistBottom = useCallback(
    (b: number) => {
      const next = clampBottom(b);
      setFabBottom(next);
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        /* ignore */
      }
    },
    [clampBottom],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    draggingRef.current = false;
    dragMovedRef.current = false;
    pointerStartYRef.current = e.clientY;
    bottomStartRef.current = fabBottom;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;

    const dy = e.clientY - pointerStartYRef.current;
    if (!draggingRef.current && Math.abs(dy) > DRAG_THRESHOLD_PX) {
      draggingRef.current = true;
      dragMovedRef.current = true;
      setIsDraggingUi(true);
    }

    if (draggingRef.current) {
      const next = bottomStartRef.current - dy;
      setFabBottom(clampBottom(next));
      e.preventDefault();
    }
  };

  const endPointer = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    if (draggingRef.current) {
      const dy = e.clientY - pointerStartYRef.current;
      const finalBottom = clampBottom(bottomStartRef.current - dy);
      persistBottom(finalBottom);
    } else if (!dragMovedRef.current) {
      setIsOpen((open) => !open);
    }

    draggingRef.current = false;
    dragMovedRef.current = false;
    setIsDraggingUi(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Rate limiting: 2 seconds
    const now = Date.now();
    if (now - lastSentTime < 2000) {
      return;
    }
    setLastSentTime(now);

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: input,
          history: messages.slice(-10), // send last 10 messages
          current_route: pathname,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Xin lỗi, hệ thống đang bận hoặc gặp sự cố. Vui lòng thử lại sau." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const panelBottom = fabBottom + FAB_SIZE + 16;

  return (
    <>
      {/* Chatbot Button — kéo dọc để đổi vị trí; bấm nhanh để mở/đóng */}
      <button
        type="button"
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        style={{
          position: "fixed",
          bottom: fabBottom,
          right: FAB_RIGHT,
          width: FAB_SIZE,
          height: FAB_SIZE,
          borderRadius: "50%",
          border: "none",
          background: theme.colors.green,
          color: "white",
          cursor: isDraggingUi ? "grabbing" : "grab",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(88, 204, 2, 0.3)",
          transition: isDraggingUi ? "none" : "box-shadow 200ms ease",
          zIndex: 40,
          touchAction: "none",
        }}
        onMouseEnter={(e) => {
          if (isDraggingUi) return;
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(88, 204, 2, 0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(88, 204, 2, 0.3)";
        }}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: panelBottom,
            right: FAB_RIGHT,
            width: 400,
            maxWidth: "min(400px, calc(100vw - 48px))",
            maxHeight: Math.min(600, Math.max(280, viewportH - NAV_OFFSET - panelBottom - 24)),
            borderRadius: 24,
            background: "white",
            boxShadow: "0 16px 48px rgba(0, 0, 0, 0.16)",
            display: "flex",
            flexDirection: "column",
            zIndex: 40,
            animation: "slideUp 200ms ease",
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${theme.colors.green} 0%, #4da600 100%)`,
              padding: 24,
              borderRadius: "24px 24px 0 0",
              color: "white",
            }}
          >
            <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, ...signlearnoText }}>SignLearn Assistant</h3>
            <p style={{ fontSize: 13, margin: "8px 0 0 0", opacity: 0.9, ...signlearnoText }}>
              How can we help you today?
            </p>
          </div>

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
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "80%",
                    padding: "12px 16px",
                    borderRadius: 16,
                    background: msg.role === "user" ? theme.colors.green : "white",
                    border: msg.role === "user" ? "none" : `1px solid ${theme.colors.border}`,
                    color: msg.role === "user" ? "white" : theme.colors.textStrong,
                    fontSize: 14,
                    lineHeight: "20px",
                    ...signlearnoText,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
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
                    display: "flex",
                    gap: 4,
                    alignItems: "center",
                    ...signlearnoText,
                  }}
                >
                  <span className="dot-typing" />
                  Đang suy nghĩ...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

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
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
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
              onFocus={(ev) => {
                ev.currentTarget.style.borderColor = theme.colors.green;
              }}
              onBlur={(ev) => {
                ev.currentTarget.style.borderColor = theme.colors.border;
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={isLoading}
              style={{
                padding: "10px 16px",
                borderRadius: 12,
                border: "none",
                background: isLoading ? "#A0AEC0" : theme.colors.green,
                color: "white",
                cursor: isLoading ? "not-allowed" : "pointer",
                fontWeight: 600,
                fontSize: 13,
                transition: "all 200ms ease",
                ...signlearnoText,
              }}
              onMouseEnter={(ev) => {
                if (!isLoading) ev.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(ev) => {
                if (!isLoading) ev.currentTarget.style.opacity = "1";
              }}
            >
              Gửi
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
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .dot-typing {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${theme.colors.textStrong};
          animation: blink 1.4s infinite both;
        }
      `}</style>
    </>
  );
}
