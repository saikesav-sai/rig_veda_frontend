import { useState } from "react";
import { FaDice, FaSearch } from "react-icons/fa";
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
    <div>
      {showResults && searchResults ? (
        <SearchResults 
          results={searchResults} 
          onBack={handleBackToSearch}
        />
      ) : (
        <div>
          <div style={{ 
            textAlign: "center", 
            marginBottom: "3rem",
            background: "#ffffff",
            padding: "3rem",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ 
              fontSize: "2.2rem", 
              marginBottom: "1rem", 
              color: "#374151",
              fontWeight: "600"
            }}>
              🔍 What wisdom are you seeking?
            </h2>
            <p style={{
              fontSize: "1.1rem",
              color: "#6b7280",
              marginBottom: "2rem",
              maxWidth: "600px",
              margin: "0 auto 2rem"
            }}>
              Discover verses across the entire Rig Veda using Semantic search. 
              Explore sacred themes, divine concepts, and timeless wisdom.
            </p>
            <div style={{ 
              display: "flex", 
              maxWidth: "650px", 
              margin: "0 auto 2rem",
              gap: "0.75rem"
            }}>
              <input
                type="text"
                placeholder="Intelligent search: 'fire sacrifice', 'dawn goddess', 'cosmic creation'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSemanticSearch()}
                style={{
                  flex: 1,
                  padding: "1.25rem 1.5rem",
                  fontSize: "1.1rem",
                  border: "2px solid #e5e7eb",
                  borderRadius: "16px",
                  outline: "none",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
              />
              <button
                onClick={() => handleSemanticSearch()}
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#9ca3af" : "#667eea",
                  color: "white",
                  border: "none",
                  padding: "1.25rem 2rem",
                  borderRadius: "16px",
                  fontSize: "1.1rem",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)"
                }}
              >
                <FaSearch /> {loading ? "Searching..." : "Search"}
              </button>
            </div>
            <button
              onClick={handleSurpriseMe}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "30px",
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                margin: "0 auto",
                fontWeight: "600",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 16px rgba(245, 158, 11, 0.3)"
              }}
            >
              <FaDice /> Surprise Me!
            </button>
            {error && (
              <div style={{ 
                color: "#dc2626", 
                textAlign: "center", 
                marginTop: "2rem",
                padding: "1rem 1.5rem",
                background: "#fef2f2",
                borderRadius: "12px",
                border: "1px solid #fecaca"
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: "3rem" }}>
            <h3 style={{ 
              textAlign: "center", 
              marginBottom: "2rem", 
              color: "#374151",
              fontSize: "1.3rem",
              fontWeight: "600"
            }}>
              🎯 Explore by Theme
            </h3>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "1.5rem" 
            }} className="responsive-grid">
              {exampleSearches.map(({ text, query }, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSearchQuery(query);
                    handleSemanticSearch(query);
                  }}
                  style={{
                    background: "white",
                    border: "2px solid #e5e7eb",
                    borderRadius: "16px",
                    padding: "2rem 1.5rem",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    fontWeight: "500",
                    fontSize: "1.1rem"
                  }}
                  className="card-hover mobile-padding"
                  onMouseOver={(e) => {
                    e.target.style.borderColor = "#667eea";
                    e.target.style.background = "#f8fafc";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.borderColor = "#e5e7eb";
                    e.target.style.background = "white";
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
