import { Block, BlockFingerprint, Structure } from '@big-yikes/lib';
import { useEffect } from 'react';
import { useBinStore } from '../stores/bin.store';
import { useProjectStore } from '../stores/project.store';

export const useRecoverSession = () => {
  const { setStructure } = useProjectStore((state) => ({
    setStructure: state.setStructure,
  }));
  const { setBin } = useBinStore((state) => ({ setBin: state.setBin }));

  useEffect(() => {
    const blocks = window.sessionStorage.getItem('blocks');
    const bin = window.sessionStorage.getItem('bin');
    if (blocks && bin) {
      setStructure(
        new Structure(
          JSON.parse(blocks).map(
            (block: BlockFingerprint) => new Block(block.type, block.position)
          )
        )
      );
      setBin(JSON.parse(bin));

      window.sessionStorage.clear();
    }
  }, []);
};
