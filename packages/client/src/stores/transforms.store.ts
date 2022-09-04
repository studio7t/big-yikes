import { Vector2D } from '@big-yikes/lib';
import p5Types from 'p5';
import create from 'zustand';
import { clamp } from '../utils/math';
import { isMouseInCanvas, mouseToGridCoords } from '../utils/mouse-to-grid';

export interface TransformsState {
  scale: number;
  translate: Vector2D;
  panning: boolean;
  pan: (p5: p5Types) => void;
  zoom: (p5: p5Types, event?: WheelEvent) => void;
  setPanning: (val: boolean) => void;
}

export const useTransformsState = create<TransformsState>((set, get) => ({
  scale: 100,
  translate: { x: 0, y: 0 },
  panning: false,
  pan: (p5: p5Types) => {
    if (!isMouseInCanvas(p5)) {
      return;
    }

    const { translate, panning, setPanning } = get();

    if (!panning) setPanning(true);

    const deltaX = p5.mouseX - p5.pmouseX;
    const deltaY = p5.mouseY - p5.pmouseY;
    const prevTranslate = translate;

    const newTranslate = {
      x: prevTranslate.x + deltaX,
      y: Math.max(0, prevTranslate.y + deltaY),
    };
    set({ translate: newTranslate });
  },
  zoom: (p5: p5Types, event?: WheelEvent) => {
    if (!isMouseInCanvas(p5)) {
      return;
    }

    const { scale } = get();

    if (event) {
      const newScale = clamp(scale - event.deltaY, 50, 400);

      const { x: gridX, y: gridY } = mouseToGridCoords(p5);

      // grid coords of mouse location are preserved before and after zoom
      const newTranslateX = p5.mouseX - newScale * gridX;
      const newTranslateY = p5.mouseY - (p5.height - newScale * gridY);

      set({
        scale: newScale,
        translate: { x: newTranslateX, y: Math.max(0, newTranslateY) },
      });
    }
  },
  setPanning: (val) => set(() => ({ panning: val })),
}));
