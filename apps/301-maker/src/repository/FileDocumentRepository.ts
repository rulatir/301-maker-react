// src/repository/FileDocumentRepository.ts
import { DocumentRepository, FileTypeProfile } from './DocumentRepository';
import { AppDocument } from '../models/AppDocument';
import { open, save } from '@tauri-apps/plugin-dialog';
import { readTextFile, writeTextFile } from '@tauri-apps/plugin-fs';
import { abortablePromise } from '../framework/utility/abortablePromise';
import { debug } from '@tauri-apps/plugin-log';
import DocumentRepositoryBase from "./DocumentRepositoryBase";

export class FileDocumentRepository extends DocumentRepositoryBase implements DocumentRepository {
    async askOpen(options?: {
        defaultPath?: string;
        multiple?: boolean;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | string[] | null> {
        try {
            const filters = options?.typeProfiles?.map(profile => ({
                name: profile.name,
                extensions: profile.extensions
            })) || [{ name: 'All Files', extensions: ['*'] }];

            return await open({
                directory: false,
                multiple: options?.multiple || false,
                filters,
                defaultPath: options?.defaultPath,
                title: options?.title
            });
        } catch (error) {
            await debug(`Error in askOpen: ${error}`);
            return null;
        }
    }

    async askSave(options?: {
        defaultPath?: string;
        defaultName?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | null> {
        try {
            const filters = options?.typeProfiles?.map(profile => ({
                name: profile.name,
                extensions: profile.extensions
            })) || [{ name: 'All Files', extensions: ['*'] }];

            let defaultPath = options?.defaultPath || undefined;
            if (options?.defaultName) {
                // Combine path and name if both provided
                defaultPath = defaultPath ? `${defaultPath}/${options.defaultName}` : options.defaultName;
            }

            const selected = await save({
                filters,
                defaultPath,
                title: options?.title
            });
            if (selected) {
                await debug(`File selected for saving: ${selected}`);
            }
            else {
                await debug('File save operation was cancelled or failed.');
            }
            return selected;
        } catch (error) {
            await debug(`Error in askSave: ${error}`);
            return null;
        }
    }

    async load(location: string, abortSignal?: AbortSignal): Promise<AppDocument> {
        try {
            const readOperation = readTextFile(location);
            return { content: await abortablePromise(readOperation, abortSignal) };
        } catch (error) {
            if (abortSignal?.aborted) {
                throw new Error('Loading aborted');
            }
            throw error;
        }
    }

    async save(doc: AppDocument, location: string, abortSignal?: AbortSignal): Promise<void> {
        try {
            const writeOperation = writeTextFile(location, doc.content);
            await abortablePromise(writeOperation, abortSignal);
        } catch (error) {
            if (abortSignal?.aborted) {
                throw new Error('Saving aborted');
            }
            throw error;
        }
    }
}