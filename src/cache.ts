export interface ICache<T> {
  get(key: string): T | undefined
  set(key: string, value: T): void
  hasKey(key: string): boolean
  size(): number
  values(): IterableIterator<T>
  clear(): void
}

export class SimpleLruCache<T> implements ICache<T> {
  private static DEFAULT_MAX_ENTRY_SIZE: number = 1000
  private _cache: Map<string, T> = new Map<string, T>()
  private _maxEntrySize: number

  constructor(maxEntrySize?: number) {
    if (maxEntrySize === undefined || maxEntrySize === null) {
      this._maxEntrySize = SimpleLruCache.DEFAULT_MAX_ENTRY_SIZE
    } else {
      this._maxEntrySize = maxEntrySize
    }
  }

  size(): number {
    return this._cache.size
  }

  *values(): IterableIterator<T> {
    for (const v of this._cache.values()) {
      yield v
    }
  }

  clear(): void {
    this._cache.clear()
  }

  get(key: string): T | undefined {
    if (this.hasKey(key)) {
      return this._cache.get(key)
    }

    return undefined
  }

  set(key: string, value: T): void {
    if (this._cache.size >= this._maxEntrySize) {
      const deleteEntryKey: string = this._cache.keys().next().value
      this._cache.delete(deleteEntryKey)
    }

    this._cache.set(key, value)
  }

  hasKey(key: string): boolean {
    return this._cache.has(key)
  }
}
