import { useEffect, useRef, useState } from 'react';


import type {Test} from "../../../entities/test/model/type";
import {createPunct, deletePunct, updatePunctTitle, movePunct as apiMovePunct} from "../../../entities/punct/api/punct.api";
import type {Theme} from "../../../entities/theme/model/type";
import type {Punct} from "../../../entities/punct/model/type";

export const usePunct = (theme: Theme | null) => {
    const [puncts, setPuncts] = useState<Punct[]>(() => theme?.puncts || []);
    const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});


    // ----------------- обновление title пункта -----------------
    const updateTitlePunct = (punctIndex: number, value: string) => {
        setPuncts(prev => {
            const next = [...prev];
            next[punctIndex] = { ...next[punctIndex], title: value };
            return next;
        });

        if (debounceTimers.current[punctIndex]) {
            clearTimeout(debounceTimers.current[punctIndex]);
        }

        debounceTimers.current[punctIndex] = setTimeout(async () => {
            try {
                await updatePunctTitle(puncts[punctIndex].id, value);
            } catch (e) {
                console.error('Ошибка обновления пункта', e);
            }
        }, 700);
    };

    // ----------------- добавление пункта -----------------
    const addPunct = async () => {
        if (!theme) return;

        try {
            const newPunct = await createPunct(theme.id);
            setPuncts(prev => [...prev, newPunct]);
        } catch (e) {
            console.error('Ошибка создания пункта', e);
        }
    };

    // ----------------- удаление пункта -----------------
    const destroyPunct = async (punctId: number) => {
        try {
            // optimistic UI
            setPuncts(prev => prev.filter(p => p.id !== punctId));
            await deletePunct(punctId);
        } catch (e) {
            console.error('Ошибка удаления пункта', e);
        }
    };

    // ----------------- перемещение пункта -----------------
    const moveOnePunct = async (punctId: number, newIndex: number) => {
        const oldIndex = puncts.findIndex(p => p.id === punctId);
        if (oldIndex === -1 || oldIndex === newIndex) return;

        const newPuncts = Array.from(puncts);
        const [moved] = newPuncts.splice(oldIndex, 1);
        newPuncts.splice(newIndex, 0, moved);
        setPuncts(newPuncts);

        if (!theme) return;
        try {
            await apiMovePunct(punctId, newIndex, theme.id);
        } catch (e) {
            console.error('Ошибка перемещения пункта', e);
            setPuncts(puncts); // rollback
        }
    };


    return {
        puncts,
        setPuncts,
        updateTitlePunct,
        addPunct,
        destroyPunct,
        moveOnePunct,

    };
};
