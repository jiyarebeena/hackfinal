import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";
import { fetchAnalytics } from "../services/api";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [view, setView] = useState("weekly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics()
      .then(data => {
        setAnalytics(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div style={styles.center}>
      <h2 className="pulse" style={{ color: '#00ff96', letterSpacing: '5px' }}>RETRIEVING_DATA_LOGS...</h2>
    </div>
  );
  
  if (!analytics) return <div style={styles.center}><p style={{color: '#ff4444'}}>[ ERROR: NO_DATA_STREAM ]</p></div>;

  const dataMap = {
    daily: analytics.daily || [],
    weekly: analytics.weekly || [],
    monthly: analytics.monthly || []
  };

  const chartData = dataMap[view];
  const totalForView = chartData.reduce((sum, item) => sum + item.co2, 0);

  const xKey = view === "daily" ? "date" : view === "weekly" ? "week" : "month";

  // Shared chart props to keep look consistent
  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 10, left: -20, bottom: 0 }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>[ SYSTEM_ANALYTICS ]</h1>

      {/* TOTAL CARD */}
      <div style={styles.glassCard}>
        <h2 style={styles.cardLabel}>
          {view.toUpperCase()}_TOTAL_EMISSIONS
        </h2>
        <p style={styles.total}>
          {totalForView.toFixed(1)} <span style={{fontSize: '1rem'}}>KG_CO2</span>
        </p>
      </div>

      {/* TOGGLE BUTTONS */}
      <div style={styles.toggleContainer}>
        {["daily", "weekly", "monthly"].map(type => (
          <button
            key={type}
            onClick={() => setView(type)}
            style={{
              ...styles.button,
              backgroundColor: view === type ? "#00ff96" : "transparent",
              color: view === type ? "black" : "white",
              border: view === type ? "none" : "1px solid #333"
            }}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CHART CONTAINER */}
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={320}>
          {view === "daily" ? (
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey={xKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={styles.tooltip} itemStyle={{ color: '#00ff96' }} />
              <Line type="monotone" dataKey="co2" stroke="#00ff96" strokeWidth={3} dot={{ fill: '#00ff96', r: 4 }} activeDot={{ r: 8 }} />
            </LineChart>
          ) : view === "weekly" ? (
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey={xKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={styles.tooltip} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
              <Bar dataKey="co2" fill="#00ff96" radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey={xKey} stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={styles.tooltip} />
              <Area type="monotone" dataKey="co2" stroke="#00ff96" fill="#00ff96" fillOpacity={0.2} />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* INSIGHT CARD */}
      <div style={{...styles.glassCard, borderLeft: '4px solid #00ff96', textAlign: 'left'}}>
        <h3 style={{...styles.cardLabel, color: '#00ff96', marginBottom: '10px'}}>💡 CORE_INSIGHT</h3>
        <p style={styles.insightText}>
          EMISSIONS ARE HIGHEST DURING PERIODS WITH FREQUENT ANIMAL-BASED
          PURCHASES. SHIFTING TO PLANT-BASED ALTERNATIVES IS RECOMMENDED 
          TO OPTIMIZE ENVIRONMENTAL EFFICIENCY.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "100px 20px",
    fontFamily: "'Courier New', Courier, monospace",
    color: "white"
  },
  center: {
    display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'
  },
  heading: {
    textAlign: "center",
    letterSpacing: "8px",
    fontSize: "1.8rem",
    marginBottom: "3rem",
    textTransform: "uppercase"
  },
  glassCard: {
    padding: "30px",
    background: "rgba(255, 255, 255, 0.02)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    marginBottom: "20px",
    textAlign: "center"
  },
  cardLabel: {
    fontSize: "0.7rem",
    letterSpacing: "3px",
    color: "#444",
    textTransform: "uppercase",
    margin: "0 0 15px 0"
  },
  total: {
    fontSize: "3.5rem",
    color: "#00ff96",
    fontWeight: "900",
    margin: 0,
    textShadow: "0 0 20px rgba(0, 255, 150, 0.3)"
  },
  toggleContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px"
  },
  button: {
    padding: "10px 20px",
    fontSize: "0.7rem",
    letterSpacing: "2px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s ease"
  },
  chartWrapper: {
    background: "rgba(255, 255, 255, 0.01)",
    border: "1px solid #111",
    padding: "30px 20px 10px 0",
    marginBottom: "20px"
  },
  tooltip: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #00ff96',
    borderRadius: '0px',
    color: '#fff',
    fontSize: '12px',
    fontFamily: 'monospace'
  },
  insightText: {
    fontSize: "0.8rem",
    color: "#aaa",
    lineHeight: "1.6",
    letterSpacing: "1px",
    margin: 0
  }
};