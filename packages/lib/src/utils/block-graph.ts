import { find, isEqual } from 'lodash';
import { Block } from '../models/block';

type BlockGraph = Record<string, Set<string>>;

export const GROUND = 'GROUND';

export const blockGraph = (blocks: Block[]): BlockGraph => {
  const graph: BlockGraph = {};

  graph[GROUND] = new Set();

  // create directed graph
  for (let i = 0; i < blocks.length; i++) {
    const b1 = blocks[i];
    graph[b1.id] = new Set();
    if (isOnTheGround(b1)) graph[b1.id].add(GROUND);
    for (let j = i + 1; j < blocks.length; j++) {
      const b2 = blocks[j];
      if (adjacent(b1, b2)) {
        graph[b1.id].add(b2.id);
      }
    }
  }

  // make each edge bidirectional
  Object.entries(graph).forEach(([blockId, adjacencies]) => {
    adjacencies.forEach((adjacency) => {
      graph[adjacency].add(blockId);
    });
  });

  return graph;
};

export const isConnected = (graph: BlockGraph) => {
  const visited = new Set();
  const queue: string[] = [];

  visited.add('GROUND');
  queue.push('GROUND');

  while (queue.length) {
    const cur = queue[0];
    queue.splice(0, 1);

    for (const neighbour of graph[cur]) {
      if (!visited.has(neighbour)) {
        visited.add(neighbour);
        queue.push(neighbour);
      }
    }
  }

  return visited.size === Object.keys(graph).length;
};

export const adjacent = (b1: Block, b2: Block) => {
  for (const b1Coord of b1.coordinates) {
    if (
      find(
        b2.coordinates,
        (b2Coord) =>
          isEqual(b2Coord, { x: b1Coord.x - 1, y: b1Coord.y }) ||
          isEqual(b2Coord, { x: b1Coord.x + 1, y: b1Coord.y }) ||
          isEqual(b2Coord, { x: b1Coord.x, y: b1Coord.y - 1 }) ||
          isEqual(b2Coord, { x: b1Coord.x, y: b1Coord.y + 1 })
      )
    )
      return true;
  }

  return false;
};

export const isOnTheGround = (block: Block) => {
  return !!block.coordinates.find((coord) => coord.y === 0);
};
