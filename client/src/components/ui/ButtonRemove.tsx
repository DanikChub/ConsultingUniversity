import React from 'react';
import {FaTrashAlt} from "react-icons/fa";




const ButtonRemove = ({onClick, message}) => {

    const handleClick = (e) => {
        e.stopPropagation()
        const ok = window.confirm(message)

        if (!ok) return;

        onClick();
    }
    return (
        <button onClick={handleClick} className="text-gray-400 hover:text-red-500 p-1">
            <FaTrashAlt className="w-4 h-4"/>
        </button>
    );
};

export default ButtonRemove;