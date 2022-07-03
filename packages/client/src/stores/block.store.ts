import { makeAutoObservable } from 'mobx';
import { nanoid } from 'nanoid';
import { blockTypeId } from '../block-types.config';
import Block from '../models/block';

class BlockStore {
  blocks: Record<string, Block>;

  constructor() {
    makeAutoObservable(this);
  }

  create(type: blockTypeId, position: Position) {
    const id = nanoid();
    this.blocks[id] = new Block(type, position);
    return id;
  }

  move(id: string, position: Position) {
    this.blocks[id].position = position;
  }

  delete(id: string) {
    delete this.blocks[id];
  }
}

export default BlockStore;
