import { DefaultSchedule, StartSchedule } from "thyseus";

export const LatticeSchedules = {
  Destroy: Symbol("Destroy"),
  FixedUpdate: Symbol("FixedUpdate"),
  Startup: StartSchedule as symbol,
  Update: DefaultSchedule as symbol,
} as const;
