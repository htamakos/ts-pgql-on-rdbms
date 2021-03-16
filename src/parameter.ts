import { PgqlType, PgqlTypeName } from './types'

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 */
export interface IParameter {
  readonly name: string
  readonly value: PgqlType
  readonly index: number
  readonly type: PgqlTypeName
}

/**
 * TODO: document comment
 *
 * @category wrapper-api
 */
export type IParameters = IParameter[]
