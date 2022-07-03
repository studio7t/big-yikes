import { observable } from 'mobx';

const _blockTypes = {
  one: {
    coordinates: [[0, 0]],
    color: '#FFFF00',
  },
};

export interface blockType {
  coordinates: Position[];
  color: string;
}
export type blockTypeId = keyof typeof _blockTypes;
export const blockTypes = observable(_blockTypes) as Record<
  blockTypeId,
  blockType
>;
