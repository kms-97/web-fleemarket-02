import { FETCH_FAILURE, FETCH_REQUEST, FETCH_SUCCESS } from "@constants/actions";
import { CacheOption, useCacheAction } from "@contexts/CacheContext";
import { fetchReducer, IFetchInitialState, initialState } from "@src/reducers/fetchReducer";
import { useCallback, useEffect, useReducer, useState } from "react";

const initialQueryOptions: CacheOption<any> = {
  cacheExpiredTime: 30000,
  cacheClear: false,
  isCacheSave: true,
  overrideCache: false,
  onError: (error: string) => error,
  onSuccess: (data: any) => data,
};

export const useQuery = <T>(
  keys: (string | number)[],
  callback: (...arg: any) => Promise<T>,
  options: CacheOption<T> = {},
) => {
  const [notify, setNotify] = useState<number>(0);
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const { onError, onSuccess, cacheClear, isCacheSave, ..._options } = {
    ...initialQueryOptions,
    ...options,
  };
  const { clear, set, get, subscribe, unsubscribe, init, no } = useCacheAction();

  const { data, error, loading } = state as IFetchInitialState<T>;
  const keyValue = keys.join(" ");

  const refetch = async (...args: any) => {
    dispatch({ type: FETCH_REQUEST });

    try {
      const result = await callback(...args);

      onSuccess?.(result, ...args);
      dispatch({ type: FETCH_SUCCESS, payload: result });

      if (isCacheSave) {
        set<T>(keyValue, result, _options);
        no(keyValue);
      }
    } catch (error: any) {
      onError?.(error.message);
      dispatch({ type: FETCH_FAILURE, error: error.message });
    }
  };

  const onNotify = useCallback(() => {
    setNotify((prev) => prev + 1);
  }, []);

  useEffect(() => {
    init(keyValue);
    subscribe(keyValue, onNotify);
  }, [keys]);

  useEffect(() => {
    const fetchCallback = async (...args: any) => {
      if (cacheClear) {
        clear();
      }

      dispatch({ type: FETCH_REQUEST });

      const cacheData = get<T>(keyValue);

      if (cacheData) {
        onSuccess?.(cacheData);
        dispatch({ type: FETCH_SUCCESS, payload: cacheData });
        return;
      }

      try {
        const result = await callback(...args);

        if (isCacheSave) {
          set<T>(keyValue, result, _options);
        }

        onSuccess?.(result, ...args);
        dispatch({ type: FETCH_SUCCESS, payload: result });
      } catch (error: any) {
        onError?.(error.message);
        dispatch({ type: FETCH_FAILURE, error: error.message });
      }
    };

    fetchCallback();

    return () => {
      unsubscribe(keyValue, onNotify);
    };
  }, [notify]);

  return { data, error, loading, refetch };
};
