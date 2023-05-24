import Canvas from "../../utils/Canvas";
import { useEngine } from "../../utils/useEngine";
import { world } from "./world";

export default function VRM() {
  useEngine(world);

  return <Canvas />;
}
