export const NUM_COLS = 32;
export const NUM_ROWS = 14;

const ASPECT_RATIO = NUM_COLS / NUM_ROWS;

const MAX_CANVAS_HEIGHT = window.innerHeight - 150;

export const CANVAS_HEIGHT = Math.min(
  window.innerHeight * 0.7,
  MAX_CANVAS_HEIGHT
);
export const CANVAS_WIDTH = CANVAS_HEIGHT * ASPECT_RATIO;

export const SCALE = CANVAS_WIDTH / NUM_COLS;
