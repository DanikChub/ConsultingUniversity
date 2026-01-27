import React, {useEffect} from 'react';
import PunctItem from './PunctItem';
import ButtonAdd from '../ButtonAdd/ButtonAdd';

import pdf from "../../assets/imgs/pdf.png"
import Button from '../ui/Button';
import ButtonRemove from '../ui/ButtonRemove';
import {TaskType} from "../../types/tasks";
import type {Theme} from "../../types/program";
import {usePunct} from "../../hooks/usePunct";
import {FaChevronDown, FaChevronUp, FaTrashAlt} from 'react-icons/fa';
import {useFile} from "../../hooks/useFile";
import FileList from "./FileList";
import PunctList from "./PunctList";

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