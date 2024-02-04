import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { MediaPipeFaceMeshMediaPipeModelConfig } from "@tensorflow-models/face-landmarks-detection";

tf.registerBackend("webgl", tf.findBackendFactory("webgl"));
tf.registerBackend("cpu", tf.findBackendFactory("cpu"));

const WebcamCapture: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectorConfig = {
    runtime: "mediapipe" as MediaPipeFaceMeshMediaPipeModelConfig["runtime"],
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh",
    refineLandmarks: false,
    maxFaces: 2,
  };

  const [faceDetected, setFaceDetected] = useState<boolean>(true);

  useEffect(() => {
    tf.ready().then(() => {
      tf.setBackend("webgl")
        .then(() => {
          console.log("WebGL backend initialized");
        })
        .catch((error) => {
          console.error("Failed to initialize WebGL backend", error);

          tf.setBackend("cpu").then(() => {
            console.log("CPU backend initialized");
          });
        });
    });

    const loadModel = async () => {
      const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;

      return await faceLandmarksDetection.createDetector(model, detectorConfig);
    };

    const detectFaces = async (model: any) => {
      if (
        webcamRef.current &&
        canvasRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        video.crossOrigin = "anonymous";
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        const faceEstimates = await model.estimateFaces(video, {
          flipHorizontal: false,
        });

        if (faceEstimates.length > 0) {
          setFaceDetected(true); // Set faceDetected to true
        } else {
          setFaceDetected(false); // Set faceDetected to false
        }

        console.log("faceEstimates.length", faceEstimates.length);
      }
    };

    console.log("faceDetected", faceDetected);

    loadModel().then((model) => {
      setInterval(() => {
        detectFaces(model).catch((error) => {
          console.error(error);
        });
      }, 1000); // Run face detection every second
    });
  }, []);

  useEffect(() => {
    const alertTimer = setTimeout(() => {
      if (!faceDetected) {
        console.log("No face detected within 10 seconds");
        alert("No face detected within 10 seconds");
      }
    }, 1000); // 10 seconds delay (in milliseconds)

    return () => {
      clearTimeout(alertTimer); // Clear the timer if the component unmounts
    };
  }, [faceDetected]);

  return (
    <>
      <Webcam
        ref={webcamRef}
        style={{ width: "640px", height: "480px" }}
        mirrored={true}
      />
      <canvas
        ref={canvasRef}
        style={{ width: "640px", height: "480px", position: "absolute" }}
      />
    </>
  );
};

export default WebcamCapture;
