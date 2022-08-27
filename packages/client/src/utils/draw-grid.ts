import p5Types from 'p5';
import { Transforms } from './canvas-utils';

const gridXOffset = (p5: p5Types, { scale, translate }: Transforms) => {
  const widthsTranslated = Math.floor(Math.abs(translate.x) / p5.width);
  let xOffset = widthsTranslated * Math.floor(p5.width / scale);
  xOffset *= translate.x > 0 ? -1 : 1;

  return xOffset;
};

const gridYOffset = (p5: p5Types, { scale, translate }: Transforms) => {
  const heightsTranslated = Math.floor(Math.abs(translate.y) / p5.height);
  let yOffset = heightsTranslated * Math.floor(p5.height / scale);
  yOffset *= translate.y < 0 ? -1 : 1;

  return yOffset;
};

export const drawGrid = (p5: p5Types, { scale, translate }: Transforms) => {
  const rows = Math.floor(p5.height / scale);
  const cols = Math.floor(p5.width / scale);

  const xOffset = gridXOffset(p5, { scale, translate });
  const yOffset = gridYOffset(p5, { scale, translate });

  p5.stroke(0);

  for (let row = -2 * rows; row < 3 * rows; row++) {
    p5.line(-cols + xOffset, row + yOffset, 2 * cols + xOffset, row + yOffset);
  }

  for (let col = -2 * cols; col < 3 * cols; col++) {
    p5.line(col + xOffset, -rows + yOffset, col + xOffset, 2 * rows + yOffset);
  }
};
