import { PlayerCamera } from "@lattice-engine/player";
import { Query } from "thyseus";

import { PortalRaycast } from "../components";

export function movePlayerCamera(
  cameras: Query<[PlayerCamera, PortalRaycast]>
) {}
