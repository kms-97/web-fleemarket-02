import React from "react";
import { createContext, useContext, useMemo, useRef } from "react";

interface Props {
  children: React.ReactNode;
}

export interface CacheOption<T> {
  cacheExpiredTime?: number;
  cacheClear?: boolean;
  isCacheSave?: boolean;
  overrideCache?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: T, ...arg: any) => void;
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
  set: <T>(key: string, data: T | T[], options: CacheOption<T>) => void;
  get: <T>(key: string) => T | null;
  subscribe: (key: string, notify: () => void) => void;
  unsubscribe: (key: string, notify: () => void) => void;
  notify: (keys: string[]) => void;
  no: (key: string) => void;
}

export const CacheContext = createContext({});
export const CacheActionContext = createContext<ICacheAction | null>(null);

export const useCacheContext = () => useContext(CacheContext);
export const useCacheActionContext = () => useContext(CacheActionContext);

export const CacheProvider = ({ children }: Props) => {
  const storeRef = useRef<ICacheState>({});

  const action: ICacheAction = useMemo(
    () => ({
      clear: () => {
        storeRef.current = {};
      },
      set: (key, data, options) => {
        const currentTime = new Date().getTime();
        const { overrideCache, cacheExpiredTime } = options;
        const prevCacheData = storeRef.current[key].data;

        if (overrideCache && Array.isArray(prevCacheData) && Array.isArray(data)) {
          storeRef.current[key].data = [...prevCacheData, ...data];
        } else {
          storeRef.current[key].data = data;
        }

        storeRef.current[key].expiredTime = currentTime + (cacheExpiredTime ?? 30000);
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
        const observers = storeRef.current[key]?.observer;

        if (!observers) {
          storeRef.current[key].observer = new Set();
        }

        storeRef.current[key].observer?.add(notify);
      },
      unsubscribe: (key, notify) => {
        storeRef.current[key].observer?.delete(notify);
      },
      notify: (keys) => {
        keys.forEach((key) => storeRef.current[key].observer?.forEach((ntf) => ntf()));
      },
      no: (key) => {
        storeRef.current[key].observer?.forEach((notify) => notify());
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

export const useCacheAction = () => {
  const actions = useCacheActionContext();

  if (!actions) {
    throw new Error();
  }

  return actions;
};
