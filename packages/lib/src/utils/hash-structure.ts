import objectHash from 'object-hash';
import { BlockStructure } from '../models/block-structure';

export const hashStructure = (structure: BlockStructure) => {
  return objectHash(structure);
};
