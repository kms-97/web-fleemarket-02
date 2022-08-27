import { useReducer } from "react";
import { CacheOption, useCacheAction } from "@contexts/CacheContext";
import { fetchReducer, IFetchInitialState, initialQueryState } from "@reducers/fetchReducer";
import { FETCH_FAILURE, FETCH_REQUEST, FETCH_SUCCESS } from "@constants/actions";

const initialMutationOptions: CacheOption<any> = {
  cacheClear: false,
  overrideCache: false,
  onError: (error: string) => error,
  onSuccess: (data: any) => data,
};

type MutationReturn<T> = [(...arg: any) => void, IFetchInitialState<T>];

export const useMutation = <T>(
  callback: (...arg: any) => Promise<T>,
  options: CacheOption<T> = initialMutationOptions,
  keys: string[] = [],
): MutationReturn<T> => {
  const [state, dispatch] = useReducer(fetchReducer, initialQueryState);

  const { onError, onSuccess, cacheClear } = {
    ...initialMutationOptions,
    ...options,
  };
  const { notify, clear } = useCacheAction();

  const { data, error, loading } = state as IFetchInitialState<T>;

  const mutate = async (...args: any) => {
    if (cacheClear) {
      clear();
    }

    dispatch({ type: FETCH_REQUEST });

    try {
      const result = await callback(...args);

      onSuccess?.(result);
      dispatch({ type: FETCH_SUCCESS, payload: result });
      notify(keys);
    } catch (error: any) {
      onError?.(error.message);
      dispatch({ type: FETCH_FAILURE, error: error.message });
    }
  };

  return [mutate, { data, error, loading }];
};
