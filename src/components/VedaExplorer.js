import { useEffect, useRef, useState } from "react";
import { FaBolt, FaBookOpen, FaCheck, FaChevronDown, FaChevronUp, FaCompress, FaExpand, FaGripHorizontal, FaQuoteLeft, FaSearch } from "react-icons/fa";
import { API_BASE } from "../config";

// Common styles
const STYLES = {
  card: { background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))",
    borderRadius: "24px", padding: "2.5rem", boxShadow: "0 15px 50px rgba(102,126,234,0.15)",
    border: "2px solid rgba(102,126,234,0.15)", marginBottom: "3rem", backdropFilter: "blur(10px)" },
  btn: { padding: "1rem 2rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white", border: "none", borderRadius: "16px", fontWeight: "700", cursor: "pointer",
    fontSize: "1.1rem", boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)", transition: "all 0.3s" },
  input: { flex: 1, padding: "1rem 1.5rem", border: "2px solid #e5e7eb", borderRadius: "16px",
    fontSize: "1.1rem", fontWeight: "600", outline: "none", transition: "all 0.3s" }
};

// Searchable Dropdown
const SearchableDropdown = ({ label, value, placeholder, options, onSelect, searchValue,
  onSearchChange, isOpen, setIsOpen, disabled, dropdownRef, renderOption, helpText }) => (
  <div style={{ flex: "1 1 250px" }} ref={dropdownRef}>
    {label && <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600",
      color: "#374151", fontSize: "0.9rem" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      <div onClick={() => !disabled && setIsOpen(!isOpen)} style={{
        width: "100%", padding: "0.75rem", border: `2px solid ${disabled ? '#d1d5db' : isOpen ? '#667eea' : '#e5e7eb'}`,
        borderRadius: "12px", cursor: disabled ? "not-allowed" : "pointer", display: "flex",
        justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
        <span style={{ color: value ? "#374151" : "#9ca3af" }}>{value || placeholder}</span>
        {!disabled && (isOpen ? <FaChevronUp color="#6b7280" /> : <FaChevronDown color="#6b7280" />)}
      </div>
      {isOpen && !disabled && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white",
          border: "2px solid #667eea", borderTop: "none", borderRadius: "0 0 12px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000, maxHeight: "200px", overflow: "hidden" }}>
          <div style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", background: "#f8fafc" }}>
            <FaSearch style={{ position: "absolute", left: "1.5rem", top: "1.25rem", color: "#667eea" }} />
            <input type="text" placeholder="Search..." value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)} autoFocus
              style={{ width: "100%", padding: "0.5rem 0.5rem 0.5rem 2.5rem", border: "1px solid #d1d5db",
                borderRadius: "8px", fontSize: "0.9rem", outline: "none" }} />
          </div>
          <div style={{ maxHeight: "150px", overflowY: "auto", padding: "0.25rem" }}>
            {options.length === 0 ? (
              <div style={{ padding: "1rem", textAlign: "center", color: "#9ca3af" }}>No matches</div>
            ) : (
              options.slice(0, 50).map((option, i) => (
                <div key={i} onClick={() => onSelect(option)} style={{
                  padding: "0.5rem", cursor: "pointer", borderRadius: "8px", transition: "background 0.15s" }}
                  onMouseEnter={(e) => e.target.style.background = "#f3f4f6"}
                  onMouseLeave={(e) => e.target.style.background = "transparent"}>
                  {renderOption ? renderOption(option) : option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
    {helpText && <small style={{ color: disabled ? "#9ca3af" : "#10b981", fontSize: "0.8rem",
      display: "block", marginTop: "0.25rem" }}>{helpText}</small>}
  </div>
);

// Verse Card
const VerseCard = ({ sloka, playing, toggleAudio }) => (
  <div style={{ background: "white", borderRadius: "24px", padding: "3rem",
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)", marginBottom: "2rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
      <h3 style={{ fontSize: "1.8rem", fontWeight: "800", margin: 0,
        background: "linear-gradient(135deg, #1e1b4b 0%, #6b21a8 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        <img src="/mantra.png" alt="Location" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} /> {sloka.location}
      </h3>
      <button onClick={toggleAudio} style={{ display: "flex", alignItems: "center", gap: "0.75rem",
        background: playing ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
          : "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        color: "white", border: "none", padding: "1rem 1.75rem", borderRadius: "50px",
        fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }}>
        🔊 {playing ? "Pause" : "Play"}
      </button>
    </div>
    <div style={{ background: "linear-gradient(135deg, rgba(102,126,234,0.08), rgba(118,75,162,0.08))",
      border: "3px solid rgba(102,126,234,0.2)", borderRadius: "24px", padding: "2rem", marginBottom: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "1rem", color: "#667eea", fontWeight: "700" }}>
        <img src="/om.png" alt="Om" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> SANSKRIT TEXT <img src="/om.png" alt="Om" style={{ width: "1.5rem", height: "1.5rem", display: "inline-block", verticalAlign: "middle", marginLeft: "0.3rem" }} />
      </div>
      <p style={{ fontSize: "1.6rem", textAlign: "center", color: "#1e1b4b", lineHeight: "2",
        fontFamily: "'Noto Serif Devanagari', serif" }}>{sloka.sanskrit}</p>
    </div>
    <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1.5rem", marginBottom: "2rem" }}>
      <span style={{ color: "#667eea", fontSize: "0.9rem", fontWeight: "600" }}>Transliteration</span>
      <p style={{ fontSize: "1.1rem", color: "#475569", fontStyle: "italic", marginTop: "0.8rem" }}>
        {sloka.transliteration}
      </p>
    </div>
    <div style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.08), rgba(5,150,105,0.08))",
        border: "3px solid rgba(16,185,129,0.25)", borderRadius: "24px", padding: "2rem" }}>
        <span style={{ color: "#10b981", fontSize: "1rem", fontWeight: "700" }}>ENGLISH TRANSLATION</span>
        <p style={{ fontSize: "1.2rem", color: "#1e1b4b", lineHeight: "1.8", fontStyle: "italic",
          marginTop: "1rem" }}>"{sloka.translation}"</p>
      </div>
    </div>
  
);

// Step indicator
const StepIndicator = ({ steps, currentStep }) => (
  <div style={{ position: "sticky", top: "5rem", width: "50%", zIndex: 99,
    background: "rgba(255, 255, 255, 0.57)", backdropFilter: "blur(20px)",
    borderRadius: "16px", padding: "2rem 1.5rem", margin: "2rem auto",
    boxShadow: "0 6px 25px rgba(0, 0, 0, 0.41)", marginBottom: "2rem",
    border: "1px solid rgba(102, 126, 234, 0.2)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
      {steps.map((step, idx) => (
        <div key={step.num} style={{ flex: 1, display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flex: 1 }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: currentStep > step.num ? "linear-gradient(135deg, #10b981 0%, #059669 100%)" 
                : currentStep === step.num ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#e5e7eb",
              color: currentStep >= step.num ? "white" : "#9ca3af", fontSize: "1.2rem",
              fontWeight: "700", transition: "all 0.3s",
              boxShadow: currentStep === step.num ? "0 4px 15px rgba(102, 126, 234, 0.4)" : "none",
              flexShrink: 0 }}>
              {currentStep > step.num ? <FaCheck /> : step.icon}
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600",
              color: currentStep >= step.num ? "#1e1b4b" : "#9ca3af" }}>{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ height: "3px", width: "60px",
              background: currentStep > step.num ? "#10b981" : "#e5e7eb",
              transition: "all 0.3s", flexShrink: 0, margin: "0 0.5rem" }} />
          )}
        </div>
      ))}
    </div>
  </div>
);

// Mandala Background SVG
const MandalaBackground = () => (
  <div style={{ position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)", width: "800px", height: "800px",
    opacity: "0.15", pointerEvents: "none", zIndex: 0 }}>
    <svg viewBox="0 0 600 600" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="mandala-gradient-explorer" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#764ba2" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#f093fb" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-explorer)" />
      {[...Array(12)].map((_, i) => (
        <ellipse key={i} cx="300" cy="120" rx="40" ry="14" fill="rgba(118,75,162,0.1)"
          transform={`rotate(${(i / 12) * 360} 300 300)`} />
      ))}
    </svg>
  </div>
);

export default function VedaExplorer() {
  const [mandalaNum, setMandalaNum] = useState("");
  const [indexData, setIndexData] = useState(null);
  const [hymnNum, setHymnNum] = useState("");
  const [stanzaNum, setStanzaNum] = useState("");
  const [sloka, setSloka] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [hymnSearch, setHymnSearch] = useState("");
  const [stanzaSearch, setStanzaSearch] = useState("");
  const [isHymnDropdownOpen, setIsHymnDropdownOpen] = useState(false);
  const [isStanzaDropdownOpen, setIsStanzaDropdownOpen] = useState(false);
  const [showPadasAnalysis, setShowPadasAnalysis] = useState(false);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  const [inputMode, setInputMode] = useState("guided");
  const [quickInput, setQuickInput] = useState("");
  
  const audioRef = useRef(null);
  const hymnDropdownRef = useRef(null);
  const stanzaDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (hymnDropdownRef.current && !hymnDropdownRef.current.contains(e.target)) setIsHymnDropdownOpen(false);
      if (stanzaDropdownRef.current && !stanzaDropdownRef.current.contains(e.target)) setIsStanzaDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!mandalaNum) return;
    setLoading(true);
    fetch(`${API_BASE}/index/${mandalaNum}`)
      .then(r => r.json())
      .then(data => {
        setIndexData(data.error ? null : data);
        setError(data.error || null);
      })
      .catch(() => setError("Could not load data"))
      .finally(() => setLoading(false));
  }, [mandalaNum]);

  const handleSearch = () => {
    if (!mandalaNum || !hymnNum || !stanzaNum) return setError("Please fill all fields");
    setLoading(true);
    fetch(`${API_BASE}/sloka/${mandalaNum}/${hymnNum}/${stanzaNum}`)
      .then(r => r.json())
      .then(data => {
        setSloka(data.error ? null : data);
        setError(data.error || null);
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
        setPlaying(false);
      })
      .catch(() => setError("Failed to fetch"))
      .finally(() => setLoading(false));
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    playing ? audioRef.current.pause() : audioRef.current.play();
    setPlaying(!playing);
  };

  const getFilteredHymns = () => {
    if (!indexData?.hymns) return [];
    return hymnSearch ? indexData.hymns.filter(h => h.hymn_number.toString().includes(hymnSearch)) : indexData.hymns;
  };

  const getFilteredStanzas = () => {
    if (!indexData || !hymnNum) return [];
    const hymn = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
    const all = Array.from({length: hymn?.total_stanzas || 1}, (_, i) => i + 1);
    return stanzaSearch ? all.filter(n => n.toString().includes(stanzaSearch)) : all;
  };

  const handleQuickInput = () => {
    const match = quickInput.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) return setError("Invalid format. Use: Mandala.Sukta.Mantra (e.g., 1.10.129)");
    const [, m, h, s] = match;
    if (Number(m) < 1 || Number(m) > 10) return setError("Mandala must be between 1-10");
    setMandalaNum(m);
    setHymnNum(h);
    setStanzaNum(s);
    setError(null);
    setTimeout(() => handleSearch(), 200);
  };

  const getCurrentStep = () => {
    if (!mandalaNum) return 1;
    if (!hymnNum) return 2;
    if (!stanzaNum) return 3;
    return 4;
  };

  const steps = [
    { num: 1, label: "Mandala", icon: <img src="/book.png" alt="Book" style={{ width: "1.2rem", height: "1.2rem" }} /> },
    { num: 2, label: "Sukta", icon: <img src="/sukta.png" alt="Sukta" style={{ width: "1.2rem", height: "1.2rem" }} /> },
    { num: 3, label: "Mantra", icon: <img src="/mantra.png" alt="Mantra" style={{ width: "1.2rem", height: "1.2rem" }} /> }
  ];

  return (
    <div style={{ minHeight: "100vh",
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)",
      padding: "2rem 0", position: "relative", overflow: "hidden" }}>
      <MandalaBackground />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem",
        position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "700", color: "#1e1b4b",
            marginBottom: "1rem", letterSpacing: "-1px", lineHeight: "1.2" }}>
            <img src="/book.png" alt="Book" style={{ width: "3rem", height: "3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.5rem" }} />
            Rig Veda Explorer
          </h2>
          <p style={{ color: "#475569", fontSize: "1.2rem", lineHeight: "1.6", fontWeight: "400" }}>
            Navigate through sacred verses using traditional indexing
          </p>
        </div>

        {/* Input Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", marginBottom: "2rem" }}>
          {[
            { mode: "guided", icon: <FaGripHorizontal />, label: "Guided Selection" },
            { mode: "quick", icon: <FaBolt />, label: "Quick Input" }
          ].map(btn => (
            <button key={btn.mode} onClick={() => setInputMode(btn.mode)}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem",
                borderRadius: "50px", border: inputMode === btn.mode ? "none" : "2px solid #e2e8f0",
                background: inputMode === btn.mode ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "white",
                color: inputMode === btn.mode ? "white" : "#334155", fontWeight: "700", fontSize: "1.05rem",
                cursor: "pointer", transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: inputMode === btn.mode ? "0 10px 30px rgba(102,126,234,0.3)" : "none" }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {inputMode === "guided" ? (
          <>
            <StepIndicator steps={steps} currentStep={getCurrentStep()} />

            <div style={STYLES.card}>
              <div style={{ marginBottom: "2rem" }}>
                <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                  color: "#1e1b4b", fontSize: "1.1rem" }}>
                  <img src="/book.png" alt="Book" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 1: Choose Mandala (Book)
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                  gap: "1rem" }}>
                  {Array.from({length: 10}, (_, i) => i + 1).map(n => (
                    <div key={n} onClick={() => { setMandalaNum(n.toString()); setHymnNum("");
                      setStanzaNum(""); setSloka(null); setError(null); }}
                      style={{ padding: "1.5rem 1rem", borderRadius: "16px", textAlign: "center",
                        cursor: "pointer", border: mandalaNum === n.toString() ? "3px solid #667eea" : "2px solid #e5e7eb",
                        background: mandalaNum === n.toString() ? "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)" : "white",
                        transform: mandalaNum === n.toString() ? "scale(1.05)" : "scale(1)",
                        transition: "all 0.3s",
                        boxShadow: mandalaNum === n.toString() ? "0 8px 20px rgba(102, 126, 234, 0.3)" : "0 2px 8px rgba(0,0,0,0.05)" }}>
                      <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "0.5rem",
                        color: mandalaNum === n.toString() ? "#667eea" : "#6b7280" }}>{n}</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: "600" }}>
                        Mandala {n}
                      </div>
                    </div>
                  ))}
                </div>
                {mandalaNum && indexData && (
                  <p style={{ fontSize: "0.9rem", color: "#10b981", marginTop: "1rem",
                    fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <FaCheck /> Contains {indexData.total_hymns} hymns
                  </p>
                )}
              </div>

              {mandalaNum && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", color: "black" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                      color: "#1e1b4b", fontSize: "1.1rem" }}>
                      <img src="/sukta.png" alt="Sukta" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 2: Select Sukta (Hymn)
                    </label>
                    <SearchableDropdown value={hymnNum ? `Sukta ${hymnNum} (${indexData?.hymns?.find(h => h.hymn_number === Number(hymnNum))?.total_stanzas || 0} stanzas)` : ""}
                      placeholder="Search or select sukta..." options={getFilteredHymns()}
                      onSelect={(h) => { setHymnNum(h.hymn_number); setStanzaNum(""); setSloka(null);
                        setIsHymnDropdownOpen(false); }}
                      searchValue={hymnSearch} onSearchChange={setHymnSearch}
                      isOpen={isHymnDropdownOpen} setIsOpen={setIsHymnDropdownOpen}
                      disabled={!indexData || loading} dropdownRef={hymnDropdownRef}
                      renderOption={(h) => `Sukta ${h.hymn_number} (${h.total_stanzas} stanzas)`}
                      helpText={indexData ? `${indexData.total_hymns} suktas available` : null} />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "1rem", fontWeight: "700",
                      color: "#1e1b4b", fontSize: "1.1rem" }}>
                      <img src="/mantra.png" alt="Mantra" style={{ width: "1.3rem", height: "1.3rem", display: "inline-block", verticalAlign: "middle", marginRight: "0.3rem" }} /> Step 3: Select Mantra (Stanza)
                    </label>
                    <SearchableDropdown value={stanzaNum ? `Mantra ${stanzaNum}` : ""}
                      placeholder="Search or select mantra..." options={getFilteredStanzas()}
                      onSelect={(s) => { setStanzaNum(s); setSloka(null); setIsStanzaDropdownOpen(false); }}
                      searchValue={stanzaSearch} onSearchChange={setStanzaSearch}
                      isOpen={isStanzaDropdownOpen} setIsOpen={setIsStanzaDropdownOpen}
                      disabled={!indexData || !hymnNum || loading} dropdownRef={stanzaDropdownRef}
                      renderOption={(s) => `Mantra ${s}`}
                      helpText={(() => {
                        if (!indexData || !hymnNum) return "Select sukta first";
                        const h = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
                        return h ? `${h.total_stanzas} mantras available` : null;
                      })()} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ textAlign: "center", margin : "10rem auto 3rem auto" }}>
              <button onClick={handleSearch} disabled={loading || !mandalaNum || !hymnNum || !stanzaNum}
                style={{ ...STYLES.btn, background: (!mandalaNum || !hymnNum || !stanzaNum) ? "#9ca3af" 
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: (!mandalaNum || !hymnNum || !stanzaNum) ? "not-allowed" : "pointer",
                  boxShadow: (!mandalaNum || !hymnNum || !stanzaNum) ? "none" : "0 10px 30px rgba(102,126,234,0.3)",
                  display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                <img src="/search1.png" alt="Search" style={{ width: "1.2rem", height: "1.2rem", filter: "brightness(0) invert(1)" }} />
                {loading ? "Searching..." : "Retrieve Sacred Verse"}
              </button>
            </div>
          </>
        ) : (
          <div style={STYLES.card}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1e1b4b",
              marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaBolt style={{ color: "#f59e0b" }} /> Quick Reference Input
            </h3>
            <p style={{ color: "#475569", marginBottom: "1.5rem", fontSize: "1.05rem" }}>
              Enter reference in format: <strong>Mandala.Sukta.Mantra</strong> (e.g., 1.10.129)
            </p>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <input type="text" value={quickInput} onChange={(e) => setQuickInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleQuickInput()}
                placeholder="e.g., 1.10.129" style={STYLES.input}
                onFocus={(e) => e.target.style.borderColor = "#667eea"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
              <button onClick={handleQuickInput} style={STYLES.btn}>Go →</button>
            </div>
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ color: "#6b7280", fontWeight: "600" }}>Examples:</span>
              {["1.1.1", "2.5.3", "10.129.1"].map(ex => (
                <button key={ex} onClick={() => setQuickInput(ex)}
                  style={{ padding: "0.5rem 1rem", background: "#f3f4f6", border: "1px solid #e5e7eb",
                    borderRadius: "8px", cursor: "pointer", color: "#1e1b4b", fontWeight: "600",
                    fontSize: "0.9rem" }}>{ex}</button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "16px", padding: "1rem", color: "#dc2626", textAlign: "center",
            marginBottom: "2rem", fontWeight: "600" }}>⚠️ {error}</div>
        )}

        {sloka && (
          <div>
            <VerseCard sloka={sloka} playing={playing} toggleAudio={toggleAudio} />

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              {sloka.padas?.length > 0 && (
                <div style={{ background: "white", borderRadius: "24px", padding: "0",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                  <button onClick={() => setShowPadasAnalysis(!showPadasAnalysis)}
                    style={{ width: "100%", background: "#f8fafc", border: "none", padding: "1.5rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", borderRadius: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <FaBookOpen color="#667eea" />
                      <span style={{ fontWeight: "600" }}>Grammatical Analysis ({sloka.padas.length} words)</span>
                    </div>
                    {showPadasAnalysis ? <FaCompress color="#667eea" /> : <FaExpand color="#667eea" />}
                  </button>
                  {showPadasAnalysis && (
                    <div style={{ padding: "1.5rem", display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
                      {sloka.padas.map((p, i) => (
                        <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0",
                          borderRadius: "12px", padding: "1.2rem" }}>
                          <div style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.8rem",
                            fontFamily: "'Noto Serif Devanagari', serif" }}>{p.form}</div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.8rem" }}>
                            <strong>Lemma:</strong> {p.lemma}
                          </div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                            {Object.entries(p).filter(([k]) => !['form', 'lemma'].includes(k)).map(([k, v]) => (
                              <span key={k} style={{ background: "#667eea", color: "white",
                                padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem" }}>
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {sloka.translations && Object.keys(sloka.translations).filter(k => k.toLowerCase() !== 'griffith').length > 0 && (
                <div style={{ background: "white", borderRadius: "24px", padding: "0",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.08)" }}>
                  <button onClick={() => setShowAllTranslations(!showAllTranslations)}
                    style={{ width: "100%", background: "#f8fafc", border: "none", padding: "1.5rem",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      cursor: "pointer", borderRadius: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                      <FaQuoteLeft color="#10b981" />
                      <span style={{ fontWeight: "600" }}>
                        Alternative Translations ({Object.keys(sloka.translations).filter(k => k.toLowerCase() !== 'griffith').length})
                      </span>
                    </div>
                    {showAllTranslations ? <FaCompress color="#10b981" /> : <FaExpand color="#10b981" />}
                  </button>
                  {showAllTranslations && (
                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      {Object.entries(sloka.translations).filter(([t]) => t.toLowerCase() !== 'griffith')
                        .map(([translator, translation]) => (
                        <div key={translator} style={{ background: "#f8fafc", border: "1px solid #e2e8f0",
                          borderRadius: "12px", padding: "1.5rem", borderLeft: "4px solid #10b981" }}>
                          <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "#10b981",
                            marginBottom: "0.8rem" }}>{translator.toUpperCase()}</div>
                          <p style={{ fontSize: "1.05rem", color: "#1e293b", lineHeight: "1.6",
                            fontStyle: "italic", margin: 0 }}>"{translation}"</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <audio ref={audioRef} src={`${API_BASE}/audio/${mandalaNum}/${hymnNum}/${stanzaNum}`}
              onEnded={() => setPlaying(false)}
              onError={() => { setPlaying(false); setError("Audio not found"); }} />
          </div>
        )}
      </div>
    </div>
  );
}
