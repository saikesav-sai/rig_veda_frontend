
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import ChatBot from "./components/ChatBot";
import SemanticSearch from "./components/SemanticSearch";
import VedaExplorer from "./components/VedaExplorer";
import Hero from "./components/hero";

function App() {
  const navigate = useNavigate();
  const navigateToPage = (page) => navigate(page === 'home' ? '/' : `/${page}`);
  const goHome = () => navigate('/');
  const location = useLocation();
  const currentPage = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '');

  const navButtonStyle = {
    padding: "1rem 2rem",
    cursor: "pointer",
    fontSize: "1.1rem",
    fontWeight: "600",
    border: "2px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "white",
    borderRadius: "16px",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    textTransform: "uppercase",
    letterSpacing: "1px"
  };

  const navButtonHoverStyle = {
    ...navButtonStyle,
    background: "rgba(255,255,255,0.2)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)"
  };

  // // 🏠 Home Page Component (now powered by the new Hero component)
  const renderHomePage = () => (
    <div style={{ textAlign: "center", maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Hero navigateToPage={navigateToPage} />

      {/* Keep a compact features strip below the hero */}
  <div style={{ marginTop: "-32px", position: "relative", zIndex: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem" }}>
          <div onClick={() => navigateToPage("search")} className="card-hover" style={{ background: "white", padding: "2rem", borderRadius: "14px", boxShadow: "0 10px 30px rgba(15,23,42,0.06)", cursor: "pointer" }}>
            <h4 style={{ marginBottom: ".5rem", color: "#334155" }}>🔍 Semantic Search</h4>
            <p style={{ color: "#6b7280" }}>Fast concept search across the Rig Veda. Try "fire sacrifice" or "dawn goddess".</p>
          </div>
          <div onClick={() => navigateToPage("chat")} className="card-hover" style={{ background: "white", padding: "2rem", borderRadius: "14px", boxShadow: "0 10px 30px rgba(15,23,42,0.06)", cursor: "pointer" }}>
            <h4 style={{ marginBottom: ".5rem", color: "#334155" }}>🕉️ Sacred AI Guide</h4>
            <p style={{ color: "#6b7280" }}>Ask the assistant for verse interpretations, context, and audio pointers.</p>
          </div>
          <div onClick={() => navigateToPage("explorer")} className="card-hover" style={{ background: "white", padding: "2rem", borderRadius: "14px", boxShadow: "0 10px 30px rgba(15,23,42,0.06)", cursor: "pointer" }}>
            <h4 style={{ marginBottom: ".5rem", color: "#334155" }}>📚 Veda Explorer</h4>
            <p style={{ color: "#6b7280" }}>Browse by Mandala, Hymn and Stanza with rich metadata and audio.</p>
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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
        color: "white",
        padding: currentPage === "home" ? "2rem 0 1rem 0" : "1.5rem 0",
        boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: "1200px", margin: "auto", padding: "0 2rem" }}>
          {currentPage === "home" ? (
            // Home Header
            <>
              <h1 style={{ 
                textAlign: "center", 
                fontSize: "3rem", 
                marginBottom: "0.5rem",
                fontWeight: "300",
                letterSpacing: "2px",
                textShadow: "0 2px 20px rgba(0,0,0,0.1)"
              }}>
                🕉️ Rig Veda Explorer
              </h1>
              <p style={{
                textAlign: "center",
                fontSize: "1.1rem",
                opacity: "0.9",
                marginBottom: "1.5rem",
                fontWeight: "300"
              }}>
                Discover the ancient wisdom of the Vedic texts
              </p>
            </>
          ) : (
            // Page Header with Navigation
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <button
                onClick={goHome}
                style={{
                  ...navButtonStyle,
                  fontSize: "1rem",
                  padding: "0.75rem 1.5rem"
                }}
                onMouseOver={(e) => {
                  Object.assign(e.target.style, navButtonHoverStyle, { fontSize: "1rem", padding: "0.75rem 1.5rem" });
                }}
                onMouseOut={(e) => {
                  Object.assign(e.target.style, navButtonStyle, { fontSize: "1rem", padding: "0.75rem 1.5rem" });
                }}
              >
                🏠 Home
              </button>
              
              <h1 style={{
                fontSize: "2rem",
                fontWeight: "300",
                letterSpacing: "1px",
                textAlign: "center",
                flex: 1
              }}>
                🕉️ Rig Veda Explorer
              </h1>
              
              <div style={{ 
                display: "flex", 
                gap: "1rem",
                flexWrap: "wrap"
              }}>
                <button
                  onClick={() => navigateToPage("search")}
                  style={{
                    ...navButtonStyle,
                    background: currentPage === "search" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                    fontSize: "0.9rem",
                    padding: "0.6rem 1.2rem"
                  }}
                  onMouseOver={(e) => {
                    Object.assign(e.target.style, navButtonHoverStyle, { fontSize: "0.9rem", padding: "0.6rem 1.2rem" });
                  }}
                  onMouseOut={(e) => {
                    Object.assign(e.target.style, {
                      ...navButtonStyle,
                      background: currentPage === "search" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      fontSize: "0.9rem",
                      padding: "0.6rem 1.2rem"
                    });
                  }}
                >
                  🔍 Search
                </button>
                <button
                  onClick={() => navigateToPage("chat")}
                  style={{
                    ...navButtonStyle,
                    background: currentPage === "chat" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                    fontSize: "0.9rem",
                    padding: "0.6rem 1.2rem"
                  }}
                  onMouseOver={(e) => {
                    Object.assign(e.target.style, navButtonHoverStyle, { fontSize: "0.9rem", padding: "0.6rem 1.2rem" });
                  }}
                  onMouseOut={(e) => {
                    Object.assign(e.target.style, {
                      ...navButtonStyle,
                      background: currentPage === "chat" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      fontSize: "0.9rem",
                      padding: "0.6rem 1.2rem"
                    });
                  }}
                >
                  🕉️ Chat
                </button>
                <button
                  onClick={() => navigateToPage("explorer")}
                  style={{
                    ...navButtonStyle,
                    background: currentPage === "explorer" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                    fontSize: "0.9rem",
                    padding: "0.6rem 1.2rem"
                  }}
                  onMouseOver={(e) => {
                    Object.assign(e.target.style, navButtonHoverStyle, { fontSize: "0.9rem", padding: "0.6rem 1.2rem" });
                  }}
                  onMouseOut={(e) => {
                    Object.assign(e.target.style, {
                      ...navButtonStyle,
                      background: currentPage === "explorer" ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                      fontSize: "0.9rem",
                      padding: "0.6rem 1.2rem"
                    });
                  }}
                >
                  📚 Explorer
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Page Content */}
      <Routes>
        <Route path="/" element={renderHomePage()} />
        <Route path="/search" element={
          <main style={{ 
            maxWidth: "1200px", 
            margin: "auto", 
            padding: "3rem 2rem",
            animation: "fadeIn 0.6s ease-out"
          }}>
            <SemanticSearch />
          </main>
        } />
        <Route path="/chat" element={
          <main style={{ 
            maxWidth: "1200px", 
            margin: "auto", 
            padding: "3rem 2rem",
            animation: "fadeIn 0.6s ease-out"
          }}>
            <ChatBot />
          </main>
        } />
        <Route path="/explorer" element={
          <main style={{ 
            maxWidth: "1200px", 
            margin: "auto", 
            padding: "3rem 2rem",
            animation: "fadeIn 0.6s ease-out"
          }}>
            <VedaExplorer />
          </main>
        } />
      </Routes>
    </div>
  );
}

export default App;

