const API_URL = "http://127.0.0.1:8000";

export async function uploadReceipt(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/receipt/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload receipt");
  }
  return response.json();
}

// THIS IS WHAT YOUR ANALYTICS PAGE IS LOOKING FOR
export async function fetchAnalytics() {
  const response = await fetch(`${API_URL}/receipt/analytics`);
  if (!response.ok) {
    throw new Error("Failed to fetch analytics");
  }
  return response.json();
}

export async function getEmissionResults() {
  const response = await fetch(`${API_URL}/results`);
  if (!response.ok) {
    throw new Error("Failed to fetch emission results");
  }
  return response.json();
}