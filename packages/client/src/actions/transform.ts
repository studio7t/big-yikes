import p5Types from 'p5';
import { CANVAS_BUFFER, SCALE } from '../utils/dimensions';

export const applyTransforms = (p5: p5Types) => {
  p5.translate(CANVAS_BUFFER, -CANVAS_BUFFER);
  p5.scale(SCALE);
};

export const flipCanvas = (p5: p5Types) => {
  p5.translate(0, p5.height / SCALE / 2);
  p5.scale(1, -1);
  p5.translate(0, -p5.height / SCALE / 2);
};
