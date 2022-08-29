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
  firstFetch?: boolean;
  onError?: (error: string) => void;
  onSuccess?: (data: T, ...arg: any) => void;
}

interface ICacheState {
  [key: string]: {
    data: any;
    expiredTime: number;
    isFetch: boolean;
    observer: Set<() => void> | null;
  };
}

interface ICacheAction {
  init: <T>(key: string, options: CacheOption<T>) => void;
  clear: () => void;
  set: <T>(key: string, data: T | T[], options: CacheOption<T>) => void;
  get: <T>(key: string) => T | null;
  subscribe: (key: string, notify: () => void) => void;
  unsubscribe: (key: string, notify: () => void) => void;
  notify: (keys: string[]) => void;
  no: (key: string) => void;
  fetchFn: <T>(key: string, fn: () => Promise<T>) => Promise<T> | undefined;
  fetchStart: (key: string) => void;
  updateCache: <T>(keys: (string | number)[], data: T) => void;
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
        const { overrideCache } = options;
        const prevCacheData = storeRef.current[key].data;

        if (overrideCache && Array.isArray(prevCacheData) && Array.isArray(data)) {
          storeRef.current[key].data = [...prevCacheData, ...data];
        } else {
          storeRef.current[key].data = data;
        }
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
      fetchFn: (key, fn) => {
        const observe = storeRef.current[key];

        if (!observe || observe.isFetch) {
          return;
        }

        storeRef.current[key].isFetch = true;

        return fn();
      },
      fetchStart: (key) => {
        const observe = storeRef.current[key];

        if (!observe) {
          return;
        }
        observe.isFetch = false;
      },
      init: (key, options) => {
        if (storeRef.current[key]) {
          return;
        }

        const currentTime = new Date().getTime();
        const { cacheExpiredTime } = options;

        storeRef.current[key] = {
          data: null,
          expiredTime: currentTime + (cacheExpiredTime ?? 30000),
          observer: null,
          isFetch: false,
        };
      },
      subscribe: (key, notify) => {
        const observers = storeRef.current[key]?.observer;

        if (!observers) {
          storeRef.current[key].observer = new Set();
        }

        storeRef.current[key]?.observer?.add(notify);
      },
      unsubscribe: (key, notify) => {
        storeRef.current[key]?.observer?.delete(notify);
      },
      notify: (keys) => {
        keys.forEach((key) => storeRef.current[key]?.observer?.forEach((ntf) => ntf()));
      },
      no: (key) => {
        storeRef.current[key]?.observer?.forEach((notify) => notify());
      },
      updateCache: (keys, data) => {
        const keyValue = keys.join(" ");
        const observe = storeRef.current[keyValue];

        if (!observe) {
          return;
        }

        observe.data = data;
        action.no(keyValue);
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
