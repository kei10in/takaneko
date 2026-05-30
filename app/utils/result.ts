interface ResultBase<T, E> {
  readonly ok: boolean;
  readonly err: boolean;
  readonly value: T | undefined;
  readonly error: E | undefined;
  unwrap(): T;
  expect(message: string): T;
  unwrapOr<V>(defaultValue: V): T | V;
  unwrapOrElse<V>(fn: (error: E) => V): T | V;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;
  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
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
    unwrap: () => value,
    expect: (_message: string) => value,
    unwrapOr: <V>(_defaultValue: V): T | V => value,
    unwrapOrElse: <V>(_fn: (error: never) => V): T | V => value,
    map: <U>(fn: (okValue: T) => U) => Ok(fn(value)),
    mapErr: <F>(_fn: (error: never) => F): Result<T, F> => Ok(value),
    andThen: <U, F>(fn: (okValue: T) => Result<U, F>) => fn(value),
    orElse: <F>(_fn: (error: never) => Result<T, F>): Result<T, F> => Ok(value),
    flatMap: <U, F>(fn: (okValue: T) => Result<U, F>) => fn(value),
  };
};

export const Err = <U>(error: U): Err<U> => {
  return {
    kind: "err",
    ok: false,
    err: true,
    value: undefined,
    error,
    unwrap: () => {
      throw error;
    },
    expect: (message: string) => {
      throw new Error(`${message}: ${String(error)}`);
    },
    unwrapOr: <V>(defaultValue: V): V => defaultValue,
    unwrapOrElse: <V>(fn: (errValue: U) => V): V => fn(error),
    map: <V>(_fn: (value: never) => V): Result<V, U> => Err<U>(error),
    mapErr: <F>(fn: (errValue: U) => F): Result<never, F> => Err<F>(fn(error)),
    andThen: <V, F>(_fn: (value: never) => Result<V, F>): Result<V, U | F> => Err<U>(error),
    orElse: <F>(fn: (errValue: U) => Result<never, F>): Result<never, F> => fn(error),
    flatMap: <V, F>(_fn: (value: never) => Result<V, F>): Result<V, U | F> => Err<U>(error),
  };
};
