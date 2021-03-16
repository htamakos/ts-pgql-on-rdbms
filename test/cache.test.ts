import { ICache, SimpleLruCache } from '../src/cache'

describe('Cache', (): void => {
  test('SimpleLruCache should work properly', async () => {
    const cache: ICache<string> = new SimpleLruCache<string>(1)

    const key1: string = 'key1'
    const value1: string = 'value1'

    cache.set(key1, value1)
    expect(cache.get(key1)).toBe(value1)

    cache.set(key1, value1)
    expect(cache.size()).toBe(1)

    const key2: string = 'key2'
    const value2: string = 'value2'

    cache.set(key2, value2)
    expect(cache.size()).toBe(1)
    expect(cache.get(key2)).toBe(value2)
  })
})
