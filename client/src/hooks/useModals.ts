// hooks/useModals.ts
import { createContext, useContext } from 'react';
import type {ModalPayloadMap, ModalResultMap, ModalType} from "../types/modal";


export type OpenModal = <T extends ModalType>(
    type: T,
    payload: ModalPayloadMap[T]
) => Promise<ModalResultMap[T]>;

export const ModalContext = createContext<{
    openModal: OpenModal;
} | null>(null);

export const useModals = () => {
    const ctx = useContext(ModalContext);
    if (!ctx) throw new Error('useModals must be used inside ModalProvider');
    return ctx;
};
