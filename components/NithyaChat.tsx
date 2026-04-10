"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  sender: "user" | "nithya";
  content: string;
  timestamp: Date;
}

type WorkflowStage = "none" | "name" | "phone" | "email" | "city" | "completed";

export default function NithyaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [workflowStage, setWorkflowStage] = useState<WorkflowStage>("none");
  const [userData, setUserData] = useState({ name: "", phone: "", email: "", city: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const INITIAL_GREETING =
    "Hello! This is Nithya from Legacy Global Bank. 👋\nHow may I assist you today? Feel free to chat here with any questions.";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addNithyaMessage(INITIAL_GREETING);
      }, 1200);
    }
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const addNithyaMessage = (content: string) => {
    setMessages((prev) => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: "nithya", content, timestamp: new Date(),
    }]);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender: "user", content, timestamp: new Date(),
    }]);
  };

  const triggerContactWorkflow = () => {
    setWorkflowStage("name");
    addNithyaMessage("I'd be happy to connect you with our team. May I know your full name please?");
  };

  const processWorkflowInput = (userInput: string) => {
    const trimmedInput = userInput.trim().toLowerCase();
    switch (workflowStage) {
      case "name":
        setUserData((prev) => ({ ...prev, name: userInput.trim() }));
        setWorkflowStage("phone");
        addNithyaMessage(`Thank you, ${userInput.trim()}. Could you please share your phone number?`);
        break;
      case "phone":
        setUserData((prev) => ({ ...prev, phone: userInput.trim() }));
        setWorkflowStage("email");
        addNithyaMessage("Got it, thank you. May I have your email address? (It's optional — you can simply reply 'skip' if you prefer)");
        break;
      case "email":
        setUserData((prev) => ({ ...prev, email: trimmedInput === "skip" ? "" : userInput.trim() }));
        setWorkflowStage("city");
        addNithyaMessage("Thank you. Lastly, which city are you based in?");
        break;
      case "city":
        setUserData((prev) => ({ ...prev, city: userInput.trim() }));
        setWorkflowStage("completed");
        addNithyaMessage(`Thank you so much, ${userData.name}.\nOur dedicated team will get back to you shortly.\n\nYou can reach us directly at:\n📞 +91 91484 26795\n✉️ contact@legacyglobalbank.com\n\nIs there anything else I can help you with today?`);
        break;
    }
  };

  const shouldTriggerWorkflow = (input: string): boolean => {
    const keywords = ["contact","phone number","email","support","talk to someone","call me","reach out","human","agent","team","callback","call back","speak to","speak with"];
    return keywords.some((k) => input.toLowerCase().includes(k));
  };

  const getAIResponse = async (userInput: string): Promise<string> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, workflowStage, userData }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error || "Failed to get response");
      }
      const data = await response.json();
      return data.reply;
    } catch (error) {
      console.error("Error getting response:", error);
      return "I apologize, but I'm having trouble connecting right now. Please try again in a moment.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    addUserMessage(input.trim());
    const userInput = input.trim();
    setInput("");

    if (workflowStage !== "none" && workflowStage !== "completed" && userInput.toLowerCase().includes("stop")) {
      setWorkflowStage("none");
      addNithyaMessage("No problem at all. Let me know how else I can assist you today.");
      return;
    }
    if (workflowStage !== "none" && workflowStage !== "completed") {
      processWorkflowInput(userInput);
      return;
    }
    if (shouldTriggerWorkflow(userInput)) {
      triggerContactWorkflow();
      return;
    }
    setIsTyping(true);
    getAIResponse(userInput).then((response) => {
      setIsTyping(false);
      addNithyaMessage(response);
    });
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Rich message renderer: detects numbered lists, bold (**text**), and emoji prefixes
  const renderMessageContent = (content: string, sender: "user" | "nithya") => {
    if (sender === "user") {
      return <p className="bubble-text">{content}</p>;
    }

    // Detect numbered step list (lines starting with "1.", "2.", etc.)
    const lines = content.split("\n");
    const stepLines: { num: string; text: string }[] = [];
    const otherLines: string[] = [];
    let hasSteps = false;

    for (const line of lines) {
      const stepMatch = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)$/) ||
                        line.match(/^(\d+)\.\s+(.+)$/);
      if (stepMatch) {
        hasSteps = true;
        if (line.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)$/)) {
          const m = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*[:\s]*(.*)$/)!;
          stepLines.push({ num: m[1], text: m[2] + (m[3] ? ": " + m[3] : "") });
        } else {
          const m = line.match(/^(\d+)\.\s+(.+)$/)!;
          stepLines.push({ num: m[1], text: m[2] });
        }
      } else {
        otherLines.push(line);
      }
    }

    // Helper: render inline bold/emoji formatting
    const renderInline = (text: string) => {
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i} style={{ fontWeight: 600, color: "var(--navy)" }}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    // Render contact info lines with special styling
    const renderContactLine = (line: string) => {
      if (line.startsWith("📞") || line.startsWith("✉️") || line.startsWith("📍")) {
        return (
          <div key={line} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 8, padding: "6px 10px", margin: "3px 0",
            fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, color: "var(--navy)",
          }}>
            {renderInline(line)}
          </div>
        );
      }
      return null;
    };

    if (hasSteps && stepLines.length >= 3) {
      // Render preamble text (non-step lines before steps)
      const preLines = otherLines.filter(l => l.trim()).filter((_, i) => i < otherLines.findIndex(l => l.trim() === "") || true);
      // Split into pre-step and post-step text
      const firstStepIdx = lines.findIndex(l => /^\d+\./.test(l));
      const preText = lines.slice(0, firstStepIdx).filter(l => l.trim()).join(" ");
      const postLines = lines.slice(firstStepIdx + stepLines.length).filter(l => l.trim());

      const stepIcons = ["🌐", "🏦", "📝", "📎", "✅", "📧", "💳"];

      return (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {preText && (
            <p style={{ fontSize: 13.5, lineHeight: 1.6, margin: "0 0 10px", color: "var(--navy)" }}>
              {renderInline(preText)}
            </p>
          )}
          <div style={{
            background: "linear-gradient(135deg, rgba(10,22,40,0.03) 0%, rgba(201,168,76,0.06) 100%)",
            border: "1px solid rgba(201,168,76,0.2)",
            borderRadius: 12, overflow: "hidden", marginBottom: postLines.length ? 10 : 0,
          }}>
            <div style={{
              background: "linear-gradient(135deg, var(--navy), var(--navy-light))",
              padding: "8px 12px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ fontSize: 12 }}>🏛️</span>
              <span style={{ color: "var(--gold-light)", fontSize: 11, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Account Opening Steps
              </span>
            </div>
            {stepLines.map((step, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "9px 12px",
                borderBottom: i < stepLines.length - 1 ? "1px solid rgba(201,168,76,0.1)" : "none",
                background: i % 2 === 0 ? "transparent" : "rgba(201,168,76,0.02)",
              }}>
                <div style={{
                  minWidth: 24, height: 24, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--navy), var(--navy-light))",
                  border: "1px solid rgba(201,168,76,0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 700, color: "var(--gold-light)",
                  flexShrink: 0, marginTop: 1,
                }}>
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12 }}>{stepIcons[i] || "▸"} </span>
                  <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--navy)" }}>
                    {renderInline(step.text)}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {postLines.map((line, i) => {
            const contactEl = renderContactLine(line);
            if (contactEl) return contactEl;
            return (
              <p key={i} style={{ fontSize: 13, lineHeight: 1.6, margin: "4px 0", color: "var(--navy)" }}>
                {renderInline(line)}
              </p>
            );
          })}
        </div>
      );
    }

    // Default: render with inline formatting + contact card lines
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {lines.map((line, i) => {
          if (!line.trim()) return <br key={i} />;
          const contactEl = renderContactLine(line);
          if (contactEl) return contactEl;
          return (
            <p key={i} style={{ fontSize: 13.5, lineHeight: 1.6, margin: "2px 0", color: "var(--navy)" }}>
              {renderInline(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --navy: #0a1628;
          --navy-mid: #122040;
          --navy-light: #1a2f58;
          --gold: #c9a84c;
          --gold-light: #e2c47a;
          --gold-pale: #f5e6c0;
          --cream: #fdf8f0;
          --text-light: #8a9bb5;
        }

        .chat-widget * { box-sizing: border-box; }

        .chat-toggle {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          box-shadow: 0 8px 32px rgba(10,22,40,0.45), 0 0 0 1px rgba(201,168,76,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
        }
        .chat-toggle:hover {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 12px 40px rgba(10,22,40,0.55), 0 0 0 2px rgba(201,168,76,0.5);
        }
        .chat-toggle-ring {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.25);
          animation: pulse-ring 2.5s ease-out infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.35); opacity: 0; }
        }

        .chat-window {
          position: fixed;
          bottom: 108px;
          right: 28px;
          z-index: 9998;
          width: 400px;
          max-width: calc(100vw - 2rem);
          height: 580px;
          max-height: calc(100vh - 140px);
          background: var(--cream);
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 80px rgba(10,22,40,0.35), 0 0 0 1px rgba(201,168,76,0.2);
          animation: slideUp 0.4s cubic-bezier(0.34,1.4,0.64,1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .chat-header {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          padding: 18px 20px 16px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .chat-header::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 120px; height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%);
        }
        .chat-header::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent);
        }

        .avatar-wrap {
          position: relative;
          width: 46px; height: 46px; flex-shrink: 0;
        }
        .avatar-circle {
          width: 46px; height: 46px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08));
          border: 1.5px solid rgba(201,168,76,0.5);
          display: flex; align-items: center; justify-content: center;
          font-size: 20px;
        }
        .online-dot {
          position: absolute;
          bottom: 1px; right: 1px;
          width: 11px; height: 11px;
          border-radius: 50%;
          background: #3ecf8e;
          border: 2px solid var(--navy);
        }

        .header-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          font-weight: 600;
          color: #fff;
          letter-spacing: 0.02em;
          line-height: 1.2;
        }
        .header-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 300;
          color: var(--gold-light);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 2px;
        }
        .header-badge {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          font-weight: 400;
          color: var(--gold);
          background: rgba(201,168,76,0.12);
          border: 1px solid rgba(201,168,76,0.25);
          border-radius: 20px;
          padding: 3px 9px;
          letter-spacing: 0.05em;
        }

        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 20px 16px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          background: var(--cream);
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(201,168,76,0.04) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(10,22,40,0.03) 0%, transparent 50%);
        }
        .messages-area::-webkit-scrollbar { width: 4px; }
        .messages-area::-webkit-scrollbar-track { background: transparent; }
        .messages-area::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.25); border-radius: 4px; }

        .msg-row {
          display: flex;
          gap: 10px;
          animation: msgIn 0.3s ease;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .msg-row.user { justify-content: flex-end; }
        .msg-row.nithya { justify-content: flex-start; }

        .msg-avatar {
          width: 30px; height: 30px; flex-shrink: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          border: 1px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px;
          align-self: flex-end;
        }

        .bubble {
          max-width: 75%;
          padding: 11px 15px;
          border-radius: 18px;
          position: relative;
        }
        .bubble.nithya {
          background: #fff;
          border: 1px solid rgba(201,168,76,0.18);
          border-bottom-left-radius: 5px;
          box-shadow: 0 2px 12px rgba(10,22,40,0.07);
        }
        .bubble.user {
          background: linear-gradient(135deg, var(--navy) 0%, var(--navy-light) 100%);
          border-bottom-right-radius: 5px;
          box-shadow: 0 2px 12px rgba(10,22,40,0.2);
        }
        .bubble-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          line-height: 1.6;
          white-space: pre-wrap;
          margin: 0;
        }
        .bubble.nithya .bubble-text { color: var(--navy); }
        .bubble.user .bubble-text { color: #fff; }
        .bubble-time {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          margin-top: 5px;
          display: block;
          letter-spacing: 0.03em;
        }
        .bubble.nithya .bubble-time { color: var(--text-light); }
        .bubble.user .bubble-time { color: rgba(255,255,255,0.5); text-align: right; }

        .typing-indicator {
          display: flex;
          gap: 10px;
          align-items: flex-end;
          animation: msgIn 0.3s ease;
        }
        .typing-bubble {
          background: #fff;
          border: 1px solid rgba(201,168,76,0.18);
          border-radius: 18px;
          border-bottom-left-radius: 5px;
          padding: 13px 16px;
          display: flex;
          gap: 5px;
          align-items: center;
          box-shadow: 0 2px 12px rgba(10,22,40,0.07);
        }
        .typing-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--gold);
          animation: typingBounce 1.2s ease-in-out infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.18s; }
        .typing-dot:nth-child(3) { animation-delay: 0.36s; }
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        .divider-date {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 4px 0;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(201,168,76,0.15); }
        .divider-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: var(--text-light);
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .input-area {
          padding: 14px 16px 16px;
          background: #fff;
          border-top: 1px solid rgba(201,168,76,0.15);
          flex-shrink: 0;
        }
        .input-row {
          display: flex;
          gap: 10px;
          align-items: center;
          background: var(--cream);
          border: 1.5px solid rgba(201,168,76,0.25);
          border-radius: 14px;
          padding: 6px 6px 6px 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-row:focus-within {
          border-color: rgba(201,168,76,0.6);
          box-shadow: 0 0 0 3px rgba(201,168,76,0.08);
        }
        .chat-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px;
          color: var(--navy);
          outline: none;
          padding: 6px 0;
        }
        .chat-input::placeholder { color: var(--text-light); }
        .send-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, var(--navy), var(--navy-light));
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--navy-light), var(--navy));
          box-shadow: 0 4px 16px rgba(10,22,40,0.3);
          transform: translateY(-1px);
        }
        .send-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .footer-brand {
          text-align: center;
          padding-top: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 10px;
          color: var(--text-light);
          letter-spacing: 0.06em;
        }
        .footer-brand span { color: var(--gold); }
      `}</style>

      <div className="chat-widget">
        {/* Toggle Button */}
        <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)} aria-label="Chat with Nithya">
          <div className="chat-toggle-ring" />
          {isOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>

        {/* Chat Window */}
        {isOpen && (
          <div className="chat-window">
            {/* Header */}
            <div className="chat-header">
              <div style={{ display: "flex", alignItems: "center", gap: 14, position: "relative", zIndex: 1 }}>
                <div className="avatar-wrap">
                  <div className="avatar-circle">👩‍💼</div>
                  <div className="online-dot" />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="header-name">Nithya</div>
                  <div className="header-sub">Legacy Global Bank</div>
                </div>
                <div className="header-badge">● Online</div>
              </div>
            </div>

            {/* Messages */}
            <div className="messages-area">
              <div className="divider-date">
                <div className="divider-line" />
                <span className="divider-text">Today</span>
                <div className="divider-line" />
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`msg-row ${msg.sender}`}>
                  {msg.sender === "nithya" && (
                    <div className="msg-avatar">👩‍💼</div>
                  )}
                  <div className={`bubble ${msg.sender}`}>
                    <div className="bubble-text">{renderMessageContent(msg.content, msg.sender)}</div>
                    <span className="bubble-time">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              ))}

              {(isTyping || isLoading) && (
                <div className="typing-indicator">
                  <div className="msg-avatar">👩‍💼</div>
                  <div className="typing-bubble">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="input-area">
              <form onSubmit={handleSendMessage}>
                <div className="input-row">
                  <input
                    ref={inputRef}
                    className="chat-input"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={isLoading ? "Nithya is responding..." : "Ask me anything…"}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button type="submit" className="send-btn" disabled={isLoading || !input.trim()}>
                    {isLoading ? (
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.8)" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.9)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
              <div className="footer-brand">Powered by <span>Legacy Global Bank</span> · Secure & Encrypted</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}