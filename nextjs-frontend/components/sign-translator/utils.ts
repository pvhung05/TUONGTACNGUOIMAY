import type { PathNode, HolisticConstructor, NodeFrame } from "./types";
import { DETECTED_LABEL_COPY, START_FRAME } from "./constants";

export function humanizeDetectedLabel(label: string) {
  return DETECTED_LABEL_COPY[label] || label.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function formatSession(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function describeCameraError(error: unknown): string {
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return "Camera permission denied. Allow camera access for this site in your browser settings, then try again.";
      case "NotFoundError":
      case "DevicesNotFoundError":
        return "No camera found. Connect a webcam or enable it in Windows Settings → Privacy → Camera.";
      case "NotReadableError":
      case "TrackStartError":
        return "Camera is busy or in use by another app. Close other apps using the camera and try again.";
      case "OverconstrainedError":
        return "This camera does not support the requested video mode. Try another camera or update drivers.";
      case "SecurityError":
        return "Camera requires a secure context. Use http://localhost or https://, not an IP address over plain HTTP.";
      default:
        return error.message || error.name || "Camera error";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unable to start the camera.";
}

export async function getCameraStream(): Promise<MediaStream> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not supported in this browser.");
  }

  const attempts: MediaStreamConstraints[] = [
    {
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
      audio: false,
    },
    { video: true, audio: false },
  ];

  let lastError: unknown;
  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

export function resolveHolisticConstructor(imported: unknown): HolisticConstructor {
  const g = globalThis as unknown as { Holistic?: HolisticConstructor };
  const mod = imported as {
    Holistic?: HolisticConstructor;
    default?: HolisticConstructor | { Holistic?: HolisticConstructor };
  };
  const fromDefault =
    mod.default && typeof mod.default === "function"
      ? (mod.default as HolisticConstructor)
      : mod.default && typeof mod.default === "object" && "Holistic" in mod.default
        ? (mod.default as { Holistic: HolisticConstructor }).Holistic
        : undefined;

  const ctor = g.Holistic ?? mod.Holistic ?? fromDefault;
  if (!ctor) {
    throw new Error("MediaPipe Holistic failed to load.");
  }
  return ctor;
}

export function getNodeFrame(node: PathNode): NodeFrame {
  if (node.kind === "start") {
    return START_FRAME;
  }

  if (node.kind === "check") {
    return { width: 96, height: 84, radius: 22, lift: 16, glossInset: 14, iconShift: 6 };
  }

  if (node.kind === "practice") {
    return { width: 88, height: 80, radius: 24, lift: 14, glossInset: 14, iconShift: 4 };
  }

  return { width: 84, height: 78, radius: 26, lift: 13, glossInset: 13, iconShift: 3 };
}

export function getConnectorPoints(node: PathNode) {
  const frame = getNodeFrame(node);
  const centerX = node.left + frame.width / 2;
  const topY = node.top + 10;
  const bottomY = node.top + frame.height - 8;

  return { centerX, topY, bottomY, frame };
}

export function buildConnectorPath(from: PathNode, to: PathNode) {
  const start = getConnectorPoints(from);
  const end = getConnectorPoints(to);
  const middleY = (start.bottomY + end.topY) / 2;

  return [
    `M ${start.centerX} ${start.bottomY}`,
    `C ${start.centerX} ${middleY}, ${end.centerX} ${middleY}, ${end.centerX} ${end.topY}`,
  ].join(" ");
}
