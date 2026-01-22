import React, {useEffect, useState} from 'react';

import word from "../../assets/imgs/word_blue.png"
import pdf from "../../assets/imgs/pdf.png"
import test_img from "../../assets/imgs/test_blue.png"
import practic_work_img from "../../assets/imgs/practic_work.png"

import video_play from "../../assets/imgs/video_play_blue.png"
import ButtonAdd from '../../components/ButtonAdd/ButtonAdd';
import { useProgramForm } from '../../hooks/useProgramForm';
import { useModals } from '../../hooks/useModals';
import ButtonRemove from '../ui/ButtonRemove';
import { TaskType } from "../../types/tasks";


const PunctItem = ({ punct, i, j, themesArray, setThemesArray, deletePunct, setShowAddTask, openModal }) => {

    const [validate, setValidate] = useState(false);


    useEffect(() => {

    }, [])

    const handleTitleChange = (e) => {
        const arr = [...themesArray];
        arr[i].puncts[j].title = e.target.value;
        setThemesArray(arr);
    }

    const handleLectionDelete  = (i, j) => {
        const valueNew = [...themesArray];
        valueNew[i].puncts[j].lection_src = null; 
        valueNew[i].puncts[j].lection_title = ''; 
        
        
      
        setThemesArray(valueNew); 
    }

    const handleLectionPdfDelete = (i, j) => {
        const valueNew = [...themesArray];
        valueNew[i].puncts[j].lection_pdf = null;



        setThemesArray(valueNew);
    }

    const handleAudioDelete = (i, j) => {
        const valueNew = [...themesArray];
        valueNew[i].puncts[j].audio_src = null;



        setThemesArray(valueNew);
    }

    const handleTestDelete = (i, j) => {
        const prevValue = [...themesArray];
        prevValue[i].have_test = false;
        prevValue[i].puncts[j].test_title = null;
        prevValue[i].puncts[j].test_id = null;

        setThemesArray(prevValue);
    }

    const handlePracticalDelete  = (i, j) => {
        const valueNew = [...themesArray];
        valueNew[i].puncts[j].practical_work = null;

        
        
      
        setThemesArray(valueNew); 
    }

    const handleVideoDelete = (i, j) => {
        const prevValue = [...themesArray];
        prevValue[i].have_test = false;
        prevValue[i].puncts[j].test_title = null;
        prevValue[i].puncts[j].test_id = null;

        setThemesArray(prevValue);
    }

    const remakeFileName = (url, new_name) => {
        if (url && new_name) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function(e) {
        var blob = this.response;
        var link = document.createElement("a");
        link.style.display = "none";
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", new_name);
        link.click();
        }
        xhr.send();
        }
        
    }

    const navigateToUrl = (url) => {
        if (url) {
            var link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("target", "_blank")
            link.click();
        }
        
    }


    return (
        <div  className='w-full py-[10px] hover:bg-gray-100 border border-gray-100'>

            <div className='flex items-center gap-[15px]'>
                <div className="flex justify-end items-center w-[90px] gap-[10px]">
                    {
                        punct.video_src &&
                        <div className='MakeProgram_Punct_Material'>
                            <button className='MakeProgram_Punct_Material_delete'>x</button>
                            <button onClick={() => openModal('video', {i: i, j: j, remake: punct.video_src})}
                                    className='MakeProgram_Punct_Material_input' id={"button" + i + "_" + j}></button>
                            <label onContextMenu={() => navigateToUrl(punct.video_src)} htmlFor={"button" + i + "_" + j}
                                   className='MakeProgram_Punct_Material_Plus'><img height='22px'
                                                                                    src={video_play}/></label>

                        </div>
                    }

                    {
                        punct.lection_src &&
                        <div className='MakeProgram_Punct_Material'>
                            <button className='MakeProgram_Punct_Material_delete'
                                    onClick={() => handleLectionDelete(i, j)}>x
                            </button>


                            <div
                                onClick={(e) => setShowAddTask({
                                    show: true,
                                    i,
                                    j,
                                    value: '',
                                    availableTasks: {
                                        [TaskType.LECTION]: !punct.lection_src,
                                    },
                                })}
                                onContextMenu={() => remakeFileName(process.env.REACT_APP_API_URL + punct.lection_src, punct.lection_title)}
                                className='MakeProgram_Punct_Material_Plus'>
                                <img height={'22px'} src={word}/>
                            </div>

                        </div>
                    }

                    {
                        punct.lection_pdf &&
                        <div className='MakeProgram_Punct_Material'>
                            <button className='MakeProgram_Punct_Material_delete'
                                    onClick={() => handleLectionPdfDelete(i, j)}>x
                            </button>


                            <div
                                onClick={(e) => setShowAddTask({
                                    show: true,
                                    i,
                                    j,
                                    value: '',
                                    availableTasks: {
                                        [TaskType.LECTION_PDF]: true,
                                    },
                                })}

                                className='MakeProgram_Punct_Material_Plus'>
                                <img height={'22px'} src={pdf}/>
                            </div>

                        </div>
                    }

                    {
                        punct.test_id &&

                        <div className='MakeProgram_Punct_Material'>
                            <button className='MakeProgram_Punct_Material_delete'
                                    onClick={() => handleTestDelete(i, j)}>x
                            </button>
                            <div onClick={() => openModal('test', {i: i, j: j, remake: punct.test_id})}
                                 className='MakeProgram_Punct_Material_Plus' id={"button_test_" + i + "_" + j}><img
                                height={'22px'} src={test_img}/></div>

                        </div>
                    }

                    {
                        punct.practical_work &&
                        <div className='MakeProgram_Punct_Material' onClick={() => handlePracticalDelete(i, j)}>
                            <button className='MakeProgram_Punct_Material_delete'>x</button>
                            <div onClick={() => openModal('practicalWork', {
                                i: i,
                                j: j,
                                remake: {
                                    practical_work: punct.practical_work,
                                    practical_work_task: punct.practical_work_task
                                }
                            })} className='MakeProgram_Punct_Material_Plus' id={"button_practic_" + i + "_" + j}><img
                                height="28px" src={practic_work_img}/></div>

                        </div>
                    }

                    {
                        punct.audio_src &&
                        <div className='MakeProgram_Punct_Material'>
                            <button className='MakeProgram_Punct_Material_delete'
                                    onClick={() => handleAudioDelete(i, j)}>x
                            </button>


                            <div
                                onClick={(e) => setShowAddTask({
                                    show: true,
                                    i,
                                    j,
                                    value: '',
                                    availableTasks: {
                                        [TaskType.AUDIO]: true,
                                    },
                                })}

                                className='MakeProgram_Punct_Material_Plus'>
                                А
                            </div>

                        </div>
                    }


                </div>


                <ButtonAdd onClick={() => setShowAddTask(
                    {
                        show: true,
                        i,
                        j,
                        value: '',
                        availableTasks: {
                            [TaskType.TEST]: !punct.test_id,
                            [TaskType.PRESENTATION]: false,
                            [TaskType.PRACTICAL]: !punct.practical_work,
                            [TaskType.LECTION]: !punct.lection_src,
                            [TaskType.VIDEO]: !punct.video_src,
                            [TaskType.LECTION_PDF]: !punct.lection_pdf,
                            [TaskType.AUDIO]: !punct.audio_src,
                        },
                    }
                )}/>

                <ButtonRemove onClick={() => deletePunct(i, punct.punct_id)}/>
                <b className='text-[#2C3E50]'>{punct.test_id ? 'Тест:' : `Тема ${j + 1}:`}</b>
                <input onChange={(e) => handleTitleChange(e)} value={punct.title}
                       className='bg-transparent border-none outline-none text-[#2C3E50] text-md w-[80%]'
                       placeholder=''/>
            </div>
        </div>
    )
}

export default PunctItem;