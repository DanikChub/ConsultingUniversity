import { useState, useEffect, useRef } from 'react';
import type { Theme, Program } from '../types/program';
import {createTheme, deleteTheme, updateThemeTitle} from '../http/programAPI';

export const useTheme = (program: Program | null) => {
    const [themes, setThemes] = useState<Theme[]>(() => program?.themes || []);
    const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});



    // ----------------- Обновление title темы -----------------
    const updateTitleTheme = (themeIndex: number, value: string) => {
        setThemes(prev => {
            const newThemes = [...prev];
            newThemes[themeIndex] = { ...newThemes[themeIndex], title: value };
            return newThemes;
        });

        // Дебаунс по индексу темы
        if (debounceTimers.current[themeIndex]) clearTimeout(debounceTimers.current[themeIndex]);

        debounceTimers.current[themeIndex] = setTimeout(async () => {
            try {

                await updateThemeTitle(themes[themeIndex].id, value);
            } catch (err) {
                console.error('Ошибка обновления темы:', err);
            }
        }, 700);
    };

    // ----------------- добавление темы -----------------
    const addTheme = async () => {
        if (!program) return;

        try {
            const newTheme = await createTheme(program.id);

            setThemes(prev => [...prev, newTheme]);
        } catch (e) {
            console.error('Ошибка создания темы', e);
        }
    };

    const destroyTheme = async (themeId: number) => {
        try {
            // 1️⃣ сразу убираем из UI
            setThemes(prev => prev.filter(theme => theme.id !== themeId));

            // 2️⃣ удаляем на сервере
            await deleteTheme(themeId);
        } catch (e) {
            console.error('Ошибка удаления темы', e);
            // 🔴 при желании можно перезагрузить темы из program
        }
    };

    return {
        themes,
        setThemes,
        updateTitleTheme,
        addTheme,
        destroyTheme
    };
};
