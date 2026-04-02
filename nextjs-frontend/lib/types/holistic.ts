/* MediaPipe Holistic Types */
export type HolisticLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

export type HolisticResult = {
  poseLandmarks?: HolisticLandmark[];
  faceLandmarks?: HolisticLandmark[];
  leftHandLandmarks?: HolisticLandmark[];
  rightHandLandmarks?: HolisticLandmark[];
};

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

export type LandmarkPoint = {
  x: number;
  y: number;
  z: number;
};
