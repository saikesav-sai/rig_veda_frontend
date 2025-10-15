import { useState } from "react";
import { API_BASE } from "../config";

// 🪷 Vedic Color Palette & Sacred Styling
const VEDIC_COLORS = {
  deepIndigo: '#1e1b4b',     // Primary sacred color
  softGold: '#f59e0b',       // Divine accent
  ivoryWhite: '#fefce8',     // Pure background
  mutedViolet: '#8b5cf6',    // Gentle accent
  cosmicBlue: '#3730a3',     // Depth and wisdom
  sacredOrange: '#fb923c',   // Fire of knowledge
  etherealPurple: '#a855f7', // Spiritual elevation
  earthyBeige: '#fef3c7',    // Grounding
  divineGlow: 'rgba(245, 158, 11, 0.1)' // Subtle radiance
};

const SACRED_GRADIENTS = {
  cosmic: `linear-gradient(135deg, ${VEDIC_COLORS.deepIndigo} 0%, ${VEDIC_COLORS.cosmicBlue} 50%, ${VEDIC_COLORS.mutedViolet} 100%)`,
  divine: `linear-gradient(135deg, ${VEDIC_COLORS.softGold} 0%, ${VEDIC_COLORS.sacredOrange} 100%)`,
  pure: `linear-gradient(135deg, ${VEDIC_COLORS.ivoryWhite} 0%, #ffffff 100%)`,
  wisdom: `linear-gradient(135deg, ${VEDIC_COLORS.etherealPurple} 0%, ${VEDIC_COLORS.mutedViolet} 100%)`
};

