import { useEffect, useRef, useState, useMemo } from "react";
import axios from "axios";
import { FaRobot, FaPaperPlane, FaEllipsisV } from "react-icons/fa";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

function ChatBox() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [particlesInit, setParticlesInit] = useState(false);
  const endRef = useRef(null);

  // Initialize particles
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setParticlesInit(true));
  }, []);

  const particlesOptions = useMemo(() => ({
    background: { color: { value: "#0b0e14" } },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" } },
      modes: { grab: { distance: 150, links: { opacity: 0.5 } } },
    },
    particles: {
      color: { value: "#cfe8ff" },
      links: { color: "#9fd1ff", distance: 140, enable: true, opacity: 0.15, width: 1 },
      move: { enable: true, speed: 1.2, outModes: { default: "out" } },
      number: { density: { enable: true, area: 900 }, value: 60 },
      opacity: { value: 0.45 },
      shape: { type: "circle" },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  }), []);

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = { 
      sender: "user", 
      text: message.trim(), 
      time: new Date().toISOString() 
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = message.trim();
    setMessage("");
    setLoading(true);

    try {
      const API_URL = "https://sannirajput.onrender.com/api/chat";

      const res = await axios.post(API_URL, { 
        message: currentMessage 
      });

      const botMessage = { 
        sender: "bot", 
        text: res.data.reply || res.data.message || "Sorry, I couldn't process that.", 
        time: new Date().toISOString() 
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat API Error:", err);
      const errorMsg = err.response?.data?.message || "Server error. Please try again.";
      
      setMessages((prev) => [...prev, { 
        sender: "bot", 
        text: `❌ ${errorMsg}`, 
        time: new Date().toISOString() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso) => {
    try {
      return new Date(iso).toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-vh-100 position-relative bg-dark">
      {/* Particle background */}
      {particlesInit && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 0 }}>
          <Particles id="tsparticles" options={particlesOptions} />
        </div>
      )}

      {/* Chat container */}
      <div className="container py-5" style={{ zIndex: 1 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card border-0 shadow-lg overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.92), rgba(245,249,255,0.85))",
                backdropFilter: "blur(10px)"
              }}
            >
              {/* Header */}
              <div className="card-header d-flex align-items-center justify-content-between border-0 py-3 px-4 bg-transparent">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center justify-content-center rounded-circle bg-primary text-white me-3" 
                       style={{ width: 48, height: 48 }}>
                    <FaRobot size={20} />
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">AI Assistant</h6>
                    <small className="text-muted">Online • Powered by Neural Mesh</small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className={`badge ${loading ? "bg-warning text-dark" : "bg-success"}`}>
                    {loading ? "Thinking..." : "Ready"}
                  </span>
                </div>
              </div>

              {/* Messages Area */}
              <div className="card-body p-3" style={{ background: "transparent", minHeight: "60vh" }}>
                <div className="d-flex flex-column gap-3">
                  {messages.length === 0 && (
                    <div className="text-center text-muted py-5 my-4">
                      <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white bg-opacity-10 mb-3" 
                           style={{ width: 72, height: 72 }}>
                        <FaRobot size={36} className="opacity-25" />
                      </div>
                      <p className="mb-0">Start chatting with AI...</p>
                    </div>
                  )}

                  {messages.map((msg, idx) => {
                    const isUser = msg.sender === "user";
                    return (
                      <div key={idx} className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"}`}>
                        {!isUser && (
                          <div className="me-2 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white shadow-sm" 
                               style={{ width: 36, height: 36 }}>
                            <small className="fw-bold">AI</small>
                          </div>
                        )}

                        <div className={`px-3 py-2 shadow-sm ${isUser ? "text-white" : "text-dark"}`}
                          style={{
                            background: isUser ? "linear-gradient(90deg,#4f46e5,#06b6d4)" : "#ffffff",
                            borderRadius: 16,
                            maxWidth: "78%",
                            border: isUser ? "none" : "1px solid rgba(0,0,0,0.08)"
                          }}>
                          <div style={{ whiteSpace: "pre-wrap", fontSize: 15.5, lineHeight: 1.5 }}>
                            {msg.text}
                          </div>
                          <div className={`mt-1 text-end ${isUser ? "text-white-50" : "text-muted"}`} style={{ fontSize: 11 }}>
                            {formatTime(msg.time)}
                          </div>
                        </div>

                        {isUser && (
                          <div className="ms-2 d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white shadow-sm" 
                               style={{ width: 36, height: 36 }}>
                            <small className="fw-bold">YOU</small>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="d-flex justify-content-start">
                      <div className="px-3 py-2 bg-white rounded-3 shadow-sm">
                        AI is thinking...
                      </div>
                    </div>
                  )}

                  <div ref={endRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="card-footer bg-transparent border-0 py-3 px-3">
                <form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                  <div className="input-group flex-grow-1">
                    <textarea
                      className="form-control border-0 shadow-sm"
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                      disabled={loading}
                      style={{ resize: "none", background: "rgba(250,250,255,0.95)" }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="btn btn-primary d-flex align-items-center justify-content-center shadow-sm" 
                    disabled={loading || !message.trim()}
                    style={{ width: 48, height: 48, borderRadius: 12 }}
                  >
                    <FaPaperPlane size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;