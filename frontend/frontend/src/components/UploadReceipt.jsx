import axios from "axios";
import { useState } from "react";

export default function UploadReceipt() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return alert("Upload a receipt");

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:8000/receipt/upload", formData);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "1rem" }}
      />
      <button onClick={handleUpload}>Analyze Receipt</button>
    </div>
  );
}
