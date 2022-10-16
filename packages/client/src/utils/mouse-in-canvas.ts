import p5Types from 'p5';
import { CANVAS_BUFFER } from './dimensions';

export const isMouseInCanvas = (p5: p5Types) => {
  return (
    p5.mouseX > CANVAS_BUFFER &&
    p5.mouseX < p5.width - CANVAS_BUFFER &&
    p5.mouseY > CANVAS_BUFFER &&
    p5.mouseY < p5.height - CANVAS_BUFFER
  );
};
