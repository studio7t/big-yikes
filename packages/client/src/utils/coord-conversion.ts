import { Vector2D } from '@big-yikes/lib';
import p5Types from 'p5';
import { SCALE } from '../stores/transforms.store';

export const mouseToGridCoords = (p5: p5Types): Vector2D => {
  const { mouseX, mouseY } = p5;

  const x = mouseX / SCALE;
  const y = (p5.height - mouseY) / SCALE;

  return { x, y };
};

export const snapMouseToGridCoords = (p5: p5Types): Vector2D => {
  const { x, y } = mouseToGridCoords(p5);

  return { x: Math.floor(x), y: Math.floor(y) };
};
