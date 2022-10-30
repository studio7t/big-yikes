import { Block, BlockFingerprint, Structure } from '@big-yikes/lib';
import { useEffect } from 'react';
import { useProjectStore } from '../stores/project.store';

export const useRecoverSession = () => {
  const { setStructure } = useProjectStore((state) => ({
    setStructure: state.setStructure,
  }));

  useEffect(() => {
    const blocks = window.sessionStorage.getItem('blocks');
    if (blocks) {
      setStructure(
        new Structure(
          JSON.parse(blocks).map(
            (block: BlockFingerprint) => new Block(block.type, block.position)
          )
        )
      );

      window.sessionStorage.clear();
    }
  }, []);
};
