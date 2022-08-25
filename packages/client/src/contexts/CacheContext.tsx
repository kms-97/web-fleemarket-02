import React from "react";
import { createContext, useContext, useMemo, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

export interface CacheOption<T> {
  cacheExpiredTime?: number;
  cacheClear?: boolean;
  isCacheSave?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: T) => void;
}

interface ICacheState {
  [key: string]: {
    data: any;
    expiredTime: number;
    observer: Set<() => void> | null;
  };
}

interface ICacheAction {
  init: (key: string) => void;
  clear: () => void;
  set: <T>(key: string, data: T, time: number) => void;
  get: <T>(key: string) => T | null;
  subscribe: (key: string, notify: () => void) => void;
}

export const CacheContext = createContext({});
export const CacheActionContext = createContext<ICacheAction>({
  clear: () => {
    return;
  },
  set: (key, data, time) => {
    return;
  },
  get: (key) => {
    return null;
  },
  subscribe: (key, notify) => {
    return;
  },
  init: (key) => {
    return;
  },
});

export const useCacheContext = () => useContext(CacheContext);
export const useCacheActionContext = () => useContext(CacheActionContext);

export const CacheProvider = ({ children }: Props) => {
  const storeRef = useRef<ICacheState>({});

  const action: ICacheAction = useMemo(
    () => ({
      clear: () => {
        storeRef.current = {};
      },
      set: (key, data, expiredTime) => {
        const currentTime = new Date().getTime();

        storeRef.current[key].data = data;
        storeRef.current[key].expiredTime = currentTime + expiredTime;
        storeRef.current[key].observer?.forEach((notify) => notify());
      },
      get: (key) => {
        const { data, expiredTime } = storeRef.current[key];

        const currentTime = new Date().getTime();

        if (currentTime >= expiredTime) {
          storeRef.current[key].data = null;
          return null;
        }

        return data;
      },
      init: (key) => {
        if (storeRef.current[key]) {
          return;
        }

        storeRef.current[key] = {
          data: null,
          expiredTime: 30000,
          observer: null,
        };
      },
      subscribe: (key, notify) => {
        const observers = storeRef.current[key].observer;

        if (!observers) {
          storeRef.current[key].observer = new Set();
        }

        storeRef.current[key].observer?.add(notify);
      },
    }),
    [],
  );

  return (
    <CacheContext.Provider value={storeRef.current}>
      <CacheActionContext.Provider value={action}>{children}</CacheActionContext.Provider>
    </CacheContext.Provider>
  );
};
