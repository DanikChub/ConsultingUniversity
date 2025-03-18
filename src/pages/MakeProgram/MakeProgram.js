import React, { useContext, useEffect, useState } from 'react';
import { ADMIN_PROGRAMS_ROUTE, MAKE_PROGRAM_ROUTE, ADMIN_LISTENERS_ROUTE } from '../../utils/consts';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./MakeProgram.css";
import { Context } from '../../index';
import { createProgram, getOneProgram, remakeProgram } from '../../http/programAPI';
import {Buffer} from "buffer";
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import CreateVideo from '../../components/CreateVideo/CreateVideo';
import CreateTest from '../../components/CreateTest/CreateTest';


const MakeProgram = () => {
    const params = useParams();
    const [programTitleInput, setProgramTitleInput] = useState('');
    const {user} = useContext(Context);
    const navigate = useNavigate();

    const [videoCounter, setVideoCounter] = useState(0);
    const [lectionCounter, setLectionCounter] = useState(0);
    const [testCounter, setTestCounter] = useState(0);

    const [lectionFile, setLectionFile] = useState([]);

    const [themesArray, setThemesArray] = useState([]);

    const [showVideo, setShowVideo] = useState(false);
    const [showTest, setShowTest] = useState(false);

    useEffect(() => {
        if (params.id) {
            getOneProgram(params.id).then(data => {
                setThemesArray(data.themes)
                setProgramTitleInput(data.title)
            });
            
        } else {
            setThemesArray([
                {
                    theme_id: 0,
                    title: "",
                    puncts: [
                        {
                            punct_id: 0,
                            title: "",
                            video_src: null,
                            lection_src: null,
                            lection_id: 0,
                            test_id: null
                        }
                    ]
                    
                }
            ])
        }
        
    }, [])

    useEffect(() => {
        console.log(themesArray);
    }, [themesArray])

    const [themeId, setThemeId] = useState(0);
    const [punctId, setPunctId] = useState([0]);


    const inputTitleHandler = (i, value) => {
        const valueNew = [...themesArray]
     
        valueNew[i].title = value;
        setThemesArray(valueNew);
    }


    const inputPunctsHandler = (i_1, i_2, type, value) => {
        const valueNew = [...themesArray]; 

        switch (type){
            case "title":
                valueNew[i_1].puncts[i_2].title = value; 
                setThemesArray(valueNew); 
                break;
            case "video":
                valueNew[i_1].puncts[i_2].video_src = value; 
                if (!valueNew[i_1].puncts[i_2].video_src) {
                    setVideoCounter(prev => prev+1);
                }
               
                setThemesArray(valueNew); 
            
                
                break;
            case "lection":

                if (!valueNew[i_1].puncts[i_2].lection_src) {
                    setLectionCounter(prev => prev+1)
                    valueNew[i_1].puncts[i_2].lection_id += lectionCounter;
                }
                
                valueNew[i_1].puncts[i_2].lection_src = value; 

              
              
                setThemesArray(valueNew); 
                
                
             
                break;
        }
        
    }

    const newTheme = () => {
        const added = [...themesArray]; // Получаем текущее состояние
        
        const data = {
            theme_id: themeId+1,
            title: "",
            puncts: [
                {
                    punct_id: 0,
                    title: "",
                    video_src: null,
                    lection_id: 0,
                    lection_src: null,
                }
            ]
            
        } 
        setThemeId(id => id+1)
 
        added.push(data); // Добавляем элемент
        setThemesArray(added); // Обновляем состояние
    }

    const deleteTheme = (i) => {
        const added = [...themesArray]; // Получаем текущее состояние
        
        setThemeId(id => id-1)
 
        setThemesArray(added.filter(elem => elem.theme_id != i)); // Обновляем состояние
    }



    const newPunct = (i) => {
        const added = [...themesArray]; // Получаем текущее состояние
        const punct_ides = [...punctId];
        if (punct_ides.length-1 < i) {
            punct_ides.push(0);
            setPunctId(punct_ides)
        } else {
            punct_ides[i]+=1;
            const data = {
                punct_id: punct_ides[i],
                title: "",
                video_src: null,
                lection_src: null,
                lection_id: null,
            }
            setPunctId(punct_ides)

            added[i].puncts.push(data); // Добавляем элемент
            setThemesArray(added); // Обновляем состояние
        }
        
        
    }

    const deletePunct = (i, j) => {
        const added = [...themesArray]; // Получаем текущее состояние
    
 
        let filtered_punct = added[i].puncts.filter(elem => elem.punct_id != j); // Добавляем элемент
        console.log(filtered_punct, j);
        added[i].puncts = filtered_punct

        setThemesArray(added); // Обновляем состояние
    }

    const [notActive, setNotActive] = useState(false);

    const handleClickSave = () => {
        if (params.id) {
            remakeProgram(params.id, programTitleInput, user.user.id, 0, 0, videoCounter, themesArray).then(data => {
             
                setNotActive(true);
                setTimeout(() => {
                    setNotActive(false);
                }, 1200)
                setTimeout(() => {
                    navigate(ADMIN_PROGRAMS_ROUTE)
                }, 2400)
            })
        } else {
            let formData = new FormData();
            formData.append("title", programTitleInput)
            formData.append("admin_id", user.user.id)
            formData.append("number_of_practical_work", lectionCounter)
            formData.append("number_of_test", testCounter)
            formData.append("number_of_videos", videoCounter)

            themesArray.forEach(theme => {
                theme.puncts.forEach(punct => {
                    formData.append("docs", punct.lection_src)
                   
                })
            })
            
            console.log(themesArray)
            formData.append("themes", JSON.stringify(themesArray))
            console.log(formData);
            createProgram(formData).then(data => {
          
                setNotActive(true);
                setTimeout(() => {
                    setNotActive(false);
                }, 1200)
                setTimeout(() => {
                    navigate(ADMIN_PROGRAMS_ROUTE)
                }, 2400)
            })
        }
        

    }

    return (
    <div className="content">
        <div className={notActive ? 'notification active' : 'notification'}>
            <div className='notification_text'>Программа успешно создана!</div>
        </div>
        <div className="container">
            <div className="admin_inner">
                <LeftMenu/>
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Программы</b></div>
                    

                    <div className="tabs">
                        
                        <div className="tabs_nav_links">
                            <Link to={ADMIN_PROGRAMS_ROUTE} className='tabs_nav_link'>Опубликовано (2)</Link>
                            <Link to={MAKE_PROGRAM_ROUTE} className='tabs_nav_link active'>Создать программу</Link>
                        </div>
                        

                        <div className='MakeProgramContainer'>

                            <input onChange={(e) => setProgramTitleInput(e.target.value)} value={programTitleInput} className='MakeProgramInput' placeholder='Название программы'/>
                            
                            <div className='MakeProgramFlex'>
                            <div className='MakeProgramTitle'>Темы</div>
                            <button onClick={() => newTheme()} className='MakeProgram_Theme_Button'>+</button>
                            </div>
                            
                            <div className='MakeProgram_Themes'>
                            {themesArray.map((theme, i) => 
                                <div className='MakeProgram_Theme'>
                                    
                                    <button onClick={() => deleteTheme(theme.theme_id)} className='MakeProgram_Theme_Button red'>-</button>
                                    <span className='MakeProgram_Theme_Marker'>{i+1}. </span>

                                    <input  onChange={(e) => inputTitleHandler(i, e.target.value)} value={theme.title} className='MakeProgramInput' placeholder='Название темы'/>
                                    <button  onClick={() => newPunct(i)} className='MakeProgram_Theme_Button'>+</button>
                                    

                                    <div className='MakeProgram_Theme_Puncts'>
                                    {theme.puncts.map((punct, j) => 
                                        <div  className='MakeProgram_Theme_Punct'>
                                            <button  onClick={() => deletePunct(i, punct.punct_id)} className='MakeProgram_Theme_Button red'>-</button>
                                            <span className='MakeProgram_Theme_Marker'>{i+1}.{j+1} </span>

                                            <input onChange={(e) => inputPunctsHandler(i, j, "title", e.target.value)} value={punct.title} className='MakeProgramInput' placeholder='Название пункта'/>

                                            <div className='MakeProgram_Punct_Materials'>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <button onClick={() => setShowVideo({show:true, i: i, j : j})} className='MakeProgram_Punct_Material_input' id={"button" + i + "_" + j} ></button>
                                                    <label htmlFor={"button" + i + "_" + j} className='MakeProgram_Punct_Material_Plus'>+</label>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.video_src?punct.video_src:'Добавить видео'}</div>
                                                </div>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <input id={i + "_" + j} onChange={(e ) => inputPunctsHandler(i, j, "lection", e.target.files[0])} accept='.docx' className='MakeProgram_Punct_Material_input'  type="file"/>
                                                    <label htmlFor={i + "_" + j} className='MakeProgram_Punct_Material_Plus'>+</label>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.lection_src?punct.lection_src.name:'Добавить лекцию'}</div>
                                                </div>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <button onClick={() => setShowTest({show:true, i: i, j : j})} className='MakeProgram_Punct_Material_Plus' id={"button_test_" + i + "_" + j} >+</button>
                                                    <div className='MakeProgram_Punct_Material_Text'>Добавить тест</div>
                                                </div>
                                            </div>
                                        </div>    
                                    )}
                                    </div>
                                </div>
                               )}
                            </div>
                            <div className='button_container'>
                                 <div onClick={handleClickSave} className='admin_button'>Сохранить</div>
                            </div>
                            
                            
                        </div>
                        
                    </div>

                    
                </div>
                
            </div>
        </div>
        <CreateVideo show={showVideo} setShow={setShowVideo} themesArray={themesArray} setThemesArray={setThemesArray} setCounter={setVideoCounter}/>
        <CreateTest show={showTest} setShow={setShowTest} themesArray={themesArray} setThemesArray={setThemesArray} setCounter={setTestCounter}/>
    </div>
    );
};

export default MakeProgram;