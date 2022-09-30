import p5Types from 'p5';

export const isMouseInCanvas = (p5: p5Types) => {
  return (
    p5.mouseX > 0 &&
    p5.mouseX < p5.width &&
    p5.mouseY > 0 &&
    p5.mouseY < p5.height
  );
};
