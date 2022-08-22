import Sketch from 'react-p5';
import p5Types from 'p5';
import { Block, blockTypes, BlockTypeSlug, Structure } from '@big-yikes/lib';
import { useEffect, useState } from 'react';
import { Vector2D } from '@big-yikes/lib';

const scale = 100;
const pan = [0, 0];

const App = () => {
  const [structure, setStructure] = useState<Structure>(new Structure([]));
  const [blockType, setBlockType] = useState<BlockTypeSlug>('1x1');

  useEffect(() => {
    console.log(structure.hash, structure.isDiscovery());
    if (structure.isDiscovery()) {
      fetch('http://localhost:3001/discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blocks: structure.blocks }),
      }).then((res) => {
        res.text().then((val) => {
          console.log(val);
        });
      });
    }
  }, [structure]);

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(800, 800).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    applyTransforms(p5);
    flipCanvas(p5);

    p5.background(255);
    drawGrid(p5);

    for (const block of structure.blocks) {
      drawBlock(p5, block);
    }
  };

  const handleClick = (p5: p5Types) => {
    const mouseCoords = gridCoordsAtMouse(p5);

    for (let i = 0; i < structure.blocks.length; i++) {
      const block = structure.blocks[i];
      for (const coord of block.coordinates) {
        if (coord.x === mouseCoords.x && coord.y === mouseCoords.y) {
          const resultingStructure = new Structure([
            ...structure.blocks.slice(0, i),
            ...structure.blocks.slice(i + 1),
          ]);
          if (resultingStructure.isValid()) {
            setStructure(resultingStructure);
          }
          return;
        }
      }
    }

    const resultingStructure = new Structure([
      ...structure.blocks,
      new Block(blockType, gridCoordsAtMouse(p5)),
    ]);

    if (resultingStructure.isValid()) {
      setStructure(resultingStructure);
    }
  };

  const changeBlockTypeHandler = (p5: p5Types) => {
    const { key } = p5;
    if (key === '1') setBlockType('1x1');
    else if (key === '2') setBlockType('1x2');
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      mouseClicked={handleClick}
      keyPressed={changeBlockTypeHandler}
    />
  );
};

const drawBlock = (p5: p5Types, block: Block) => {
  for (const coord of block.coordinates) {
    p5.fill(blockTypes[block.type].color);
    p5.rect(coord.x, coord.y, 1, 1);
  }
};

const applyTransforms = (p5: p5Types) => {
  p5.scale(scale);
  p5.translate(-pan[0], -pan[1]);
};

const flipCanvas = (p5: p5Types) => {
  p5.translate(0, p5.height / scale / 2);
  p5.scale(1, -1);
  p5.translate(0, -p5.height / scale / 2);
};

const drawGrid = (p5: p5Types) => {
  const rows = p5.height / scale;
  const cols = p5.width / scale;

  p5.stroke(0);
  p5.strokeWeight(1 / scale);

  for (let row = 0; row < rows; row++) {
    p5.line(0, row, cols, row);
  }

  for (let col = 0; col < cols; col++) {
    p5.line(col, 0, col, rows);
  }
};

const gridCoordsAtMouse = (p5: p5Types): Vector2D => {
  const { mouseX, mouseY } = p5;

  const x = Math.floor(mouseX / scale);
  const y = Math.floor((p5.height - mouseY) / scale);

  return { x, y };
};

export default App;
