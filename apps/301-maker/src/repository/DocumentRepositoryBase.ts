import {DocumentRepository, FileTypeProfile} from "./DocumentRepository";

abstract class DocumentRepositoryBase implements DocumentRepository {
// Add to DummyDocumentRepository class
    async askOpenOne(options?: {
        defaultPath?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string | null> {
        const result = await this.askOpen({
            ...options,
            multiple: false
        });

        return typeof result === 'string' ? result : null;
    }

    async askOpenMany(options?: {
        defaultPath?: string;
        typeProfiles?: FileTypeProfile[];
        title?: string;
    }): Promise<string[] | null> {
        const result = await this.askOpen({
            ...options,
            multiple: true
        });

        if (result === null) return null;
        return Array.isArray(result) ? result : [result];
    }
}
interface DocumentRepositoryBase extends DocumentRepository {}
export default DocumentRepositoryBase;