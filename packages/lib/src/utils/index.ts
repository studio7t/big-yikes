import { Bounds } from '../types';

export const growBounds = (bounds: Bounds, amount = 1) => {
  return {
    minX: bounds.minX - amount,
    minY: bounds.minY - amount,
    maxX: bounds.maxX + amount,
    maxY: bounds.maxY + amount,
  };
};
