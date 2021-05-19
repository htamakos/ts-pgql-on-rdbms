import { AutoClosable, AutoCloseableSync } from './Resource'
import { LocalDateTime } from './JavaStandardType'
import {
  JavaPgqlResultSetMetaDataImpl,
  PgqlResultSetMetaDataImpl,
} from './PgqlResultSetMetaDataImpl'
import { PgqlError } from './PgqlError'
import { LOGGER } from './Logger'

/**
 * @internal
 * @category core-api
 */
export interface JavaPgqlResultSet extends AutoClosable, AutoCloseableSync {
  closeSync(): void
  close(): Promise<void>

  printSync(): JavaPgqlResultSet
  nextSync(): boolean
  beforeFirstSync(): boolean

  getLongSync(columnName: string): BigInt
  getDoubleSync(columnName: string): number
  getFloatSync(columnName: string): number
  getStringSync(columnName: string): string
  getIntegerSync(columnName: string): number
  getBooleanSync(columnName: string): boolean
  getTimestampSync(columnName: string): LocalDateTime

  getMetaDataSync(): JavaPgqlResultSetMetaDataImpl
  getValueTypeSync(elementIdx: number): number
}

/**
 * @category core-api
 */
export class PgqlResultSet implements AutoClosable, AutoCloseableSync {
  private readonly internalObj: JavaPgqlResultSet

  constructor(rs: JavaPgqlResultSet) {
    this.internalObj = rs
  }

  closeSync(): void {
    return this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close().catch((error: Error) => {
      if (LOGGER.isErrorEnabledSync()) {
        LOGGER.errorSync(`PgqlResultSet#close: ${error.message}`)
      }

      throw new PgqlError(error.message)
    })
  }

  print(): void {
    this.internalObj.printSync()
  }

  next(): boolean {
    return this.internalObj.nextSync()
  }

  beforeFirst(): boolean {
    return this.internalObj.beforeFirstSync()
  }

  getLong(columnName: string): BigInt | null {
    const value: any | null = this.internalObj.getLongSync(columnName)

    if (value != null && value != undefined) {
      return BigInt(value.longValue)
    } else {
      return null
    }
  }

  getDouble(columnName: string): number | null {
    const value: number | null = this.internalObj.getDoubleSync(columnName)
    if (value != null && value != undefined) {
      return value.valueOf()
    } else {
      return null
    }
  }

  getFloat(columnName: string): number | null {
    const value: number | null = this.internalObj.getFloatSync(columnName)
    if (value != null && value != undefined) {
      return value.valueOf()
    } else {
      return null
    }
  }

  getString(columnName: string): string | null {
    const value: string | null = this.internalObj.getStringSync(columnName)
    if (value != null && value != undefined) {
      return value.valueOf()
    } else {
      return null
    }
  }

  getInteger(columnName: string): number | null {
    const value: number | null = this.internalObj.getIntegerSync(columnName)
    if (value != null && value != undefined) {
      return value.valueOf()
    } else {
      return null
    }
  }

  getBoolean(columnName: string): boolean | null {
    const value: boolean | null = this.internalObj.getBooleanSync(columnName)

    if (value != null && value != undefined) {
      return value.valueOf()
    } else {
      return null
    }
  }

  getTimestamp(columnName: string): LocalDateTime | null {
    const value: any = this.internalObj.getTimestampSync(columnName)
    if (value != null && value != undefined) {
      return new LocalDateTime(value)
    } else {
      return null
    }
  }

  getMetaData(): PgqlResultSetMetaDataImpl {
    return new PgqlResultSetMetaDataImpl(this.internalObj.getMetaDataSync())
  }

  getValueType(elementIdx: number): number {
    return this.internalObj.getValueTypeSync(elementIdx)
  }
}
