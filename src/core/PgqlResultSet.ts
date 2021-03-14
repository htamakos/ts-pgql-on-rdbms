import { AutoClosable, AutoCloseableSync } from './Resource'
import { LocalDateTime } from './JavaStandardType'

export interface JavaPgqlResultSet extends AutoClosable, AutoCloseableSync {
  closeSync(): void
  close(): Promise<void>

  printSync(): JavaPgqlResultSet
  nextSync(): boolean

  getLongSync(columnName: string): number
  getDoubleSync(columnName: string): number
  getFloatSync(columnName: string): number
  getStringSync(columnName: string): string
  getIntegerSync(columnName: string): number
  getBooleanSync(columnName: string): boolean
  getTimestampSync(columnName: string): LocalDateTime
}

export class PgqlResultSet implements AutoClosable, AutoCloseableSync {
  private readonly internalObj: JavaPgqlResultSet

  constructor(readonly rs: JavaPgqlResultSet) {
    this.internalObj = rs
  }

  closeSync(): void {
    return this.internalObj.closeSync()
  }

  async close(): Promise<void> {
    return this.internalObj.close()
  }

  print(): void {
    this.internalObj.printSync()
  }

  next(): boolean {
    return this.internalObj.nextSync()
  }

  getLong(columnName: string): number | null {
    const value: number | null = this.internalObj.getLongSync(columnName)

    if (value != null && value != undefined) {
      return value.valueOf()
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

  getTimestamp(columnName: string): Date | null {
    const value: LocalDateTime | null = this.internalObj.getTimestampSync(
      columnName,
    )
    if (value != null && value != undefined) {
      return new Date(value.toStringSync())
    } else {
      return null
    }
  }
}
