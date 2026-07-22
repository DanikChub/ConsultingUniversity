// providers/ModalProvider.tsx
import React, {useEffect, useState} from 'react';
import { ModalContext } from '../hooks/useModals';
import type { ModalPayloadMap, ModalResultMap, ModalType } from '../types/modal';
import FileUploadModal from '../modals/FileUploadModal';
import FileInfoModal from "../modals/FileInfoModal";
import ProgramZipUploadModal from "../modals/ProgramZipUploadModal";
import CreateTestModal from "../modals/CreateTestModal";
import {TestViewModal} from "../modals/TestViewModal";
import GradeBookModal from "../modals/GradeBookModal";
import AlertModal from "../modals/AlertModal";
import ConfirmModal from "../modals/ConfirmModal";
import CertificateDeliveryModal from "../modals/CertificateDeliveryModal";
import {EditCertificateModal} from "../modals/EditCertificateModal";
import BlockUserModal from "../modals/BlockUserModal";


type ActiveModal<T extends ModalType = ModalType> = {
    type: T;
    payload: ModalPayloadMap[T];
    resolve: (value: ModalResultMap[T]) => void;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<ActiveModal | null>(null);

    const openModal = <T extends ModalType>(
        type: T,
        payload: ModalPayloadMap[T]
    ): Promise<ModalResultMap[T]> => {
        return new Promise((resolve) => {
            setModal({ type, payload, resolve } as ActiveModal);
        });
    };

    const close = <T extends ModalType>(result: ModalResultMap[T]) => {
        modal?.resolve(result as any);
        setModal(null);
    };

    useEffect(() => {
        if (modal) {
            // модалка открыта
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                // при закрытии восстанавливаем
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [modal]);

    return (
        <ModalContext.Provider value={{ openModal }}>
            {children}

            {modal?.type === 'uploadFile' && (
                <FileUploadModal
                    onClose={() => close(null)}
                    onSubmit={(data) => close( data )} // 👈 resolve промиса
                />
            )}

            {modal?.type === 'fileInfo' && (
                <FileInfoModal
                    file={modal.payload.file}
                    onDelete={modal.payload.onDelete}
                    onDownload={modal.payload.onDownload}
                    onRename={modal.payload.onRename}
                    onClose={() => close('close')}
                />
            )}

            {modal?.type === 'uploadProgramZip' && (
                <ProgramZipUploadModal
                    onClose={() => close(null)}
                    onSubmit={(data) => close(data)} // data = { file, resetProgram }
                />
            )}

            {modal?.type === 'createTest' && (
                <CreateTestModal
                    targetId={modal.payload.punctId}
                    onDelete={modal.payload.onDelete}
                    mode='create'
                    onClose={() => close(null)}
                    onSubmit={(test) => close(test)} // 👈 resolve промиса
                />
            )}
            {modal?.type === 'editTest' && (
                <CreateTestModal
                    targetId={modal.payload.testId}
                    onDelete={modal.payload.onDelete}
                    mode='edit'
                    onClose={() => close(null)}
                    onSubmit={(test) => close(test)} // 👈 resolve промиса
                />
            )}
            {modal?.type === 'viewTest' && (
                <TestViewModal
                    test={modal.payload.test}
                    onClose={() => close('close')}
                />
            )}
            {modal?.type === 'viewGradeBook' && (
                <GradeBookModal
                    program={modal.payload.program}
                    progress={modal.payload.progress}
                    onClose={() => close('close')}
                />
            )}
            {modal?.type === 'alert' && (
                <AlertModal
                    title={modal.payload.title}
                    description={modal.payload.description}
                    buttonText={modal.payload.buttonText}
                    onClose={() => close(undefined)}
                />
            )}

            {modal?.type === 'confirm' && (
                <ConfirmModal
                    title={modal.payload.title}
                    description={modal.payload.description}
                    confirmText={modal.payload.confirmText}
                    cancelText={modal.payload.cancelText}
                    variant={modal.payload.variant}
                    onCancel={() => close(false)}
                    onConfirm={() => close(true)}
                />
            )}

            {modal?.type === 'certificateDelivery' && (
                <CertificateDeliveryModal
                    certificate={modal.payload.certificate}
                    onClose={() => close('close')}
                    onUpdated={() => close('updated')}
                />
            )}
            {modal?.type === 'editCertificate' && (
                <EditCertificateModal
                    certificate={modal.payload.certificate}
                    onClose={() => close('close')}
                    onUpdated={() => close('updated')}
                />
            )}
            {modal?.type === "blockUser" && (
                <BlockUserModal
                    userName={modal.payload.userName}
                    onClose={() => close(null)}
                    onSubmit={result => close(result)}
                />
            )}

        </ModalContext.Provider>
    );
};
