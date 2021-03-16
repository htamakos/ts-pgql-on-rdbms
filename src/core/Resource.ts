/**
 * @category core-api
 */
export interface AutoCloseableSync {
  closeSync(): void
}

/**
 * @category core-api
 */
export interface AutoClosable {
  close(): Promise<void>
}

/**
 * @category core-api
 */
export function tryWithSync<T extends AutoCloseableSync>(
  resource: T,
  func: (resource: T) => void,
) {
  try {
    func(resource)
  } finally {
    resource.closeSync()
  }
}

/**
 * @category core-api
 */
export async function tryWith<T extends AutoClosable>(
  resource: T,
  func: (resource: T) => Promise<void>,
) {
  try {
    await func(resource)
  } finally {
    await resource.close()
  }
}
