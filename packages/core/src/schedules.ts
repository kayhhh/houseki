import { DefaultSchedule, StartSchedule } from "thyseus";

export const LatticeSchedules = {
  ApplyCommands: Symbol("ApplyCommands"),
  Destroy: Symbol("Destroy"),
  FixedUpdate: Symbol("FixedUpdate"),
  Startup: StartSchedule as symbol,
  Update: DefaultSchedule as symbol,
} as const;
