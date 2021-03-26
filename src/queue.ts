export interface IQueue<E> {
  offer(value: E): boolean
  poll(): E | null
  values(): IterableIterator<E>
}

class LinkedNode<T> {
  value: T
  next: LinkedNode<T> | null = null

  constructor(value: T, next: LinkedNode<T> | null = null) {
    this.value = value
    this.next = next
  }
}

export class LinkedQueue<E> implements IQueue<E> {
  private _head: LinkedNode<E> | null = null
  private _tail: LinkedNode<E> | null = null
  private _length: number = 0

  constructor() {}

  offer(value: E): boolean {
    const n: LinkedNode<E> = new LinkedNode<E>(value)

    if (this._head == null) {
      this._head = n
    }

    if (this._tail == null) {
      this._tail = n
    } else {
      this._tail.next = n
      this._tail = n
    }

    this._length = this._length + 1

    return true
  }

  poll(): E | null {
    if (this._length == 0) return null

    const head: LinkedNode<E> | null = this._head

    if (head !== null && head !== undefined) {
      this._head = head!.next
      this._length = this._length - 1

      return head!.value
    }

    return null
  }

  *values(): IterableIterator<E> {
    let current: LinkedNode<E> | null = this._head
    while (current !== null) {
      yield current!.value
      current = current!.next
    }
  }
}
