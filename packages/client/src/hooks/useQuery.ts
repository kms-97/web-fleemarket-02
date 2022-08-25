import { FETCH_FAILURE, FETCH_REQUEST, FETCH_SUCCESS } from "@constants/actions";
import { CacheOption, useCacheActionContext } from "@contexts/CacheContext";
import { fetchReducer, initialState } from "@src/reducers/fetchReducer";
import { useCallback, useEffect, useReducer, useState } from "react";

const initialQueryOptions: CacheOption<any> = {
  cacheExpiredTime: 30000,
  cacheClear: false,
  isCacheSave: true,
  onError: (error: string) => error,
  onSuccess: (data: any) => data,
};

export const useQuery = <T>(
  key: string,
  callback: (...arg: any) => Promise<T>,
  options: CacheOption<T>,
) => {
  const [notify, setNotify] = useState<number>(NaN);
  const [state, dispatch] = useReducer(fetchReducer, initialState);

  const { onError, onSuccess, cacheClear, cacheExpiredTime, isCacheSave } = {
    ...initialQueryOptions,
    ...options,
  };
  const { clear, set, get, subscribe, init } = useCacheActionContext();

  const { data, error, loading } = state;

  const refetch = async () => {
    dispatch({ type: FETCH_REQUEST });

    try {
      const result = await callback();

      if (isCacheSave) {
        set<T>(key, result, cacheExpiredTime ?? 30000);
      }

      onSuccess?.(result);
      dispatch({ type: FETCH_SUCCESS, payload: result });
    } catch (error: any) {
      onError?.(error.message);
      dispatch({ type: FETCH_FAILURE, error: error.message });
    }
  };

  const onNotify = useCallback(() => {
    setNotify(NaN);
  }, []);

  useEffect(() => {
    init(key);
    subscribe(key, onNotify);
  }, []);

  useEffect(() => {
    const fetchCallback = async () => {
      if (cacheClear) {
        clear();
      }

      dispatch({ type: FETCH_REQUEST });

      const cacheData = get<T>(key);

      if (cacheData) {
        onSuccess?.(cacheData);
        dispatch({ type: FETCH_SUCCESS, payload: cacheData });
        return;
      }

      try {
        const result = await callback();

        if (isCacheSave) {
          set<T>(key, result, cacheExpiredTime ?? 30000);
        }

        onSuccess?.(result);
        dispatch({ type: FETCH_SUCCESS, payload: result });
      } catch (error: any) {
        onError?.(error.message);
        dispatch({ type: FETCH_FAILURE, error: error.message });
      }
    };

    fetchCallback();
  }, [notify]);

  return { data, error, loading, refetch };
};
