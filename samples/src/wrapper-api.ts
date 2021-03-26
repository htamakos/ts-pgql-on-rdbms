import {
  IOraclePoolConfig,
  IOracleDatabaseConfig,
  ISession,
  IRecord,
  IResult,
  IParameters,
  Pgql,
} from 'ts-pgql-on-rdbms'

const oraclePoolConfig: IOraclePoolConfig = {
  poolName: 'pool-wrapper-api1',
  initialPoolSize: 1,
  minPoolSize: 1,
  maxPoolSize: 1,
  timeoutCheckInteraval: 5,
  inactiveConnectionTimeout: 60,
}

const oracleDatabaseConfig: IOracleDatabaseConfig = {
  jdbcUrl:
    process.env.TEST_JDBC_URL || 'jdbc:oracle:thin:@localhost:21521/pdb1',
  userName: process.env.TEST_DB_USER || 'test_user',
  password: process.env.TEST_DB_PASSWORD || 'welcome1',
  databasePoolConfig: oraclePoolConfig,
}

export async function executePgqlByWrapperAPI() {
  // Get Instance
  const pgql: Pgql = Pgql.getInstance(oracleDatabaseConfig)

  // Get Session
  const session: ISession = await pgql.getSession()

  // INSERT PGQL with bind variables
  const insertPgql: string = `
  INSERT INTO test_graph
    VERTEX v LABELS(vl) PROPERTIES(v.LONG_PROP = ?)
  `
  // bind variables parameters
  const parameters1: IParameters = [
    { name: 'LONG_PROP', type: 'long', index: 1, value: 1000 },
  ]

  // Execute INSERT PGQL
  await session.modify(insertPgql, parameters1)

  // SELECT PGQL with bind variables
  const selectPgql: string = `
  SELECT id(n) as nid, n.LONG_PROP
  FROM MATCH (n) on test_graph
  WHERE n.LONG_PROP = ?
  `

  // bind variables parameters
  const parameters2: IParameters = [
    { name: 'LONG_PROP', type: 'long', index: 1, value: 1000 },
  ]

  // Execute and get result
  const result: IResult = await session.query(selectPgql, parameters2)
  const record: IRecord = result.records[0]

  // Rollback
  session.rollback()

  await pgql.close()

  console.log(record)
}
