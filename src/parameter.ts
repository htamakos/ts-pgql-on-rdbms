import { PgqlType, PgqlTypeName } from './types'

/**
 * TODO: document comment
 */
export interface IParameter {
  readonly name: string
  readonly value: PgqlType
  readonly index: number
  readonly type: PgqlTypeName
}

/**
 * TODO: document comment
 */
export type IParameters = IParameter[]
