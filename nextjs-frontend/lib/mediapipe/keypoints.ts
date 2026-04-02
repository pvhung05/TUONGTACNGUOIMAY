/* Holistic Keypoints Processing */
import { SIGN_SEQUENCE_LENGTH, SIGN_FEATURE_SIZE } from "@/lib/constants/holistic";
import type { HolisticLandmark, HolisticResult } from "@/lib/types";

function createZeroVector(length: number): number[] {
  return Array.from({ length }, () => 0);
}

function flattenLandmarks(
  points: HolisticLandmark[] | undefined,
  expectedLength: number,
  includeVisibility: boolean,
): number[] {
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

/**
 * Extract holistic keypoints from MediaPipe results
 * Combines pose, face, left hand and right hand landmarks into a single feature vector
 */
export function extractHolisticKeypoints(result: HolisticResult): number[] {
  const pose = flattenLandmarks(result.poseLandmarks, 33 * 4, true);
  const face = flattenLandmarks(result.faceLandmarks?.slice(0, 468), 468 * 3, false);
  const leftHand = flattenLandmarks(result.leftHandLandmarks, 21 * 3, false);
  const rightHand = flattenLandmarks(result.rightHandLandmarks, 21 * 3, false);

  return [...pose, ...face, ...leftHand, ...rightHand];
}

export { SIGN_SEQUENCE_LENGTH, SIGN_FEATURE_SIZE };
