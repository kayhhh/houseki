import { RenderStats } from "lattice-engine/render";
import { Res } from "thyseus";

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

export const statsStore: StatsStore = {
  calls: 0,
  frame: 0,
  geometries: 0,
  lines: 0,
  points: 0,
  shaders: 0,
  textures: 0,
  triangles: 0,
};

export function statsSystem(renderStats: Res<RenderStats>) {
  statsStore.frame = renderStats.frame;
  statsStore.calls = renderStats.calls;
  statsStore.lines = renderStats.lines;
  statsStore.points = renderStats.points;
  statsStore.triangles = renderStats.triangles;
  statsStore.geometries = renderStats.geometries;
  statsStore.textures = renderStats.textures;
  statsStore.shaders = renderStats.shaders;
}
