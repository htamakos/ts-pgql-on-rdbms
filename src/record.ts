import { PgqlType } from './types'

export interface IRecord {
  readonly columns: string[]
  readonly fields: PgqlType[]
  values(): IterableIterator<PgqlType>
  entries(): IterableIterator<[string, PgqlType]>
  toDict(): { [column: string]: PgqlType }
  get(column: string): PgqlType
}

export class Record implements IRecord {
  readonly columns: string[]
  readonly fields: PgqlType[]
  private readonly _dict: { [column: string]: PgqlType }

  constructor(columns: string[], fields: PgqlType[]) {
    this.columns = columns
    this.fields = fields
    this._dict = this.toDict()
  }

  *entries(): IterableIterator<[string, PgqlType]> {
    for (let i = 0; i < this.columns.length; i++) {
      yield [this.columns[i], this.fields[i]]
    }
  }

  *values(): IterableIterator<PgqlType> {
    for (let i = 0; i < this.columns.length; i++) {
      yield this.fields[i]
    }
  }

  toDict(): { [column: string]: PgqlType } {
    const dict: { [column: string]: PgqlType } = {}

    for (const [column, value] of this.entries()) {
      dict[column] = value
    }

    return dict
  }

  get(column: string): PgqlType {
    return this._dict[column]
  }
}
