import { useState, useEffect, useRef } from "react";
import { useUploadProgress } from "./useUploadProgress";

function App() {
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

  const {
    upload, 
    progress,
    loading
  } = useUploadProgress();

  const uploadFile = async () => {
    // get upload url
    const res = await fetch(
      `https://r4ov8eew07.execute-api.us-east-1.amazonaws.com/default/hello-api/upload-url?file=${file.name}`
    );
    const { uploadUrl } = await res.json();

    // s3 upload using url

    await upload(file, uploadUrl)

    alert("Upload complete.");
    await fetchFiles();

    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const fetchFiles = async () => {
    const res = await fetch(
        `https://r4ov8eew07.execute-api.us-east-1.amazonaws.com/default/hello-api/files`
    );
    const data = await res.json();
    setFiles(data.files);
  }

  const deleteFile = async (key) => {
    await fetch (
      `https://r4ov8eew07.execute-api.us-east-1.amazonaws.com/default/hello-api/file?key=${key}`, 
      { method: "DELETE" }
    );

    alert("Delete complete.")
    await fetchFiles();
  }

  useEffect(() => {
    fetchFiles();
  }, []);
  
  return (
    <div>
      <h1> S3 Upload App </h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files[0])} 
      />

      <button onClick={uploadFile} disabled={!file || loading}>
        Upload
      </button>

      {loading && (
        <div style={{ marginTop: 10 }}>
          <div>Uploading... {progress.toFixed(0)}%</div>

          <div style={{ width: 200, height: 10, background: "#eee" }}>
            <div
              style={{
                width:`${progress}%`,
                height: "100%",
                background: "green",
                transition: "width 0.1s"
              }}
            />
          </div>
        </div> 
      )}

      <ul>
        {files.map(f => (
          <li key={f.key}>
            {f.key}
            <button onClick={() => deleteFile(f.key)}>Delete</button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
