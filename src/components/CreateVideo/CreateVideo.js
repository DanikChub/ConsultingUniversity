import React, { useEffect, useState } from 'react';

import "./CreateVideo.css"

const CreateVideo = ({show, setShow, themesArray, setThemesArray, setCounter}) => {
    const [videoInput, setVideoInput] = useState('');

    useEffect(() => {
        if (show.remake) {
            
            setVideoInput(show.remake);
        }
    }, [show.remake])

    const handleVideoInput = (value) => {
        setVideoInput(value)
    }

    const handleClick = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].video_src = videoInput;
        
        setThemesArray(prevValueArray)
        setShow(false);
        setVideoInput('');
        setCounter(value => value+1);
    }
    const handleClickDelete = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].video_src = null;

        setThemesArray(prevValueArray)
        setShow(false);
        setVideoInput('');
        setCounter(value => value+1);
    }

    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container video'>
                <button onClick={() => setShow(false)} className='modal_button'>x</button>
                <input onChange={(e) => handleVideoInput(e.target.value)} value={videoInput} type="text" placeholder='Ссылка на видео' className='modal_input'/>
                <div style={{display: 'flex'}}>
                    <div onClick={handleClickDelete} className='admin_button red'>Удалить</div>
                    <div onClick={handleClick} className='admin_button'>Сохранить</div>
                </div>
            
            </div>
        </div>
    );
};

export default CreateVideo;