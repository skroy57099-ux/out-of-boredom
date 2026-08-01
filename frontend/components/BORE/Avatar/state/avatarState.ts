export type AvatarExpression =
  | "idle"
  | "blink"
  | "thinking"
  | "error";

export interface AvatarState {
  expression: AvatarExpression;
}

export const defaultAvatarState: AvatarState = {
  expression: "idle",
};
