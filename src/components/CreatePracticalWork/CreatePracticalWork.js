import React, { useEffect, useState } from 'react';

import "./CreatePracticalWork.css"

const CreatePracticalWork = ({show, setShow, themesArray, setThemesArray, setCounter}) => {
    const [practicalInput, setPracticalInput] = useState('');

    useEffect(() => {
        if (show.remake) {
            
            setPracticalInput(show.remake);
        }
    }, [show.remake])

    const handleVideoInput = (value) => {
        setPracticalInput(value)
    }

    const handleClick = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].practical_work = practicalInput;

        setThemesArray(prevValueArray)
        setShow(false);
        setPracticalInput('');
        setCounter(value => value+1);
    }
    const handleClickDelete = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].practical_work = null;

        setThemesArray(prevValueArray)
        setShow(false);
        setPracticalInput('');
        setCounter(value => value+1);
    }

    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container video'>
                <button onClick={() => setShow(false)} className='modal_button'>x</button>
                <input onChange={(e) => handleVideoInput(e.target.value)} value={practicalInput} type="text" placeholder='Тема практической работы' className='modal_input'/>
                <div style={{display: 'flex'}}>
                    <div onClick={handleClickDelete} className='admin_button red'>Удалить</div>
                    <div onClick={handleClick} className='admin_button'>Сохранить</div>
                </div>
            
            </div>
        </div>
    );
};

export default CreatePracticalWork;