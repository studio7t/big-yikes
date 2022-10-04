import p5Types from 'p5';
import { NUM_COLS, NUM_ROWS, SCALE } from '../utils/diminsions';

export const drawGrid = (p5: p5Types) => {
  p5.stroke('#F20D0D');

  for (let row = 0; row <= NUM_ROWS; row++) {
    p5.strokeWeight((row === 0 || row === NUM_ROWS ? 2 : 1) / SCALE);
    p5.line(0, row, NUM_COLS, row);
  }

  for (let col = 0; col <= NUM_COLS; col++) {
    p5.strokeWeight((col === 0 || col === NUM_COLS ? 2 : 1) / SCALE);
    p5.line(col, 0, col, NUM_ROWS);
  }
};
