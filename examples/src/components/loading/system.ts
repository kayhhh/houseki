import { Loading } from "lattice-engine/core";
import { Entity, Query, SystemRes } from "thyseus";
import { create } from "zustand";

type LoadingStore = {
  count: number;
  loaded: boolean;
  maxCount: number;
  message: string;
  reset: () => void;
};

export const useLoadingStore = create<LoadingStore>((set) => ({
  count: 0,
  loaded: false,
  maxCount: 0,
  message: "",
  reset: () => {
    set({ count: 0, loaded: false, maxCount: 0, message: "" });
  },
}));

class LocalStore {
  messageId = 0n;
  message = "";
}

export function loadingSystem(
  localStore: SystemRes<LocalStore>,
  loading: Query<[Entity, Loading]>
) {
  const ids: bigint[] = [];

  let count = 0;
  let newMessageId = 0n;
  let newMessage = "";

  for (const [entity, load] of loading) {
    ids.push(entity.id);

    count++;

    if (!newMessage && load.message) {
      newMessageId = entity.id;
      newMessage = load.message;
    }
  }

  if (!ids.includes(localStore.messageId)) {
    localStore.messageId = newMessageId;
    localStore.message = newMessage;
  }

  if (count > 0) {
    useLoadingStore.setState((prev) => ({
      count,
      loaded: false,
      maxCount: Math.max(prev.maxCount, count),
      message: localStore.message,
    }));
  } else {
    useLoadingStore.setState({ loaded: true, message: "" });
  }
}
