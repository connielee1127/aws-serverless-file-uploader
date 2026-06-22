# S3 Upload App (Serverless File Manager)

A full-stack serverless file upload system using **AWS Lambda, API Gateway, and S3**, with React frontend for uploading, listing, and deleting files.

---

## Live Demo

- Frontend: [frontend vercel deployment](aws-serverless-file-uploader.vercel.app)
- Backend API: [API-GATEWAY-ENDPOINT](https://r4ov8eew07.execute-api.us-east-1.amazonaws.com/default/hello-api)

---

## Tech Stack

### Frontend
- React (Hooks)
- Fetch API / XMLHttpRequest (upload progress)
- JavaScript (ES6+)

### Backend
- AWS Lambda (Node.js)
- API Gateway (HTTP API)
- AWS S3 (file storage)
- AWS SDK v3

---

## Features

- Upload files to S3 using presigned URLs
- Real-time upload progress bar
- List uploaded files from S3
- Delete files from S3
- Fully serverless backend
  
---


## Backend Setup

```bash
cd s3-upload-app-backend
npm install
``` 

---

## Frontend Setup

```bash
cd s3-upload-app-frontend  
npm install  
npm start
```

---

## Key Learnings

- CORS must be enabled in API Gateway + Lambda responses  
- IAM permissions must include BOTH bucket + object ARNs  
- fetch() does not support upload progress → use XMLHttpRequest    

---

## Possible Improvements

- Add authentication (Cognito / JWT)  
- Add file preview (images, PDFs)  
- Add drag-and-drop upload  
- Add pagination for large buckets  
- Add file type validation  

---

## Author

Built by Connie Lee

---





## 🏗️ Architecture
