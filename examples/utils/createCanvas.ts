/**
 * Create a canvas element and append it to the body.
 * Updates the canvas size on window resize.
 */
export function createCanvas() {
  const canvas = document.createElement("canvas");
  canvas.style.touchAction = "none";
  canvas.style.position = "absolute";

  document.body.appendChild(canvas);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  return canvas;
}
