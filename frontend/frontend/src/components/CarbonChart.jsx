import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const CarbonChart = ({ data }) => {
  const chartData = {
    labels: ["Food", "Transport", "Electricity", "Shopping"],
    datasets: [
      {
        label: "CO₂ Emissions (kg)",
        data: data || [12, 19, 8, 15],
        backgroundColor: "#f5c77a",
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default CarbonChart;
