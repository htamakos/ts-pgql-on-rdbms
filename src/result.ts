import { IRecord } from './record'

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IResult {
  readonly records: IRecord[]
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 */
export class Result implements IResult {
  readonly records: IRecord[]

  constructor(readonly _records: IRecord[]) {
    this.records = _records
  }
}
