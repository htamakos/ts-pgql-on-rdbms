import { PgDatatypeConstants } from './core/PgDatatypeConstants'
import { PgqlResultSet } from './core/PgqlResultSet'
import { PgqlResultSetMetaDataImpl } from './core/PgqlResultSetMetaDataImpl'
import { IRecord, Record } from './record'
import { IResult, Result } from './result'
import { PgqlType, PgqlTypeName } from './types'
import * as utils from './utils'

/**
 * @internal
 * @category wrapper-api
 *
 */
export interface IResultHanlder {
  handle(rs: PgqlResultSet): Promise<IResult>
}

/**
 * @internal
 * @category wrapper-api
 *
 */
export class ResultHanlder implements IResultHanlder {
  private getColumnNames(
    meta: PgqlResultSetMetaDataImpl,
    columnCount: number,
  ): string[] {
    const columnNames: string[] = [...utils.range(0, columnCount)].map((i) =>
      meta.getColumnName(i + 1),
    )

    return columnNames
  }

  private getColumnTypes(rs: PgqlResultSet, columnCount: number): number[] {
    if (rs.next()) {
      const columnTypes: number[] = [...utils.range(0, columnCount)].map((i) =>
        rs.getValueType(i + 1),
      )
      rs.beforeFirst()
      return columnTypes
    }
    return []
  }

  async handle(rs: PgqlResultSet): Promise<IResult> {
    const meta: PgqlResultSetMetaDataImpl = rs.getMetaData()
    const columnCount: number = meta.getColumnCount()

    const columnNames: string[] = this.getColumnNames(meta, columnCount)
    const columnTypes: number[] = this.getColumnTypes(rs, columnCount)
    const columnTypeNames: PgqlTypeName[] = columnTypes.map((t) => {
      switch (t) {
        case PgDatatypeConstants.TYPE_DT_BOOL:
          return 'boolean'
        case PgDatatypeConstants.TYPE_DT_DATE:
          return 'timestamp'
        case PgDatatypeConstants.TYPE_DT_INTEGER:
          return 'int'
        case PgDatatypeConstants.TYPE_DT_LONG:
          return 'long'
        case PgDatatypeConstants.TYPE_DT_FLOAT:
          return 'float'
        case PgDatatypeConstants.TYPE_DT_DOUBLE:
          return 'double'
        case PgDatatypeConstants.TYPE_DT_STRING:
          return 'string'
        case PgDatatypeConstants.TYPE_DT_EMPTY:
          return 'object'
        default:
          throw new Error(`unkown PGQL types: ${t}`)
      }
    })

    const records: IRecord[] = []

    try {
      while (rs.next()) {
        const values: PgqlType[] = [...utils.range(0, columnCount)].map((i) => {
          const t: number = columnTypes[i]
          const name: string = columnNames[i]

          switch (t) {
            case PgDatatypeConstants.TYPE_DT_BOOL:
              return rs.getBoolean(name)
            case PgDatatypeConstants.TYPE_DT_DATE:
              return rs.getTimestamp(name)
            case PgDatatypeConstants.TYPE_DT_INTEGER:
              return rs.getInteger(name)
            case PgDatatypeConstants.TYPE_DT_LONG:
              return rs.getLong(name)
            case PgDatatypeConstants.TYPE_DT_FLOAT:
              return rs.getFloat(name)
            case PgDatatypeConstants.TYPE_DT_DOUBLE:
              return rs.getDouble(name)
            case PgDatatypeConstants.TYPE_DT_STRING:
              return rs.getString(name)
            case PgDatatypeConstants.TYPE_DT_EMPTY:
              return null
            default:
              throw new Error(`unkown PGQL types: ${t}`)
          }
        })

        const record: IRecord = new Record(columnNames, values)
        records.push(record)
      }
    } finally {
      rs.closeSync()
    }

    return new Result(records, columnNames, columnTypeNames)
  }
}
