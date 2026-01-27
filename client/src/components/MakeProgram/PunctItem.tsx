import React, {useEffect, useState} from 'react';

import word from "../../assets/imgs/word_blue.png"
import pdf from "../../assets/imgs/pdf.png"
import test_img from "../../assets/imgs/test_blue.png"
import practic_work_img from "../../assets/imgs/practic_work.png"
import {FaPlus, FaTrashAlt} from 'react-icons/fa';

import video_play from "../../assets/imgs/video_play_blue.png"
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';
import { useModals } from '../../hooks/useModals';
import ButtonRemove from '../ui/ButtonRemove';
import { TaskType } from "../../types/tasks";
import type {Punct, Theme} from "../../types/program";
import {useFile} from "../../hooks/useFile";
import FileList from "./FileList";
import type {Test} from "../../types/test";
import FileItem from "./FileItem";
import TestList from "./TestList";


type Props = {
    punct: Punct;
    updateTitlePunct: (punctIndex: number, value: string) => void;
    destroyPunct: (pucntId: number) => void;
    punctIndex: number;
    setDisableParentDrag?: (disable: boolean) => void;

};

const PunctItem: React.FC<Props> =
    ({
         punct,
         updateTitlePunct,
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

            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <FileList target={punct} targetType='punct'/>
            </div>

            <TestList punct={punct}/>

        </div>

    )
    }

export default PunctItem;