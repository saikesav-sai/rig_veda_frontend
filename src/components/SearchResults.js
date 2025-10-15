import { useRef, useState } from "react";
import { FaArrowLeft, FaPause, FaPlay } from "react-icons/fa";
import { API_BASE } from "../config";

export default function SearchResults({ results, onBack }) {
  const [playingAudio, setPlayingAudio] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const audioRefs = useRef({});

  if (!results) return null;

  // Handle both old ChatBot format and new semantic search format
  const { answer, slokas, intents, verses, summary, query, searchMetadata } = results;
  
  // Use verses if slokas is not available (semantic search format)
  const displayVerses = slokas || verses || [];
  
  // Get intent from various sources
  const intentUsed = answer?.intent_used || results.intent || "semantic_search";
  
  // Create a summary for display if not in answer object
  const displaySummary = answer?.summary || summary || `Found ${displayVerses.length} relevant verses`;

  const getIntentConfig = (intent) => {
    switch (intent) {
      case 'semantic_search':
        return { 
          color: '#6366f1', 
          bg: '#f0f9ff', 
          border: '#0ea5e9',
          icon: '🔍',
          title: 'Semantic Search Results'
        };
      case 'verse_lookup':
        return { 
          color: '#059669', 
          bg: '#f0fdf4', 
          border: '#22c55e',
          icon: '📖',
          title: 'Verse Lookup'
        };
      case 'explanation':
        return { 
          color: '#dc2626', 
          bg: '#fef2f2', 
          border: '#f87171',
          icon: '💡',
          title: 'Explanation'
        };
      default:
        return { 
          color: '#6b7280', 
          bg: '#f9fafb', 
          border: '#d1d5db',
          icon: '💬',
          title: 'Search Results'
        };
    }
  };

  const config = getIntentConfig(intentUsed);

  // Audio control functions
  const getAudioUrl = (location) => {
    if (!location) return null;
    // Parse location format: "01.001.01" -> mandala=1, hymn=1, stanza=1
    const parts = location.split('.');
    if (parts.length !== 3) return null;
    
    const mandala = parseInt(parts[0]);
    const hymn = parseInt(parts[1]);
    const stanza = parseInt(parts[2]);
    
    return `${API_BASE}/audio/${mandala}/${hymn}/${stanza}`;
  };

  const toggleAudio = async (verse) => {
    const audioId = verse.location;
    const audioUrl = getAudioUrl(verse.location);
    
    if (!audioUrl) {
      setAudioError(`Audio not available for ${verse.location}`);
      return;
    }

    // If this audio is currently playing, pause it
    if (playingAudio === audioId) {
      if (audioRefs.current[audioId]) {
        audioRefs.current[audioId].pause();
        setPlayingAudio(null);
      }
      return;
    }

    // Stop any currently playing audio
    if (playingAudio && audioRefs.current[playingAudio]) {
      audioRefs.current[playingAudio].pause();
    }

    setAudioLoading(audioId);
    setAudioError(null);

    try {
      // Create audio element if it doesn't exist
      if (!audioRefs.current[audioId]) {
        const audio = new Audio(audioUrl);
        audioRefs.current[audioId] = audio;

        // Set up event listeners
        audio.addEventListener('loadstart', () => {
          setAudioLoading(audioId);
        });

        audio.addEventListener('canplay', () => {
          setAudioLoading(null);
        });

        audio.addEventListener('ended', () => {
          setPlayingAudio(null);
          setAudioLoading(null);
        });

        audio.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          setAudioError(`Failed to load audio for ${verse.location}`);
          setAudioLoading(null);
          setPlayingAudio(null);
        });
      }

      // Play the audio
      await audioRefs.current[audioId].play();
      setPlayingAudio(audioId);
      setAudioLoading(null);

    } catch (error) {
      console.error('Audio play error:', error);
      setAudioError(`Failed to play audio for ${verse.location}`);
      setAudioLoading(null);
      setPlayingAudio(null);
    }
  };

  const getAudioButtonContent = (verse) => {
    const audioId = verse.location;
    
    if (audioLoading === audioId) {
      return (
        <>
          <div style={{
            width: "14px",
            height: "14px",
            border: "2px solid #ffffff40",
            borderTop: "2px solid white",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }} />
          Loading...
        </>
      );
    }
    
    if (playingAudio === audioId) {
      return (
        <>
          <FaPause size={14} />
          Pause
        </>
      );
    }
    
    return (
      <>
        <FaPlay size={14} />
        Play
      </>
    );
  };

  return (
    <div style={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Add CSS animation for loading spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header with back button */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "2rem",
        gap: "1rem"
      }}>
        <button
          onClick={onBack}
          style={{
            background: "#667eea",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "0.75rem 1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontWeight: "600",
            transition: "all 0.2s ease"
          }}
        >
          <FaArrowLeft /> Back to Search
        </button>
        <div>
          <h2 style={{ 
            margin: 0, 
            color: config.color,
            fontSize: "1.5rem",
            fontWeight: "600"
          }}>
            {config.icon} {config.title}
          </h2>
        </div>
      </div>

      {/* Global Audio Error Display */}
      {audioError && (
        <div style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          borderRadius: "12px",
          padding: "1rem",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "#dc2626"
        }}>
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          <span>{audioError}</span>
          <button
            onClick={() => setAudioError(null)}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "none",
              color: "#dc2626",
              cursor: "pointer",
              fontSize: "1.2rem",
              padding: "0.2rem"
            }}
          >
            ×
          </button>
        </div>
      )}
      {/* AI Summary Section */}
      {(answer || summary) && (
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "2rem",
          marginBottom: "2rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          border: `2px solid ${config.border}20`
        }}>
          <h3 style={{ 
            color: config.color, 
            marginBottom: "1.5rem",
            fontSize: "1.3rem",
            fontWeight: "600"
          }}>
            🤖 {answer ? 'AI Analysis' : 'Search Summary'}
          </h3>

          {(answer?.summary || summary) && (
            <div style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "1rem"
            }}>
              <div style={{ 
                fontWeight: "600", 
                color: config.color,
                marginBottom: "0.5rem",
                fontSize: "1rem"
              }}>
                📝 Summary
              </div>
              <div style={{ lineHeight: "1.6", fontSize: "1.05rem", color: "#000000" }}>
                {/* make color for text black */}
                {answer?.summary || displaySummary}
              </div>
            </div>
          )}

          {answer?.interpretation && (
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #22c55e",
              borderRadius: "12px",
              padding: "1.25rem",
              marginBottom: "1rem"
            }}>
              <div style={{ 
                fontWeight: "600", 
                color: "#16a34a",
                marginBottom: "0.5rem",
                fontSize: "1rem"
              }}>
                🎯 Interpretation
              </div>
              <div style={{ lineHeight: "1.6", fontSize: "1.05rem" }}>
                {answer.interpretation}
              </div>
            </div>
          )}

          {answer?.reflection && (
            <div style={{
              background: "#fefce8",
              border: "1px solid #eab308",
              borderRadius: "12px",
              padding: "1.25rem"
            }}>
              <div style={{ 
                fontWeight: "600", 
                color: "#ca8a04",
                marginBottom: "0.5rem",
                fontSize: "1rem"
              }}>
                🔮 Reflection
              </div>
              <div style={{ lineHeight: "1.6", fontSize: "1.05rem" }}>
                {answer.reflection}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verses Display Section */}
      {displayVerses && displayVerses.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <h3 style={{ 
              color: "#374151", 
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: "600"
            }}>
              📚 Found Verses ({displayVerses.length})
            </h3>
            
            {/* Relevance Legend */}
            {intentUsed === 'semantic_search' && (
              <div style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
                alignItems: "center"
              }}>
                
                  
              </div>
            )}
          </div>
          
          <div style={{
            display: "grid",
            gap: "1.5rem"
          }}>
            {displayVerses.map((verse, index) => (
              <div
                key={verse.location || index}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "2rem",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e5e7eb",
                  position: "relative"
                }}
              >
                {/* Verse Header */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                  flexWrap: "wrap",
                  gap: "1rem"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem"
                  }}>
                    <h4 style={{
                      margin: 0,
                      color: "#1e293b",
                      fontSize: "1.1rem",
                      fontWeight: "600"
                    }}>
                      📍 {verse.location}
                    </h4>
                    {verse.confidence && verse.confidence >= 0.6 && (
                      <span style={{
                        backgroundColor: verse.confidence >= 0.8 ? "#10b981" : 
                                       verse.confidence >= 0.7 ? "#f59e0b" : "#3b82f6",
                        color: "white",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "12px",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}>
                        {verse.confidence >= 0.8 ? "🎯 Highly Relevant" : 
                         verse.confidence >= 0.7 ? "⭐ Very Relevant" : "✨ Relevant"}
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <button
                      onClick={() => toggleAudio(verse)}
                      style={{
                        background: playingAudio === verse.location 
                          ? "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" 
                          : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        transition: "all 0.2s ease",
                        minWidth: "80px",
                        justifyContent: "center"
                      }}
                      disabled={audioLoading === verse.location}
                    >
                      {getAudioButtonContent(verse)}
                    </button>
                    {audioError === `Failed to load audio for ${verse.location}` && (
                      <span style={{
                        fontSize: "0.8rem",
                        color: "#ef4444",
                        fontStyle: "italic"
                      }}>
                        Audio unavailable
                      </span>
                    )}
                  </div>
                </div>

                {/* Sanskrit Text */}
                {verse.sanskrit && (
                  <div style={{
                    backgroundColor: "rgba(102, 126, 234, 0.08)",
                    border: "1px solid rgba(102, 126, 234, 0.2)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1.5rem"
                  }}>
                    <div style={{
                      fontSize: "1.2rem",
                      fontWeight: "600",
                      color: "#1e293b",
                      lineHeight: "1.6",
                      fontFamily: "'Noto Serif Devanagari', serif"
                    }}>
                      {verse.sanskrit}
                    </div>
                  </div>
                )}

                {/* Transliteration */}
                {verse.transliteration && (
                  <div style={{
                    backgroundColor: "#f8fafc",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1.5rem",
                    fontStyle: "italic",
                    color: "#64748b"
                  }}>
                    {verse.transliteration}
                  </div>
                )}

                {/* Translation */}
                {verse.translation && (
                  <div style={{
                    backgroundColor: "rgba(16, 185, 129, 0.05)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    borderRadius: "12px",
                    padding: "1.5rem",
                    marginBottom: "1rem"
                  }}>
                    <div style={{
                      fontSize: "1.05rem",
                      color: "#1e293b",
                      lineHeight: "1.6"
                    }}>
                      {verse.translation}
                    </div>
                  </div>
                )}

                {/* Additional Translations */}
                {verse.translations && Object.keys(verse.translations).filter(key => key.toLowerCase() !== 'griffith').length > 0 && (
                  <div style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "1rem"
                  }}>
                    <div style={{
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      color: "#6b7280",
                      marginBottom: "0.8rem"
                    }}>
                      Alternative Translations:
                    </div>
                    {Object.entries(verse.translations)
                      .filter(([key]) => key.toLowerCase() !== 'griffith')
                      .map(([translator, translation]) => (
                      <div
                        key={translator}
                        style={{
                          backgroundColor: "#f9fafb",
                          borderRadius: "8px",
                          padding: "1rem",
                          marginBottom: "0.8rem",
                          fontSize: "0.95rem"
                        }}
                      >
                        <div style={{
                          fontWeight: "600",
                          color: "#374151",
                          marginBottom: "0.4rem",
                          textTransform: "capitalize"
                        }}>
                          {translator}:
                        </div>
                        <div style={{ color: "#6b7280", fontStyle: "italic" }}>
                          "{translation}"
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No results message */}
      {(!displayVerses || displayVerses.length === 0) && !answer && !summary && (
        <div style={{ 
          textAlign: "center", 
          color: "#6b7280",
          background: "white",
          padding: "3rem",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
          <div style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "0.5rem" }}>
            No results found
          </div>
          <div>Try different keywords or explore our suggested themes!</div>
        </div>
      )}
    </div>
  );
}