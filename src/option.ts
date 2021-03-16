//const PGQL_OPTION_TRUE: string = 'T'
//const PGQL_OPTION_FALSE: string = 'F'

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export interface IOptions {
  readonly parallel: number
  readonly dynamicSampling: number
  readonly timeout: number
  readonly maxResults: number
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 *
 */
export const DEFAULT_OPTIONS: IOptions = {
  parallel: 0,
  dynamicSampling: 2,
  timeout: 1000,
  maxResults: -1,
}

/**
 * TODO: document comment
 */
//interface IModifyOptions {
//  readonly streaming: boolean
//  readonly autoCommit: boolean
//  readonly deleteCascade: boolean
//}

/**
 * TODO: document comment
 */
//const DEFAULT_MODIFY_OPTIONS: IModifyOptions = {
//  streaming: true,
//  autoCommit: false,
//  deleteCascade: false,
//}

/**
 * TODO: document comment
 */
//function genereateModifyOptionString(op: IModifyOptions): string {
//  const streamingStr: string = op.streaming
//    ? PGQL_OPTION_TRUE
//    : PGQL_OPTION_FALSE
//  const autoCommitStr: string = op.autoCommit
//    ? PGQL_OPTION_TRUE
//    : PGQL_OPTION_FALSE
//  const deleteCascadeStr: string = op.deleteCascade
//    ? PGQL_OPTION_TRUE
//    : PGQL_OPTION_FALSE
//  return `STREAMING=${streamingStr},AUTO_COMMIT=${autoCommitStr},DELETE_CASCADE=${deleteCascadeStr}`
//}

/**
 * TODO: document comment
 */
//interface ISelectOptions {
//  readonly useRw: boolean
//  readonly maxPathLen: number
//  readonly edgeSetPartial: boolean
//}

/**
 * TODO: document comment
 */
//function genereateSelectOptionString(op: ISelectOptions): string {
//  const useRwStr: string = op.useRw ? PGQL_OPTION_TRUE : PGQL_OPTION_FALSE
//  const edgeSetPartialStr: string = op.edgeSetPartial
//    ? PGQL_OPTION_TRUE
//    : PGQL_OPTION_FALSE
//  return `USE_RW=${useRwStr},MAX_PATH_LEN=${op.maxPathLen},EDGE_SET_PARTIAL=${edgeSetPartialStr}`
//}

/**
 * TODO: document comment
 */
//const DEFAULT_SELECT_OPTIONS: ISelectOptions = { useRw: false, maxPathLen: 100, edgeSetPartial: true, }
