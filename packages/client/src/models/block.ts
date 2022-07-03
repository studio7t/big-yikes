import { makeAutoObservable } from 'mobx';
import { blockTypes, blockTypeId } from '../block-types.config';

class Block {
  type: blockTypeId;
  position: Position;

  constructor(type: blockTypeId, position: Position) {
    makeAutoObservable(this);
    this.type = type;
    this.position = position;
  }

  get coordinates() {
    return blockTypes[this.type].coordinates.map((coord) => [
      coord[0] + this.position[0],
      coord[1] + this.position[1],
    ]);
  }
}

export default Block;
