import { intersectionWith, isEqual } from 'lodash';
import { nanoid } from 'nanoid';
import { Vector2D } from '../types';

export interface BlockType {
  slug: string;
  coordinates: Vector2D[];
  color: string;
}

export class Block {
  id: string;
  type: BlockType;
  position: Vector2D;

  constructor(type: BlockType, position: Vector2D) {
    this.id = nanoid();
    this.type = type;
    this.position = position;
  }

  get coordinates() {
    return this.type.coordinates.map((coord) => ({
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
