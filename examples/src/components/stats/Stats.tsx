import "./Stats.css";

import { useEffect, useState } from "react";

import { useStatsStore } from "./system";

const STATS_INTERVAL_MS = 500;
const COLLAPSED_KEY = "stats-collapsed";

export default function Stats() {
  const calls = useStatsStore((state) => state.calls);
  const triangles = useStatsStore((state) => state.triangles);
  const geometries = useStatsStore((state) => state.geometries);
  const textures = useStatsStore((state) => state.textures);
  const shaders = useStatsStore((state) => state.shaders);
  const lines = useStatsStore((state) => state.lines);
  const points = useStatsStore((state) => state.points);

  const [fps, setFps] = useState(0);
  const [collapsed, setCollapsed] = useState(
    sessionStorage.getItem(COLLAPSED_KEY) === "true"
  );

  useEffect(() => {
    let lastFrame = useStatsStore.getState().frame;

    const interval = setInterval(() => {
      const currentFrame = useStatsStore.getState().frame;
      const fps = ((currentFrame - lastFrame) / STATS_INTERVAL_MS) * 1000;
      lastFrame = currentFrame;
      setFps(Math.max(0, fps));
    }, STATS_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  function toggleCollapsed() {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    sessionStorage.setItem(COLLAPSED_KEY, newCollapsed ? "true" : "false");
  }

  return (
    <div id="stats" className={collapsed ? "collapsed" : ""}>
      <button
        id="stats-collapse"
        onClick={toggleCollapsed}
        title={collapsed ? "Open Stats" : "Close Stats"}
      >
        {`>`}
      </button>

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
