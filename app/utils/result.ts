interface ResultBase<T, E> {
  readonly ok: boolean;
  readonly err: boolean;
  readonly value: T | undefined;
  readonly error: E | undefined;
}

export interface Ok<T> extends ResultBase<T, never> {
  readonly kind: "ok";
  readonly value: T;
  readonly error: undefined;
}

export interface Err<U> extends ResultBase<never, U> {
  readonly kind: "err";
  readonly value: undefined;
  readonly error: U;
}

export type Result<T, E> = Ok<T> | Err<E>;

export const Ok = <T>(value: T): Ok<T> => {
  return {
    kind: "ok",
    ok: true,
    err: false,
    value,
    error: undefined,
  };
};

export const Err = <U>(error: U): Err<U> => {
  return {
    kind: "err",
    ok: false,
    err: true,
    value: undefined,
    error,
  };
};
