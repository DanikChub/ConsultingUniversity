import React, { useEffect, useState } from 'react';

import "./CreatePracticalWork.css"

const CreatePracticalWork = ({show, setShow, themesArray, setThemesArray, setCounter}) => {
    const [practicalInput, setPracticalInput] = useState('');
    const [practicalTaskInput, setPracticalTaskInput] = useState('');

    useEffect(() => {
        if (show.remake) {
            console.log(show.remake.practical_work_task)
            setPracticalInput(show.remake.practical_work);
            setPracticalTaskInput(show.remake.practical_work_task);
        }
    }, [show.remake])

 

    const handleClick = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].practical_work = practicalInput;
        prevValueArray[show.i].puncts[show.j].practical_work_task = practicalTaskInput

        setThemesArray(prevValueArray)
        setShow(false);
        setPracticalInput('');
        setCounter(value => value+1);
    }
    const handleClickDelete = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].practical_work = null;
        prevValueArray[show.i].puncts[show.j].practical_work_task = null;

        setThemesArray(prevValueArray)
        setShow(false);
        setPracticalInput('');
        setCounter(value => value+1);
    }

    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container video'>
                <button onClick={() => setShow(false)} className='modal_button'>x</button>
                <input onChange={(e) => setPracticalInput(e.target.value)} value={practicalInput} type="text" placeholder='Тема практической работы' className='modal_input'/>
                <textarea onChange={(e) => setPracticalTaskInput(e.target.value)} value={practicalTaskInput} type="text" placeholder='Задание...' className='modal_input test' style={{marginTop: '40px'}}></textarea>
                <div style={{display: 'flex', marginTop: '20px'}}>
                    <div onClick={handleClickDelete} className='admin_button red'>Удалить</div>
                    <div onClick={handleClick} className='admin_button'>Сохранить</div>
                </div>
            
            </div>
        </div>
    );
};

export default CreatePracticalWork;