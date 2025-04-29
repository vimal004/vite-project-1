import React, { useState, useEffect } from "react";

function AuthForm({ onAuth }) {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("gw-username");
    if (storedUser) {
      setIsLoggedIn(true);
      onAuth(storedUser);
    }
  }, [onAuth]);

  const handleLogin = () => {
    if (username.trim()) {
      localStorage.setItem("gw-username", username);
      setIsLoggedIn(true);
      onAuth(username);
    }
  };

  if (isLoggedIn) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "#004d40cc",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "1rem",
          width: "300px",
          textAlign: "center",
          boxShadow: "0 0 20px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: "1rem", color: "#00796b" }}>Login</h2>
        <input
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleLogin}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#00796b",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default function GroundWaterPrediction() {
  const [username, setUsername] = useState(null);
  const [location, setLocation] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("gw-prediction-history");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("gw-prediction-history", JSON.stringify(history));
  }, [history]);

  const handleSubmit = async () => {
    if (!location) return;
    setLoading(true);
    const prompt = `Query: ${location} next 7 days ground water level.. just give me an rough prediction need not be accurate to the tee based on recent weather rain and stuff. just use general knowledge. Don't add extra things. just answer with good bad decent etc.`;
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
      setHistory((prev) => [
        ...prev.slice(-4),
        { location, response: data.response },
      ]);
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
        background: "linear-gradient(to right, #e0f7fa, #fff)",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <AuthForm onAuth={setUsername} />
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#004d40",
            marginBottom: "1.5rem",
          }}
        >
          Ground Water Prediction
        </h1>
        {username && (
          <p style={{ color: "#004d40", marginBottom: "1rem" }}>
            Welcome, {username}!
          </p>
        )}
        <div
          style={{
            background: "#ffffff",
            padding: "2rem",
            borderRadius: "1rem",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
                fontSize: "1rem",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: loading ? "#ccc" : "#00796b",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              {loading ? "Predicting..." : "Predict"}
            </button>
          </div>

          {prediction && (
            <div style={{ textAlign: "left", marginTop: "1.5rem" }}>
              <h2
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#00796b",
                }}
              >
                Prediction Result:
              </h2>
              <div
                style={{
                  marginTop: "0.5rem",
                  backgroundColor: "#f1f8e9",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  whiteSpace: "pre-wrap",
                }}
              >
                {prediction}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div style={{ marginTop: "2rem", textAlign: "left" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color: "#004d40",
                }}
              >
                Recent Queries:
              </h3>
              <ul
                style={{ marginTop: "0.5rem", listStyle: "none", padding: 0 }}
              >
                {history.map((item, index) => (
                  <li
                    key={index}
                    style={{
                      background: "#e0f2f1",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <strong>{item.location}:</strong>
                    <div
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.95rem",
                        color: "#333",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.response}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
