import { PgqlType } from './types'

export interface IRecord {
  columns(): IterableIterator<string>
  values(): IterableIterator<PgqlType>
  entries(): IterableIterator<[string, PgqlType]>
  get(column: string): PgqlType
}

export class Record implements IRecord {
  private readonly _dict: { [column: string]: PgqlType }

  constructor(columns: string[], fields: PgqlType[]) {
    this._dict = this.toDict(columns, fields)
  }

  *columns(): IterableIterator<string> {
    for (const c of Object.keys(this._dict)) {
      yield c
    }
  }

  *entries(): IterableIterator<[string, PgqlType]> {
    for (const c of Object.keys(this._dict)) {
      yield [c, this._dict[c]]
    }
  }

  *values(): IterableIterator<PgqlType> {
    for (const c of Object.keys(this._dict)) {
      yield this._dict[c]
    }
  }

  get(column: string): PgqlType {
    return this._dict[column]
  }

  private toDict(
    columns: string[],
    fields: PgqlType[],
  ): { [column: string]: PgqlType } {
    const dict: { [column: string]: PgqlType } = {}

    for (let i = 0; i < columns.length; i++) {
      dict[columns[i]] = fields[i]
    }

    return dict
  }
}
