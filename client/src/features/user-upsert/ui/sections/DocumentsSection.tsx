import React from 'react';
import type { UserDocument } from '../../../../entities/user/model/type';
import RHFFileInput from '../../../../shared/ui/form/RHFFileInput';

type DocumentsSectionProps = {
    existingDocuments: UserDocument[];
    newDocuments: File[];
    onAddDocuments: (files: FileList | null) => void;
    onRemoveNewDocument: (index: number) => void;
    onDeleteExistingDocument: (documentId: number) => void | Promise<void>;
};

const DocumentsSection: React.FC<DocumentsSectionProps> = ({
                                                               existingDocuments,
                                                               newDocuments,
                                                               onAddDocuments,
                                                               onRemoveNewDocument,
                                                               onDeleteExistingDocument,
                                                           }) => {
    return (
        <>
            <RHFFileInput
                label="Документы"
                multiple
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={onAddDocuments}
            />

            {(existingDocuments.length > 0 || newDocuments.length > 0) && (
                <div className="grid grid-cols-[118px_auto] p-[25px] border-b border-[#C7C7C7] gap-[30px]">
                    <div />
                    <div className="flex flex-col gap-3">
                        {existingDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between rounded border border-[#C7C7C7] p-3"
                            >
                                <span>{doc.original_name}</span>
                                <button
                                    type="button"
                                    onClick={() => onDeleteExistingDocument(doc.id)}
                                    className="text-red-500"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}

                        {newDocuments.map((file, index) => (
                            <div
                                key={`${file.name}-${index}`}
                                className="flex items-center justify-between rounded border border-[#C7C7C7] p-3"
                            >
                                <span>{file.name}</span>
                                <button
                                    type="button"
                                    onClick={() => onRemoveNewDocument(index)}
                                    className="text-red-500"
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentsSection;