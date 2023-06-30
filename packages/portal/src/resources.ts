import { WebGLRenderTarget } from "three";

export class PortalStore {
  readonly renderTargets = new Map<bigint, WebGLRenderTarget>();
}
