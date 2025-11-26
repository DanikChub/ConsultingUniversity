import { useState } from 'react';

export const useModals = () => {
    const [modals, setModals] = useState({
        video: { show: false, i: 0, j: 0, remake: null },
        test: { show: false, i: 0, j: 0, remake: null },
        practicalWork: { show: false, i: 0, j: 0, remake: null },
        addTask: { show: false, i: 0, j: 0, value: '', tasks: ['', '', '', '', ''] }
    });

    const openModal = (type, payload = {}) => {
        
        setModals(prev => ({
            ...prev,
            [type]: { ...prev[type], show: true, ...payload }
        }));
    }

    const closeModal = (type) => {
        setModals(prev => ({
            ...prev,
            [type]: { ...prev[type], show: false }
        }));
    }

    return { modals, openModal, closeModal, setModals };
}