import { Block, blockTypes, Vector2D } from '@big-yikes/lib';
import p5Types from 'p5';

export interface Transforms {
  scale: number;
  translate: Vector2D;
}

export const mouseToGridCoords = (p5: p5Types, scale: number) => {
  const { mouseX, mouseY } = p5;

  const x = Math.floor(mouseX / scale);
  const y = Math.floor((p5.height - mouseY) / scale);

  return { x, y };
};

export const drawBlock = (p5: p5Types, block: Block) => {
  for (const coord of block.coordinates) {
    p5.fill(blockTypes[block.type].color);
    p5.rect(coord.x, coord.y, 1, 1);
  }
};

export const applyTransforms = (
  p5: p5Types,
  { scale, translate }: Transforms
) => {
  p5.scale(scale);
  p5.translate(-translate.x, -translate.y);
};

export const flipCanvas = (p5: p5Types, scale: number) => {
  p5.translate(0, p5.height / scale / 2);
  p5.scale(1, -1);
  p5.translate(0, -p5.height / scale / 2);
};

export const drawGrid = (p5: p5Types, scale: number) => {
  const rows = p5.height / scale;
  const cols = p5.width / scale;

  p5.stroke(0);
  p5.strokeWeight(1 / scale);

  for (let row = 0; row < rows; row++) {
    p5.line(0, row, cols, row);
  }

  for (let col = 0; col < cols; col++) {
    p5.line(col, 0, col, rows);
  }
};
