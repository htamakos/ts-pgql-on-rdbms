import {IRecord } from "./record";

/**
 * TODO: document comment
 */
export interface IResult {
    readonly records: IRecord[];
}

/**
 * TODO: document comment
 */
export class Result implements IResult {
  readonly records: IRecord[];

  constructor(readonly _records: IRecord[]){
    this.records = _records;
  }
}
