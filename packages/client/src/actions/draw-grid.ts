import p5Types from 'p5';
import { NUM_COLS, NUM_ROWS, SCALE } from '../stores/transforms.store';

export const drawGrid = (p5: p5Types) => {
  p5.stroke(0);
  p5.strokeWeight(1 / SCALE);

  for (let row = 0; row < NUM_ROWS; row++) {
    p5.line(0, row, NUM_COLS, row);
  }

  for (let col = 0; col < NUM_COLS; col++) {
    p5.line(col, 0, col, NUM_ROWS);
  }
};
