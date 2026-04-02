"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Clock3, Copy, Languages, Sparkles, Video, Volume2 } from "lucide-react";
import { signlearnoTheme as theme, signlearnoText, signlearnoUpperLabel } from "@/components/signlearno/theme";
import { extractHolisticKeypoints, SIGN_FEATURE_SIZE, SIGN_SEQUENCE_LENGTH } from "@/lib/mediapipe";
import { drawDetectedLabel, drawHolisticLandmarks, drawProbabilityBars, type HolisticDrawResults } from "@/lib/mediapipe";
import { predictSignToText } from "@/lib/api/sign-translation";
import { formatSession, describeCameraError, getCameraStream, humanizeDetectedLabel, resolveHolisticConstructor } from "../utils";
import { ToolIconButton, ToolStatCard } from "../ui/shared";

export function SignToTextExperience() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<number | null>(null);
  const sessionIntervalRef = useRef<number | null>(null);
  const sequenceRef = useRef<number[][]>([]);
  const framePendingRef = useRef(false);
  const predictionPendingRef = useRef(false);
  const lastPredictionAtRef = useRef(0);
  const latestScoresRef = useRef<Record<string, number> | null>(null);
  const latestLabelRef = useRef<string>("");
  const holisticRef = useRef<{
    close: () => Promise<void>;
    onResults: (listener: (results: unknown) => void) => void;
    send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
    setOptions: (options: Record<string, unknown>) => void;
  } | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [translationText, setTranslationText] = useState("Start the camera to begin translating.");
  const [translationStatus, setTranslationStatus] = useState("Camera Off");
  const [confidence, setConfidence] = useState<number | null>(null);

  const stopCamera = async () => {
    if (captureIntervalRef.current) {
      window.clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }

    if (sessionIntervalRef.current) {
      window.clearInterval(sessionIntervalRef.current);
      sessionIntervalRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (holisticRef.current) {
      try {
        await holisticRef.current.close();
      } catch {
        // ignore MediaPipe teardown errors
      }
      holisticRef.current = null;
    }

    sequenceRef.current = [];
    framePendingRef.current = false;
    predictionPendingRef.current = false;
    latestScoresRef.current = null;
    latestLabelRef.current = "";

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }

    setCameraActive(false);
    setCameraReady(false);
    setIsPredicting(false);
    setSessionSeconds(0);
    setTranslationStatus("Camera Off");
  };

  useEffect(() => {
    return () => {
      void stopCamera();
    };
  }, []);

  const runPrediction = async (sequence: number[][]) => {
    predictionPendingRef.current = true;
    setIsPredicting(true);
    setTranslationStatus("Translating...");
    setCameraError(null);

    try {
      const response = await predictSignToText(sequence);
      const label = humanizeDetectedLabel(response.result.label);
      setTranslationText(label);
      setConfidence(response.result.confidence);
      setTranslationStatus("Live prediction ready");
      latestScoresRef.current = response.result.scores;
      latestLabelRef.current = label;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to reach the translation API.";
      setCameraError(message);
      setTranslationStatus("Prediction failed");
      setConfidence(null);
    } finally {
      setIsPredicting(false);
      predictionPendingRef.current = false;
    }
  };

  const startCamera = async () => {
    if (cameraActive) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported in this browser.");
      setTranslationStatus("Camera unavailable");
      return;
    }

    setCameraError(null);
    setConfidence(null);
    setTranslationText("Move into frame and start signing.");
    setTranslationStatus("Requesting camera access...");
    setSessionSeconds(0);
    sequenceRef.current = [];
    lastPredictionAtRef.current = 0;

    let stream: MediaStream | null = null;

    try {
      stream = await getCameraStream();

      const videoElement = videoRef.current;
      if (!videoElement) {
        throw new Error("Video element is not ready.");
      }

      videoElement.srcObject = stream;
      setCameraActive(true);
      setTranslationStatus("Starting video…");

      try {
        await videoElement.play();
      } catch (playError) {
        throw playError instanceof Error ? playError : new Error(String(playError));
      }

      const overlayCanvas = canvasRef.current;
      if (overlayCanvas) {
        overlayCanvas.width = videoElement.videoWidth || 640;
        overlayCanvas.height = videoElement.videoHeight || 480;
      }

      const mediaPipeModule = await import("@mediapipe/holistic");
      const HolisticConstructor = resolveHolisticConstructor(mediaPipeModule);

      const holistic = new HolisticConstructor({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
      });

      holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        refineFaceLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      holistic.onResults((results) => {
        const holisticResults = results as HolisticDrawResults & {
          poseLandmarks?: { x: number; y: number; z: number; visibility?: number }[];
          faceLandmarks?: { x: number; y: number; z: number }[];
          leftHandLandmarks?: { x: number; y: number; z: number }[];
          rightHandLandmarks?: { x: number; y: number; z: number }[];
        };

        const cvs = canvasRef.current;
        if (cvs) {
          const ctx = cvs.getContext("2d");
          if (ctx) {
            ctx.clearRect(0, 0, cvs.width, cvs.height);
            drawHolisticLandmarks(ctx, holisticResults, cvs.width, cvs.height);
            if (latestScoresRef.current) {
              drawProbabilityBars(ctx, latestScoresRef.current, cvs.width);
            }
            if (latestLabelRef.current) {
              drawDetectedLabel(ctx, latestLabelRef.current, cvs.width, cvs.height);
            }
          }
        }

        const keypoints = extractHolisticKeypoints(holisticResults);

        if (keypoints.length !== SIGN_FEATURE_SIZE) {
          return;
        }

        setCameraReady(true);
        sequenceRef.current = [...sequenceRef.current.slice(-(SIGN_SEQUENCE_LENGTH - 1)), keypoints];

        if (
          sequenceRef.current.length >= SIGN_SEQUENCE_LENGTH &&
          !predictionPendingRef.current &&
          Date.now() - lastPredictionAtRef.current > 1800
        ) {
          lastPredictionAtRef.current = Date.now();
          void runPrediction(sequenceRef.current.slice(-SIGN_SEQUENCE_LENGTH));
        }
      });

      streamRef.current = stream;
      holisticRef.current = holistic;
      setTranslationStatus("Collecting frames...");

      captureIntervalRef.current = window.setInterval(async () => {
        const currentVideo = videoRef.current;
        if (
          !currentVideo ||
          currentVideo.readyState < 2 ||
          !holisticRef.current ||
          framePendingRef.current
        ) {
          return;
        }

        framePendingRef.current = true;
        try {
          await holisticRef.current.send({ image: currentVideo });
        } finally {
          framePendingRef.current = false;
        }
      }, 140);

      sessionIntervalRef.current = window.setInterval(() => {
        setSessionSeconds((current) => current + 1);
      }, 1000);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      setCameraError(describeCameraError(error));
      await stopCamera();
      setTranslationStatus("Camera start failed");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translationText);
    } catch {
      setCameraError("Copy failed in this browser.");
    }
  };

  const handleSpeak = () => {
    if (!("speechSynthesis" in window) || !translationText.trim()) {
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(translationText));
  };

  const statusValue = cameraError
    ? cameraError
    : cameraActive
      ? isPredicting
        ? "Listening..."
        : cameraReady
          ? "Camera Active"
          : "Starting..."
      : "Camera Off";
  const accuracyValue =
    confidence !== null ? `${Math.round(confidence * 100)}% Confidence` : "Awaiting gesture";

  return (
    <section style={{ width: "90%", margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 24, rowGap: 16, alignItems: "start" }}>
        <section style={{ gridColumn: 1, gridRow: 1 }}>
          <div style={{ position: "relative", minHeight: 700, borderRadius: 28, border: `2px solid ${theme.colors.border}`, background: "linear-gradient(145deg, rgba(229, 247, 215, 0.9) 0%, rgba(255, 255, 255, 0.96) 100%)", overflow: "hidden", boxShadow: "0 22px 50px rgba(17, 24, 39, 0.08)" }}>
            <div style={{ position: "absolute", inset: 16, borderRadius: 22, background: "#FFFFFF", border: "2px solid rgba(88, 204, 2, 0.18)", boxShadow: "inset 0 0 0 1px rgba(88, 204, 2, 0.05)", overflow: "hidden" }}>
              <video
                ref={videoRef}
                muted
                playsInline
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraActive ? "block" : "none" }}
              />
              <canvas
                ref={canvasRef}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none", display: cameraActive ? "block" : "none" }}
              />
              {!cameraActive ? (
                <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, color: theme.colors.textMuted, background: "linear-gradient(180deg, rgba(229, 247, 215, 0.35) 0%, rgba(255,255,255,0.96) 100%)", textAlign: "center", padding: 24, boxSizing: "border-box", ...signlearnoText }}>
                  <Camera size={34} color={theme.colors.green} />
                  <div style={{ fontSize: 20, lineHeight: "28px", fontWeight: 700 }}>
                    Camera preview will appear here
                  </div>
                  <div style={{ fontSize: 15, lineHeight: "24px", maxWidth: 320 }}>
                    Start the camera to stream landmarks to the backend model in real time.
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => { void (cameraActive ? stopCamera() : startCamera()); }}
              style={{ position: "absolute", left: "50%", bottom: 24, transform: "translateX(-50%)", height: 56, padding: "0 28px", borderRadius: 20, border: "none", background: "#FFFFFF", color: theme.colors.green, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", boxShadow: "0 12px 32px rgba(17,24,39,0.12)", fontSize: 16, lineHeight: "22px", fontWeight: 700, ...signlearnoText }}
            >
              <Camera size={20} />
              {cameraActive ? "Stop Camera" : "Start Camera"}
            </button>
          </div>
        </section>

        <div style={{ gridColumn: "1 / -1", gridRow: 2, display: "flex", alignItems: "center", justifyContent: "space-between", color: theme.colors.green, fontSize: 15, lineHeight: "24px", fontWeight: 700, paddingTop: 8, ...signlearnoText }}>
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Clock3 size={18} color={theme.colors.green} />
            Session: {formatSession(sessionSeconds)}
          </span>
          <span style={{ color: "rgba(88, 204, 2, 0.72)", ...signlearnoUpperLabel }}>
            {translationStatus}
          </span>
        </div>

        <section style={{ gridColumn: 2, gridRow: 1, minHeight: 700, borderRadius: 28, border: `2px solid ${theme.colors.border}`, background: theme.colors.surface, padding: 28, boxSizing: "border-box", boxShadow: "0 22px 50px rgba(17, 24, 39, 0.06)", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Languages size={22} color={theme.colors.green} />
              <span style={{ color: theme.colors.green, ...signlearnoUpperLabel }}>
                Real-time Translation
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <ToolIconButton icon={<Volume2 size={22} color={theme.colors.green} />} onClick={handleSpeak} disabled={confidence === null} />
              <ToolIconButton icon={<Copy size={22} color={theme.colors.green} />} onClick={() => { void handleCopy(); }} disabled={confidence === null} />
            </div>
          </div>

          <div style={{ marginTop: 28, color: theme.colors.textStrong, fontSize: 50, lineHeight: "52px", fontWeight: 800, letterSpacing: -1.8, ...signlearnoText }}>
            {translationText}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 22, borderTop: "2px solid rgba(88, 204, 2, 0.2)", display: "grid", gap: 14 }}>
            <ToolStatCard icon={<Video size={22} color={theme.colors.green} />} eyebrow="Status" value={statusValue} tone="green" />
            <ToolStatCard icon={<Sparkles size={22} color={theme.colors.orange} />} eyebrow="Accuracy" value={accuracyValue} tone="orange" />
          </div>
        </section>
      </div>

      <div style={{ marginTop: 24, borderRadius: 28, border: "2px solid rgba(88, 204, 2, 0.22)", background: "linear-gradient(135deg, rgba(229, 247, 215, 0.9) 0%, rgba(255, 255, 255, 0.96) 100%)", padding: "20px 26px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 18px rgba(88, 204, 2, 0.12)" }}>
          <Sparkles size={20} color={theme.colors.green} />
        </div>
        <div style={{ color: theme.colors.green, fontSize: 16, lineHeight: "24px", fontWeight: 700, ...signlearnoText }}>
          Keep both hands in frame for at least {SIGN_SEQUENCE_LENGTH} sampled frames so the
          backend can classify the sign.
        </div>
      </div>
    </section>
  );
}
