// src/DummyDocumentRepository.ts
import { DocumentRepository } from './DocumentRepository';
import { AppDocument } from '../models/AppDocument';
import { abortablePromise } from '../framework/utility/abortablePromise';

export class DummyDocumentRepository implements DocumentRepository {
    async load(file: string, abortSignal?: AbortSignal): Promise<AppDocument> {
        const ioOperation = simulateIO<AppDocument>(() => {
            return { content: `Content loaded from ${file}` };
        }, 1000);
        return abortablePromise(ioOperation, abortSignal).catch( () => {
            ioOperation.cancel()
            throw new Error('Loading aborted');
        });
    }

    async save(
        doc: AppDocument,
        file: string,
        abortSignal?: AbortSignal
    ): Promise<void> {
        const ioOperation = simulateIO<void>(() => {
            console.log(`Document ${file} saved with content: ${doc.content}`);
            alert(`Document saved with content: ${doc.content}`);
        }, 1000);
        return abortablePromise(ioOperation, abortSignal).catch( () => {
            ioOperation.cancel();
            throw new Error('Saving aborted');
        });
    }
}

// Helper function to simulate IO delay
function simulateIO<T>(operation: () => T, delayMs: number): Promise<T> & { cancel: () => void } {
    let timeout: any = undefined;
    const result = new Promise<T>((resolve) => {
        timeout = setTimeout(() => {
            resolve(operation());
        }, delayMs);
    }) as Promise<T> & { cancel: () => void };
    result.cancel = clearTimeout.bind(undefined, timeout);
    return result;
}