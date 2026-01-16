import { motion } from "framer-motion";
import UploadReceipt from "../../frontend/src/components/UploadReceipt";
import ResultCard from "../../frontend/src/components/ResultCard";

export default function Home() {
  return (
    <div className="home">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="hero glass"
      >
        <h1 className="title">BOYCO2</h1>
        <p className="subtitle">Know the carbon behind what you buy.</p>

        <UploadReceipt />
      </motion.div>

      <ResultCard />
    </div>
  );
}
