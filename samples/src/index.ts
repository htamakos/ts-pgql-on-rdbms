import { executePgqlByCoreAPI } from './core-api'
import { executePgqlByWrapperAPI } from './wrapper-api'
import { LOGGER } from 'ts-pgql-on-rdbms'

async function main() {
  LOGGER.errorSync('error message')
  // Execute Sample Core API
  console.log('===== Execute Pgql By Core API =====')
  await executePgqlByCoreAPI()

  // Execute Sample Wrapper API
  console.log('===== Execute Pgql By Wrapper API =====')
  await executePgqlByWrapperAPI()
}

Promise.all([main()])
