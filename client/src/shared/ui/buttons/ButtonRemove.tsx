import React from 'react';
import {FaTrashAlt} from "react-icons/fa";
import {useModals} from "../../../hooks/useModals";




const ButtonRemove = ({onClick, message}) => {
    const { openModal } = useModals();

    const handleClick = async (e) => {
        e.stopPropagation()
        const confirmed = await openModal('confirm', {
            title: message,
            description: "Это действие нельзя отменить",
            variant: "danger",
            confirmText: "Удалить",

        });


        if (!confirmed) return;

        onClick();
    }
    return (
        <button onClick={handleClick} className="text-gray-400 hover:text-red-500 p-1">
            <FaTrashAlt className="w-4 h-4"/>
        </button>
    );
};

export default ButtonRemove;