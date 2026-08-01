export const idleEye = [
  [false, true, true, true, true, true, true, false],
  [true, true, true, true, true, true, true, true],
  [true, true, true, true, true, true, true, true],
  [false, true, true, true, true, true, true, false],
];

export const blinkEye = [
  [false, false, false, false, false, false, false, false],
  [true, true, true, true, true, true, true, true],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
];

export const idleMouth = [
  [false, false, false, false, false, false, false, false],
  [false, true, true, true, true, true, true, false],
  [false, false, false, false, false, false, false, false],
];

export const thinkingMouth = [
  [false, false, true, true, true, false, false, false],
  [false, false, true, false, true, false, false, false],
  [false, false, true, true, true, false, false, false],
];

export const errorMouth = [
  [true, false, true, false, true, false, true, false],
  [false, true, false, true, false, true, false, true],
  [true, false, true, false, true, false, true, false],
];

export const expressions = {
  idle: {
    leftEye: idleEye,
    rightEye: idleEye,
    mouth: idleMouth,
  },

  blink: {
    leftEye: blinkEye,
    rightEye: blinkEye,
    mouth: idleMouth,
  },

  thinking: {
    leftEye: idleEye,
    rightEye: idleEye,
    mouth: thinkingMouth,
  },

  error: {
    leftEye: blinkEye,
    rightEye: blinkEye,
    mouth: errorMouth,
  },
};