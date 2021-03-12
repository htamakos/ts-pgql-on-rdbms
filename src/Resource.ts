export interface AutoCloseableSync {
    closeSync(): void;
}

export interface AutoClosable {
    close(): Promise<void>;
}

export function tryWithSync<T extends AutoCloseableSync>(resource: T, func: (resource: T) => void) {
    try {
        func(resource);
    } finally {
        resource.closeSync();
    }
}

export async function tryWith<T extends AutoClosable>(resource: T, func: (resource: T) => Promise<void>) {
    try {
        await func(resource)
    } finally {
        await resource.close();
    }
}
