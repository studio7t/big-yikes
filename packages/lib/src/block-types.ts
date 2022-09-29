import { Static, Type } from '@sinclair/typebox';
import { Vector2D } from './types';

export interface BlockType {
  coordinates: Vector2D[];
  color: string;
}

export const blockTypeSlugs = ['1x1', '1x2'] as const;

export const BlockTypeSlugSchema = Type.Union(
  blockTypeSlugs.map((slug) => Type.Literal(slug))
);
export type BlockTypeSlug = Static<typeof BlockTypeSlugSchema>;

export const blockTypes: Record<BlockTypeSlug, BlockType> = {
  '1x1': {
    coordinates: [{ x: 0, y: 0 }],
    color: '#FF0000',
  },
  '1x2': {
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    color: '#0000FF',
  },
};
