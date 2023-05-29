import "./Stats.css";

import { useEffect, useState } from "react";

import { statsStore } from "./system";

const STATS_INTERVAL_MS = 500;

export default function Stats() {
  const [fps, setFps] = useState(0);
  const [calls, setCalls] = useState(0);
  const [lines, setLines] = useState(0);
  const [points, setPoints] = useState(0);
  const [triangles, setTriangles] = useState(0);
  const [geometries, setGeometries] = useState(0);
  const [textures, setTextures] = useState(0);
  const [shaders, setShaders] = useState(0);

  useEffect(() => {
    let lastFrame = statsStore.frame;

    const interval = setInterval(() => {
      const currentFrame = statsStore.frame;
      const fps = ((currentFrame - lastFrame) / STATS_INTERVAL_MS) * 1000;
      lastFrame = currentFrame;
      setFps(Math.max(0, Math.round(fps * 10) / 10));

      setCalls(statsStore.calls);
      setLines(statsStore.lines);
      setPoints(statsStore.points);
      setTriangles(statsStore.triangles);
      setGeometries(statsStore.geometries);
      setTextures(statsStore.textures);
      setShaders(statsStore.shaders);
    }, STATS_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="stats">
      <div className="stat-row">
        <div className="stat">
          <div>FPS</div>
          <div>{fps}</div>
        </div>

        <div className="stat">
          <div>Calls</div>
          <div>{calls}</div>
        </div>

        <div className="stat">
          <div>Triangles</div>
          <div>{triangles}</div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat">
          <div>Geometries</div>
          <div>{geometries}</div>
        </div>

        <div className="stat">
          <div>Textures</div>
          <div>{textures}</div>
        </div>

        <div className="stat">
          <div>Shaders</div>
          <div>{shaders}</div>
        </div>

        <div className="stat">
          <div>Lines</div>
          <div>{lines}</div>
        </div>

        <div className="stat">
          <div>Points</div>
          <div>{points}</div>
        </div>
      </div>
    </div>
  );
}
