export const NUM_COLS = 32;
export const NUM_ROWS = 14;

const ASPECT_RATIO = NUM_COLS / NUM_ROWS;

export const CANVAS_HEIGHT = 410;
export const CANVAS_WIDTH = Math.floor(CANVAS_HEIGHT * ASPECT_RATIO);

export const SCALE = CANVAS_WIDTH / NUM_COLS;

export const CANVAS_BUFFER = 1;
export const TOTAL_CANAS_WIDTH = CANVAS_WIDTH + 2 * CANVAS_BUFFER;
export const TOTAL_CANVAS_HEIGHT = CANVAS_HEIGHT + 2 * CANVAS_BUFFER;

export const GRID_BORDER_WIDTH = 2;
