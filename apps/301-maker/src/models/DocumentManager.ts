// src/DocumentManager.ts
import {makeAutoObservable, runInAction} from 'mobx';
import {CommandBus} from '../framework/command/CommandBus.ts';
import type {AppDocument} from './AppDocument';
import {DocumentRepository} from '../repository/DocumentRepository';
import {EnablementPredicates} from "../framework/command/CommandEnabler.ts";
import {commands} from "../resources/commands.ts";
import {handler} from "../utils/handler";

const openOptions = {
    title: "Open Document",
    filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
    ]
}

const saveOptions = {
    title: "Save Document",
    filters: [
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
    ],
    defaultName: "untitled.txt"
}

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

    setDocument(document?: AppDocument) {
        runInAction(() => {
            this.document = document;
        })
    }

    setFile(file?: string) {
        runInAction(() => {
            this.file = file;
        })
    }

    setModified(modified: boolean) {
        runInAction(() => {this.modified = modified;});
    }

    setBusy(busy: boolean) {
        runInAction(()=>{this.busy = busy;});
    }

    private registerCommandHandlers() {
        this.commandBus.addEventListener('FILE_NEW', handler(this.handleNewCommand.bind(this)));
        this.commandBus.addEventListener('FILE_OPEN', handler(this.handleOpenCommand.bind(this)));
        this.commandBus.addEventListener('FILE_SAVE', handler(this.handleSaveCommand.bind(this)));
        this.commandBus.addEventListener('FILE_SAVE_AS', handler(this.handleSaveAsCommand.bind(this)));
        this.commandBus.addEventListener('FILE_CLOSE', handler(this.handleCloseCommand.bind(this)));
    }

    private async handleNewCommand(_event: Event) {
        this.newDocument();
    }

    private async handleOpenCommand(_event: Event) {
        const result = await this.repository.askOpenOne(openOptions);
        if (result) {
            await this.openDocument(result);
        }
    }

    private async handleSaveCommand(_event: Event) {
        if (this.file) {
            await this.saveDocument();
        } else {
            const file = await this.repository.askSave(saveOptions);
            if (file) {
                await this.saveDocumentAs(file);
            }
        }
    }

    private async handleSaveAsCommand(_event: Event) {
        const file = await this.repository.askSave(
            Object.assign({}, saveOptions, this.file ? {defaultPath: this.file} : {})
        );
        if (file) {
            await this.saveDocumentAs(file);
        }
    }

    private async handleCloseCommand(_event: Event) {
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
        runInAction(() => {
            this.document = { content: '' };
            this.file = undefined;
            this.modified = false;
        });
    }

    async openDocument(file: string) {
        runInAction(() => this.busy = true);
        this.abortController = new AbortController();
        try {
            const document = await this.repository.load(file, this.abortController.signal)
            runInAction(() => {
                this.document = document;
                this.file = file;
                this.modified = false;
            });
        }
        finally {
            runInAction(() => this.busy = false);
            this.abortController = undefined;
        }
    }

    closeDocument() {
        runInAction(() => {
            this.document = undefined;
            this.file = undefined;
            this.modified = false;
        });
    }

    modifyDocument(newContent: string) {
        runInAction(() => {
            if (this.document) {
                this.document.content = newContent;
                this.modified = true;
            }
        });
    }

    async saveDocumentAs(newFile: string) {
        if (this.document) {
            const originalFile = this.file; // Store the original filename
            this.setFile(newFile);
            try {
                await this.saveDocument(); // Attempt to save with the new filename
            } catch (err) {
                // Rollback the filename assignment upon failure
                this.setFile(originalFile);
                // Re-throw the error to be handled elsewhere if needed
                throw err;
            }
        }
    }

    async saveDocument() {
        if (this.document && this.file) {
            this.setBusy(true);
            this.abortController = new AbortController();
            try {
                await this.repository.save(this.document, this.file, this.abortController.signal);
                this.setModified(false);
            }
            finally {
                this.setBusy(false);
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
