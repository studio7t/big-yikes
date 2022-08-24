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
  mouseToGridCoords,
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

  const removeOrPlaceBlock = (p5: p5Types) => {
    const mouseCoords = mouseToGridCoords(p5, transforms.scale);

    for (let i = 0; i < structure.blocks.length; i++) {
      const block = structure.blocks[i];
      for (const coord of block.coordinates) {
        if (coord.x === mouseCoords.x && coord.y === mouseCoords.y) {
          removeBlock(i);
          return;
        }
      }
    }

    addBlock(new Block(blockType, mouseToGridCoords(p5, transforms.scale)));
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
      new Block(blockType, mouseToGridCoords(p5, transforms.scale))
    );
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mouseClicked={removeOrPlaceBlock}
      keyPressed={changeActiveBlockType}
      mouseWheel={zoom}
      mouseMoved={updateHoveringBlock}
    />
  );
};
