import { Static, Type } from '@sinclair/typebox';
import { Vector2D } from './types';

export interface BlockType {
  coordinates: Vector2D[];
  color: string;
}

export const blockTypeSlugs = [
  'T',
  '1x2',
  'L',
  '1x1',
  'J',
  'TR-corner',
  'TL-corner',
  '2x2',
] as const;

export const BlockTypeSlugSchema = Type.Union(
  blockTypeSlugs.map((slug) => Type.Literal(slug))
);
export type BlockTypeSlug = Static<typeof BlockTypeSlugSchema>;

export const blockTypes: Record<BlockTypeSlug, BlockType> = {
  T: {
    coordinates: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
    ],
    color: '#4265FF',
  },
  '1x2': {
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    color: '#FF5B39',
  },
  L: {
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 0 },
    ],
    color: '#E5F20D',
  },
  '1x1': {
    coordinates: [{ x: 0, y: 0 }],
    color: '#92028C',
  },
  J: {
    coordinates: [
      { x: -1, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
    ],
    color: '#92C4FF',
  },
  'TR-corner': {
    coordinates: [
      { x: -1, y: 1 },
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    color: '#FFAEE5',
  },
  'TL-corner': {
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    color: '#F2AF0D',
  },
  '2x2': {
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    color: '#62B300',
  },
};
