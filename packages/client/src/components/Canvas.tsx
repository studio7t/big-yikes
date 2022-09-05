import { Block } from '@big-yikes/lib';
import p5Types from 'p5';
import Sketch from 'react-p5';
import { drawBlock } from '../actions/draw-block';
import { drawGrid } from '../actions/draw-grid';
import { applyTransforms, flipCanvas } from '../actions/transform';
import { useProjectStore } from '../stores/project.store';
import { useTentativeState } from '../stores/tentative.store';
import { useTransformsState } from '../stores/transforms.store';
import { snapMouseToGridCoords } from '../utils/mouse-to-grid';

export const Canvas = () => {
  const { addBlock, removeBlock, structure } = useProjectStore((state) => ({
    structure: state.structure,
    addBlock: state.addBlockIfValid,
    removeBlock: state.removeBlockIfValid,
  }));

  const { pan, zoom, panning, setPanning } = useTransformsState((state) => ({
    pan: state.pan,
    zoom: state.zoom,
    panning: state.panning,
    setPanning: state.setPanning,
  }));

  const { hoveringBlock, updateHoveringBlock, blockType, setBlockType } =
    useTentativeState((state) => ({
      hoveringBlock: state.hoveringBlock,
      updateHoveringBlock: state.updateHoveringBlock,
      blockType: state.blockType,
      setBlockType: state.setBlockType,
    }));

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
    } else {
      addBlock(new Block(blockType, mouseCoords));
    }

    updateHoveringBlock(p5);
  };

  const changeActiveBlockType = (p5: p5Types) => {
    const { key } = p5;
    if (key === '1') setBlockType('1x1');
    else if (key === '2') setBlockType('1x2');

    updateHoveringBlock(p5);
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
