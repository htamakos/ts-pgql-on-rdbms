import { IRecord } from './record'
import { PgqlTypeName } from './types'

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IResult {
  readonly records: IRecord[]
  size(): number
  columns(): string[]
  columnTypes(): PgqlTypeName[]
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 */
export class Result implements IResult {
  readonly records: IRecord[]
  private readonly _columns: string[]
  private readonly _columnTypes: PgqlTypeName[]

  constructor(
    readonly _records: IRecord[],
    columns: string[],
    columnTypes: PgqlTypeName[],
  ) {
    this.records = _records
    this._columns = columns
    this._columnTypes = columnTypes
  }

  size(): number {
    return this.records.length
  }

  columns(): string[] {
    return this._columns
  }

  columnTypes(): PgqlTypeName[] {
    return this._columnTypes
  }
}
