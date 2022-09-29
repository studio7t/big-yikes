import intersectionWith from 'lodash.intersectionwith';
import isEqual from 'lodash.isequal';
import { nanoid } from 'nanoid';
import { blockTypes, BlockTypeSlug } from '../block-types';
import { Bounds, Vector2D } from '../types';

export interface BlockBounds extends Bounds {
  block: Block;
}

export class Block {
  id: string;
  type: BlockTypeSlug;
  position: Vector2D;

  constructor(type: BlockTypeSlug, position: Vector2D) {
    this.id = nanoid();
    this.type = type;
    this.position = position;
  }

  get coordinates() {
    return blockTypes[this.type].coordinates.map((coord) => ({
      x: coord.x + this.position.x,
      y: coord.y + this.position.y,
    }));
  }

  get bounds(): BlockBounds {
    const firstCoord = this.coordinates[0];
    const bounds = this.coordinates.reduce(
      (acc, curr) => {
        acc.minX = Math.min(acc.minX, curr.x);
        acc.minY = Math.min(acc.minY, curr.y);
        acc.maxX = Math.max(acc.maxX, curr.x);
        acc.maxY = Math.max(acc.maxY, curr.y);

        return acc;
      },
      {
        minX: firstCoord.x,
        minY: firstCoord.y,
        maxX: firstCoord.x,
        maxY: firstCoord.y,
      }
    );
    return { ...bounds, block: this };
  }

  isValid(others: Block[]) {
    return !this.isUnderground() && !this.isOverlapping(others);
  }

  isValidAndConnected(others: Block[]) {
    return (
      this.isValid(others) &&
      (this.isOnTheGround() || this.isAdjacentToAnother(others))
    );
  }

  isOverlapping(others: Block[]) {
    for (const other of others) {
      if (this === other) continue;

      if (intersectionWith(this.coordinates, other.coordinates, isEqual).length)
        return true;
    }

    return false;
  }

  isAdjacentTo(other: Block) {
    for (const b1Coord of this.coordinates) {
      if (
        other.coordinates.find(
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
  }

  isAdjacentToAnother(others: Block[]) {
    for (const other of others) {
      if (this.isAdjacentTo(other)) return true;
    }

    return false;
  }

  isOnTheGround() {
    return this.coordinates.filter((coord) => coord.y === 0).length > 0;
  }

  isUnderground() {
    return this.coordinates.filter((coord) => coord.y < 0).length > 0;
  }
}
