// src/DocumentRepository.ts
import { AppDocument } from '../models/AppDocument';

export interface DocumentRepository {
    load(file: string, abortSignal?: AbortSignal): Promise<AppDocument>;
    save(doc: AppDocument, file: string, abortSignal?: AbortSignal): Promise<void>;
}