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

  for (let row = -2 * rows; row < 3 * rows; row++) {
    p5.line(-cols + xOffset, row + yOffset, 2 * cols + xOffset, row + yOffset);
  }

  for (let col = -2 * cols; col < 3 * cols; col++) {
    p5.line(col + xOffset, -rows + yOffset, col + xOffset, 2 * rows + yOffset);
  }
};
