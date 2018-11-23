import { some, none, Option } from "fp-ts/lib/Option";

// tidy way to save API call data plus the load state etc

export const enum ResponseDataState {
  Empty = "EMPTY",
  Loading = "LOADING",
  Reloading = "RELOADING",
  Failed = "FAILED",
  Ready = "READY"
}

export interface ResponseData<a, b> {
  _tag: "ResponseData";
  data: a | null;
  state: ResponseDataState;
  error: b | null;
}

const defaultResponse: ResponseData<any, any> = {
  _tag: "ResponseData",
  data: null,
  state: ResponseDataState.Empty,
  error: null
};

type ExcludeTag<A> = { [K in Exclude<keyof A, "_tag">]?: A[K] };

const buildResponse = <A, B>(
  overwrites: ExcludeTag<ResponseData<A, B>>
): ResponseData<A, B> => ({
  ...defaultResponse,
  ...overwrites
});

// getters
export const getData = <a, b>(thisData: ResponseData<a, b>): Option<a> =>
  isReady(thisData) && thisData.data !== null ? some(thisData.data) : none;

export const getError = <a, b>(thisData: ResponseData<a, b>): Option<b> =>
  thisData.error !== null ? some(thisData.error) : none;

const getState = <a, b>(
  thisData: ResponseData<a, b> | undefined
): ResponseDataState => {
  if (thisData === undefined) {
    return ResponseDataState.Empty;
  } else {
    return thisData.state;
  }
};

const setReload = <a, b>(thisData: ResponseData<a, b>): ResponseData<a, b> =>
  getData(thisData).fold(responseDataLoading(), data =>
    responseDataReloading<a, b>(data)
  );

// checks
export const isReady = <a, b>(thisData: ResponseData<a, b>): boolean => {
  return (
    thisData !== undefined &&
    thisData !== null &&
    (getState(thisData) === ResponseDataState.Ready ||
      getState(thisData) === ResponseDataState.Reloading)
  );
};

export const isLoading = <a, b>(thisData: ResponseData<a, b>): boolean => {
  return (
    getState(thisData) === ResponseDataState.Loading ||
    getState(thisData) === ResponseDataState.Reloading
  );
};

export const isFailed = <a, b>(thisData: ResponseData<a, b>): boolean => {
  return getState(thisData) === ResponseDataState.Failed;
};

export const isEmpty = <a, b>(thisData: ResponseData<a, b>): boolean => {
  return (
    getState(thisData) === ResponseDataState.Empty ||
    getState(thisData) === ResponseDataState.Failed
  );
};

// constructors
const responseDataEmpty = <a, b>(): ResponseData<a, b> => buildResponse({});

const responseDataFailed = <a, b>(error: b): ResponseData<a, b> =>
  buildResponse({
    error,
    state: ResponseDataState.Failed
  });

const responseDataLoading = <a, b>(): ResponseData<a, b> =>
  buildResponse({
    state: ResponseDataState.Loading
  });

const responseDataReloading = <a, b>(data: a): ResponseData<a, b> =>
  buildResponse({
    data,
    state: ResponseDataState.Reloading
  });

const responseDataReady = <a, b>(data: a): ResponseData<a, b> =>
  buildResponse({
    data,
    state: ResponseDataState.Ready
  });

export const responseData = {
  empty: responseDataEmpty,
  loading: responseDataLoading,
  reloading: responseDataReloading,
  failed: responseDataFailed,
  ready: responseDataReady,
  isEmpty,
  isReady,
  isFailed,
  isLoading,
  getData,
  setReload,
  getError
};
