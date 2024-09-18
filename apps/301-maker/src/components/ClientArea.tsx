import React from 'react';
import { observer } from 'mobx-react-lite';
import { DocumentManager } from '../models/DocumentManager';
import { InputTextarea } from 'primereact/inputtextarea';

interface ClientAreaProps {
    documentManager: DocumentManager;
}

const ClientArea: React.FC<ClientAreaProps> = observer(({ documentManager }) => {
    const handleContentChange = (e: React.FormEvent<HTMLTextAreaElement>) => {
        documentManager.modifyDocument(e.currentTarget.value);
    };

    return (
        <div className="p-4">
            {documentManager.document ? (
                <div>
                    <h2>Document is Open</h2>
                    <p>
                        <strong>File:</strong> {documentManager.file || 'Untitled'}
                    </p>
                    <p>
                        <strong>Modified:</strong> {documentManager.modified ? 'Yes' : 'No'}
                    </p>
                    <p>
                        <strong>Content:</strong>
                    </p>
                    <InputTextarea
                        value={documentManager.document.content}
                        onChange={handleContentChange}
                        rows={10}
                        cols={50}
                        autoResize
                    />
                </div>
            ) : (
                <h2>No Document is Open</h2>
            )}
        </div>
    );
});

export default ClientArea;