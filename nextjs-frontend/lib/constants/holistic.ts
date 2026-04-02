/* Holistic Keypoints Constants */
export const SIGN_SEQUENCE_LENGTH = 30;
export const SIGN_FEATURE_SIZE = 1662;

/* Pose Connections (MediaPipe standard) */
export const POSE_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
  [9, 10], [11, 12], [11, 13], [13, 15], [15, 17], [15, 19], [15, 21],
  [17, 19], [12, 14], [14, 16], [16, 18], [16, 20], [16, 22], [18, 20],
  [11, 23], [12, 24], [23, 24], [23, 25], [24, 26], [25, 27], [26, 28],
  [27, 29], [28, 30], [29, 31], [30, 32], [27, 31], [28, 32],
];

/* Hand Connections (MediaPipe standard) */
export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

/* Drawing Colors and Styles */
export const FACE_DOT = { color: "rgba(121, 255, 80, 0.55)", radius: 1 };

export const POSE = {
  line: { color: "rgb(121, 44, 80)", width: 2 },
  dot: { color: "rgb(10, 22, 80)", radius: 4 },
};

export const LEFT_HAND = {
  line: { color: "rgb(250, 44, 121)", width: 2 },
  dot: { color: "rgb(76, 22, 121)", radius: 4 },
};

export const RIGHT_HAND = {
  line: { color: "rgb(230, 66, 245)", width: 2 },
  dot: { color: "rgb(66, 117, 245)", radius: 4 },
};

/* Probability Bar Color Palette */
export const PROB_BAR_PALETTE = [
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
