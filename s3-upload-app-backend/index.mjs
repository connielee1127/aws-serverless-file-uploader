import { 
  S3Client, 
  PutObjectCommand, 
  ListObjectsV2Command, 
  DeleteObjectCommand 
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({ region: "us-east-1" });

export const handler = async (event) => {
  console.log("Incoming event:", event);

  const path = event.requestContext.http.path;
  const query = event.queryStringParameters || {};

  const name =
    event.queryStringParameters?.name || "World";

  const fileName = query.file;

  const greeting = 
    process.env.GREETING_MESSAGE || "Hello";

  const route = {
    "/default/hello-api": () => ({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }, 
      body: JSON.stringify({
        message: `${greeting} ${name}`
      }),
    }), 

    "/default/hello-api/time": () => ({
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }, 
      body: JSON.stringify({
        timestamp: new Date().toISOString()
      })   
    }),

    "/default/hello-api/files": async () => {
      const command = new ListObjectsV2Command({
        Bucket: "connie-s3-upload-file-demo"
      });

      const result = await s3.send(command);

      const files = (result.Contents || []).map(file => ({
        key: file.Key, 
        size: file.Size,
        lastModified: file.LastModified
      }));

      return {
        statusCode: 200, 
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ files })
      };
    },

    "/default/hello-api/file": async (event) => {
      const key = event.queryStringParameters?.key;
      
      if (!key) {
        return {
          statusCode: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }, 
          body: JSON.stringify({
            error: "Invalid access"
          }) 
        };
      }
      await s3.send(
        new DeleteObjectCommand({
          Bucket: "connie-s3-upload-file-demo",
          Key: key
        })
      );
      return {
        statusCode: 200, 
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ success: true, message: "File deleted" }),
      }
    },

    "/default/hello-api/upload-url": async () => {
      if (!fileName) {
        return {
          statusCode: 400, 
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }, 
          body: JSON.stringify({
            error: `Missing file ${fileName}`
          })
        }
      }
      
      const command = new PutObjectCommand({
        Bucket: "connie-s3-upload-file-demo", 
        Key: fileName,
        ContentType: "application/octet-stream"
      });

      const uploadUrl = await getSignedUrl(s3, command, {
        expiresIn: 60
      });
      
      return {
        statusCode: 200, 
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }, 
        body: JSON.stringify({
          uploadUrl
        }), 
      }
    }    
  };

  const routeHandler = route[path]

  if (!routeHandler) {
    return {
      statusCode: 404,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }, 
      body: JSON.stringify({
        error: "Route not found"
      })
    };
  }

  return await routeHandler(event);
};
