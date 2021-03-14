import {PgqlPreparedStatement} from "./core/PgqlPreparedStatement";
import {IParameter, IParameters} from "./parameter";

/**
 * TODO: document comment
 */
export interface IParameterHandler {
  setParameters(pstmt: PgqlPreparedStatement, parameters?: IParameters): void
}

/**
 * TODO: document comment
 */
export class ParemeterHandler implements IParameterHandler {
  setParameters(pstmt: PgqlPreparedStatement, parameters?: IParameters): void {
    if (parameters != undefined) {
      parameters.forEach((p: IParameter) => {
        switch (p.type) {
          case 'string':
            pstmt.setString(p.index, p.value as string)
          case 'int':
            pstmt.setInt(p.index, p.value as number)
          case 'long':
            pstmt.setLong(p.index, p.value as number)
          case 'float':
            pstmt.setFloat(p.index, p.value as number)
          case 'double':
            pstmt.setDouble(p.index, p.value as number)
          case 'boolean':
            pstmt.setBoolean(p.index, p.value as boolean)
          case 'timestamp':
            pstmt.setTimestamp(p.index, p.value as Date)
          default:
            throw new Error(`${p.type} is not valid parameter type.`)
        }
      })
    }
  }
}
