import "./Loading.css";

import { useEffect, useState } from "react";

import { useLoadingStore } from "./system";

const LOADING_DELAY = 1000;

export default function Loading() {
  const loaded = useLoadingStore((state) => state.loaded);
  const loading = useLoadingStore((state) => state.loading);
  const message = useLoadingStore((state) => state.message);
  const total = useLoadingStore((state) => state.total);
  const startedLoading = useLoadingStore((state) => state.startedLoading);

  const [doneLoading, setDoneLoading] = useState(false);

  // Reset loading state when we unmount
  useEffect(() => {
    return () => {
      useLoadingStore.getState().reset();
    };
  }, []);

  // If nothing is loading after a delay, we're done loading
  useEffect(() => {
    if (!startedLoading) return;

    const timeout = setTimeout(() => {
      if (loading === 0) {
        setDoneLoading(true);
      }
    }, LOADING_DELAY);

    return () => clearTimeout(timeout);
  }, [startedLoading, loading, setDoneLoading]);

  const text = message || "Loading...";

  return (
    <div id="loading" className={doneLoading ? "hidden" : ""}>
      <div>{text}</div>
      {total === 0 ? null : (
        <div>
          ({loaded}/{total})
        </div>
      )}
    </div>
  );
}
