import p5Types from 'p5';
import {
  TransformsState,
  useTransformsState,
} from '../stores/transforms.store';

const gridXOffset = (p5: p5Types, { scale, translate }: TransformsState) => {
  const widthsTranslated = Math.floor(Math.abs(translate.x) / p5.width);
  let xOffset = widthsTranslated * Math.floor(p5.width / scale);
  xOffset *= translate.x > 0 ? -1 : 1;

  return xOffset;
};

const gridYOffset = (p5: p5Types, { scale, translate }: TransformsState) => {
  const heightsTranslated = Math.floor(Math.abs(translate.y) / p5.height);
  let yOffset = heightsTranslated * Math.floor(p5.height / scale);
  yOffset *= translate.y < 0 ? -1 : 1;

  return yOffset;
};

export const drawGrid = (p5: p5Types) => {
  const transformsState = useTransformsState.getState();

  const { scale } = transformsState;
  const rows = Math.floor(p5.height / scale);
  const cols = Math.floor(p5.width / scale);

  const xOffset = gridXOffset(p5, transformsState);
  const yOffset = gridYOffset(p5, transformsState);

  p5.stroke(0);
  p5.strokeWeight(1 / scale);

  const [minX, maxX] = [-2 * cols, 3 * cols];
  const [minY, maxY] = [-2 * rows, 3 * rows];

  for (let row = minY; row < maxY; row++) {
    p5.line(minX + xOffset, row + yOffset, maxX + xOffset, row + yOffset);
  }

  for (let col = minX; col < maxX; col++) {
    p5.line(col + xOffset, minY + yOffset, col + xOffset, maxY + yOffset);
  }
};
