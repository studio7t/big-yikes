import { Block, Vector2D } from './block';

export type BlockStructure = Set<{ type: string; position: Vector2D }>;

export const blockStructure = (blocks: Block[]): BlockStructure => {
  return new Set(
    blocks.map((b) => {
      // TODO replace type identifier with something more reliable
      return { type: b.type.color, position: b.position };
    })
  );
};
