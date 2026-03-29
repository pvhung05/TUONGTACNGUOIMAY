type HolisticLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
};

type HolisticResult = {
  poseLandmarks?: HolisticLandmark[];
  faceLandmarks?: HolisticLandmark[];
  leftHandLandmarks?: HolisticLandmark[];
  rightHandLandmarks?: HolisticLandmark[];
};

export const SIGN_SEQUENCE_LENGTH = 30;
export const SIGN_FEATURE_SIZE = 1662;

function createZeroVector(length: number) {
  return Array.from({ length }, () => 0);
}

function flattenLandmarks(
  points: HolisticLandmark[] | undefined,
  expectedLength: number,
  includeVisibility: boolean,
) {
  if (!points?.length) {
    return createZeroVector(expectedLength);
  }

  const vector = points.flatMap((point) =>
    includeVisibility
      ? [point.x, point.y, point.z, point.visibility ?? 0]
      : [point.x, point.y, point.z],
  );

  if (vector.length >= expectedLength) {
    return vector.slice(0, expectedLength);
  }

  return [...vector, ...createZeroVector(expectedLength - vector.length)];
}

export function extractHolisticKeypoints(result: HolisticResult) {
  const pose = flattenLandmarks(result.poseLandmarks, 33 * 4, true);
  const face = flattenLandmarks(result.faceLandmarks?.slice(0, 468), 468 * 3, false);
  const leftHand = flattenLandmarks(result.leftHandLandmarks, 21 * 3, false);
  const rightHand = flattenLandmarks(result.rightHandLandmarks, 21 * 3, false);

  return [...pose, ...face, ...leftHand, ...rightHand];
}
