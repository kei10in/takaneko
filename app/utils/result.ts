interface ResultBase<T, E> {
  readonly ok: boolean;
  readonly err: boolean;
  readonly value: T | undefined;
  readonly error: E | undefined;
  unwrap(): T;
  unwrapErr(): E;
  expect(message: string): T;
  expectErr(message: string): E;
  unwrapOr<V>(defaultValue: V): T | V;
  unwrapOrElse<V>(fn: (error: E) => V): T | V;
  map<U>(fn: (value: T) => U): Result<U, E>;
  mapErr<F>(fn: (error: E) => F): Result<T, F>;
  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
  orElse<F>(fn: (error: E) => Result<T, F>): Result<T, F>;
  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, E | F>;
}

export class ResultAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResultAccessError";
  }
}

export interface Ok<T> extends ResultBase<T, never> {
  readonly kind: "ok";
  readonly ok: true;
  readonly err: false;
  readonly value: T;
  readonly error: undefined;
}

export interface Err<U> extends ResultBase<never, U> {
  readonly kind: "err";
  readonly ok: false;
  readonly err: true;
  readonly value: undefined;
  readonly error: U;
}

export type Result<T, E> = Ok<T> | Err<E>;

class OkImpl<T> implements Ok<T> {
  readonly kind = "ok" as const;
  readonly ok = true as const;
  readonly err = false as const;
  readonly error = undefined;

  constructor(readonly value: T) {}

  unwrap(): T {
    return this.value;
  }

  unwrapErr(): never {
    throw new ResultAccessError("called unwrapErr on Ok");
  }

  expect(_message: string): T {
    return this.value;
  }

  expectErr(message: string): never {
    throw new ResultAccessError(message);
  }

  unwrapOr<V>(_defaultValue: V): T | V {
    return this.value;
  }

  unwrapOrElse<V>(_fn: (error: never) => V): T | V {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Result<U, never> {
    return Ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: never) => F): Result<T, F> {
    return Ok(this.value);
  }

  andThen<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this.value);
  }

  orElse<F>(_fn: (error: never) => Result<T, F>): Result<T, F> {
    return Ok(this.value);
  }

  flatMap<U, F>(fn: (value: T) => Result<U, F>): Result<U, F> {
    return fn(this.value);
  }
}

class ErrImpl<U> implements Err<U> {
  readonly kind = "err" as const;
  readonly ok = false as const;
  readonly err = true as const;
  readonly value = undefined;

  constructor(readonly error: U) {}

  unwrap(): never {
    throw new ResultAccessError("called unwrap on Err");
  }

  unwrapErr(): U {
    return this.error;
  }

  expect(message: string): never {
    throw new ResultAccessError(message);
  }

  expectErr(_message: string): U {
    return this.error;
  }

  unwrapOr<V>(defaultValue: V): V {
    return defaultValue;
  }

  unwrapOrElse<V>(fn: (error: U) => V): V {
    return fn(this.error);
  }

  map<V>(_fn: (value: never) => V): Result<V, U> {
    return Err(this.error);
  }

  mapErr<F>(fn: (error: U) => F): Result<never, F> {
    return Err(fn(this.error));
  }

  andThen<V, F>(_fn: (value: never) => Result<V, F>): Result<V, U | F> {
    return Err(this.error);
  }

  orElse<F>(fn: (error: U) => Result<never, F>): Result<never, F> {
    return fn(this.error);
  }

  flatMap<V, F>(_fn: (value: never) => Result<V, F>): Result<V, U | F> {
    return Err(this.error);
  }
}

export const Ok = <T>(value: T): Ok<T> => new OkImpl(value);
export const Err = <U>(error: U): Err<U> => new ErrImpl(error);
