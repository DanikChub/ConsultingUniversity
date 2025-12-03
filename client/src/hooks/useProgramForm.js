// hooks/useProgramForm.js
import { useState, useEffect, useContext } from 'react';
import { Context } from '../index';
import { getOneProgram, createProgram, remakeProgram } from '../http/programAPI';
import { getOneTest } from '../http/testAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { ADMIN_PROGRAMS_ROUTE } from '../utils/consts';

export const useProgramForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { user } = useContext(Context);

    const [loaded, setLoaded] = useState(false);
    const [programTitle, setProgramTitle] = useState('');
    const [programShortTitle, setProgramShortTitle] = useState('');
    const [programPrice, setProgramPrice] = useState('');
    const [programImg, setProgramImg] = useState(null);
    const [themesArray, setThemesArray] = useState([]);
    const [themeId, setThemeId] = useState(0);
    const [punctId, setPunctId] = useState([0]);
    const [videoCounter, setVideoCounter] = useState(0);
    const [lectionCounter, setLectionCounter] = useState(0);
    const [presentationCounter, setPresentationCounter] = useState(0);
    const [testCounter, setTestCounter] = useState(0);
    const [serverMessage, setServerMessage] = useState('');
    const [validate, setValidate] = useState(false);
    const [notActive, setNotActive] = useState(false);

    useEffect(() => {
        const fetchProgram = async () => {
            if (params.id) {
                const data = await getOneProgram(params.id);
                let themes = data.themes.sort((a, b) => a.theme_id - b.theme_id);
                let punctArr = [];

                for (const theme of themes) {
                    theme.hide = false;
                    punctArr.push(theme.puncts.length - 1);
                    for (const punct of theme.puncts) {
                        if (punct.test_id) {
                            const test = await getOneTest(punct.test_id);
                            punct.test_title = test.title;
                        }
                    }
                }
                setProgramImg(data.img)
                setThemeId(themes.length);
                setPunctId(punctArr);
                setThemesArray(themes);
                setProgramTitle(data.title);
                setProgramShortTitle(data.short_title);
                setProgramPrice(data.price);
                setTestCounter(data.number_of_test);

                
            } else {
                setThemesArray([{
                    theme_id: 0,
                    have_test: false,
                    lection_src: null,
                    lection_id: null,
                    lection_title: null,
                    title: "",
                    hide: false,
                    presentation_src: null,
                    presentation_id: null,
                    puncts: [{ punct_id: 0, title: "", video_src: null, lection_src: null, lection_id: null, lection_title: null, test_id: null, test_title: null, practical_work: null, practical_work_task: null }]
                }]);
                
            }
            setLoaded(true)
        }

        fetchProgram();
    }, [params.id]);

    const handleImg = (file) => {
        setProgramImg(file);
        return file ? URL.createObjectURL(file) : null;
    }

    const addTheme = () => {
        const newTheme = {
            theme_id: themeId + 1,
            have_test: false,
            lection_src: null,
            lection_id: null,
            lection_title: null,
            title: "",
            hide: false,
            presentation_src: null,
            presentation_id: null,
            puncts: [{ punct_id: 0, title: "", video_src: null, lection_src: null, lection_id: null, lection_title: null, test_id: null, test_title: null, practical_work: null, practical_work_task: null }]
        }
        setThemeId(id => id + 1);
        setThemesArray([...themesArray, newTheme]);
    }

    const deleteTheme = (themeIndex) => {
        setThemesArray(themesArray.filter(t => t.theme_id !== themeIndex));
        setThemeId(prev => prev - 1);
    }

    const addPunct = (themeIndex) => {
        const updatedThemes = [...themesArray];
        const theme = updatedThemes[themeIndex];
        const nextPunctId = (punctId[themeIndex] || 0) + 1;
        const newPunct = { punct_id: nextPunctId, title: "", video_src: null, lection_src: null, lection_id: null, lection_title: null, test_id: null, test_title: null, practical_work: null, practical_work_task: null };
        theme.puncts.push(newPunct);
        const newPunctId = [...punctId];
        newPunctId[themeIndex] = nextPunctId;
        setPunctId(newPunctId);
        setThemesArray(updatedThemes);
    }

    const deletePunct = (themeIndex, punctIdToDelete) => {
        const updatedThemes = [...themesArray];
        updatedThemes[themeIndex].puncts = updatedThemes[themeIndex].puncts.filter(p => p.punct_id !== punctIdToDelete);
        setThemesArray(updatedThemes);
    }

    const toggleThemeHide = (themeIndex) => {
        const updatedThemes = [...themesArray];
        updatedThemes[themeIndex].hide = !updatedThemes[themeIndex].hide;
        setThemesArray(updatedThemes);
    }

    const handleSave = async () => {
        let bool = true;
        themesArray.forEach(theme => { 
            theme.puncts.forEach(punct => {
                
                if (!punct.title) {

                    bool = false;
                }
            })
            if (!theme.title) {
                bool = false;
            }
            
        })

        if (programTitle && bool) {
            let formData = new FormData();
            formData.append("title", programTitle)
            formData.append("short_title", programShortTitle)
            formData.append("price", programPrice)
            formData.append("img", programImg)
            formData.append("admin_id", user.user.id)
            

            let number_of_test = 0;

            let prev_lection_id = 0
            themesArray.forEach(theme => {
                
                formData.append("presentation_src", theme.presentation_src)
                
                formData.append("theme_lection_src", theme.lection_src)
                
                theme.puncts.forEach(punct => {
                    formData.append("docs", punct.lection_src)
                    if (punct.lection_src) {
                        punct.lection_id = prev_lection_id
                        prev_lection_id+=1
                    } else {
                        punct.lection_id = null
                    }
                    if (punct.test_id || punct.practical_work) {
                        number_of_test++;
                    }
                })
                
                
            })
     
            formData.append("number_of_practical_work", lectionCounter)
            formData.append("number_of_test", number_of_test)
            formData.append("number_of_videos", videoCounter)
          
            formData.append("themes", JSON.stringify(themesArray))
        
            if (params.id) {
                formData.append("id", params.id)
                
                setNotActive(true);
                remakeProgram(formData).then(data => {
                 
                   
                    
                    setNotActive(false);
                    
                   
                    navigate(ADMIN_PROGRAMS_ROUTE)
                   
                }).catch(e => {
                    setNotActive(false);
                    setServerMessage(e.response.data.message)
                })
            } else {
                setNotActive(true);

                createProgram(formData)
                .then(data => {
              
                    setNotActive(false);
                    
                    
                    navigate(ADMIN_PROGRAMS_ROUTE)
                    
                })
                .catch(e => {
                    setNotActive(false);
                    console.error('Ошибка:', e)
                    setServerMessage(e.response?.data?.message)
                })
            }
        } else {
            setValidate(true);
            setServerMessage('Заполните все названия пунктов и тем!')
        }
        
        

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

    return {
        programTitle, setProgramTitle,
        programShortTitle, setProgramShortTitle,
        programPrice, setProgramPrice,
        programImg, handleImg, setProgramImg,
        themesArray, setThemesArray,
        addTheme, deleteTheme,
        addPunct, deletePunct,
        toggleThemeHide,
        themeId, punctId,
        videoCounter, setVideoCounter,
        lectionCounter, setLectionCounter,
        presentationCounter, setPresentationCounter,
        testCounter, setTestCounter,
        serverMessage, setServerMessage,
        validate, setValidate,
        notActive, setNotActive,
        handleSave, loaded, presentationSrcHandler
    }
}
