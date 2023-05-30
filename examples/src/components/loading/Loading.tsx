import "./Loading.css";

import { useEffect } from "react";

import { useLoadingStore } from "./system";

export default function Loading() {
  const loaded = useLoadingStore((state) => state.loaded);
  const message = useLoadingStore((state) => state.message);
  const count = useLoadingStore((state) => state.count);
  const maxCount = useLoadingStore((state) => state.maxCount);

  const text = message || "Loading...";

  // Clean up on unmount
  useEffect(() => {
    return () => {
      useLoadingStore.getState().reset();
    };
  }, []);

  return (
    <div id="loading" className={loaded ? "hidden" : ""}>
      <div id="loading-text">{text}</div>
      {maxCount > 0 && (
        <div id="loading-bar">
          {count}/{maxCount}
        </div>
      )}
    </div>
  );
}
