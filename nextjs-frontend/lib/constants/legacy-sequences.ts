/* Legacy Sequences for Demo */
export const LEGACY_SEQUENCE_COLLECTION_WORDS = ["hello", "thanks", "iloveyou"] as const;

export type LegacySequenceWord = (typeof LEGACY_SEQUENCE_COLLECTION_WORDS)[number];
