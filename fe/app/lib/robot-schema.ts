export type CraneState = {
  swing: number;
  lift: number;
  arm: number;
  wrist: number;
  jaw: number;
};

export const CRANE_JOINTS = ["swing", "lift", "arm", "wrist", "jaw"];

export const DEFAULT_CRANE_STATE: CraneState = {
  swing: 0,
  lift: 0,
  arm: 0,
  wrist: 0,
  jaw: 0,
};
