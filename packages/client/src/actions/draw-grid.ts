import p5Types from 'p5';
import {
  TransformsState,
  useTransformsState,
} from '../stores/transforms.store';

// TODO might want to derive this from the canvas width and min zoom amount
const GRID_SIZE = 64;

const gridXOffset = ({ scale, translate }: TransformsState) => {
  const colsTranslated = Math.abs(translate.x) / scale;
  return (
    GRID_SIZE *
    Math.floor(colsTranslated / GRID_SIZE) *
    (translate.x > 0 ? -1 : 1)
  );
};

const gridYOffset = ({ scale, translate }: TransformsState) => {
  const rowsTranslated = Math.abs(translate.y) / scale;
  return (
    GRID_SIZE *
    Math.floor(rowsTranslated / GRID_SIZE) *
    (translate.y < 0 ? -1 : 1)
  );
};

export const drawGrid = (p5: p5Types) => {
  const transformsState = useTransformsState.getState();

  const { scale } = transformsState;

  const xOffset = gridXOffset(transformsState);
  const yOffset = gridYOffset(transformsState);

  p5.stroke(0);

  for (let i = -GRID_SIZE; i < 2 * GRID_SIZE; i++) {
    p5.strokeWeight(i % 8 === 0 ? 4 / scale : 1 / scale);
    p5.line(
      -GRID_SIZE + xOffset,
      i + yOffset,
      2 * GRID_SIZE + xOffset,
      i + yOffset
    );
    p5.line(
      i + xOffset,
      -GRID_SIZE + yOffset,
      i + xOffset,
      2 * GRID_SIZE + yOffset
    );
  }
};
