import React, {useEffect, useState} from 'react';
import Button from '../ui/Button';
import ThemeItem from './ThemeItem';
import type {Program, Theme} from "../../types/program";
import {useTheme} from "../../hooks/useTheme";

type Props = {
    program: Program;
};

const ThemeList: React.FC<Props> = ({ program}) => {

    const {
        themes,
        updateTitleTheme,
        addTheme,
        destroyTheme } = useTheme(program);

    const [hideThemes, setHideThemes] = useState<Set<number>>(new Set());

    const toggleTheme = (themeId: number) => {
        setHideThemes(prev => {
            const next = new Set(prev);
            next.has(themeId) ? next.delete(themeId) : next.add(themeId);
            return next;
        });
    };

    useEffect(() => {
        console.log(program)
    }, [program]);

    return (
        <div className='MakeProgram_Themes'>
            {themes.map((theme, themeIndex) => {
                const isHide = hideThemes.has(theme.id);

                return (
                    <ThemeItem
                        key={theme.id}
                        theme={theme}
                        updateTitleTheme={updateTitleTheme}
                        destroyTheme={destroyTheme}
                        themeIndex={themeIndex}
                        isHide={isHide}
                        toggleTheme={() => toggleTheme(theme.id)}


                    />
                )
            })}
            <Button className='mt-4' onClick={addTheme}>Добавить модуль</Button>


        </div>
    )
}

export default ThemeList;