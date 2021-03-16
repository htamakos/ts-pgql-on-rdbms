/**
 * TODO: document comment
 *
 * @internal
 * @cateogry utils
 */
export function* range(start: number, end: number) {
  for (let i = start; i < end; i++) {
    yield i
  }
}
