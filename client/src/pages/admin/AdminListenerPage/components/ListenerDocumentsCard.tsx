import React, { useRef, useState } from "react";
import { FiEdit2, FiEye, FiFileText, FiImage, FiPlus, FiTrash2 } from "react-icons/fi";

import type { ExistingDocument } from "../../../../features/listener-profile/model/types";
import {
    isImageFile,
    isPdfFile,
} from "../../../../features/listener-profile/model/listenerProfile.helpers";

import {
    addUserDocuments,
    deleteUserDocument,
    updateUserDocument,
} from "../../../../entities/user/api/user.api";

interface ListenerDocumentsCardProps {
    userId: number;
    documents: ExistingDocument[];
    onDocumentsChanged: () => void;
}

const ListenerDocumentsCard: React.FC<ListenerDocumentsCardProps> = ({
                                                                         userId,
                                                                         documents,
                                                                         onDocumentsChanged,
                                                                     }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [previewDoc, setPreviewDoc] = useState<ExistingDocument | null>(null);

    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        try {
            setLoading(true);
            await addUserDocuments(userId, Array.from(files));
            onDocumentsChanged();
        } finally {
            setLoading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const startEdit = (doc: ExistingDocument) => {
        setEditingId(doc.id);
        setEditName(doc.original_name || "");
        setEditType(doc.document_type || "");
    };

    const saveEdit = async (docId: number) => {
        try {
            setLoading(true);

            await updateUserDocument(docId, {
                original_name: editName,
                document_type: editType || null,
            });

            setEditingId(null);
            onDocumentsChanged();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (docId: number) => {
        const ok = window.confirm("Удалить документ?");
        if (!ok) return;

        try {
            setLoading(true);
            await deleteUserDocument(docId);
            onDocumentsChanged();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 mt-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-left text-base font-semibold text-gray-800">
                            Документы
                        </h2>
                        <div className="mt-1 text-xs text-gray-400">
                            Паспорт, СНИЛС, документы об образовании и другие файлы
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled={loading}
                        onClick={() => inputRef.current?.click()}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-300"
                    >
                        <FiPlus />
                        Добавить
                    </button>

                    <input
                        ref={inputRef}
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/png,image/jpeg,application/pdf"
                        onChange={e => handleUpload(e.target.files)}
                    />
                </div>

                {documents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-center text-sm text-gray-400">
                        Документы еще не загружены
                    </div>
                ) : (
                    <div className="space-y-2">
                        {documents.map(doc => {
                            const isEditing = editingId === doc.id;
                            const fileUrl = `${process.env.REACT_APP_API_URL}${doc.file_path}`;

                            return (
                                <div
                                    key={doc.id}
                                    className="rounded-xl border border-gray-100 bg-white p-3"
                                >
                                    {isEditing ? (
                                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_220px_auto]">
                                            <input
                                                value={editName}
                                                onChange={e => setEditName(e.target.value)}
                                                placeholder="Название документа"
                                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                            />

                                            <input
                                                value={editType}
                                                onChange={e => setEditType(e.target.value)}
                                                placeholder="Подпись/тип: Паспорт, СНИЛС..."
                                                className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
                                            />

                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => saveEdit(doc.id)}
                                                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                                                >
                                                    Сохранить
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    className="rounded-lg bg-gray-200 px-3 py-2 text-sm hover:bg-gray-300"
                                                >
                                                    Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                                                    {isImageFile(doc.file_name || doc.original_name, doc.mime_type) ? (
                                                        <FiImage />
                                                    ) : (
                                                        <FiFileText />
                                                    )}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium text-gray-800">
                                                        {doc.original_name}
                                                    </div>

                                                    <div className="mt-0.5 truncate text-xs text-gray-400">
                                                        {doc.document_type || "Без подписи"}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => setPreviewDoc(doc)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                                                    title="Открыть"
                                                >
                                                    <FiEye />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => startEdit(doc)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600"
                                                    title="Переименовать"
                                                >
                                                    <FiEdit2 />
                                                </button>

                                                <a
                                                    href={fileUrl}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-lg px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                                                >
                                                    Вкладка
                                                </a>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600"
                                                    title="Удалить"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {previewDoc && (
                <DocumentPreviewModal
                    document={previewDoc}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
        </>
    );
};

interface DocumentPreviewModalProps {
    document: ExistingDocument;
    onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
                                                                       document,
                                                                       onClose,
                                                                   }) => {
    const fileUrl = `${process.env.REACT_APP_API_URL}${document.file_path}`;
    const isImage = isImageFile(document.file_name || document.original_name, document.mime_type);
    const isPdf = isPdfFile(document.file_name || document.original_name, document.mime_type);

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-5 py-3">
                    <div>
                        <div className="font-semibold text-gray-900">
                            {document.original_name}
                        </div>
                        <div className="text-xs text-gray-500">
                            {document.document_type || "Без подписи"}
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md px-2 py-1 text-gray-400 hover:bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-[80vh] overflow-auto bg-gray-50 p-4">
                    {isImage && (
                        <img
                            src={fileUrl}
                            alt={document.original_name}
                            className="mx-auto max-h-[75vh] rounded-lg object-contain"
                        />
                    )}

                    {isPdf && (
                        <iframe
                            src={fileUrl}
                            title={document.original_name}
                            className="h-[75vh] w-full rounded-lg bg-white"
                        />
                    )}

                    {!isImage && !isPdf && (
                        <div className="py-20 text-center text-sm text-gray-500">
                            Предпросмотр недоступен. Откройте файл в новой вкладке.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ListenerDocumentsCard;