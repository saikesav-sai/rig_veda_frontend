import { useNavigate } from "react-router-dom";

const Credits = () => {
  const navigate = useNavigate();

  const creditSections = [
    {
      title: "Sacred Texts & Audio",
      icon: "📖",
      items: [
        {
          name: "Veda Web",
          description: "Original Sanskrit texts from ancient Vedic manuscripts",
          link: "https://vedaweb.uni-koeln.de/rigveda/"
        },
        {
          name: "Vedic Audio Recordings",
          description: "Authentic recitations by traditional Vedic scholars",
          link: "https://github.com/aasi-archive/rv-audio"
        }
        
      ]
    },
    
    
    
    {
      title: "Development Team",
      icon: "👥",
      items: [
        {
          name: "Project Creator",
          description: "Eternal Veda development team",
          link: null
        },
        {
          name: "GitHub Contributors",
          description: "Open-source contributors who helped improve the platform",
          link: "https://github.com/"
        },
        {
          name: "Beta Testers",
          description: "Community members who provided valuable feedback",
          link: null
        }
      ]
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)",
      padding: "2rem 1rem"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto"
      }}>
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.75rem 1.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            marginBottom: "2rem",
            boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            transition: "all 0.3s ease"
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <div style={{
          textAlign: "center",
          marginBottom: "3rem",
          background: "white",
          borderRadius: "24px",
          padding: "3rem 2rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
        }}>
          <img src="/om.png" alt="Om" style={{ width: "5rem", height: "5rem", marginBottom: "1rem" }} />
          <h1 style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "#1e1b4b",
            marginBottom: "1rem"
          }}>
            Credits & Acknowledgments
          </h1>
          <p style={{
            color: "#6b7280",
            fontSize: "1.2rem",
            maxWidth: "700px",
            margin: "0 auto"
          }}>
            I am deeply grateful to all the individuals, organizations, and communities
            who have contributed to making the Rig Veda accessible to the world.
          </p>
        </div>

        {/* Credit Sections */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          marginBottom: "3rem"
        }}>
          {creditSections.map((section, idx) => (
            <div
              key={idx}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "2rem",
                boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease"
              }}
              className="card-hover"
            >
              <div style={{
                fontSize: "3rem",
                marginBottom: "1rem",
                textAlign: "center"
              }}>
                {section.icon}
              </div>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                color: "#1e1b4b",
                marginBottom: "1.5rem",
                textAlign: "center"
              }}>
                {section.title}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {section.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      padding: "1rem",
                      background: "linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)",
                      borderRadius: "12px",
                      borderLeft: "4px solid #667eea"
                    }}
                  >
                    <h3 style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#4c1d95",
                      marginBottom: "0.5rem"
                    }}>
                      {item.name}
                    </h3>
                    <p style={{
                      fontSize: "0.95rem",
                      color: "#6b7280",
                      marginBottom: item.link ? "0.5rem" : "0"
                    }}>
                      {item.description}
                    </p>
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: "0.9rem",
                          color: "#667eea",
                          textDecoration: "none",
                          fontWeight: "600"
                        }}
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Special Thanks Section */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          borderRadius: "24px",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "white",
          boxShadow: "0 15px 50px rgba(0,0,0,0.2)"
        }}>
          <h2 style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "1rem"
          }}>
            🙏 Special Thanks
          </h2>
          <p style={{
            fontSize: "1.1rem",
            lineHeight: "1.8",
            maxWidth: "800px",
            margin: "0 auto 1.5rem",
            opacity: 0.9
          }}>
            This project would not have been possible without the tireless efforts of Vedic scholars,
            translators, and technologists who have dedicated their lives to preserving and sharing
            ancient wisdom. We honor the rishis (sages) who originally composed these sacred hymns
            thousands of years ago, and all those who have kept this knowledge alive through generations.
          </p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
            marginTop: "2rem"
          }}>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>10,552 Verses</div>
            </div>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎵</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Audio Recordings</div>
            </div>
            <div style={{
              padding: "1rem 2rem",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🌏</div>
              <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>Open to All</div>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div style={{
          background: "white",
          borderRadius: "20px",
          padding: "2rem",
          marginTop: "2rem",
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          textAlign: "center"
        }}>
          <h3 style={{
            fontSize: "1.3rem",
            fontWeight: "600",
            color: "#1e1b4b",
            marginBottom: "1rem"
          }}>
            📜 License Information
          </h3>
          <p style={{ color: "#6b7280", lineHeight: "1.8", fontSize: "1rem" }}>
            This project uses open-source software and public domain texts. The Rig Veda texts
            and translations are in the public domain. Modern software components are used under
            their respective licenses (MIT, Apache 2.0, etc.). All audio recordings are used with
            permission or are in the public domain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Credits;
