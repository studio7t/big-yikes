import p5Types from 'p5';
import { useTransformsState } from '../stores/transforms.store';
import { clamp } from '../utils/math';
import { mouseToGridCoords } from '../utils/mouse-to-grid';

export const pan = (p5: p5Types) => {
  const { translate, setTranslate, panning, setPanning } =
    useTransformsState.getState();

  if (!panning) setPanning(true);

  const deltaX = p5.mouseX - p5.pmouseX;
  const deltaY = p5.mouseY - p5.pmouseY;
  const prevTranslate = translate;

  const newTranslate = {
    x: prevTranslate.x + deltaX,
    y: Math.max(0, prevTranslate.y + deltaY),
  };
  setTranslate(newTranslate);
};

export const zoom = (p5: p5Types, event?: WheelEvent) => {
  const { scale, setScale, setTranslate } = useTransformsState.getState();

  if (event) {
    const newScale = clamp(scale - event.deltaY, 50, 400);

    const { x: gridX, y: gridY } = mouseToGridCoords(p5);

    // grid coords of mouse location are preserved before and after zoom
    const newTranslateX = p5.mouseX - newScale * gridX;
    const newTranslateY = p5.mouseY - (p5.height - newScale * gridY);

    setScale(newScale);
    setTranslate({ x: newTranslateX, y: Math.max(0, newTranslateY) });
  }
};

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
