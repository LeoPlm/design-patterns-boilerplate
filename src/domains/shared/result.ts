export type Success<T> = { readonly ok : true, readonly value : T}
export type Failure<E> = { readonly ok: false, readonly error : E}

export type Result<T, E> = Success<T> | Failure<E>

export const success = <T>(value : T): Success<T> => ({ ok : true, value })
export const failure = <E>(error : E): Failure<E> => ({ ok : false, error })