import React, {useEffect} from 'react';

import ButtonRemove from '../../../../shared/ui/buttons/ButtonRemove';
import {FaChevronDown, FaChevronUp, FaTrashAlt} from 'react-icons/fa';
import FileList from "./FileList";
import PunctList from "./PunctList";
import type {Theme} from "../../../../entities/theme/model/type";

type Props = {
    theme: Theme;
    updateTitleTheme: (themeIndex: number, value: string) => void;
    destroyTheme: (themeId: number) => void;
    themeIndex: number;
    isHide: boolean;
    toggleTheme: (themeId: number) => void;

};

const ThemeItem: React.FC<Props> =
    ({
        theme,
        updateTitleTheme,
        destroyTheme,
        themeIndex,
        isHide,
        toggleTheme,

    }) => {


    return (
        <div
            className="pt-4 mt-5 border-t border-gray-100 rounded-lg bg-white shadow-sm transition-shadow">

            {/* Заголовок темы */}
            <div className="flex items-center gap-3 px-3 py-2 cursor-pointer select-none">
                <div className="flex items-center gap-2 " onClick={toggleTheme}>
                    {isHide ? <FaChevronDown className="text-gray-500"/> : <FaChevronUp className="text-gray-500"/>}

                </div>
                <b className="text-gray-800 min-w-max">Модуль {themeIndex + 1}:</b>
                <input
                    className="flex-1 bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none py-1 text-gray-800 placeholder-gray-400"
                    value={theme.title}
                    placeholder="Введите название модуля"
                    onChange={(e) => updateTitleTheme(themeIndex, e.target.value)}
                />

                <ButtonRemove onClick={() => destroyTheme(theme.id)} message='Вы уверены что хотит удалить тему?'/>
            </div>
            <FileList target={theme} targetType='theme'/>
            {/* Содержание темы (пункты) */}
            <PunctList theme={theme} isHide={isHide}/>
        </div>
    )
    }

export default ThemeItem;