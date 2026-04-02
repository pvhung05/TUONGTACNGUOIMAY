/* MediaPipe Drawing Utilities */
import {
  POSE_CONNECTIONS,
  HAND_CONNECTIONS,
  FACE_DOT,
  POSE,
  LEFT_HAND,
  RIGHT_HAND,
  PROB_BAR_PALETTE,
} from "@/lib/constants/holistic";
import type { NormalizedLandmark, HolisticDrawResults } from "@/lib/types";

/**
 * Draw connections between landmarks on canvas
 */
function drawConnections(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: [number, number][],
  color: string,
  lineWidth: number,
  w: number,
  h: number,
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  for (const [a, b] of connections) {
    if (a < landmarks.length && b < landmarks.length) {
      ctx.beginPath();
      ctx.moveTo(landmarks[a].x * w, landmarks[a].y * h);
      ctx.lineTo(landmarks[b].x * w, landmarks[b].y * h);
      ctx.stroke();
    }
  }
}

/**
 * Draw individual landmark points on canvas
 */
function drawDots(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  color: string,
  radius: number,
  w: number,
  h: number,
): void {
  ctx.fillStyle = color;
  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * Draw all holistic landmarks (face, pose, hands) on canvas
 */
export function drawHolisticLandmarks(
  ctx: CanvasRenderingContext2D,
  results: HolisticDrawResults,
  width: number,
  height: number,
): void {
  if (results.faceLandmarks?.length) {
    drawDots(ctx, results.faceLandmarks, FACE_DOT.color, FACE_DOT.radius, width, height);
  }

  if (results.poseLandmarks?.length) {
    drawConnections(
      ctx,
      results.poseLandmarks,
      POSE_CONNECTIONS,
      POSE.line.color,
      POSE.line.width,
      width,
      height,
    );
    drawDots(ctx, results.poseLandmarks, POSE.dot.color, POSE.dot.radius, width, height);
  }

  if (results.leftHandLandmarks?.length) {
    drawConnections(
      ctx,
      results.leftHandLandmarks,
      HAND_CONNECTIONS,
      LEFT_HAND.line.color,
      LEFT_HAND.line.width,
      width,
      height,
    );
    drawDots(
      ctx,
      results.leftHandLandmarks,
      LEFT_HAND.dot.color,
      LEFT_HAND.dot.radius,
      width,
      height,
    );
  }

  if (results.rightHandLandmarks?.length) {
    drawConnections(
      ctx,
      results.rightHandLandmarks,
      HAND_CONNECTIONS,
      RIGHT_HAND.line.color,
      RIGHT_HAND.line.width,
      width,
      height,
    );
    drawDots(
      ctx,
      results.rightHandLandmarks,
      RIGHT_HAND.dot.color,
      RIGHT_HAND.dot.radius,
      width,
      height,
    );
  }
}

/**
 * Draw probability bars showing detection scores
 */
export function drawProbabilityBars(
  ctx: CanvasRenderingContext2D,
  scores: Record<string, number>,
  canvasWidth: number,
): void {
  const entries = Object.entries(scores);
  if (entries.length === 0) return;

  const barHeight = 30;
  const gap = 5;
  const startY = 10;
  const pad = 10;
  const maxBarWidth = Math.min(canvasWidth * 0.4, 260);

  ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textBaseline = "middle";

  for (let i = 0; i < entries.length; i++) {
    const [action, prob] = entries[i];
    const y = startY + i * (barHeight + gap);

    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    roundRect(ctx, pad, y, maxBarWidth, barHeight, 4);
    ctx.fill();

    const barWidth = prob * maxBarWidth;
    if (barWidth > 0) {
      ctx.fillStyle = PROB_BAR_PALETTE[i % PROB_BAR_PALETTE.length];
      ctx.globalAlpha = 0.85;
      roundRect(ctx, pad, y, Math.max(barWidth, 8), barHeight, 4);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 3;
    ctx.fillText(`${action} ${Math.round(prob * 100)}%`, pad + 8, y + barHeight / 2);
    ctx.shadowBlur = 0;
  }
}

/**
 * Draw detected label banner at the bottom of canvas
 */
export function drawDetectedLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  canvasWidth: number,
  canvasHeight: number,
): void {
  if (!label) return;

  const boxH = 44;
  const y = canvasHeight - boxH - 14;

  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  roundRect(ctx, 10, y, canvasWidth - 20, boxH, 10);
  ctx.fill();

  ctx.font = "bold 22px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = 4;
  ctx.fillText(label, canvasWidth / 2, y + boxH / 2);
  ctx.shadowBlur = 0;
  ctx.textAlign = "start";
}

/**
 * Polyfill-safe rounded rectangle (falls back to plain rect if needed)
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    (ctx as any).roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

export type { HolisticDrawResults, NormalizedLandmark };
