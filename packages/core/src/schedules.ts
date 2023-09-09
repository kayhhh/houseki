import { DefaultSchedule, StartSchedule } from "thyseus";

export const HousekiSchedules = {
  ApplyCommands: Symbol("ApplyCommands"),
  Destroy: Symbol("Destroy"),
  FixedUpdate: Symbol("FixedUpdate"),
  PostFixedUpdate: Symbol("PostFixedUpdate"),
  PostLoop: Symbol("PostLoop"),
  PostUpdate: Symbol("PostUpdate"),
  PreFixedUpdate: Symbol("PreFixedUpdate"),
  PreLoop: Symbol("PreLoop"),
  PreUpdate: Symbol("PreUpdate"),
  Render: Symbol("Render"),
  RunFixedUpdate: Symbol("RunFixedUpdate"),
  RunMainUpdate: Symbol("RunMainUpdate"),
  Startup: StartSchedule as symbol,
  Update: DefaultSchedule as symbol,
} as const;
