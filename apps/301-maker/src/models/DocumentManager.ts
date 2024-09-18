// src/DocumentManager.ts
import {makeAutoObservable} from 'mobx';
import {CommandBus} from '../framework/command/CommandBus.ts';
import {AppDocument} from './AppDocument';
import {DocumentRepository} from '../repository/DocumentRepository';
import {EnablementPredicates} from "../framework/command/CommandEnabler.ts";
import {commands} from "../resources/commands.ts";

export class DocumentManager {
    document?: AppDocument;
    file?: string;
    modified : boolean = false;
    busy: boolean = false;

    private repository: DocumentRepository;
    private commandBus: CommandBus;
    private abortController?: AbortController;

    constructor(repository: DocumentRepository, commandBus: CommandBus) {
        makeAutoObservable(this);
        this.repository = repository;
        this.commandBus = commandBus;
        this.registerCommandHandlers();
    }

    private registerCommandHandlers() {
        this.commandBus.addEventListener('FILE_NEW', this.handleNewCommand.bind(this));
        this.commandBus.addEventListener('FILE_OPEN', this.handleOpenCommand.bind(this));
        this.commandBus.addEventListener('FILE_SAVE', this.handleSaveCommand.bind(this));
        this.commandBus.addEventListener('FILE_SAVE_AS', this.handleSaveAsCommand.bind(this));
        this.commandBus.addEventListener('FILE_CLOSE', this.handleCloseCommand.bind(this));
    }

    private async handleNewCommand(_event: Event) {
        this.newDocument();
    }

    private async handleOpenCommand(_event: Event) {
        const file = prompt('Enter the name of the file to open:', 'opened-file.txt');
        if (file) {
            await this.openDocument(file);
        }
    }

    private async handleSaveCommand(_event: Event) {
        if (this.file) {
            await this.saveDocument();
        } else {
            const file = prompt('Enter the name of the file to save:', 'untitled.txt');
            if (file) {
                await this.saveDocumentAs(file);
            }
        }
    }

    private async handleSaveAsCommand(_event: Event) {
        const file = prompt('Enter the new file name to save as:', 'saved-as-file.txt');
        if (file) {
            await this.saveDocumentAs(file);
        }
    }

    private handleCloseCommand(_event: Event) {
        this.closeDocument();
    }

    // Helper to abort ongoing operations
    private abortOngoingOperation() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = undefined;
        }
    }


    // Document operations
    newDocument() {
        this.document = { content: '' };
        this.file = undefined;
        this.modified = false;
    }

    async openDocument(file: string) {
        this.busy = true;
        this.abortController = new AbortController();
        try {
            this.document = await this.repository.load(file, this.abortController.signal);
            this.file = file;
            this.modified = false;
        } catch (error) {
            if (error instanceof Error && 'AbortError' !== error.name) {
                console.error('Failed to open document:', error);
                alert('Failed to open document.');
            }
        } finally {
            this.busy = false;
            this.abortController = undefined;
        }
    }

    closeDocument() {
        this.document = undefined;
        this.file = undefined;
        this.modified = false;
    }

    modifyDocument(newContent: string) {
        if (this.document) {
            this.document.content = newContent;
            this.modified = true;
        }
    }

    async saveDocumentAs(newFile: string) {
        if (this.document) {
            const originalFile = this.file; // Store the original filename
            this.file = newFile; // Assign the new filename temporarily

            try {
                await this.saveDocument(); // Attempt to save with the new filename
            } catch (error) {
                // Rollback the filename assignment upon failure
                this.file = originalFile;

                // Re-throw the error to be handled elsewhere if needed
                throw error;
            }
        }
    }

    async saveDocument() {
        if (this.document && this.file) {
            this.busy = true;
            this.abortController = new AbortController();
            try {
                await this.repository.save(this.document, this.file, this.abortController.signal);
                this.modified = false;
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error('Failed to save document:', error);
                    alert('Failed to save document.');
                }
                // Re-throw the error to be handled by saveDocumentAs() if needed
                throw error;
            } finally {
                this.busy = false;
                this.abortController = undefined;
            }
        } else {
            // Handle case when there is no document or file
            throw new Error('No document or file specified for saving.');
        }
    }

    private enablements?: EnablementPredicates = undefined;
    getEnablements() : EnablementPredicates
    {
        const c=commands;
        return this.enablements || (this.enablements = {
            [c.FILE_NEW.id]: () => !this.busy,
            [c.FILE_OPEN.id]: () => !this.busy,
            [c.FILE_SAVE.id]: () => !this.busy && this.document !== undefined && this.modified,
            [c.FILE_SAVE_AS.id]: () => !this.busy && this.document !== undefined,
            [c.FILE_CLOSE.id]: () => this.document !== undefined
        });
    }
}
