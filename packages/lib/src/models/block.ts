import { nanoid } from 'nanoid';

export interface Vector2D {
  x: number;
  y: number;
}

export interface BlockType {
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
}
