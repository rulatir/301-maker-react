// src/DummyDocumentRepository.ts
import { DocumentRepository, FileTypeProfile } from './DocumentRepository';
import { AppDocument } from '../models/AppDocument';
import { abortablePromise } from '../framework/utility/abortablePromise';
import DocumentRepositoryBase from "./DocumentRepositoryBase";


export class DummyDocumentRepository extends DocumentRepositoryBase implements DocumentRepository {
    async askOpen(options?: {
        defaultPath?: string;
        multiple?: boolean;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | string[] | null> {
        const name = options?.defaultPath || "document.txt";
        return prompt(options?.title || "Enter the file name to open:", name);
    }

    async askSave(options?: {
        defaultPath?: string;
        defaultName?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | null> {
        const name = options?.defaultName || options?.defaultPath || "document.txt";
        return prompt(options?.title || "Enter the file name to save:", name);
    }

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