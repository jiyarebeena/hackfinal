import { motion } from "framer-motion";

export default function ResultCard({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="dashboard glass"
    >
      <div className="stats">
        <div className="stat">
          <h4>Total CO₂</h4>
          <h2>{result.total_co2} kg</h2>
        </div>
        <div className="stat">
          <h4>Highest Impact</h4>
          <h2>{result.highest_item}</h2>
        </div>
        <div className="stat">
          <h4>Category</h4>
          <h2>{result.category}</h2>
        </div>
      </div>
    </motion.div>
  );
}
