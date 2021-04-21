/**
 * A function to do something like either monad when handling errors with async / await
 */
export const handle: (promise: Promise<any>) => Promise<any> = async (
  promise: Promise<[any | undefined]>,
) => {
  return promise
    .then((data) => [data, undefined])
    .catch((error) => Promise.resolve([undefined, error]))
}
