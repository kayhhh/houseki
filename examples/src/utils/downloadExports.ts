import { ExportedGltf } from "lattice-engine/gltf";
import { EventReader } from "thyseus";

export function downloadExports(reader: EventReader<ExportedGltf>) {
  if (reader.length === 0) return;

  for (const event of reader) {
    const isBinary = event.binary;

    fetch(event.uri)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);

        const fileExtension = isBinary ? "glb" : "gltf";

        const link = document.createElement("a");
        link.download = `exported.${fileExtension}`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      });
  }

  reader.clear();
}
