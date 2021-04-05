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
      parameters.forEach((p: IParameter) => {
        const t: PgqlTypeName = this.judgePgqlTypeName(p)

        switch (t) {
          case 'string':
            pstmt.setString(p.index, p.value as string)
            break
          case 'int':
            pstmt.setInt(p.index, p.value as number)
            break
          case 'long':
            pstmt.setLong(p.index, p.value as number)
            break
          case 'float':
            pstmt.setFloat(p.index, p.value as number)
            break
          case 'double':
            pstmt.setDouble(p.index, p.value as number)
            break
          case 'boolean':
            pstmt.setBoolean(p.index, p.value as boolean)
            break
          case 'timestamp':
            pstmt.setTimestamp(p.index, p.value as LocalDateTime)
            break
          case 'object':
            throw new Error('object type is not supported on parameters')
          default:
            throw new Error(`${p.type} is not valid parameter type.`)
        }
      })
    }
  }

  private judgePgqlTypeName(param: IParameter): PgqlTypeName {
    if (param.type !== undefined) return param.type!
    if (param.value === null || param.value === undefined) return 'object'

    switch (typeof param.value!) {
      case 'boolean':
        return 'boolean'
      case 'number':
      case 'bigint':
        if (
          !param.value!.toString().includes('.') &&
          Number.isSafeInteger(param.value)
        ) {
          return 'long'
        } else {
          return 'double'
        }
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
