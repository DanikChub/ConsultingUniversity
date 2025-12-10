import React, { useEffect, useRef, useState } from 'react';

import "./CreateVideo.css"
import Modal from "../ui/Modal";

const CreateVideo = ({show, setShow, themesArray, setThemesArray, setCounter}) => {
    const [videoInput, setVideoInput] = useState('');
    const [correct, setCorrect] = useState(false);
    const [oid, setOid] = useState('')
    const [id, setId] = useState('')

    useEffect(() => {
        if (show.remake) {
            
            setVideoInput(show.remake);
            let new_value = show.remake.replace('https://vkvideo.ru/video', '')
            try {
                let oid = new_value.match(/-\d\d\d\d\d\d\d\d\d/)[0]
                let id = new_value.match(/_\d\d\d\d\d\d\d\d\d/)[0].slice(1, 10)
                if (oid && id) {
                    setCorrect(true)
                    setOid(oid)
                    setId(id)
                }
            } catch (e) {
               
                setCorrect(false)
            }
            
        }
    }, [show.remake])

    const handleVideoInput = (value) => {
        let new_value = value.replace('https://vkvideo.ru/video', '')
        try {
            let oid = new_value.match(/-\d\d\d\d\d\d\d\d\d/)[0]
            let id = new_value.match(/_\d\d\d\d\d\d\d\d\d/)[0].slice(1, 10)
            if (oid && id) {
                setCorrect(true)
                setOid(oid)
                setId(id)
               
            }
        } catch (e) {
           
            setCorrect(false)
        }
        
        
        
        
        setVideoInput(value)
    }

    const handleClick = () => {
        const prevValueArray = [...themesArray];
       
        

        prevValueArray[show.i].puncts[show.j].video_src = videoInput;
        
        setThemesArray(prevValueArray)
        setShow(false);
        setOid('')
        setCorrect(false)
        setVideoInput('');
        setCounter(value => value+1);

        
    }
    const handleClickDelete = () => {
        const prevValueArray = [...themesArray];

        prevValueArray[show.i].puncts[show.j].video_src = null;

        setThemesArray(prevValueArray)
        setShow(false);
        setOid('')
        setCorrect(false)
        setVideoInput('');
        setCounter(value => value+1);
    }

    return (
        <Modal open={show.show} onClose={() => setShow({ show: false, i: 0, j: 0 })} width="600px">
                <input onChange={(e) => handleVideoInput(e.target.value)} value={videoInput} type="text" placeholder='Ссылка на видео' className='modal_input'/>
                {
                    !correct 
                    ? 
                    <div class="login_form_message">Ссылка не корректна</div>
                    :
                    <iframe class="create_video_iframe" src={`https://vkvideo.ru/video_ext.php?oid=${oid}&id=${id}&hd=2`} allow="encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;" frameborder="0" allowfullscreen></iframe>
                }
                
                <div style={{display: 'flex'}}>
                    <div onClick={handleClickDelete} className='admin_button red'>Удалить</div>
                    <div onClick={handleClick} className='admin_button'>Сохранить</div>
                </div>
        </Modal>
    );
};

export default CreateVideo;