import React, { useState } from "react";

export default function GroundWaterPrediction() {
  const [location, setLocation] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location) return;
    setLoading(true);
    const prompt = `Query: ${location} next 7 days ground water level.. just give me an rough prediction need not be accurate to the tee based on recent weather rain and stuff. just use general knowledge
    dont tell me where the fuck to find accurate data and all. its summer season in india. do what i say that alone. dont add extra things. just answer with good bad decent etc`;
    try {
      const response = await fetch(
        "https://gemini-backend-uiuz.onrender.com/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setPrediction(data.response);
    } catch (error) {
      console.error("Error fetching prediction:", error);
      setPrediction("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#e6f2ff",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          marginBottom: "1.5rem",
          color: "#003366",
        }}
      >
        Ground Water Prediction
      </h1>
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "white",
          borderRadius: "1rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          padding: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Enter Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#0066cc",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>
        {prediction && (
          <div style={{ marginTop: "1rem" }}>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: "bold",
                color: "#004080",
              }}
            >
              Prediction:
            </h2>
            <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
              {prediction}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
