import { useEffect, useRef, useState } from "react";
import { FaBookOpen, FaChevronDown, FaChevronUp, FaCompress, FaExpand, FaLanguage, FaQuoteLeft, FaSearch, FaVolumeUp } from "react-icons/fa";
import { API_BASE } from "../config";

export default function VedaExplorer() {
  const [mandalaNum, setMandalaNum] = useState("");
  const [indexData, setIndexData] = useState(null);
  const [hymnNum, setHymnNum] = useState("");
  const [stanzaNum, setStanzaNum] = useState("");
  const [sloka, setSloka] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [availableMandalas, setAvailableMandalas] = useState([]);
  
  // Search functionality for dropdowns
  const [hymnSearch, setHymnSearch] = useState("");
  const [stanzaSearch, setStanzaSearch] = useState("");
  const [isHymnDropdownOpen, setIsHymnDropdownOpen] = useState(false);
  const [isStanzaDropdownOpen, setIsStanzaDropdownOpen] = useState(false);
  
  // Expanded view states for sloka details
  const [showPadasAnalysis, setShowPadasAnalysis] = useState(false);
  const [showAllTranslations, setShowAllTranslations] = useState(false);
  
  const audioRef = useRef(null);
  const hymnDropdownRef = useRef(null);
  const stanzaDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hymnDropdownRef.current && !hymnDropdownRef.current.contains(event.target)) {
        setIsHymnDropdownOpen(false);
      }
      if (stanzaDropdownRef.current && !stanzaDropdownRef.current.contains(event.target)) {
        setIsStanzaDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load available mandalas on component mount
  useEffect(() => {
    // Try to get mandala list from a general endpoint or hardcode known range
    const mandalaRange = Array.from({length: 10}, (_, i) => i + 1);
    setAvailableMandalas(mandalaRange);
  }, []);

  useEffect(() => {
    if (mandalaNum) {
      setLoading(true);
      fetch(`${API_BASE}/index/${mandalaNum}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            setError(data.error);
            setIndexData(null);
          } else {
            setIndexData(data);
            setError(null);
          }
        })
        .catch(() => {
          setError("Could not load data from backend.");
          setIndexData(null);
        })
        .finally(() => setLoading(false));
    } else {
      setIndexData(null);
      setError(null);
    }
  }, [mandalaNum]);

  const handleMandalaChange = (newMandala) => {
    setMandalaNum(newMandala);
    setHymnNum("");
    setStanzaNum("");
    setSloka(null);
    setError(null);
    setHymnSearch("");
    setStanzaSearch("");
    setIsHymnDropdownOpen(false);
    setIsStanzaDropdownOpen(false);
  };

  const handleHymnChange = (newHymn) => {
    setHymnNum(newHymn);
    setStanzaNum("");
    setSloka(null);
    setError(null);
    setStanzaSearch("");
    setIsHymnDropdownOpen(false);
    setIsStanzaDropdownOpen(false);
  };

  const handleStanzaChange = (newStanza) => {
    setStanzaNum(newStanza);
    setSloka(null);
    setError(null);
    setIsStanzaDropdownOpen(false);
  };

  // Filter functions for search
  const getFilteredHymns = () => {
    if (!indexData?.hymns) return [];
    if (!hymnSearch) return indexData.hymns;
    
    return indexData.hymns.filter(hymn => 
      hymn.hymn_number.toString().includes(hymnSearch)
    );
  };

  const getFilteredStanzas = () => {
    if (!indexData || !hymnNum) return [];
    
    const selectedHymn = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
    const stanzaCount = selectedHymn?.total_stanzas || 1;
    const allStanzas = Array.from({length: stanzaCount}, (_, i) => i + 1);
    
    if (!stanzaSearch) return allStanzas;
    
    return allStanzas.filter(num => 
      num.toString().includes(stanzaSearch)
    );
  };

  // Custom Searchable Dropdown Component
  const SearchableDropdown = ({ 
    label, 
    value, 
    placeholder, 
    options, 
    onSelect, 
    searchValue, 
    onSearchChange, 
    isOpen, 
    setIsOpen, 
    disabled, 
    dropdownRef,
    renderOption,
    helpText,
    searchPlaceholder
  }) => {
    const maxDisplayHeight = "200px";
    
    return (
      <div style={{ flex: "1 1 250px" }} ref={dropdownRef}>
        <label style={{
          display: "block",
          marginBottom: "0.5rem",
          fontWeight: "600",
          color: "#374151",
          fontSize: "0.9rem"
        }}>{label}</label>
        
        <div style={{ position: "relative" }}>
          <div
            onClick={() => !disabled && setIsOpen(!isOpen)}
            style={{
              width: "100%",
              padding: "0.75rem",
              fontSize: "1rem",
              border: `2px solid ${disabled ? '#d1d5db' : (isOpen ? '#667eea' : '#e5e7eb')}`,
              borderRadius: "12px",
              backgroundColor: disabled ? "#ffffffff" : "#ffffffff",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span style={{ 
              color: value ? "#374151" : "#9ca3af",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {value || placeholder}
            </span>
            {!disabled && (
              isOpen ? <FaChevronUp color="#6b7280" /> : <FaChevronDown color="#6b7280" />
            )}
          </div>
          
          {isOpen && !disabled && (
            <div style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "white",
              border: "2px solid #667eea",
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              zIndex: 1000,
              maxHeight: maxDisplayHeight,
              overflow: "hidden"
            }}>
              {/* Search Input */}
              <div style={{
                padding: "0.75rem",
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f8fafc"
              }}>
                <div style={{ position: "relative" }}>
                  <FaSearch style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#214178ff",
                    fontSize: "0.9rem"
                  }} />
                  <input
                    type="text"
                    placeholder={searchPlaceholder || `Search ${label.toLowerCase()}...`}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.5rem 0.5rem 2.5rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                      fontSize: "0.9rem",
                      outline: "none"
                    }}
                    autoFocus
                  />
                </div>
              </div>
              
              {/* Options List */}
              <div style={{
                maxHeight: "150px",
                overflowY: "auto",
                padding: "0.25rem"
              }}>
                {options.length === 0 ? (
                  <div style={{
                    padding: "1rem",
                    textAlign: "center",
                    color: "#a85b5bff",
                    fontStyle: "italic"
                  }}>
                    No matches found
                  </div>
                ) : (
                  options.slice(0, 50).map((option, index) => (
                    <div
                      key={index}
                      onClick={() => onSelect(option)}
                      style={{
                        padding: "0.5rem",
                        cursor: "pointer",
                        color: "#374151",
                        borderRadius: "8px",
                        margin: "0.125rem 0",
                        backgroundColor: "transparent",
                        transition: "background-color 0.15s ease",
                        fontSize: "0.95rem"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#d07cea3a";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                      }}
                    >
                      {renderOption ? renderOption(option) : option}
                    </div>
                  ))
                )}
                {options.length > 50 && (
                  <div style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    color: "#6b7280",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                    borderTop: "1px solid #e5e7eb"
                  }}>
                    Showing first 50 results. Use search to narrow down.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {helpText && (
          <small style={{ 
            color: disabled ? "#9ca3af" : "#10b981", 
            fontSize: "0.8rem",
            display: "block",
            marginTop: "0.25rem"
          }}>
            {helpText}
          </small>
        )}
      </div>
    );
  };

  const handleSearch = () => {
    setError(null);
    setSloka(null);
    if (!mandalaNum || !hymnNum || !stanzaNum) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    fetch(`${API_BASE}/sloka/${mandalaNum}/${hymnNum}/${stanzaNum}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setSloka(null);
          setError(data.error);
        } else {
          setSloka(data);
          setError(null);
          setPlaying(false);
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
        }
      })
      .catch(() => setError("Failed to fetch sloka from backend."))
      .finally(() => setLoading(false));
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
    }
  };

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h2 style={{ 
          color: "#374151", 
          marginBottom: "0.5rem", 
          fontWeight: "600",
          fontSize: "1.5rem"
        }}>
          📖 Explore Rig Veda by Reference
        </h2>
        <p style={{
          color: "#6b7280",
          fontSize: "0.95rem",
          marginBottom: "1.5rem"
        }}>
          Navigate through the sacred verses using the traditional indexing system
        </p>
      </div>

      {/* Mandala, Hymn and Stanza Selectors */}
      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
        
        {/* Mandala Dropdown */}
        <div style={{ flex: "1 1 250px" }}>
          <label style={{
            display: "block",
            marginBottom: "0.5rem",
            fontWeight: "600",
            color: "#374151",
            fontSize: "0.95rem"
          }}>
            📚 Mandala (Book)
          </label>
          <select
            value={mandalaNum}
            onChange={(e) => handleMandalaChange(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "1rem",
              background: "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
              outline: "none"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.boxShadow = "0 0 0 3px rgba(102, 126, 234, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e5e7eb";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="">Select Mandala...</option>
            {availableMandalas.map(num => (
              <option key={num} value={num}>
                Mandala {num}
              </option>
            ))}
          </select>
          {mandalaNum && indexData && (
            <p style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginTop: "0.5rem"
            }}>
              Contains {indexData.total_hymns} hymns
            </p>
          )}
        </div>
      
      {/* Hide the book grid section */}
      <div style={{ display: "none" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1.5rem",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {availableMandalas.map(num => (
            <div
              key={num}
              onClick={() => handleMandalaChange(num.toString())}
              className="mandala-book"
              style={{
                position: "relative",
                cursor: "pointer",
                transform: mandalaNum === num.toString() ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
              }}
            >
              {/* Book Cover */}
              <div style={{
                background: mandalaNum === num.toString() 
                  ? "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                padding: "2rem 1rem",
                boxShadow: mandalaNum === num.toString()
                  ? "0 20px 40px rgba(245, 158, 11, 0.4), 0 0 0 3px #fbbf24"
                  : "0 8px 25px rgba(102, 126, 234, 0.3)",
                position: "relative",
                overflow: "hidden",
                height: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                border: mandalaNum === num.toString() ? "3px solid #fbbf24" : "none",
                transformStyle: "preserve-3d",
                perspective: "1000px"
              }}
              className="book-cover"
            >
              {/* Book Spine Effect */}
              <div style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: "8px",
                background: "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, transparent 100%)",
                borderRadius: "12px 0 0 12px"
              }} />
              
              {/* Page Lines Effect */}
              <div style={{
                position: "absolute",
                right: "8px",
                top: "20px",
                bottom: "20px",
                width: "3px",
                background: "rgba(255,255,255,0.3)",
                borderRadius: "2px"
              }} />
              <div style={{
                position: "absolute",
                right: "14px",
                top: "20px",
                bottom: "20px",
                width: "2px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "2px"
              }} />
              
              {/* Om Symbol */}
              <div style={{
                fontSize: "2.5rem",
                marginBottom: "0.5rem",
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))"
              }}>
                �️
              </div>
              
              {/* Mandala Number */}
              <div style={{
                color: "white",
                fontSize: "2rem",
                fontWeight: "800",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                letterSpacing: "1px"
              }}>
                {num}
              </div>
              
              {/* Mandala Label */}
              <div style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "0.85rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginTop: "0.25rem"
              }}>
                Mandala
              </div>
              
              {/* Hymn Count Badge */}
              {indexData && mandalaNum === num.toString() && (
                <div style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "rgba(255,255,255,0.25)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "12px",
                  padding: "0.25rem 0.6rem",
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.3)"
                }}>
                  {indexData.total_hymns} hymns
                </div>
              )}
              
              {/* Selected Checkmark */}
              {mandalaNum === num.toString() && (
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  width: "28px",
                  height: "28px",
                  background: "white",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                }}>
                  ✓
                </div>
              )}
              
              {/* Decorative Corner */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "40px",
                height: "40px",
                background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
                borderRadius: "12px 0 40px 0"
              }} />
            </div>
            
            {/* Book Info Below */}
            <div style={{
              textAlign: "center",
              marginTop: "0.75rem",
              fontSize: "0.85rem",
              color: mandalaNum === num.toString() ? "#f59e0b" : "#6b7280",
              fontWeight: mandalaNum === num.toString() ? "600" : "500"
            }}>
              {mandalaNum === num.toString() ? "✨ Selected" : "Click to select"}
            </div>
            </div>
          ))}
        </div>
      </div> {/* End hidden book grid */}
      </div> {/* End Mandala selector container */}

      {mandalaNum && (
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>


        {/* Hymn Searchable Dropdown */}
        <SearchableDropdown
          label="🎵 Sukta (Hymn)"
          value={hymnNum ? `Sukta ${hymnNum} (${indexData?.hymns?.find(h => h.hymn_number === Number(hymnNum))?.total_stanzas || 0} stanzas)` : ""}
          placeholder="Select Sukta..."
          searchPlaceholder="Enter hymn number (e.g. 15)..."
          options={getFilteredHymns()}
          onSelect={(hymn) => handleHymnChange(hymn.hymn_number)}
          searchValue={hymnSearch}
          onSearchChange={setHymnSearch}
          isOpen={isHymnDropdownOpen}
          setIsOpen={setIsHymnDropdownOpen}
          disabled={!indexData || loading}
          dropdownRef={hymnDropdownRef}
          renderOption={(hymn) => `Sukta ${hymn.hymn_number} (${hymn.total_stanzas} stanzas)`}
          helpText={indexData ? `✓ ${indexData.total_hymns} suktas available` : (!mandalaNum ? "Select a mandala first" : null)}
        />

        {/* Stanza Searchable Dropdown */}
        <SearchableDropdown
          label="📝 Mantra (Stanza)"
          value={stanzaNum ? `Mantra ${stanzaNum}` : ""}
          placeholder="Select Mantra..."
          searchPlaceholder="Enter stanza number (e.g. 3)..."
          options={getFilteredStanzas()}
          onSelect={(stanza) => handleStanzaChange(stanza)}
          searchValue={stanzaSearch}
          onSearchChange={setStanzaSearch}
          isOpen={isStanzaDropdownOpen}
          setIsOpen={setIsStanzaDropdownOpen}
          disabled={!indexData || !hymnNum || loading}
          dropdownRef={stanzaDropdownRef}
          renderOption={(stanza) => `Mantra ${stanza}`}
          helpText={(() => {
            if (!indexData || !hymnNum) return "Select sukta first";
            const selectedHymn = indexData.hymns.find(h => h.hymn_number === Number(hymnNum));
            return selectedHymn ? `✓ ${selectedHymn.total_stanzas} mantras available` : null;
          })()}
        />
        </div>
      )}

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <button
          onClick={handleSearch}
          disabled={loading || !mandalaNum || !hymnNum || !stanzaNum}
          style={{
            backgroundColor: (!mandalaNum || !hymnNum || !stanzaNum) ? "#9ca3af" : "#667eea",
            color: "white",
            border: "none",
            padding: "0.875rem 2rem",
            borderRadius: "12px",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: (!mandalaNum || !hymnNum || !stanzaNum) ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
            transform: loading ? "scale(0.98)" : "scale(1)"
          }}
        >
          {loading ? "🔍 Searching..." : "🔍 Find Sloka"}
        </button>
        {(!mandalaNum || !hymnNum || !stanzaNum) && (
          <div style={{ 
            marginTop: "0.5rem", 
            fontSize: "0.8rem", 
            color: "#6b7280", 
            fontStyle: "italic" 
          }}>
            Please select all three fields to search
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: "#dc3545", textAlign: "center", marginBottom: "1rem" }}>{error}</div>
      )}

      {sloka && (
        <div style={{ marginTop: "2rem" }}>
          {/* Main Sloka Card */}
          <div
            style={{
              border: "none",
              borderRadius: "20px",
              padding: "2.5rem",
              boxShadow: "0 15px 50px rgba(0, 0, 0, 0.08)",
              backgroundColor: "white",
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* Background Pattern */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "200px",
              height: "200px",
              background: "radial-gradient(circle, rgba(102, 126, 234, 0.05) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: "translate(50%, -50%)"
            }} />

            {/* Header with Location and Audio */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem"
              }}>
                <h3 style={{ 
                  color: "#1e293b", 
                  margin: 0,
                  fontSize: "1.4rem",
                  fontWeight: "700",
                  letterSpacing: "0.5px"
                }}>
                  📍 {sloka.location}
                </h3>
                {sloka.stanza_number && (
                  <span style={{
                    backgroundColor: "#667eea",
                    color: "white",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600"
                  }}>
                    Stanza {sloka.stanza_number}
                  </span>
                )}
              </div>
              <button
                onClick={toggleAudio}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: playing ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                  color: playing ? "white" : "#64748b",
                  border: "none",
                  padding: "0.8rem 1.2rem",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
              >
                <FaVolumeUp size={16} />
                {playing ? "Pause Audio" : "Play Audio"}
              </button>
            </div>

            {/* Sanskrit Text */}
            <div style={{
              backgroundColor: "rgba(102, 126, 234, 0.08)",
              border: "2px solid rgba(102, 126, 234, 0.15)",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem",
              position: "relative"
            }}>
              <div style={{
                position: "absolute",
                top: "1rem",
                left: "1.5rem",
                color: "#667eea",
                fontSize: "0.8rem",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1px"
              }}>
                Sanskrit Text
              </div>
              <p
                className="sanskrit-text"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  textAlign: "center",
                  color: "#1e293b",
                  lineHeight: "1.8",
                  margin: "1rem 0 0 0",
                  fontFamily: "'Noto Serif Devanagari', serif"
                }}
              >
                {sloka.sanskrit}
              </p>
            </div>

            {/* Transliteration */}
            <div style={{
              backgroundColor: "#f8fafc",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.8rem"
              }}>
                <FaLanguage color="#667eea" size={16} />
                <span style={{
                  color: "#667eea",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Transliteration {sloka.transliteration_scheme && `(${sloka.transliteration_scheme})`}
                </span>
              </div>
              <p style={{ 
                fontSize: "1.1rem",
                color: "#475569",
                lineHeight: "1.6",
                margin: 0,
                fontStyle: "italic"
              }}>
                {sloka.transliteration}
              </p>
            </div>

            {/* Primary Translation */}
            <div style={{
              backgroundColor: "rgba(16, 185, 129, 0.05)",
              border: "2px solid rgba(16, 185, 129, 0.15)",
              borderRadius: "16px",
              padding: "2rem",
              marginBottom: "2rem"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem"
              }}>
                <FaQuoteLeft color="#10b981" size={18} />
                <span style={{
                  color: "#10b981",
                  fontSize: "1rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  Primary Translation
                </span>
              </div>
              <p style={{ 
                fontSize: "1.15rem",
                color: "#1e293b",
                lineHeight: "1.7",
                margin: 0,
                fontWeight: "500"
              }}>
                {sloka.translation}
              </p>
            </div>
          </div>

          {/* Expandable Sections */}
          <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            
            {/* Grammatical Analysis Section */}
            {sloka.padas && sloka.padas.length > 0 && (
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                overflow: "hidden",
                border: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={() => setShowPadasAnalysis(!showPadasAnalysis)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "none",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem"
                  }}>
                    <FaBookOpen color="#667eea" size={18} />
                    <span style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1e293b"
                    }}>
                      Grammatical Analysis ({sloka.padas.length} words)
                    </span>
                  </div>
                  {showPadasAnalysis ? <FaCompress color="#667eea" /> : <FaExpand color="#667eea" />}
                </button>
                
                {showPadasAnalysis && (
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                      gap: "1rem"
                    }}>
                      {sloka.padas.map((pada, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "1.2rem",
                            transition: "transform 0.2s ease, box-shadow 0.2s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "none";
                          }}
                        >
                          <div style={{
                            fontSize: "1.1rem",
                            fontWeight: "700",
                            color: "#1e293b",
                            marginBottom: "0.8rem",
                            fontFamily: "'Noto Serif Devanagari', serif"
                          }}>
                            {pada.form}
                          </div>
                          <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.8rem" }}>
                            <strong>Lemma:</strong> {pada.lemma}
                          </div>
                          <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.4rem"
                          }}>
                            {Object.entries(pada).filter(([key]) => !['form', 'lemma'].includes(key)).map(([key, value]) => (
                              <span
                                key={key}
                                style={{
                                  backgroundColor: "#667eea",
                                  color: "white",
                                  padding: "0.2rem 0.6rem",
                                  borderRadius: "12px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  textTransform: "uppercase"
                                }}
                              >
                                {key}: {value}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Additional Translations Section */}
            {sloka.translations && Object.keys(sloka.translations).filter(key => key.toLowerCase() !== 'griffith').length > 0 && (
              <div style={{
                backgroundColor: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
                overflow: "hidden",
                border: "1px solid #e2e8f0"
              }}>
                <button
                  onClick={() => setShowAllTranslations(!showAllTranslations)}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "none",
                    padding: "1.5rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem"
                  }}>
                    <FaQuoteLeft color="#10b981" size={18} />
                    <span style={{
                      fontSize: "1.1rem",
                      fontWeight: "600",
                      color: "#1e293b"
                    }}>
                      Alternative Translations ({Object.keys(sloka.translations).filter(key => key.toLowerCase() !== 'griffith').length})
                    </span>
                  </div>
                  {showAllTranslations ? <FaCompress color="#10b981" /> : <FaExpand color="#10b981" />}
                </button>
                
                {showAllTranslations && (
                  <div style={{ padding: "1.5rem" }}>
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1.5rem"
                    }}>
                      {Object.entries(sloka.translations).filter(([translator]) => translator.toLowerCase() !== 'griffith').map(([translator, translation], index) => (
                        <div
                          key={translator}
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            padding: "1.5rem",
                            borderLeft: "4px solid #10b981"
                          }}
                        >
                          <div style={{
                            fontSize: "0.9rem",
                            fontWeight: "700",
                            color: "#10b981",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            marginBottom: "0.8rem"
                          }}>
                            {translator}
                          </div>
                          <p style={{
                            fontSize: "1.05rem",
                            color: "#1e293b",
                            lineHeight: "1.6",
                            margin: 0,
                            fontStyle: "italic"
                          }}>
                            "{translation}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <audio
            ref={audioRef}
            src={`${API_BASE}/audio/${mandalaNum}/${hymnNum}/${stanzaNum}`}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setPlaying(false);
              setError("Audio not found or unsupported format.");
            }}
          />
        </div>
      )}
    </div>
  );
}
