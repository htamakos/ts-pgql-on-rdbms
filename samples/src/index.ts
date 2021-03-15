import { executePgqlByCoreAPI } from './core-api'
import { executePgqlByWrapperAPI } from './wrapper-api'

async function main() {
  // Execute Sample Core API
  console.log('===== Execute Pgql By Core API =====')
  await executePgqlByCoreAPI()

  // Execute Sample Wrapper API
  console.log('===== Execute Pgql By Wrapper API =====')
  await executePgqlByWrapperAPI()
}

Promise.all([main()])
