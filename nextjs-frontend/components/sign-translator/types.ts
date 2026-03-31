import type {
  SignLearnoNavKind,
  SignLearnoPathKind,
} from "@/components/signlearno/icons";

export type NavItem = { label: string; kind: SignLearnoNavKind };

export type PathNode = {
  left: number;
  top: number;
  kind: SignLearnoPathKind;
  color?: string;
  bubbleText?: string;
};

export type Unit = {
  title: string;
  subtitle: string;
  color: string;
  levelsHeight: number;
  nodes: PathNode[];
};

export type NodeFrame = {
  width: number;
  height: number;
  radius: number;
  lift: number;
  glossInset: number;
  iconShift: number;
};

export type HolisticLike = {
  close: () => Promise<void>;
  onResults: (listener: (results: unknown) => void) => void;
  send: (inputs: { image: HTMLVideoElement }) => Promise<void>;
  setOptions: (options: Record<string, unknown>) => void;
};

export type HolisticConstructor = new (config?: {
  locateFile?: (path: string, prefix?: string) => string;
}) => HolisticLike;
