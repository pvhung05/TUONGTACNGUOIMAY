export type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

export type HolisticDrawResults = {
  poseLandmarks?: NormalizedLandmark[];
  faceLandmarks?: NormalizedLandmark[];
  leftHandLandmarks?: NormalizedLandmark[];
  rightHandLandmarks?: NormalizedLandmark[];
};

// ---------------------------------------------------------------------------
// Connection topology (MediaPipe standard)
// ---------------------------------------------------------------------------

const POSE_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28],
  [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32],
];

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

// ---------------------------------------------------------------------------
// Colour palette — derived from the notebook's OpenCV BGR values → CSS RGB
// ---------------------------------------------------------------------------

const FACE_DOT = { color: "rgba(121, 255, 80, 0.55)", radius: 1 };

const POSE = {
  line: { color: "rgb(121, 44, 80)", width: 2 },
  dot: { color: "rgb(10, 22, 80)", radius: 4 },
};

const LEFT_HAND = {
  line: { color: "rgb(250, 44, 121)", width: 2 },
  dot: { color: "rgb(76, 22, 121)", radius: 4 },
};

const RIGHT_HAND = {
  line: { color: "rgb(230, 66, 245)", width: 2 },
  dot: { color: "rgb(66, 117, 245)", radius: 4 },
};

// ---------------------------------------------------------------------------
// Low-level canvas helpers
// ---------------------------------------------------------------------------

function drawConnections(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: [number, number][],
  color: string,
  lineWidth: number,
  w: number,
  h: number,
) {
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

function drawDots(
  ctx: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  color: string,
  radius: number,
  w: number,
  h: number,
) {
  ctx.fillStyle = color;
  for (const lm of landmarks) {
    ctx.beginPath();
    ctx.arc(lm.x * w, lm.y * h, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// ---------------------------------------------------------------------------
// Public: draw all holistic landmarks (face, pose, hands)
// ---------------------------------------------------------------------------

export function drawHolisticLandmarks(
  ctx: CanvasRenderingContext2D,
  results: HolisticDrawResults,
  width: number,
  height: number,
) {
  if (results.faceLandmarks?.length) {
    drawDots(ctx, results.faceLandmarks, FACE_DOT.color, FACE_DOT.radius, width, height);
  }

  if (results.poseLandmarks?.length) {
    drawConnections(ctx, results.poseLandmarks, POSE_CONNECTIONS, POSE.line.color, POSE.line.width, width, height);
    drawDots(ctx, results.poseLandmarks, POSE.dot.color, POSE.dot.radius, width, height);
  }

  if (results.leftHandLandmarks?.length) {
    drawConnections(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, LEFT_HAND.line.color, LEFT_HAND.line.width, width, height);
    drawDots(ctx, results.leftHandLandmarks, LEFT_HAND.dot.color, LEFT_HAND.dot.radius, width, height);
  }

  if (results.rightHandLandmarks?.length) {
    drawConnections(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, RIGHT_HAND.line.color, RIGHT_HAND.line.width, width, height);
    drawDots(ctx, results.rightHandLandmarks, RIGHT_HAND.dot.color, RIGHT_HAND.dot.radius, width, height);
  }
}

// ---------------------------------------------------------------------------
// Public: probability bar overlay (mirrors the notebook's `prob_viz`)
// ---------------------------------------------------------------------------

const PROB_BAR_PALETTE = [
  "rgb(245, 117, 16)",
  "rgb(117, 245, 16)",
  "rgb(16, 117, 245)",
  "rgb(200, 50, 200)",
  "rgb(50, 200, 200)",
  "rgb(200, 200, 50)",
  "rgb(150, 100, 200)",
  "rgb(100, 200, 150)",
  "rgb(200, 150, 100)",
  "rgb(100, 150, 200)",
];

export function drawProbabilityBars(
  ctx: CanvasRenderingContext2D,
  scores: Record<string, number>,
  canvasWidth: number,
) {
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

// ---------------------------------------------------------------------------
// Public: detected label banner at the bottom of the canvas
// ---------------------------------------------------------------------------

export function drawDetectedLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  canvasWidth: number,
  canvasHeight: number,
) {
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

// ---------------------------------------------------------------------------
// Polyfill-safe rounded rectangle (falls back to plain rect if needed)
// ---------------------------------------------------------------------------

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
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
