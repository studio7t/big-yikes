import { Block, isEqual } from '@big-yikes/lib';
import p5Types from 'p5';
import Sketch from 'react-p5';
import { drawBlock } from '../actions/draw-block';
import { drawGrid } from '../actions/draw-grid';
import { applyTransforms, flipCanvas } from '../actions/transform';
import snapUrl from '../assets/sounds/snap.mp3';
import tickUrl from '../assets/sounds/tick.mp3';
import { useBinStore } from '../stores/bin.store';
import {
  ableToAdd,
  ableToRemove,
  useProjectStore,
} from '../stores/project.store';
import {
  chooseNextAvailableBlockType,
  useTentativeStore,
} from '../stores/tentative.store';
import {
  CANVAS_BUFFER,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
} from '../stores/transforms.store';
import { snapMouseToGridCoords } from '../utils/coord-conversion';
import { isMouseInCanvas } from '../utils/mouse-in-canvas';

export const Canvas = () => {
  const { addBlock, removeBlock, structure } = useProjectStore((state) => ({
    structure: state.structure,
    addBlock: state.addBlock,
    removeBlock: state.removeBlock,
  }));

  const { addToBin, removeFromBin, bin } = useBinStore((state) => ({
    bin: state.bin,
    addToBin: state.addToBin,
    removeFromBin: state.removeFromBin,
  }));

  const { hoveringBlock, setHoveringBlock, blockType } = useTentativeStore(
    (state) => ({
      hoveringBlock: state.hoveringBlock,
      setHoveringBlock: state.setHoveringBlock,
      blockType: state.blockType,
      setBlockType: state.setBlockType,
    })
  );

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(
      CANVAS_WIDTH + CANVAS_BUFFER * 2,
      CANVAS_HEIGHT + CANVAS_BUFFER * 2
    ).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(255);

    applyTransforms(p5);
    flipCanvas(p5);

    drawGrid(p5);

    for (const block of structure.blocks) {
      drawBlock(p5, block);
    }

    if (hoveringBlock) {
      drawBlock(p5, hoveringBlock, { tentative: true });
    }
  };

  const onMouseClicked = (p5: p5Types) => {
    if (!isMouseInCanvas(p5)) return;

    const mouseCoords = snapMouseToGridCoords(p5);
    const blockAtMouse = structure.getBlockAtCoords(mouseCoords);

    if (blockAtMouse) {
      if (ableToRemove(blockAtMouse)) {
        removeBlock(blockAtMouse);
        addToBin(blockAtMouse.type);
      }
    } else {
      const block = new Block(blockType, mouseCoords);
      if (ableToAdd(block)) {
        removeFromBin(block.type);
        addBlock(block);

        new Audio(snapUrl).play();

        if (bin[block.type] === 0) chooseNextAvailableBlockType();
      }
    }

    setHoveringBlock(null);
  };

  const onMouseMoved = (p5: p5Types) => {
    const snappedMousePos = snapMouseToGridCoords(p5);

    const shouldUpdateHoveringBlock =
      hoveringBlock === null ||
      hoveringBlock.type !== blockType ||
      !isEqual(hoveringBlock.position, snappedMousePos);

    if (shouldUpdateHoveringBlock) {
      const block = new Block(blockType, snappedMousePos);
      if (!isMouseInCanvas(p5) || bin[blockType] === 0 || !ableToAdd(block)) {
        setHoveringBlock(null);
      } else {
        setHoveringBlock(block);

        new Audio(tickUrl).play();
      }
    }
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mouseClicked={onMouseClicked}
      mouseMoved={onMouseMoved}
    />
  );
};
