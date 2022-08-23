import Sketch from 'react-p5';
import p5Types from 'p5';
import { Block, BlockTypeSlug } from '@big-yikes/lib';
import { useEffect, useState } from 'react';
import { BinCounts } from './components/BinCounts';
import {
  applyTransforms,
  drawBlock,
  drawGrid,
  flipCanvas,
  mouseToGridCoords,
  Transforms,
} from './utils/canvas-utils';
import { clamp } from './utils/math-utils';
import { useProjectStore } from './stores/project.store';

const App = () => {
  const { bin, structure } = useProjectStore((state) => ({
    bin: state.bin,
    structure: state.structure,
  }));
  const { addBlock, removeBlock } = useProjectStore((state) => ({
    addBlock: state.addBlockIfValid,
    removeBlock: state.removeBlockIfValid,
  }));

  const [blockType, setBlockType] = useState<BlockTypeSlug>('1x1');
  const [transforms, setTransforms] = useState<Transforms>({
    scale: 100,
    translate: { x: 0, y: 0 },
  });

  useEffect(() => {
    console.log('Discovery: ' + structure.isDiscovery());
    // if (structure.isDiscovery()) {
    //   fetch('http://localhost:3001/discovery', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ blocks: structure.blocks }),
    //   }).then((res) => {
    //     res.text().then((val) => {
    //       console.log(val);
    //     });
    //   });
    // }
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

  return (
    <div>
      <Sketch
        setup={setup}
        draw={draw}
        mouseClicked={removeOrPlaceBlock}
        keyPressed={changeActiveBlockType}
        mouseWheel={zoom}
      />
      <BinCounts bin={bin} />
    </div>
  );
};

export default App;
