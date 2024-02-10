export type CraneState = {
  swing: number;
  lift: number;
  arm: number;
  wrist: number;
  jaw: number;
};

export const CRANE_JOINTS = ["swing", "lift", "arm", "wrist", "jaw"];
