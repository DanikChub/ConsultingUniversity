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
import { getOneTest } from '../../http/testAPI';
import CreatePracticalWork from '../../components/CreatePracticalWork/CreatePracticalWork';

import word from "../../assets/imgs/word.png"
import test_img from "../../assets/imgs/test.png"
import video_play from "../../assets/imgs/video_play.png"

const MakeProgram = () => {
    const params = useParams();
    const [programTitleInput, setProgramTitleInput] = useState('');
    const {user} = useContext(Context);
    const navigate = useNavigate();

    const [videoCounter, setVideoCounter] = useState(0);
    const [lectionCounter, setLectionCounter] = useState(0);
    const [themeLectionCounter, setThemeLectionCounter] = useState(0);
    const [presentationCounter, setPresentationCounter] = useState(0);
    const [testCounter, setTestCounter] = useState(0);



    const [themesArray, setThemesArray] = useState([]);


    const [showVideo, setShowVideo] = useState(false);
    const [showTest, setShowTest] = useState(false);
    const [showPracticalWork, setShowPracticalWork] = useState(false);

    useEffect(() => {
        if (params.id) {
            getOneProgram(params.id).then(data => {
                let themes_arr = data.themes.sort((a, b) => a.id-b.id);
                
                themes_arr.forEach(theme => {
                    theme.puncts.forEach( async punct => {
                        if (punct.test_id) {
                            await getOneTest(punct.test_id)
                            .then(test => {
                               
                                punct.test_title = test.title;
                               
                            })
                        }
                        
                        
                        
                    })
                })
                
              
                setTimeout(() => {
                    setThemesArray(themes_arr)
                }, 1000)
                
                
                setProgramTitleInput(data.title);
            });
            
        } else {
            setThemesArray([
                {
                    theme_id: 0,
                    lection_src: null,
                    lection_id: null,
                    lection_title: null,
                    title: "",
                    presentation_src: null,
                    presentation_id: null,
                    puncts: [
                        {
                            punct_id: 0,
                            title: "",
                            video_src: null,
                            lection_src: null,
                            lection_id: null,
                            lection_title: null,
                            test_id: null,
                            test_title: null,
                            practical_work: null,
                        }
                    ]
                    
                }
            ])
        }
        
    }, [])

    

    const [themeId, setThemeId] = useState(0);
    const [punctId, setPunctId] = useState([0]);


    const inputTitleHandler = (i, value) => {
        const valueNew = [...themesArray]
     
        valueNew[i].title = value;
        setThemesArray(valueNew);
    }

    const presentationSrcHandler = (i, value) => {
        const valueNew = [...themesArray]
    
        if (!valueNew[i].presentation_src) {
           
            setPresentationCounter(prev => prev+1)
            valueNew[i].presentation_id = 0;
            valueNew[i].presentation_id += presentationCounter;
            
        }

  
                
        
        valueNew[i].presentation_src = value;
        valueNew[i].presentation_title = valueNew[i].presentation_src.name; 
        
        setThemesArray(valueNew);
    }

    const themeLectionHandler = (i, value) => {
        const valueNew = [...themesArray]
    
        if (!valueNew[i].lection_src) {
           
            setThemeLectionCounter(prev => prev+1)
            valueNew[i].lection_id = 0;
            valueNew[i].lection_id += themeLectionCounter;
            
        }

  
        
        
        valueNew[i].lection_src = value;
        valueNew[i].lection_title = valueNew[i].lection_src.name; 


        console.log(valueNew);
        
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
                    valueNew[i_1].puncts[i_2].lection_id = 0;
                    valueNew[i_1].puncts[i_2].lection_id += lectionCounter;
                }

                
                
                valueNew[i_1].puncts[i_2].lection_src = value; 
                valueNew[i_1].puncts[i_2].lection_title = valueNew[i_1].puncts[i_2].lection_src.name; 
                
                
              
                setThemesArray(valueNew); 
                
                
             
                break;
        }

        console.log(valueNew);
        
    }

    const newTheme = () => {
        const added = [...themesArray]; // Получаем текущее состояние
        
        const data = {
            theme_id: themeId+1,
            
            lection_src: null,
            lection_id: null,
            lection_title: null,
            title: "",
            presentation_src: null,
            presentation_id: null,
            title: "",
            puncts: [
                {
                    punct_id: 0,
                    title: "",
                    video_src: null,
                    lection_src: null,
                    lection_id: null,
                    lection_title: null,
                    test_id: null,
                    test_title: null,
                    practical_work: null,
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
                lection_title: null,
                test_id: null,
                test_title: null,
                practical_work: null,
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
        let formData = new FormData();
        formData.append("title", programTitleInput)
        formData.append("admin_id", user.user.id)
        formData.append("number_of_practical_work", lectionCounter)
        formData.append("number_of_test", testCounter)
        formData.append("number_of_videos", videoCounter)

        
        themesArray.forEach(theme => {
            formData.append("presentation_src", theme.presentation_src)
            formData.append("theme_lection_src", theme.lection_src)
            theme.puncts.forEach(punct => {
                formData.append("docs", punct.lection_src)
                
            })
        })
        console.log(JSON.stringify(themesArray))
        formData.append("themes", JSON.stringify(themesArray))
        if (params.id) {
            formData.append("id", params.id)
            setNotActive(true);
            remakeProgram(formData).then(data => {
             
               
                
                setNotActive(false);
                
               
                navigate(ADMIN_PROGRAMS_ROUTE)
               
            })
        } else {
            setNotActive(true);
            createProgram(formData).then(data => {
          
                setNotActive(false);
                
                
                navigate(ADMIN_PROGRAMS_ROUTE)
                
            })
        }
        

    }

    const showTestClasses = (show, i, j, remake) => {
        console.log(themesArray)
        setShowTest({show:show, i: i, j: j, remake: remake})
        if (show) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }

    return (
    <div className="content">
        

        
            <div className="container">
            <div className="admin_inner">
                <LeftMenu active_arr={['', '', '', '', 'active', '', '', '',]}/>

                
                <div className="admin_container">
                    <div className="admin_path">Главная / <b>Программы</b></div>
                    

                    <div className="tabs">
                        
                        <div className="tabs_nav_links">
                            <Link to={ADMIN_PROGRAMS_ROUTE} className='tabs_nav_link'>Опубликовано (2)</Link>
                            <Link to={MAKE_PROGRAM_ROUTE} className='tabs_nav_link active'>Создать программу</Link>
                        </div>
                        
                        {
                            notActive ? 
                            <div className='loader'>
                                <div className='loader_container'></div>
                                <div className='loader_text'>Программа обрабатывается...</div>
                            </div>
                            :
                        <div className='MakeProgramContainer'>

                            <input onChange={(e) => setProgramTitleInput(e.target.value)} value={programTitleInput} className='MakeProgramInput' placeholder='Название программы'/>
                            
                            <div className='MakeProgramFlex'>
                                <div className='MakeProgramTitle'>Темы</div>
                                <div className='MakeProgram_Punct_Material'>
                                    <button onClick={() => newTheme()} className='MakeProgram_Theme_Button'>+</button>
                                    <div className='MakeProgram_Punct_Material_Text'>Добавить тему</div>
                                </div>
                            
                            </div>
                            
                            <div className='MakeProgram_Themes'>
                            {themesArray.map((theme, i) => 
                                <div className='MakeProgram_Theme'>
                                    <div className='MakeProgramFlex long'>
                                        <button onClick={() => deleteTheme(theme.theme_id)} className='MakeProgram_Theme_Button red'>-</button>
                                        <span className='MakeProgram_Theme_Marker'>{i+1}. </span>

                                        <input  onChange={(e) => inputTitleHandler(i, e.target.value)} value={theme.title} className='MakeProgramInput' placeholder='Название темы'/>
                                        
                                        
                                        <div className='MakeProgram_Punct_Material'>
                                            <button  onClick={() => newPunct(i)} className='MakeProgram_Theme_Button'>+</button>
                                            <div className='MakeProgram_Punct_Material_Text'>Добавить пункт</div>
                                        </div>
                                    </div>
                                    

                                    <div className='MakeProgram_Punct_Materials'>
                                        <div className='MakeProgram_Punct_Material'>
                                            <input id={i} onChange={(e ) => presentationSrcHandler(i, e.target.files[0])} accept='.pdf' className='MakeProgram_Punct_Material_input'  type="file"/>
                                            <label htmlFor={i} className='MakeProgram_Punct_Material_Plus'>+</label>
                                            <div className='MakeProgram_Punct_Material_Text'>{theme.presentation_src?theme.presentation_title:'Добавить презентацию'}</div>
                                        </div>
                                        <div className='MakeProgram_Punct_Material'>
                                            <input id={"lection_" + i} onChange={(e ) => themeLectionHandler(i, e.target.files[0])} accept='.docx' className='MakeProgram_Punct_Material_input'  type="file"/>
                                            
                                            <label htmlFor={"lection_" + i} className='MakeProgram_Punct_Material_Plus'>{theme.lection_src?<img src={word}/>:'+'}</label>
                                            <div className='MakeProgram_Punct_Material_Text'>{theme.lection_src?theme.lection_title:'Добавить лекцию'}</div>
                                        </div>
                                        {/* <div className='MakeProgram_Punct_Material'>
                                            <button onClick={() => setShowVideo({show:true, i: i, j: j, remake: theme.video_src})} className='MakeProgram_Punct_Material_input' id={"button" + i + "_" + j} ></button>
                                            <label htmlFor={"button" + i + "_" + j} className='MakeProgram_Punct_Material_Plus'>{theme.video_src?<img src={video_play}/>:'+'}</label>
                                            <div className='MakeProgram_Punct_Material_Text'>{theme.video_src? theme.video_src.slice(8, 18) + "..."  :'Добавить видео'}</div>
                                        </div> */}

                                        
                                    </div>
                                    
                                    
                                    <div className='MakeProgram_Theme_Puncts'>
                                    {theme.puncts.map((punct, j) => 
                                        <div  className='MakeProgram_Theme_Punct'>
                                            <div className='MakeProgramFlex long'>
                                                <button  onClick={() => deletePunct(i, punct.punct_id)} className='MakeProgram_Theme_Button red'>-</button>
                                                <span className='MakeProgram_Theme_Marker'>{i+1}.{j+1} </span>

                                                <input onChange={(e) => inputPunctsHandler(i, j, "title", e.target.value)} value={punct.title} className='MakeProgramInput' placeholder='Название пункта'/>
                                            </div>
                                           

                                            <div className='MakeProgram_Punct_Materials'>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <button onClick={() => setShowVideo({show:true, i: i, j: j, remake: punct.video_src})} className='MakeProgram_Punct_Material_input' id={"button" + i + "_" + j} ></button>
                                                    <label htmlFor={"button" + i + "_" + j} className='MakeProgram_Punct_Material_Plus'>{punct.video_src?<img src={video_play}/>:'+'}</label>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.video_src? punct.video_src.slice(8, 18) + "..."  :'Добавить видео'}</div>
                                                </div>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <input id={i + "_" + j} onChange={(e ) => inputPunctsHandler(i, j, "lection", e.target.files[0])} accept='.docx' className='MakeProgram_Punct_Material_input'  type="file"/>
                                                    
                                                    <label htmlFor={i + "_" + j} className='MakeProgram_Punct_Material_Plus'>{punct.lection_src?<img src={word}/>:'+'}</label>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.lection_src?punct.lection_title:'Добавить лекцию'}</div>
                                                </div>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <button onClick={() => showTestClasses(true, i, j, punct.test_id)} className='MakeProgram_Punct_Material_Plus' id={"button_test_" + i + "_" + j} >{punct.test_id?<img src={test_img}/>:'+'}</button>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.test_title? punct.test_title.length>10? punct.test_title.slice(0, 10) + "..." : punct.test_title  : "Создать тест"}</div>
                                                </div>
                                                <div className='MakeProgram_Punct_Material'>
                                                    <button onClick={() => setShowPracticalWork({show:true, i: i, j: j, remake: punct.practical_work})} className='MakeProgram_Punct_Material_Plus' id={"button_practic_" + i + "_" + j} >+</button>
                                                    <div className='MakeProgram_Punct_Material_Text'>{punct.practical_work? punct.practical_work.slice(0, 10) + "..."  :'Добавить практическую работу'}</div>
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
                        }
                    </div>

                    
                </div>
                
            </div>
        </div>
        
        
        <CreateVideo show={showVideo} setShow={setShowVideo} themesArray={themesArray} setThemesArray={setThemesArray} setCounter={setVideoCounter}/>
        <CreateTest show={showTest} setShow={setShowTest} themesArray={themesArray} setThemesArray={setThemesArray} setCounter={setTestCounter}/>
        <CreatePracticalWork show={showPracticalWork} setShow={setShowPracticalWork} themesArray={themesArray} setThemesArray={setThemesArray} setCounter={setTestCounter}/>
    </div>
    );
};

export default MakeProgram;