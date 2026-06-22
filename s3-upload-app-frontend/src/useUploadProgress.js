import { useState, useCallback } from "react";

export function useUploadProgress() {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const upload = useCallback((file, uploadUrl) => {
        if (!file || !uploadUrl) {
            throw new Error("file and upload url required.")
        }    
        setProgress(0);
        setLoading(true);
        setError(null);

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open("PUT", uploadUrl);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    setProgress(percent);
                }
            };

            xhr.onload = () => {
                setLoading(false);

                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(true);
                } else {
                    const err = new Error(xhr.responseText || "Upload failed.");
                    setError(err);
                    reject(err);  
                }
            };

            xhr.setRequestHeader("Content-Type", file.type);
            xhr.send(file);
        });
    }, []);

    return {
        upload, 
        progress, 
        loading, 
        error
    };
}