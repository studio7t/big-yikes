import { Block, BlockTypeSlug, growBounds } from '@big-yikes/lib';
import p5Types from 'p5';
import { useState } from 'react';
import Sketch from 'react-p5';
import { useSubmitDiscoveries } from '../hooks/submit-discoveries';
import { useProjectStore } from '../stores/project.store';
import {
  applyTransforms,
  drawBlock,
  flipCanvas,
  mouseToGridCoords,
  snapMouseToGridCoords,
  Transforms,
} from '../utils/canvas-utils';
import { drawGrid } from '../utils/draw-grid';
import { clamp } from '../utils/math-utils';

export const Canvas = () => {
  const { addBlock, removeBlock, structure } = useProjectStore((state) => ({
    structure: state.structure,
    addBlock: state.addBlockIfValid,
    removeBlock: state.removeBlockIfValid,
  }));

  const [panning, setPanning] = useState(false);
  const [hoveringBlock, setHoveringBlock] = useState<Block | null>(null);
  const [blockType, setBlockType] = useState<BlockTypeSlug>('1x1');
  const [transforms, setTransforms] = useState<Transforms>({
    scale: 100,
    translate: { x: 0, y: 0 },
  });

  useSubmitDiscoveries();

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 800).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(240);

    applyTransforms(p5, transforms);
    flipCanvas(p5, transforms.scale);

    p5.strokeWeight(1 / transforms.scale);

    drawGrid(p5, transforms);

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
    const mouseCoords = snapMouseToGridCoords(p5, transforms);
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

  const zoom = (p5: p5Types, event?: WheelEvent) => {
    if (event) {
      const newScale = clamp(transforms.scale - event.deltaY, 50, 400);

      const { x: gridX, y: gridY } = mouseToGridCoords(p5, transforms);

      // grid coords of mouse location are preserved before and after zoom
      const newTranslateX = p5.mouseX - newScale * gridX;
      const newTranslateY = p5.mouseY - (p5.height - newScale * gridY);
      setTransforms({
        translate: { x: newTranslateX, y: Math.max(0, newTranslateY) },
        scale: newScale,
      });
    }
  };

  const updateHoveringBlock = (p5: p5Types) => {
    setHoveringBlock(
      new Block(blockType, snapMouseToGridCoords(p5, transforms))
    );
  };

  const pan = (p5: p5Types) => {
    if (!panning) setPanning(true);

    const deltaX = p5.mouseX - p5.pmouseX;
    const deltaY = p5.mouseY - p5.pmouseY;
    const prevTranslate = transforms.translate;

    const newTranslate = {
      x: prevTranslate.x + deltaX,
      y: Math.max(0, prevTranslate.y + deltaY),
    };
    setTransforms({
      ...transforms,
      translate: newTranslate,
    });
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
