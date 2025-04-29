import React, { useState, useEffect } from "react";

export default function GroundWaterPrediction() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState("");
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [authMode, setAuthMode] = useState("login"); // 'login' or 'signup'
  const [authForm, setAuthForm] = useState({ email: "", password: "" });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("gw-user"));
    if (storedUser) setUser(storedUser);

    const storedHistory = localStorage.getItem("gw-prediction-history");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("gw-prediction-history", JSON.stringify(history));
  }, [history]);

  const handleAuth = () => {
    const { email, password } = authForm;
    if (!email || !password) return;

    if (authMode === "signup") {
      const userData = { email, password };
      localStorage.setItem(`gw-user-${email}`, JSON.stringify(userData));
      localStorage.setItem("gw-user", JSON.stringify(userData));
      setUser(userData);
    } else {
      const saved = localStorage.getItem(`gw-user-${email}`);
      if (!saved) {
        alert("No user found. Please sign up.");
        return;
      }
      const savedUser = JSON.parse(saved);
      if (savedUser.password !== password) {
        alert("Incorrect password");
        return;
      }
      localStorage.setItem("gw-user", JSON.stringify(savedUser));
      setUser(savedUser);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("gw-user");
    setUser(null);
    setAuthForm({ email: "", password: "" });
    setAuthMode("login");
  };

  const handleSubmit = async () => {
    if (!location) return;
    setLoading(true);
    const prompt = `Query: ${location} next 7 days ground water level.. just give me a rough prediction need not be accurate to the tee based on recent weather rain and stuff. just use general knowledge. Don't add extra things its summer in chennai.`;

    try {
      const response = await fetch(
        "https://gemini-backend-uiuz.onrender.com/gemini",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!response.ok) throw new Error("Network error");

      const data = await response.json();
      setPrediction(data.response);
      setHistory((prev) => [
        ...prev.slice(-4),
        { location, response: data.response },
      ]);
    } catch (err) {
      console.error(err);
      setPrediction("Failed to fetch prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        style={{
          height: "100vh",
          background: "#004d40cc",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "2rem",
            borderRadius: "1rem",
            width: "320px",
            textAlign: "center",
            boxShadow: "0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          <h2 style={{ color: "#00796b", marginBottom: "1rem" }}>
            {authMode === "signup" ? "Sign Up" : "Login"}
          </h2>
          <input
            type="email"
            placeholder="Email"
            value={authForm.email}
            onChange={(e) =>
              setAuthForm((prev) => ({ ...prev, email: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={authForm.password}
            onChange={(e) =>
              setAuthForm((prev) => ({ ...prev, password: e.target.value }))
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              border: "1px solid #ccc",
            }}
          />
          <button
            onClick={handleAuth}
            style={{
              marginTop: "1rem",
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#00796b",
              color: "white",
              border: "none",
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
          >
            {authMode === "signup" ? "Sign Up" : "Login"}
          </button>
          <p
            style={{ marginTop: "1rem", fontSize: "0.9rem", cursor: "pointer" }}
          >
            {authMode === "signup" ? (
              <>
                Already have an account?{" "}
                <span
                  style={{ color: "#00796b", textDecoration: "underline" }}
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  style={{ color: "#00796b", textDecoration: "underline" }}
                  onClick={() => setAuthMode("signup")}
                >
                  Sign Up
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #fff)",
        padding: "2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
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
        <div style={{ marginBottom: "1rem", color: "#004d40" }}>
          Welcome, {user.email}!
        </div>
        <button
          onClick={handleLogout}
          style={{
            marginBottom: "1.5rem",
            background: "#e53935",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0.4rem 1rem",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

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
