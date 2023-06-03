import { CoreSchedule } from "thyseus";

export const LatticeSchedules = {
  Destroy: Symbol("Destroy"),
  FixedUpdate: CoreSchedule.FixedUpdate as symbol,
  Startup: CoreSchedule.Startup as symbol,
  Update: CoreSchedule.Main as symbol,
} as const;
