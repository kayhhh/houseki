import { RenderStats } from "reddo/render";
import { Res } from "thyseus";
import { create } from "zustand";

export type StatsStore = {
  frame: number;
  calls: number;
  lines: number;
  points: number;
  triangles: number;
  geometries: number;
  textures: number;
  shaders: number;
};

export const useStatsStore = create<StatsStore>(() => ({
  calls: 0,
  frame: 0,
  geometries: 0,
  lines: 0,
  points: 0,
  shaders: 0,
  textures: 0,
  triangles: 0,
}));

export function statsSystem(renderStats: Res<RenderStats>) {
  useStatsStore.setState({
    calls: renderStats.calls,
    frame: renderStats.frame,
    geometries: renderStats.geometries,
    lines: renderStats.lines,
    points: renderStats.points,
    shaders: renderStats.shaders,
    textures: renderStats.textures,
    triangles: renderStats.triangles,
  });
}
