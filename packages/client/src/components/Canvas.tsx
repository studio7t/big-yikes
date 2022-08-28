import { Block, BlockTypeSlug, growBounds } from '@big-yikes/lib';
import p5Types from 'p5';
import { useState } from 'react';
import Sketch from 'react-p5';
import { drawBlock } from '../actions/draw-block';
import { drawGrid } from '../actions/draw-grid';
import { applyTransforms, flipCanvas, pan, zoom } from '../actions/transform';
import { useSubmitDiscoveries } from '../hooks/submit-discoveries';
import { useProjectStore } from '../stores/project.store';
import { useTransformsState } from '../stores/transforms.store';
import { snapMouseToGridCoords } from '../utils/mouse-to-grid';

export const Canvas = () => {
  const { addBlock, removeBlock, structure } = useProjectStore((state) => ({
    structure: state.structure,
    addBlock: state.addBlockIfValid,
    removeBlock: state.removeBlockIfValid,
  }));

  const { panning, setPanning } = useTransformsState((state) => ({
    panning: state.panning,
    setPanning: state.setPanning,
  }));

  const [hoveringBlock, setHoveringBlock] = useState<Block | null>(null);
  const [blockType, setBlockType] = useState<BlockTypeSlug>('1x1');

  useSubmitDiscoveries();

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 800).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(240);

    applyTransforms(p5);
    flipCanvas(p5);

    drawGrid(p5);

    for (const block of structure.blocks) {
      drawBlock(p5, block);
    }

    if (hoveringBlock) {
      const nearbyBlocks = structure.getBlocksInBounds(
        growBounds(hoveringBlock.bounds)
      );

      if (hoveringBlock.isValidAndConnected(nearbyBlocks))
        drawBlock(p5, hoveringBlock);
    }
  };

  const handleMouseReleased = (p5: p5Types) => {
    if (panning) setPanning(false);
    else removeOrPlaceBlock(p5);
  };

  const removeOrPlaceBlock = (p5: p5Types) => {
    const mouseCoords = snapMouseToGridCoords(p5);
    const blockAtMouse = structure.getBlockAtCoords(mouseCoords);

    if (blockAtMouse) {
      removeBlock(blockAtMouse);
      return;
    }

    addBlock(new Block(blockType, mouseCoords));
  };

  const changeActiveBlockType = (p5: p5Types) => {
    const { key } = p5;
    if (key === '1') setBlockType('1x1');
    else if (key === '2') setBlockType('1x2');
  };

  const updateHoveringBlock = (p5: p5Types) => {
    setHoveringBlock(new Block(blockType, snapMouseToGridCoords(p5)));
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mouseReleased={handleMouseReleased}
      keyPressed={changeActiveBlockType}
      mouseWheel={zoom}
      mouseMoved={updateHoveringBlock}
      mouseDragged={pan}
    />
  );
};
