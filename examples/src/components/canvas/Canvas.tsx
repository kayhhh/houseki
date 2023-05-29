import "./Canvas.css";

import { useEffect, useRef } from "react";

/**
 * An auto-resizing canvas component.
 */
export default function Canvas() {
  const canvas = useRef<HTMLCanvasElement>(null);

  // Resize canvas
  useEffect(() => {
    function resize() {
      if (!canvas.current) return;

      canvas.current.width = window.innerWidth;
      canvas.current.height = window.innerHeight;

      // If not mobile, subtract sidebar width
      if (window.innerWidth > 768) canvas.current.width -= 232;
    }

    resize();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [canvas]);

  return <canvas ref={canvas} />;
}
