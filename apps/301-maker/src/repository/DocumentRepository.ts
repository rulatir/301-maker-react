// src/repository/DocumentRepository.ts
import { AppDocument } from '../models/AppDocument';

export interface FileTypeProfile {
    name: string;
    extensions: string[];
}

export interface DocumentRepository {
    // Ask user for a location to open from
    askOpen(options?: {
        defaultPath?: string;
        multiple?: boolean;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | string[] | null>;

    askOpenOne(options?: {
        defaultPath?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | null>;

    askOpenMany(options?: {
        defaultPath?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string[] | null>;


    // Ask user for a location to save to
    askSave(options?: {
        defaultPath?: string;
        defaultName?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | null>;

    // Load document from location
    load(location: string, abortSignal?: AbortSignal): Promise<AppDocument>;

    // Save document to location
    save(doc: AppDocument, location: string, abortSignal?: AbortSignal): Promise<void>;
}