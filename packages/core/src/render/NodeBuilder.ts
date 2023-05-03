import { System, system } from "@lastolivegames/becsy";
import { Object3D } from "three";

import { Node, NodeObject } from "../components";
import { Renderer } from "./Renderer";

/**
 * Converts Node components to Three.js objects.
 */
@system((s) => s.before(Renderer).beforeReadersOf(NodeObject))
export class NodeBuilder extends System {
  private readonly objects = this.query((q) => q.with(NodeObject).write);

  private readonly addedNodes = this.query((q) => q.added.with(Node));
  private readonly addedOrChangedNodes = this.query(
    (q) => q.addedOrChanged.with(Node).trackWrites
  );
  private readonly removedNodes = this.query((q) => q.removed.with(Node));

  override execute() {
    // Create objects
    for (const entity of this.addedNodes.added) {
      entity.add(NodeObject, { object: new Object3D() });
    }

    // Sync objects
    for (const entity of this.addedOrChangedNodes.addedOrChanged) {
      const node = entity.read(Node);
      const object = entity.read(NodeObject).object;

      object.position.fromArray(node.position);
      object.quaternion.fromArray(node.rotation);
      object.scale.fromArray(node.scale);
    }

    // Remove objects
    for (const entity of this.removedNodes.removed) {
      const object = entity.read(NodeObject).object;
      object.removeFromParent();
      object.clear();

      entity.remove(NodeObject);
    }
  }
}
