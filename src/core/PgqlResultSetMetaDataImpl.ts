export interface JavaPgqlResultSetMetaDataImpl {
  getColumnCountSync(): number
  getColumnNameSync(column: number): string
}

export class PgqlResultSetMetaDataImpl {
  private readonly internalObj: JavaPgqlResultSetMetaDataImpl
  constructor(readonly meta: JavaPgqlResultSetMetaDataImpl) {
    this.internalObj = meta
  }

  getColumnCount(): number {
    return this.internalObj.getColumnCountSync()
  }

  getColumnName(column: number): string {
    return this.internalObj.getColumnNameSync(column)
  }
}
