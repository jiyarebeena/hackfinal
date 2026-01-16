import { useState } from "react";
import "./App.css";
import Analytics from "../../src/pages/Analytics";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("home"); // home | result | analytics

  const uploadReceipt = async () => {
    if (!file) return alert("Please upload a receipt");

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/receipt/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
    setPage("result");
  };

  return (
    <div className="page">
      <div className="card">

        

        {/* HOME */}
        {page === "home" && !loading && (
          <>
            <h1>🌱 BOYCO2 </h1>
            <p className="subtitle">
              Track the environmental impact of your purchases
            </p>

            <input
              type="file"
              accept=".jpg,.png"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <button className="primary" onClick={uploadReceipt}>
              Calculate Carbon Impact
            </button>

            <button
              className="secondary"
              onClick={() => setPage("analytics")}
            >
              View Analytics
            </button>
          </>
        )}

        {/* LOADING */}
        {loading && (
          <div className="loading">
            <p>🔍 Scanning receipt...</p>
            <p>🌍 Calculating carbon footprint...</p>
          </div>
        )}

        {/* RESULT */}
        {page === "result" && result && (
          <div className="result">
            <h2>🔥 Total CO₂ Emission</h2>
            <h1 className="co2">{result.total_co2} kg</h1>

            <ul>
              {result.items.map((item, i) => (
                <li key={i} className={item.co2 > 2 ? "high" : ""}>
                  {item.item} • {item.category} • {item.co2} kg
                </li>
              ))}
            </ul>

            <div className="actions">
              <button onClick={() => setPage("home")}>
                Upload Another Receipt
              </button>

              <button
                className="secondary"
                onClick={() => setPage("analytics")}
              >
                View Analytics
              </button>
            </div>
          </div>
        )}

        {/* ANALYTICS */}
        {page === "analytics" && (
          <>
            <Analytics />
            <button
              style={{ marginTop: "1rem" }}
              onClick={() => setPage("home")}
            >
              ⬅ Back to Home
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default App;