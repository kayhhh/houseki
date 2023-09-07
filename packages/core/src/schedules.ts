import { DefaultSchedule, StartSchedule } from "thyseus";

export const ReddoSchedules = {
  ApplyCommands: Symbol("ApplyCommands"),
  Destroy: Symbol("Destroy"),
  FixedLoop: Symbol("FixedLoop"),
  FixedUpdate: Symbol("FixedUpdate"),
  PostFixedUpdate: Symbol("PostFixedUpdate"),
  PostUpdate: Symbol("PostUpdate"),
  PreFixedUpdate: Symbol("PreFixedUpdate"),
  PreUpdate: Symbol("PreUpdate"),
  Render: Symbol("Render"),
  Startup: StartSchedule as symbol,
  Update: DefaultSchedule as symbol,
} as const;
