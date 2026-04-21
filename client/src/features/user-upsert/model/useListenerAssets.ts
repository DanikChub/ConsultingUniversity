import { useState } from 'react';
import { deleteUserDocument } from '../../../entities/user/api/user.api';
import type { UserDocument } from '../../../entities/user/model/type';

type UseListenerAssetsParams = {
    initialDocuments?: UserDocument[];
    initialProfileImg?: string | null;
};

export function useListenerAssets({
                                      initialDocuments = [],
                                      initialProfileImg = null,
                                  }: UseListenerAssetsParams) {
    const [newDocuments, setNewDocuments] = useState<File[]>([]);
    const [existingDocuments, setExistingDocuments] = useState<UserDocument[]>(initialDocuments);
    const [profileImg, setProfileImg] = useState<File | null>(null);
    const [currentProfileImg, setCurrentProfileImg] = useState<string | null>(initialProfileImg);

    const handleDocumentsChange = (files: FileList | null) => {
        if (!files) return;
        const filesArray = Array.from(files);
        setNewDocuments((prev) => [...prev, ...filesArray]);
    };

    const removeNewDocument = (index: number) => {
        setNewDocuments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingDocument = async (documentId: number) => {
        await deleteUserDocument(documentId);
        setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    };

    return {
        newDocuments,
        existingDocuments,
        profileImg,
        currentProfileImg,
        setProfileImg,
        setCurrentProfileImg,
        setExistingDocuments,
        handleDocumentsChange,
        removeNewDocument,
        handleDeleteExistingDocument,
    };
}