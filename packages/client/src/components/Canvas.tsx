import { Block, BlockTypeSlug, growBounds, isEqual } from '@big-yikes/lib';
import p5Types from 'p5';
import { useState } from 'react';
import Sketch from 'react-p5';
import { drawBlock } from '../actions/draw-block';
import { drawGrid } from '../actions/draw-grid';
import { applyTransforms, flipCanvas, pan, zoom } from '../actions/transform';
import { useProjectStore } from '../stores/project.store';
import { useTransformsState } from '../stores/transforms.store';
import { isMouseInCanvas, snapMouseToGridCoords } from '../utils/mouse-to-grid';

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
    const mouseInCanvas = isMouseInCanvas(p5);
    if (!mouseInCanvas) {
      if (hoveringBlock) setHoveringBlock(null);
      return;
    }

    const snappedMousePos = snapMouseToGridCoords(p5);
    if (
      hoveringBlock === null ||
      !isEqual(hoveringBlock.position, snappedMousePos)
    ) {
      const potentialBlock = new Block(blockType, snappedMousePos);
      const nearbyBlocks = structure.getBlocksInBounds(
        growBounds(potentialBlock.bounds)
      );

      if (potentialBlock.isValidAndConnected(nearbyBlocks)) {
        setHoveringBlock(new Block(blockType, snappedMousePos));
        // play sound here
      } else {
        setHoveringBlock(null);
      }
    }
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
