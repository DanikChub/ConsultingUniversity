import React from 'react';
import {FaTrashAlt} from "react-icons/fa";
import {useModals} from "../../../hooks/useModals";
import {useNavigate} from "react-router-dom";
import {FiArrowLeft} from "react-icons/fi";


interface Props {
    onClick?: () => void
}

const ButtonRemove: React.FC<Props> = ({onClick}) => {
    const { openModal } = useModals();
    const navigate = useNavigate()


    return (
        <button
            onClick={onClick ? onClick : () => navigate(-1)}
            className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
        >
            <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                <FiArrowLeft size={20}/>
            </div>
            <span className="text-lg font-medium">Назад</span>
        </button>
    );
};

export default ButtonRemove;