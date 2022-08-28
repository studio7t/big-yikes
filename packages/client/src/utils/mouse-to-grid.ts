import p5Types from 'p5';
import { useTransformsState } from '../stores/transforms.store';

export const mouseToGridCoords = (p5: p5Types) => {
  const { translate, scale } = useTransformsState.getState();

  const { mouseX, mouseY } = p5;

  const x = (mouseX - translate.x) / scale;
  const y = (p5.height - (mouseY - translate.y)) / scale;

  return { x, y };
};

export const snapMouseToGridCoords = (p5: p5Types) => {
  const { x, y } = mouseToGridCoords(p5);

  return { x: Math.floor(x), y: Math.floor(y) };
};