export default function ChatBot() {
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🪷 Sacred Response Renderer
  const renderChatResponse = (data) => {
    if (typeof data === "string") {
      return (
        <div style={{ 
          fontFamily: "'Crimson Pro', 'Noto Serif', serif",
          lineHeight: "1.7",
          color: VEDIC_COLORS.deepIndigo
        }}>
          {data}
        </div>
      );
    }

  const { answer, slokas } = data;
    const intentUsed = answer?.intent_used || "general";
    const config = getIntentConfig(intentUsed);

    return (
      <div style={{ 
        maxWidth: "100%",
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Sacred Intent Badge */}
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          background: SACRED_GRADIENTS.divine,
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: "600",
          marginBottom: "1rem",
          boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
          border: `1px solid ${VEDIC_COLORS.softGold}30`
        }}>
          <span>{config.symbol}</span>
          <span>{config.title}</span>
        </div>


        {/* Sacred Verses */}
        {slokas && slokas.length > 0 && (
          <div style={{ marginTop: "1.5rem" }}>
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              justifyContent: "center"
            }}>
              <div style={{
                width: "30px",
                height: "2px",
                background: SACRED_GRADIENTS.divine
              }} />
              <span style={{
                fontSize: "1.1rem", 
                fontWeight: "600", 
                color: VEDIC_COLORS.deepIndigo,
                fontFamily: "'Crimson Pro', serif"
              }}>
                🪷 Sacred Verses ({slokas.length})
              </span>
              <div style={{
                width: "30px",
                height: "2px",
                background: SACRED_GRADIENTS.divine
              }} />
            </div>
            {slokas.slice(0, 2).map((sloka, idx) => (
              <div key={idx} style={{
                background: SACRED_GRADIENTS.pure,
                border: `1px solid ${VEDIC_COLORS.softGold}30`,
                borderRadius: "12px",
                padding: "1rem",
                marginBottom: "0.75rem",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "40px",
                  height: "40px",
                  background: `${VEDIC_COLORS.softGold}10`,
                  borderRadius: "0 12px 0 40px"
                }} />
                <div style={{ 
                  fontWeight: "600", 
                  color: VEDIC_COLORS.cosmicBlue, 
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem"
                }}>
                  🕉️ {sloka.location}
                </div>
                <div className="sanskrit-text" style={{
                  fontSize: "1rem",
                  fontStyle: "italic",
                  color: VEDIC_COLORS.mutedViolet,
                  marginBottom: "0.5rem",
                  fontFamily: "'Noto Serif Devanagari', serif",
                  lineHeight: "1.8",
                  textAlign: "center",
                  padding: "0.5rem 0"
                }}>
                  {sloka.sanskrit}
                </div>
                <div style={{ 
                  lineHeight: "1.6",
                  color: VEDIC_COLORS.deepIndigo,
                  fontSize: "0.95rem",
                  fontFamily: "'Crimson Pro', serif"
                }}>
                  {sloka.meaning}
                </div>
              </div>
            ))}
            {slokas.length > 2 && (
              <div style={{ 
                fontSize: "0.85rem", 
                color: VEDIC_COLORS.mutedViolet, 
                fontStyle: "italic",
                textAlign: "center",
                marginTop: "0.5rem"
              }}>
                ✨ ... and {slokas.length - 2} more sacred verses await
              </div>
            )}
          </div>
        )}
        {/* Sacred Summary */}
        {answer?.summary && (
          <div style={{
            background: SACRED_GRADIENTS.pure,
            border: `2px solid ${VEDIC_COLORS.softGold}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Divine Glow Effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.divine
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>📜</span>
              <strong style={{ 
                color: VEDIC_COLORS.cosmicBlue,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Sacred Summary</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem"
            }}>
              {answer.summary}
            </div>
          </div>
        )}

        {/* Divine Interpretation */}
        {answer?.interpretation && (
          <div style={{
            background: "linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%)",
            border: `2px solid ${VEDIC_COLORS.mutedViolet}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.wisdom
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>🔮</span>
              <strong style={{ 
                color: VEDIC_COLORS.mutedViolet,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Divine Interpretation</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem"
            }}>
              {answer.interpretation}
            </div>
          </div>
        )}

        {/* Cosmic Reflection */}
        {answer?.reflection && (
          <div style={{
            background: "linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)",
            border: `2px solid ${VEDIC_COLORS.sacredOrange}40`,
            borderRadius: "16px",
            padding: "1.25rem",
            marginBottom: "1rem",
            position: "relative"
          }}>
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: SACRED_GRADIENTS.divine
            }} />
            <div style={{ 
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem"
            }}>
              <span style={{ fontSize: "1.2rem" }}>🌟</span>
              <strong style={{ 
                color: VEDIC_COLORS.sacredOrange,
                fontFamily: "'Crimson Pro', serif",
                fontSize: "1.1rem"
              }}>Cosmic Reflection</strong>
            </div>
            <div style={{ 
              lineHeight: "1.7", 
              color: VEDIC_COLORS.deepIndigo,
              fontFamily: "'Crimson Pro', serif",
              fontSize: "1.05rem",
              fontStyle: "italic"
            }}>
              {answer.reflection}
            </div>
          </div>
        )}

        
      </div>
    );
  };

  // 🕉️ Sacred Intent Styling
  const getIntentConfig = (intent) => {
    switch (intent) {
      case 'semantic_search': 
        return { 
          color: VEDIC_COLORS.cosmicBlue, 
          bg: VEDIC_COLORS.divineGlow,
          icon: '🔍', 
          symbol: '🌌',
          title: 'Cosmic Search'
        };
      case 'verse_lookup': 
        return { 
          color: VEDIC_COLORS.sacredOrange, 
          bg: VEDIC_COLORS.earthyBeige,
          icon: '📿', 
          symbol: '🪷',
          title: 'Sacred Verse'
        };
      case 'explanation': 
        return { 
          color: VEDIC_COLORS.etherealPurple, 
          bg: '#f3e8ff',
          icon: '💫', 
          symbol: '🕉️',
          title: 'Divine Wisdom'
        };
      case 'general': 
        return { 
          color: VEDIC_COLORS.mutedViolet, 
          bg: VEDIC_COLORS.ivoryWhite,
          icon: '🙏', 
          symbol: '✨',
          title: 'Sacred Dialogue'
        };
      default: 
        return { 
          color: VEDIC_COLORS.deepIndigo, 
          bg: VEDIC_COLORS.ivoryWhite,
          icon: '🙏', 
          symbol: '✨',
          title: 'Sacred Dialogue'
        };
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setChatLoading(true);
    setError(null);

    try {
      const resp = await fetch(`${API_BASE.replace(/\/$/, "")}/chat/intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        throw new Error(data.error || "Chat request failed");
      }

      setChatMessages((prev) => [
        ...prev,
        { type: "assistant", data: data },
      ]);
    } catch (err) {
      setError("Failed to get response from chat API, Ask Relevant Question");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div style={{
      background: SACRED_GRADIENTS.pure,
      borderRadius: "24px",
      overflow: "hidden",
      boxShadow: "0 20px 60px rgba(30, 27, 75, 0.15)",
      border: `2px solid ${VEDIC_COLORS.softGold}20`
    }}>
      {/* 🕉️ Sacred Header */}
      <div style={{
        background: SACRED_GRADIENTS.cosmic,
        padding: "2rem 1.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Cosmic Background Pattern */}
        <div style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: `radial-gradient(circle, ${VEDIC_COLORS.softGold}10 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          opacity: 0.3,
          animation: "cosmicDrift 60s linear infinite"
        }} />
        
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.5))"
          }}>🕉️</div>
          <h2 style={{ 
            color: "white",
            marginBottom: "0.5rem", 
            fontWeight: "300",
            fontSize: "1.8rem",
            fontFamily: "'Crimson Pro', serif",
            letterSpacing: "2px",
            textShadow: "0 2px 20px rgba(0,0,0,0.3)"
          }}>
            Sacred Wisdom Guide
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "1rem",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "300",
            letterSpacing: "1px"
          }}>
            Discover the Eternal Wisdom of the Rig Veda
          </p>
        </div>
      </div>

      {/* 🪷 Sacred Chat Area */}
      <div style={{
        padding: "2rem",
        minHeight: "450px",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        background: "linear-gradient(135deg, #fefce8 0%, #ffffff 100%)"
      }}>
        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "0.5rem",
          scrollbarWidth: "thin",
          scrollbarColor: `${VEDIC_COLORS.softGold} transparent`
        }}>
          {chatMessages.length === 0 && (
            <div style={{ 
              textAlign: "center", 
              marginTop: "3rem",
              padding: "3rem 2rem",
              background: SACRED_GRADIENTS.pure,
              borderRadius: "20px",
              border: `2px dashed ${VEDIC_COLORS.softGold}40`,
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Sacred Glow Effect */}
              <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "150px",
                height: "150px",
                background: `radial-gradient(circle, ${VEDIC_COLORS.softGold}10, transparent 70%)`,
                borderRadius: "50%"
              }} />
              
              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ 
                  fontSize: "3rem", 
                  marginBottom: "1rem",
                  filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.3))"
                }}>🪷</div>
                <div style={{ 
                  fontWeight: "600", 
                  marginBottom: "1rem",
                  color: VEDIC_COLORS.deepIndigo,
                  fontSize: "1.3rem",
                  fontFamily: "'Crimson Pro', serif"
                }}>
                  Welcome, Seeker of Wisdom
                </div>
                <div style={{ 
                  fontSize: "1rem",
                  color: VEDIC_COLORS.mutedViolet,
                  fontFamily: "'Inter', sans-serif",
                  lineHeight: "1.6"
                }}>
                  Ask about sacred hymns, cosmic themes, or divine concepts...
                  <br />
                  <span style={{ fontSize: "0.9rem", fontStyle: "italic" }}>
                    "What is Agni's cosmic role?" • "Explain the creation hymn 10.129"
                  </span>
                </div>
              </div>
            </div>
          )}

          {chatMessages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: m.type === "user" ? "flex-end" : "flex-start",
                marginBottom: "1.5rem",
                animation: "messageAppear 0.5s ease-out"
              }}
            >
              <div
                style={{
                  background: m.type === "user" 
                    ? SACRED_GRADIENTS.cosmic
                    : "white",
                  color: m.type === "user" ? "white" : VEDIC_COLORS.deepIndigo,
                  border: m.type === "user" 
                    ? `2px solid ${VEDIC_COLORS.softGold}40`
                    : `2px solid ${VEDIC_COLORS.softGold}20`,
                  padding: "1rem 1.5rem",
                  borderRadius: m.type === "user" 
                    ? "24px 24px 6px 24px" 
                    : "24px 24px 24px 6px",
                  maxWidth: "85%",
                  whiteSpace: "pre-wrap",
                  boxShadow: m.type === "user"
                    ? "0 8px 32px rgba(30, 27, 75, 0.3)"
                    : "0 8px 32px rgba(245, 158, 11, 0.1)",
                  fontFamily: m.type === "user" 
                    ? "'Inter', sans-serif" 
                    : "'Crimson Pro', serif",
                  fontSize: m.type === "user" ? "1rem" : "1.05rem",
                  lineHeight: "1.6",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Message Glow Effect */}
                {m.type === "assistant" && (
                  <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: SACRED_GRADIENTS.divine
                  }} />
                )}
                
                <div style={{ position: "relative", zIndex: 2 }}>
                  {m.type === "user" ? m.text : renderChatResponse(m.data || m.text)}
                </div>
              </div>
            </div>
          ))}
          
          {/* Loading Indicator */}
          {chatLoading && (
            <div style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "1.5rem"
            }}>
              <div style={{
                background: "white",
                border: `2px solid ${VEDIC_COLORS.softGold}20`,
                padding: "1rem 1.5rem",
                borderRadius: "24px 24px 24px 6px",
                boxShadow: "0 8px 32px rgba(245, 158, 11, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: VEDIC_COLORS.softGold,
                  animation: "pulse 1.5s ease-in-out infinite"
                }} />
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: VEDIC_COLORS.mutedViolet,
                  animation: "pulse 1.5s ease-in-out infinite 0.2s"
                }} />
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: VEDIC_COLORS.sacredOrange,
                  animation: "pulse 1.5s ease-in-out infinite 0.4s"
                }} />
                <span style={{
                  color: VEDIC_COLORS.mutedViolet,
                  fontStyle: "italic",
                  fontSize: "0.9rem"
                }}>
                  Channeling wisdom...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div style={{ 
            color: VEDIC_COLORS.sacredOrange,
            textAlign: "center",
            background: "#fef2f2",
            border: `2px solid ${VEDIC_COLORS.sacredOrange}40`,
            borderRadius: "12px",
            padding: "1rem",
            fontFamily: "'Inter', sans-serif"
          }}>
            🔥 {error}
          </div>
        )}

        {/* 🙏 Sacred Input Area */}
        <div style={{ 
          display: "flex", 
          gap: "1rem",
          padding: "1rem",
          background: "white",
          borderRadius: "20px",
          border: `2px solid ${VEDIC_COLORS.softGold}30`,
          boxShadow: "0 8px 32px rgba(245, 158, 11, 0.1)",
          position: "relative",
          overflow: "hidden"
        }}>
          {/* Input Glow Effect */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: SACRED_GRADIENTS.divine,
            opacity: chatInput.trim() ? 1 : 0,
            transition: "opacity 0.3s ease"
          }} />
          
          <div style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: "0.75rem"
          }}>
            <span style={{
              fontSize: "1.2rem",
              filter: "drop-shadow(0 0 8px rgba(245, 158, 11, 0.3))"
            }}>
              🙏
            </span>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSend()}
              placeholder="Ask about hymns, themes, or cosmic concepts..."
              style={{ 
                flex: 1,
                padding: "0.75rem 0",
                border: "none",
                outline: "none",
                fontSize: "1rem",
                fontFamily: "'Inter', sans-serif",
                color: VEDIC_COLORS.deepIndigo,
                background: "transparent",
                '::placeholder': {
                  color: VEDIC_COLORS.mutedViolet,
                  fontStyle: "italic"
                }
              }}
            />
          </div>
          
          <button
            onClick={handleChatSend}
            disabled={chatLoading || !chatInput.trim()}
            style={{
              background: (chatLoading || !chatInput.trim()) 
                ? "#d1d5db" 
                : SACRED_GRADIENTS.divine,
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "0.875rem 1.25rem",
              cursor: (chatLoading || !chatInput.trim()) ? "not-allowed" : "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              boxShadow: (chatLoading || !chatInput.trim()) 
                ? "none" 
                : "0 4px 16px rgba(245, 158, 11, 0.4)",
              transform: chatLoading ? "scale(0.95)" : "scale(1)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem"
            }}
          >
            {chatLoading ? (
              <>
                <span>🔄</span>
                <span>Seeking...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Send</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
