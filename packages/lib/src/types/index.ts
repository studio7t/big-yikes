import { Static, Type } from '@sinclair/typebox';

export const Vector2DSchema = Type.Object({
  x: Type.Number(),
  y: Type.Number(),
});

export type Vector2D = Static<typeof Vector2DSchema>;

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}
