
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import ChatBot from "./components/ChatBot";
import Hero from "./components/Hero";
import QuoteCarousel from "./components/QuoteCarousel";
import SemanticSearch from "./components/SemanticSearch";
import VedaExplorer from "./components/VedaExplorer";

function App() {
  const navigate = useNavigate();
  const navigateToPage = (page) => navigate(page === 'home' ? '/' : `/${page}`);
  const goHome = () => navigate('/');
  const location = useLocation();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');

  // 🏠 Fully Redesigned Home Page
  const renderHomePage = () => (
    <div style={{ 
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)",
      minHeight: "calc(100vh - 120px)"
    }}>
      {/* Hero Section with Background Pattern */}
      <div style={{ 
        position: "relative",
        overflow: "hidden",
        paddingTop: "3rem"
      }}>
        {/* Decorative Background Elements */}
        <div style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float-gentle 8s ease-in-out infinite"
        }} />
        <div style={{
          position: "absolute",
          bottom: "-150px",
          left: "-150px",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(102, 126, 234, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float-gentle 10s ease-in-out infinite reverse"
        }} />

        {/* Main Hero Content */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 10 }}>
          <Hero navigateToPage={navigateToPage} />
        </div>
      </div>

      {/* Features Section - Redesigned Grid */}
      <div style={{ 
        maxWidth: "1400px", 
        margin: "0 auto", 
        padding: "4rem 2rem 3rem",
        position: "relative",
        zIndex: 20
      }}>
        <h2 style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#1e1b4b",
          marginBottom: "1rem",
          letterSpacing: "-0.5px"
        }}>
          Explore the Sacred Texts
        </h2>
        <p style={{
          textAlign: "center",
          fontSize: "1.2rem",
          color: "#6b7280",
          marginBottom: "3rem",
          maxWidth: "700px",
          margin: "0 auto 3rem"
        }}>
          Three powerful ways to discover ancient wisdom
        </p>

        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
          gap: "2rem",
          marginBottom: "4rem"
        }}>
          {/* Semantic Search Card */}
          <div 
            onClick={() => navigateToPage("search")} 
            className="card-hover"
            style={{ 
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "3rem 2rem",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(102, 126, 234, 0.3)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              border: "none",
              color: "white",
              textAlign: "center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            {/* Card Glow Effect */}
            <div style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              animation: "rotate-slow 20s linear infinite"
            }} />
            
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ 
                fontSize: "4rem", 
                marginBottom: "1.5rem",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
              }}>
                🔍
              </div>
              <h3 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700",
                marginBottom: "1rem",
                color: "white"
              }}>
                Semantic Search
              </h3>
              <p style={{ 
                fontSize: "1.05rem", 
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "1.5rem"
              }}>
                Discover Rig Veda slokas through keywords like “fire sacrifice” or “dawn goddess.
              </p>
              <div style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}>
                Try Now →
              </div>
            </div>
          </div>

          {/* AI Chat Card */}
          <div 
            onClick={() => navigateToPage("chat")} 
            className="card-hover"
            style={{ 
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              padding: "3rem 2rem",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(245, 158, 11, 0.3)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              border: "none",
              color: "white",
              textAlign: "center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <div style={{
              position: "absolute",
              top: "-50%",
              right: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              animation: "rotate-slow 25s linear infinite reverse"
            }} />
            
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ 
                fontSize: "4rem", 
                marginBottom: "1.5rem",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
              }}>
                🪷
              </div>
              <h3 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700",
                marginBottom: "1rem",
                color: "white"
              }}>
                Sacred AI Guide
              </h3>
              <p style={{ 
                fontSize: "1.05rem", 
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "1.5rem"
              }}>
                Explore the Rig Veda with AI Chat Bot, uncover verse meanings, historical context, and listen to authentic recitations.
              </p>
              <div style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}>
                Start Chat →
              </div>
            </div>
          </div>

          {/* Explorer Card */}
          <div 
            onClick={() => navigateToPage("explorer")} 
            className="card-hover"
            style={{ 
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "3rem 2rem",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(16, 185, 129, 0.3)",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              border: "none",
              color: "white",
              textAlign: "center",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
          >
            <div style={{
              position: "absolute",
              bottom: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              animation: "rotate-slow 30s linear infinite"
            }} />
            
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ 
                fontSize: "4rem", 
                marginBottom: "1.5rem",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.2))"
              }}>
                📖
              </div>
              <h3 style={{ 
                fontSize: "1.8rem", 
                fontWeight: "700",
                marginBottom: "1rem",
                color: "white"
              }}>
                Veda Explorer
              </h3>
              <p style={{ 
                fontSize: "1.05rem", 
                lineHeight: "1.6",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "1.5rem"
              }}>
                Navigate the Rig Veda systematically by Mandala, Hymn, and Stanza, complete with rich metadata and accompanying audio.
              </p>
              <div style={{
                display: "inline-block",
                padding: "0.75rem 2rem",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50px",
                fontSize: "0.95rem",
                fontWeight: "600",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.3)"
              }}>
                Explore →
              </div>
            </div>
          </div>
        </div>

        {/* Rotating Quotes Section */}
        <div style={{
          maxWidth: "900px",
          margin: "0 auto 4rem",
          padding: "0 1rem"
        }}>
          <QuoteCarousel />
        </div>

        {/* Stats Section */}
        <div style={{
          background: "white",
          borderRadius: "24px",
          padding: "3rem 2rem",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          marginBottom: "4rem"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            textAlign: "center"
          }}>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#667eea", marginBottom: "0.5rem" }}>10</div>
              <div style={{ fontSize: "1.1rem", color: "#6b7280", fontWeight: "600" }}>Mandalas</div>
              <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: "0.25rem" }}>Sacred Books</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#f59e0b", marginBottom: "0.5rem" }}>1,028</div>
              <div style={{ fontSize: "1.1rem", color: "#6b7280", fontWeight: "600" }}>Suktas</div>
              <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: "0.25rem" }}>Hymns</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#10b981", marginBottom: "0.5rem" }}>10,552</div>
              <div style={{ fontSize: "1.1rem", color: "#6b7280", fontWeight: "600" }}>Mantras</div>
              <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: "0.25rem" }}>Verses</div>
            </div>
            <div>
              <div style={{ fontSize: "3rem", fontWeight: "800", color: "#8b5cf6", marginBottom: "0.5rem" }}>3,500+</div>
              <div style={{ fontSize: "1.1rem", color: "#6b7280", fontWeight: "600" }}>Years Old</div>
              <div style={{ fontSize: "0.9rem", color: "#9ca3af", marginTop: "0.25rem" }}>Ancient Wisdom</div>
            </div>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div style={{
          background: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 100%)",
          borderRadius: "24px",
          padding: "4rem 3rem",
          textAlign: "center",
          color: "white",
          position: "relative",
          overflow: "hidden"
        }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"  %3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            opacity: 0.3
          }} />
          
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🕉️</div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem" }}>
              Begin Your Journey
            </h2>
            <p style={{ 
              fontSize: "1.2rem", 
              marginBottom: "2rem",
              opacity: 0.9,
              maxWidth: "600px",
              margin: "0 auto 2rem"
            }}>
              Dive into the world's oldest scripture and discover timeless wisdom
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigateToPage("search")}
                style={{
                  padding: "1rem 2.5rem",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  background: "white",
                  color: "#1e1b4b",
                  border: "none",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
                }}
                className="btn-shimmer"
              >
                Start Exploring
              </button>
              <button
                onClick={() => navigateToPage("chat")}
                style={{
                  padding: "1rem 2.5rem",
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  background: "rgba(255,255,255,0.1)",
                  color: "white",
                  border: "2px solid white",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)"
                }}
              >
                Ask AI Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Header */}
      <header style={{ 
        background: "linear-gradient(135deg, rgba(30, 27, 75, 0.05) 0%, rgba(76, 29, 149, 0.05) 100%)",
        color: "#1e1b4b",
        padding: "1.5rem 0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(0,0,0,0.05)"
      }}>
        <div style={{ maxWidth: "1400px", margin: "auto", padding: "0 2rem" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            {/* Logo/Title */}
            <div 
              onClick={goHome}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "1rem",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            >
              <span style={{ fontSize: "2rem" }}>🕉️</span>
              <h1 style={{ 
                fontSize: "1.5rem", 
                margin: 0,
                fontWeight: "700",
                letterSpacing: "-0.5px"
              }}>
                Rig Veda Explorer
              </h1>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <button
                onClick={() => navigateToPage("search")}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  background: currentPage === "search" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                  color: currentPage === "search" ? "white" : "#667eea",
                  border: currentPage === "search" ? "none" : "2px solid #e2e8f0",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: currentPage === "search" ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"
                }}
              >
                🔍 Search
              </button>
              <button
                onClick={() => navigateToPage("chat")}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  background: currentPage === "chat" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                  color: currentPage === "chat" ? "white" : "#667eea",
                  border: currentPage === "chat" ? "none" : "2px solid #e2e8f0",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: currentPage === "chat" ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"
                }}
              >
                AI Guide
              </button>
              <button
                onClick={() => navigateToPage("explorer")}
                style={{
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  background: currentPage === "explorer" ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                  color: currentPage === "explorer" ? "white" : "#667eea",
                  border: currentPage === "explorer" ? "none" : "2px solid #e2e8f0",
                  borderRadius: "50px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: currentPage === "explorer" ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"
                }}
              >
                Explorer
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Page Content */}
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/search" element={<SemanticSearch />} />
        <Route path="/chat" element={<ChatBot />} />
        <Route path="/explorer" element={<VedaExplorer />} />
      </Routes>
    </div>
  );
}

export default App;

