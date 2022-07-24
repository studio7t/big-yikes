import { Block } from '../models/block';

export const blockTypes = {
  '1x1': {
    id: 1,
    coordinates: [{ x: 0, y: 0 }],
    color: '#FF0000',
  },
  '1x2': {
    id: 2,
    coordinates: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    color: '#00FF00',
  },
};

// A B . . .  E  .
// A . . C . D/E .
export const blocks = [
  new Block(blockTypes['1x2'], { x: 0, y: 0 }),
  new Block(blockTypes['1x1'], { x: 1, y: 1 }),
  new Block(blockTypes['1x1'], { x: 3, y: 0 }),
  new Block(blockTypes['1x1'], { x: 5, y: 0 }),
  new Block(blockTypes['1x2'], { x: 5, y: 0 }),
];

// A B .
// A . .
// . . .
export const floatingBoys = [
  new Block(blockTypes['1x2'], { x: 0, y: 1 }),
  new Block(blockTypes['1x1'], { x: 1, y: 2 }),
];
