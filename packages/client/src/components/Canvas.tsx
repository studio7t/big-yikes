import { useAuth0 } from '@auth0/auth0-react';
import { Block, BlockTypeSlug, Structure } from '@big-yikes/lib';
import p5Types from 'p5';
import { useEffect, useState } from 'react';
import Sketch from 'react-p5';
import { useProjectStore } from '../stores/project.store';
import {
  applyTransforms,
  drawBlock,
  drawGrid,
  flipCanvas,
  snapMouseToGridCoords,
  Transforms,
} from '../utils/canvas-utils';
import { clamp } from '../utils/math-utils';

export const Canvas = () => {
  const { getAccessTokenSilently } = useAuth0();

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

  useEffect(() => {
    const submitDiscovery = async () => {
      const accessToken = await getAccessTokenSilently({
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      });

      const res = await fetch(`${import.meta.env.VITE_API_HOST}/discovery`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ blocks: structure.blocks }),
      });

      const discoveries = await res.json();
      console.log(discoveries);
    };

    if (structure.isDiscovery()) submitDiscovery();
  }, [structure]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 800).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    applyTransforms(p5, transforms);
    flipCanvas(p5, transforms.scale);

    p5.background(255);
    drawGrid(p5, transforms.scale);

    for (const block of structure.blocks) {
      drawBlock(p5, block);
    }

    if (hoveringBlock) {
      const resultingStructure = new Structure([
        ...structure.blocks,
        hoveringBlock,
      ]);
      if (resultingStructure.isValid()) drawBlock(p5, hoveringBlock);
    }
  };

  const handleMouseReleased = (p5: p5Types) => {
    if (panning) setPanning(false);
    else removeOrPlaceBlock(p5);
  };

  const removeOrPlaceBlock = (p5: p5Types) => {
    const mouseCoords = snapMouseToGridCoords(p5, transforms);

    for (let i = 0; i < structure.blocks.length; i++) {
      const block = structure.blocks[i];
      for (const coord of block.coordinates) {
        if (coord.x === mouseCoords.x && coord.y === mouseCoords.y) {
          removeBlock(i);
          return;
        }
      }
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
      const scale = clamp(transforms.scale + event.deltaY, 50, 400);
      setTransforms({
        ...transforms,
        scale,
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
      y: prevTranslate.y + deltaY,
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
