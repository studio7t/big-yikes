import { Vector2D } from '@big-yikes/lib';
import create from 'zustand';

export interface TransformsState {
  scale: number;
  translate: Vector2D;
  panning: boolean;
  setScale: (val: number) => void;
  setTranslate: (val: Vector2D) => void;
  setPanning: (val: boolean) => void;
}

export const useTransformsState = create<TransformsState>((set) => ({
  scale: 100,
  translate: { x: 0, y: 0 },
  panning: false,
  setScale: (val) => set(() => ({ scale: val })),
  setTranslate: (val) => set(() => ({ translate: val })),
  setPanning: (val) => set(() => ({ panning: val })),
}));
