import { intersectionWith, isEqual } from 'lodash';
import { nanoid } from 'nanoid';
import { blockTypes, BlockTypeSlug } from '../block-types';
import { Vector2D } from '../types';

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

  isValid(others: Block[]) {
    return !this.isUnderground() && !this.isOverlapping(others);
  }

  isOverlapping(others: Block[]) {
    for (const other of others) {
      if (intersectionWith(this.coordinates, other.coordinates, isEqual).length)
        return true;
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
