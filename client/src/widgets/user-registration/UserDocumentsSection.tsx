import React, { useMemo, useRef } from 'react';

type ExistingDocument = {
    id: number;
    original_name: string;
    file_name: string;
    file_path: string;
    mime_type?: string | null;
    size?: number | null;
    document_type?: string | null;
};

type Props = {
    documents: File[];
    existingDocuments: ExistingDocument[];
    handleDocumentsChange: (files: FileList | null) => void;
    removeNewDocument: (index: number) => void;
    handleDeleteExistingDocument: (documentId: number) => void;
    params: {
        id?: string;
    };
};

const API_URL =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    '';

const isImageFile = (name?: string, mime?: string | null) => {
    if (mime?.startsWith('image/')) return true;
    if (!name) return false;

    const lower = name.toLowerCase();
    return (
        lower.endsWith('.png') ||
        lower.endsWith('.jpg') ||
        lower.endsWith('.jpeg') ||
        lower.endsWith('.webp')
    );
};

const isPdfFile = (name?: string, mime?: string | null) => {
    if (mime === 'application/pdf') return true;
    if (!name) return false;
    return name.toLowerCase().endsWith('.pdf');
};

const UserDocumentsSection: React.FC<Props> = ({
                                                   documents,
                                                   existingDocuments,
                                                   handleDocumentsChange,
                                                   removeNewDocument,
                                                   handleDeleteExistingDocument,
                                               }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const newFilePreviews = useMemo(() => {
        return documents.map((file) => ({
            file,
            previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        }));
    }, [documents]);

    return (
        <div className="w-full border-b border-[#d9d9d9]">
            <div className="grid grid-cols-[118px_auto] gap-[30px] border-b border-[#C7C7C7] p-[25px]">
                <div className="pt-[10px] text-right text-[15px] font-medium text-[#334155]">
                    Документы
                </div>

                <div className="flex min-h-[84px] items-start gap-4">
                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={(e) => handleDocumentsChange(e.target.files)}
                        className="hidden"
                    />

                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex h-[44px] shrink-0 items-center gap-2 rounded border border-[#cfd6df] bg-[#f5f7fa] px-4 text-[14px] text-[#8b97a8] transition hover:bg-[#eef2f6]"
                    >
                        <span className="text-[16px] leading-none">+</span>
                        <span>Добавить файл</span>
                    </button>

                    <div className="flex flex-wrap items-start gap-4">
                        {existingDocuments.map((doc) => {
                            const imageUrl = `${process.env.REACT_APP_API_URL}${doc.file_path}`;
                            const image = isImageFile(doc.file_name || doc.original_name, doc.mime_type);
                            const pdf = isPdfFile(doc.file_name || doc.original_name, doc.mime_type);

                            return (
                                <div key={`existing-${doc.id}`} className="group relative">
                                    <a
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block"
                                        title={doc.original_name}
                                    >
                                        {image ? (
                                            <img
                                                src={imageUrl}
                                                alt={doc.original_name}
                                                className="h-[84px] w-[62px] rounded-[2px] border border-[#d8d8d8] object-cover bg-white"
                                            />
                                        ) : (
                                            <div className="flex h-[84px] w-[62px] items-center justify-center rounded-[2px] border border-[#d8d8d8] bg-[#f3f4f6] text-[12px] font-semibold text-[#6b7280]">
                                                {pdf ? 'PDF' : 'FILE'}
                                            </div>
                                        )}
                                    </a>

                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingDocument(doc.id)}
                                        className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[14px] text-[#7a7a7a] shadow-sm group-hover:flex"
                                        title="Удалить файл"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        {newFilePreviews.map(({ file, previewUrl }, index) => {
                            const image = isImageFile(file.name, file.type);
                            const pdf = isPdfFile(file.name, file.type);

                            return (
                                <div key={`new-${file.name}-${index}`} className="group relative">
                                    {image && previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className="h-[84px] w-[62px] rounded-[2px] border border-[#d8d8d8] object-cover bg-white"
                                        />
                                    ) : (
                                        <div
                                            className="flex h-[84px] w-[62px] items-center justify-center rounded-[2px] border border-[#d8d8d8] bg-[#f3f4f6] text-[12px] font-semibold text-[#6b7280]"
                                            title={file.name}
                                        >
                                            {pdf ? 'PDF' : 'FILE'}
                                        </div>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => removeNewDocument(index)}
                                        className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full border border-[#d9d9d9] bg-white text-[14px] text-[#7a7a7a] shadow-sm group-hover:flex"
                                        title="Убрать файл"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDocumentsSection;