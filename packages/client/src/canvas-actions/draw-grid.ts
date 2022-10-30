import p5Types from 'p5';
import {
  GRID_BORDER_WIDTH,
  NUM_COLS,
  NUM_ROWS,
  SCALE,
} from '../utils/dimensions';

export const drawGrid = (p5: p5Types) => {
  p5.stroke('#F20D0D');

  for (let row = 0; row <= NUM_ROWS; row++) {
    p5.strokeWeight(
      (row === 0 || row === NUM_ROWS ? GRID_BORDER_WIDTH : 1) / SCALE
    );
    p5.line(0, row, NUM_COLS, row);
  }

  for (let col = 0; col <= NUM_COLS; col++) {
    p5.strokeWeight(
      (col === 0 || col === NUM_COLS ? GRID_BORDER_WIDTH : 1) / SCALE
    );
    p5.line(col, 0, col, NUM_ROWS);
  }
};
