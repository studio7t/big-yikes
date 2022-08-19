import { find, isEqual } from 'lodash';
import { Block } from './block';

type AdjacencyList = Record<string, Set<string>>;

export const GROUND = 'GROUND';

export class BlockGraph {
  graph: AdjacencyList;

  constructor(blocks: Block[]) {
    const graph: AdjacencyList = {};

    graph[GROUND] = new Set();

    for (const block of blocks) {
      graph[block.id] = new Set();
    }

    for (let i = 0; i < blocks.length; i++) {
      const b1 = blocks[i];
      if (b1.isOnTheGround()) {
        graph[b1.id].add(GROUND);
        graph[GROUND].add(b1.id);
      }
      for (let j = i + 1; j < blocks.length; j++) {
        const b2 = blocks[j];
        if (adjacent(b1, b2)) {
          graph[b1.id].add(b2.id);
          graph[b2.id].add(b1.id);
        }
      }
    }

    this.graph = graph;
  }

  isConnected() {
    const visited = new Set();
    const queue: string[] = [];

    visited.add('GROUND');
    queue.push('GROUND');

    while (queue.length) {
      const cur = queue[0];
      queue.splice(0, 1);

      for (const neighbour of this.graph[cur]) {
        if (!visited.has(neighbour)) {
          visited.add(neighbour);
          queue.push(neighbour);
        }
      }
    }

    return visited.size === Object.keys(this.graph).length;
  }
}

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
