import p5Types from 'p5';
import { useTransformsState } from '../stores/transforms.store';

export const applyTransforms = (p5: p5Types) => {
  const { translate, scale } = useTransformsState.getState();

  p5.translate(translate.x, translate.y);
  p5.scale(scale);
};

export const flipCanvas = (p5: p5Types) => {
  const { scale } = useTransformsState.getState();

  p5.translate(0, p5.height / scale / 2);
  p5.scale(1, -1);
  p5.translate(0, -p5.height / scale / 2);
};
