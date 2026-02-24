import React, {useEffect, useState} from 'react';

import { useModals } from '../../../../hooks/useModals';
import ButtonRemove from '../../../../shared/ui/buttons/ButtonRemove';


import FileList from "./FileList";

import TestList from "./TestList";
import type {Punct} from "../../../../entities/punct/model/type";
import {AutoResizeTextarea} from "../../../../shared/ui/inputs/AutoResizeTextarea";


type Props = {
    punct: Punct;
    updateTitlePunct: (punctIndex: number, value: string) => void;
    updateDescriptionPunct: (punctIndex: number, value: string) => void;
    destroyPunct: (pucntId: number) => void;
    punctIndex: number;
    setDisableParentDrag?: (disable: boolean) => void;

};

const PunctItem: React.FC<Props> =
    ({
         punct,
         updateTitlePunct,
         updateDescriptionPunct,
         destroyPunct,
         punctIndex,
         setDisableParentDrag,

    }) => {

    const { openModal } = useModals();


    const handleMouseEnter = () => {
        if (setDisableParentDrag) setDisableParentDrag(true);
    };

    const handleMouseLeave = () => {
        if (setDisableParentDrag) setDisableParentDrag(false);
    };

    return (

        <div
            className=" w-full py-4 px-3 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">


                <b className="text-gray-800 min-w-max">Тема {punctIndex + 1}:</b>

                <input
                    onChange={(e) => updateTitlePunct(punctIndex, e.target.value)}
                    value={punct.title}
                    placeholder="Введите название темы"
                    className="flex-1 bg-transparent text-gray-800 text-md placeholder-gray-400 outline-none focus:border-b-1 focus:border-blue-500 transition-all border-b border-gray-300 py-1"
                />
                <ButtonRemove onClick={() => destroyPunct(punct.id)} message='Вы уверены что хотит удалить пункт?'/>
            </div>
            <div className="flex items-start gap-4 mt-6">


                <b className="text-gray-800 min-w-max">Описание:</b>

                <AutoResizeTextarea
                    onChange={(value) => updateDescriptionPunct(punctIndex, value)}
                    value={punct.description}
                    placeholder="Введите описание темы"
                    className="w-full bg-transparent text-gray-800 text-md placeholder-gray-400 outline-none focus:border-b-1 focus:border-blue-500 transition-all border-b border-gray-300 py-1"
                />

            </div>


            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <FileList target={punct} targetType='punct'/>
            </div>

            <TestList punct={punct}/>

        </div>

    )
    }

export default PunctItem;