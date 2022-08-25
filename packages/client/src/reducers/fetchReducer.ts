import { FETCH_FAILURE, FETCH_REQUEST, FETCH_SUCCESS } from "@constants/actions";

export interface IFetchInitialState<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export const initialState: IFetchInitialState<any> = {
  data: null,
  error: null,
  loading: false,
};

type IReducerAction<T> =
  | { type: "FETCH_REQUEST" }
  | { type: "FETCH_SUCCESS"; payload: T }
  | { type: "FETCH_FAILURE"; error: string };

export const fetchReducer = <T>(state: IFetchInitialState<T>, action: IReducerAction<T>) => {
  switch (action.type) {
    case FETCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload,
      };
    case FETCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      throw new Error();
  }
};
