import { LocalDateTime } from './core/JavaStandardType'
import { PgqlPreparedStatement } from './core/PgqlPreparedStatement'
import { IParameter, IParameters } from './parameter'
import { PgqlTypeName } from './types'

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 */
export interface IParameterHandler {
  setParameters(pstmt: PgqlPreparedStatement, parameters?: IParameters): void
}

/**
 * TODO: document comment
 *
 * @internal
 * @category wrapper-api
 */
export class ParameterHandler implements IParameterHandler {
  setParameters(pstmt: PgqlPreparedStatement, parameters?: IParameters): void {
    if (parameters != undefined) {
      let parameterIndex: number = 1

      for (const p of parameters) {
        const t: PgqlTypeName = this.judgePgqlTypeName(p)

        const index: number =
          p.index !== undefined && p.index !== null ? p.index! : parameterIndex

        switch (t) {
          case 'string':
            pstmt.setString(index, p.value as string)
            break
          case 'int':
            pstmt.setInt(index, p.value as number)
            break
          case 'long':
            pstmt.setLong(index, p.value as BigInt)
            break
          case 'float':
            pstmt.setFloat(index, p.value as number)
            break
          case 'double':
            pstmt.setDouble(index, p.value as number)
            break
          case 'boolean':
            pstmt.setBoolean(index, p.value as boolean)
            break
          case 'timestamp':
            pstmt.setTimestamp(index, p.value as LocalDateTime)
            break
          case 'object':
            throw new Error('object type is not supported on parameters')
          default:
            throw new Error(`${p.type} is not valid parameter type.`)
        }
        parameterIndex++
      }
    }
  }

  private judgePgqlTypeName(param: IParameter): PgqlTypeName {
    if (param.type !== undefined) return param.type!
    if (param.value === null || param.value === undefined) return 'object'

    switch (typeof param.value!) {
      case 'boolean':
        return 'boolean'
      case 'number':
        if (
          !param.value!.toString().includes('.') &&
          Number.isInteger(param.value)
        ) {
          return 'long'
        } else {
          return 'double'
        }
      case 'bigint':
        return 'long'
      case 'string':
      case 'symbol':
        return 'string'
      case 'object':
        if (param.value instanceof LocalDateTime) {
          return 'timestamp'
        } else {
          return 'object'
        }
      default:
        throw new Error(`${param.type} is not valid parameter type.`)
    }
  }
}
