import { useState } from "react";
import { FaDice, FaSearch, FaStar } from "react-icons/fa";
import { API_BASE } from "../config";
import SearchResults from "./SearchResults";

export default function SemanticSearch({ onResults }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Example searches for quick access - optimized for intelligent filtering
  const exampleSearches = [
    { text: "Fire & Sacred Rituals", query: "fire sacrifice agni sacred ritual offerings" },
    { text: "Dawn Goddess & Light", query: "dawn goddess ushas light morning radiance" },
    { text: "Thunder God Indra", query: "indra thunder storm lightning vajra warrior" },
    { text: "Cosmic Creation & Universe", query: "creation universe cosmic order rita primordial" },
    { text: "Divine Wisdom & Knowledge", query: "wisdom knowledge divine truth enlightenment" },
    { text: "Water & Purification", query: "water purification sacred rivers streams flowing" }
  ];

  // Surprise me function
  const handleSurpriseMe = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/semantic/random`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setSearchResults(null);
      } else {
        // Transform random results to match expected format
        const transformedData = {
          intent: 'random_exploration',
          query: 'Random Vedic Wisdom',
          summary: `Discover ${data.total_results} randomly selected verses from the Rig Veda`,
          verses: data.results.map(verse => ({
            ...verse,
            confidence: 1.0 // Random results have full confidence
          }))
        };
        setSearchQuery("Random Vedic Wisdom");
        setSearchResults(transformedData);
        setShowResults(true);
        if (onResults) onResults(transformedData);
      }
    } catch (err) {
      setError("Failed to fetch random verses. Please try again.");
      setSearchResults(null);
      if (onResults) onResults(null);
    } finally {
      setLoading(false);
    }
  };

  // Distribution analysis for dynamic confidence thresholds
  const analyzeConfidenceDistribution = (scores) => {
    if (scores.length === 0) return { threshold: 0.65, maxResults: 15 };
    
    // Sort scores in descending order
    const sortedScores = [...scores].sort((a, b) => b - a);
    
    // Calculate quartiles
    const q1Index = Math.floor(sortedScores.length * 0.25);
    const q2Index = Math.floor(sortedScores.length * 0.5);
    const q3Index = Math.floor(sortedScores.length * 0.75);
    
    const q1 = sortedScores[q1Index];
    const q2 = sortedScores[q2Index]; // Median
    const q3 = sortedScores[q3Index];
    
    // Find natural breakpoints by looking for gaps
    const gaps = [];
    for (let i = 0; i < Math.min(20, sortedScores.length - 1); i++) {
      const gap = sortedScores[i] - sortedScores[i + 1];
      gaps.push({ position: i, gap, score: sortedScores[i + 1] });
    }
    
    // Sort gaps by size to find the most significant break
    gaps.sort((a, b) => b.gap - a.gap);
    
    // Quality assessment
    const topScore = sortedScores[0];
    const scoreRange = topScore - sortedScores[sortedScores.length - 1];
    
    let threshold, maxResults;
    
    // High-quality results: clear leader with good distribution
    if (topScore >= 0.85 && gaps[0]?.gap > 0.1) {
      threshold = Math.max(0.70, gaps[0].score);
      maxResults = Math.min(15, gaps[0].position + 5);
    }
    // Good distribution with natural break
    else if (gaps[0]?.gap > 0.08 && gaps[0].position < 25) {
      threshold = Math.max(0.60, gaps[0].score);
      maxResults = Math.min(20, gaps[0].position + 8);
    }
    // Tight cluster of good results
    else if (q1 >= 0.70 && (q1 - q3) < 0.15) {
      threshold = Math.max(0.65, q3 - 0.05);
      maxResults = Math.min(18, q3Index + 5);
    }
    // Broad distribution - use quartile analysis
    else if (scoreRange > 0.3) {
      threshold = Math.max(0.55, q2);
      maxResults = Math.min(25, q2Index + 10);
    }
    // Poor overall quality - be more inclusive
    else {
      threshold = Math.max(0.45, q3);
      maxResults = Math.min(30, sortedScores.length);
    }
    
    return { threshold, maxResults };
  };

  // Dynamic confidence-based filtering with distribution analysis
  const filterAndRankResults = (results, query) => {
    // Convert similarity scores to confidence (higher similarity = higher confidence)
    const resultsWithConfidence = results.map(verse => ({
      ...verse,
      confidence: 1 - (verse.similarity_score || 0.5) // FAISS returns distances, so lower = better
    }));

    // Sort by confidence (highest first)
    resultsWithConfidence.sort((a, b) => b.confidence - a.confidence);

    // Extract confidence scores for distribution analysis
    const confidenceScores = resultsWithConfidence.map(v => v.confidence);
    
    // Get dynamic threshold and max results from distribution analysis
    const { threshold: distributionThreshold, maxResults: distributionMaxResults } = 
      analyzeConfidenceDistribution(confidenceScores);
    
    // Query complexity adjustment
    const queryWords = query.trim().split(/\s+/).length;
    let complexityAdjustment = 0;
    let maxResultsAdjustment = 0;
    
    if (queryWords <= 2) {
      // Simple queries: slightly stricter
      complexityAdjustment = 0.05;
      maxResultsAdjustment = -3;
    } else if (queryWords >= 6) {
      // Complex queries: slightly more lenient
      complexityAdjustment = -0.05;
      maxResultsAdjustment = +5;
    }
    
    // Final thresholds
    const minConfidence = Math.max(0.45, Math.min(0.80, distributionThreshold + complexityAdjustment));
    const maxResults = Math.max(8, Math.min(30, distributionMaxResults + maxResultsAdjustment));

    // Filter by confidence and limit results
    const filteredResults = resultsWithConfidence
      .filter(verse => verse.confidence >= minConfidence)
      .slice(0, maxResults);

    // Fallback: ensure minimum results if we're being too strict
    if (filteredResults.length < 5 && resultsWithConfidence.length >= 5) {
      const fallbackThreshold = Math.max(0.40, minConfidence - 0.15);
      const fallbackResults = resultsWithConfidence
        .filter(verse => verse.confidence >= fallbackThreshold)
        .slice(0, Math.max(8, maxResults));
      
      return {
        filteredResults: fallbackResults,
        totalFetched: results.length,
        highConfidenceCount: fallbackResults.filter(v => v.confidence >= 0.75).length,
        averageConfidence: fallbackResults.length > 0 
          ? fallbackResults.reduce((sum, v) => sum + v.confidence, 0) / fallbackResults.length 
          : 0,
        distributionAnalysis: {
          originalThreshold: distributionThreshold,
          adjustedThreshold: minConfidence,
          fallbackUsed: true
        }
      };
    }

    return {
      filteredResults,
      totalFetched: results.length,
      highConfidenceCount: filteredResults.filter(v => v.confidence >= 0.75).length,
      averageConfidence: filteredResults.length > 0 
        ? filteredResults.reduce((sum, v) => sum + v.confidence, 0) / filteredResults.length 
        : 0,
      distributionAnalysis: {
        originalThreshold: distributionThreshold,
        adjustedThreshold: minConfidence,
        fallbackUsed: false,
        maxResultsFromDistribution: distributionMaxResults
      }
    };
  };

  // Semantic search function
  const handleSemanticSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      // Request more results for better filtering
      const response = await fetch(`${API_BASE}/semantic/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query,
          top_k: 50  // Get more results for intelligent filtering
        }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setSearchResults(null);
        if (onResults) onResults(null);
      } else {
        // Apply intelligent filtering with distribution analysis
        const { 
          filteredResults, 
          totalFetched, 
          highConfidenceCount, 
          averageConfidence,
          distributionAnalysis
        } = filterAndRankResults(data.results, query);

        // Create clean summary without technical details
        const enhancedSummary = `Found ${filteredResults.length} relevant verses related to "${query}"`;

        // Transform the results to match the expected format
        const transformedData = {
          intent: 'semantic_search',
          query: data.query,
          summary: enhancedSummary,
          verses: filteredResults,
          searchMetadata: {
            totalFetched,
            displayCount: filteredResults.length,
            highConfidenceCount,
            averageConfidence,
            distributionAnalysis
          }
        };
        setSearchResults(transformedData);
        setShowResults(true);
        if (onResults) onResults(transformedData);
      }
    } catch (err) {
      setError("Failed to search. Please try again.");
      setSearchResults(null);
      if (onResults) onResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSearch = () => {
    setShowResults(false);
    setSearchResults(null);
    setError(null);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)", 
      padding: "2rem 0",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Static Mandala Background */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px",
        height: "800px",
        opacity: "0.15",
        pointerEvents: "none",
        zIndex: 0
      }}>
        <svg viewBox="0 0 600 600" style={{
          width: "100%",
          height: "100%"
        }}>
          <defs>
            <radialGradient id="mandala-gradient-search" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#667eea" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#764ba2" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f093fb" stopOpacity="0.05" />
            </radialGradient>
          </defs>
          <circle cx="300" cy="300" r="140" fill="url(#mandala-gradient-search)" />
          {[...Array(12)].map((_, i) => (
            <ellipse 
              key={i} 
              cx="300" 
              cy="120" 
              rx="40" 
              ry="14" 
              fill="rgba(118,75,162,0.1)" 
              transform={`rotate(${(i / 12) * 360} 300 300)`} 
            />
          ))}
        </svg>
      </div>

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem", position: "relative", zIndex: 1 }}>
        {showResults && searchResults ? (
          <SearchResults 
            results={searchResults} 
            onBack={handleBackToSearch}
          />
        ) : (
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
              <h2 style={{ 
                fontSize: "3.5rem", 
                fontWeight: "700", 
                color: "#1e1b4b",
                marginBottom: "1rem",
                letterSpacing: "-1px",
                lineHeight: "1.2"
              }}>
                <FaStar style={{ fontSize: "2.5rem", verticalAlign: "middle", marginRight: "0.5rem", color: "#f59e0b" }} />
                Semantic Search
              </h2>
              <p style={{ color: "#475569", fontSize: "1.2rem", lineHeight: "1.6", fontWeight: "400", maxWidth: "700px", margin: "0 auto" }}>
                Discover the wisdom of the Rig Veda through intelligent semantic search. 
                Find verses by meaning, theme, and concept.
              </p>
            </div>

            {/* Search Card */}
            <div style={{ 
              background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))", 
              borderRadius: "24px", 
              padding: "2.5rem", 
              boxShadow: "0 15px 50px rgba(102,126,234,0.15)", 
              border: "2px solid rgba(102,126,234,0.15)",
              marginBottom: "3rem",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ 
                display: "flex", 
                maxWidth: "800px", 
                margin: "0 auto 1.5rem",
                gap: "1rem",
                flexWrap: "wrap"
              }}>
                <input
                  type="text"
                  placeholder="Search for wisdom: 'fire sacrifice', 'dawn goddess', 'cosmic creation'..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
                  style={{
                    flex: 1,
                    minWidth: "300px",
                    padding: "1.25rem 1.5rem",
                    fontSize: "1.1rem",
                    border: "2px solid #e5e7eb",
                    borderRadius: "16px",
                    outline: "none",
                    transition: "all 0.3s ease",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    fontWeight: "500"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#667eea"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
                <button
                  onClick={() => handleSemanticSearch()}
                  disabled={loading}
                  style={{
                    background: loading ? "#9ca3af" : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    padding: "1.25rem 2.5rem",
                    borderRadius: "16px",
                    fontSize: "1.1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "700",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: loading ? "none" : "0 10px 30px rgba(102,126,234,0.3)",
                    whiteSpace: "nowrap"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 15px 40px rgba(102,126,234,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = loading ? "none" : "0 10px 30px rgba(102,126,234,0.3)";
                  }}
                >
                  <FaSearch /> {loading ? "Searching..." : "Search"}
                </button>
              </div>
              
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={handleSurpriseMe}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    color: "white",
                    border: "none",
                    padding: "1rem 2rem",
                    borderRadius: "50px",
                    fontSize: "1rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    fontWeight: "700",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: loading ? "none" : "0 10px 30px rgba(245,158,11,0.3)"
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.transform = "translateY(-3px)";
                      e.target.style.boxShadow = "0 15px 40px rgba(245,158,11,0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = loading ? "none" : "0 10px 30px rgba(245,158,11,0.3)";
                  }}
                >
                  <FaDice /> Surprise Me!
                </button>
              </div>

              {error && (
                <div style={{ 
                  background: "rgba(239, 68, 68, 0.1)", 
                  border: "2px solid rgba(239, 68, 68, 0.3)", 
                  borderRadius: "16px", 
                  padding: "1rem", 
                  color: "#dc2626", 
                  textAlign: "center", 
                  marginTop: "1.5rem", 
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem"
                }}>
                  <span style={{ fontSize: "1.2rem" }}>⚠️</span>
                  {error}
                </div>
              )}
            </div>
            
            {/* Theme Cards */}
            <div style={{ marginBottom: "3rem" }}>
              <h3 style={{ 
                textAlign: "center", 
                marginBottom: "2rem", 
                color: "#1e1b4b",
                fontSize: "1.8rem",
                fontWeight: "700"
              }}>
                🎯 Explore by Theme
              </h3>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
                gap: "1.5rem" 
              }} className="responsive-grid">
                {exampleSearches.map(({ text, query }, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchQuery(query);
                      handleSemanticSearch(query);
                    }}
                    disabled={loading}
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(254,252,232,0.95))",
                      border: "2px solid rgba(102,126,234,0.15)",
                      borderRadius: "20px",
                      padding: "2.5rem 2rem",
                      cursor: loading ? "not-allowed" : "pointer",
                      textAlign: "center",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                      fontWeight: "600",
                      fontSize: "1.15rem",
                      color: "#1e1b4b",
                      opacity: loading ? 0.6 : 1,
                      backdropFilter: "blur(10px)"
                    }}
                    className="card-hover mobile-padding"
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.target.style.borderColor = "rgba(102,126,234,0.4)";
                        e.target.style.transform = "translateY(-5px)";
                        e.target.style.boxShadow = "0 20px 50px rgba(102,126,234,0.2)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(102,126,234,0.15)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                      {index === 0 ? "🔥" : index === 1 ? "🌅" : index === 2 ? "⚡" : index === 3 ? "🌌" : index === 4 ? "📿" : "💧"}
                    </div>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
