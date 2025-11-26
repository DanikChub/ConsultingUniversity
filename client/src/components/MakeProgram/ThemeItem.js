import React from 'react';
import PunctItem from './PunctItem';
import ButtonAdd from '../ButtonAdd/ButtonAdd';

import pdf from "../../assets/imgs/pdf.png"
import Button from '../ui/Button';

const ThemeItem = ({ theme, i, themesArray, setThemesArray, deleteTheme, addPunct, deletePunct, toggleThemeHide, setShowAddTask, openModal, setPresentationCounter, presentationSrcHandler}) => {


    const handleDeletePresentation = (i) => {
        const valueNew = [...themesArray]
    

  
        setPresentationCounter(prev => prev-1)
        
        valueNew[i].presentation_src = null;
        valueNew[i].presentation_title = ''; 
        
        setThemesArray(valueNew);
    }

    return (
        <div className='MakeProgram_Theme'>
            <div className='MakeProgram_Theme_Title'>
                {
                    theme.presentation_src&&
                    <div className='MakeProgram_Punct_Material'>
                        <button className='MakeProgram_Punct_Material_delete' onClick={() => handleDeletePresentation(i)}>x</button>
                        <input id={i} onChange={(e ) => presentationSrcHandler(i, e.target.files[0])} accept='.pdf' className='MakeProgram_Punct_Material_input'  type="file"/>
                        <label htmlFor={i} className='MakeProgram_Punct_Material_Plus'><img height={'22px'} src={pdf}/></label>
                        
                    </div>
                }
                                        
                <ButtonAdd onClick={() => setShowAddTask(
                    {
                        show: true, 
                        i,
                        j:0, 
                        value: '',
                        tasks: [
                            '',
                            'presentation',
                            '',
                            '',
                            '',
                            
                            
                            
                        ]
                    }
                )}/>
                <svg onClick={() => toggleThemeHide(i)} width="16" height="11" viewBox="0 0 16 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14.8633 0.952148L8.11989 9.74902" stroke="#898989" stroke-opacity="0.78" stroke-width="2" stroke-linecap="round"/>
                    <path d="M1.04688 1.31543L7.85366 9.63645" stroke="#898989" stroke-opacity="0.78" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                
                <b>Модуль {i + 1}: </b>
                <input 
                    className='MakeProgramInput'
                    value={theme.title} 
                    onChange={e => {
                        const arr = [...themesArray];
                        arr[i].title = e.target.value;
                        setThemesArray(arr);
                    }} 
                />
                {/* <button onClick={() => toggleThemeHide(i)}>Toggle</button>
                <button onClick={() => deleteTheme(theme.theme_id)}>Удалить модуль</button> */}
            </div>
            {!theme.hide && (
                <div className='MakeProgram_Theme_Puncts'>
                    {theme.puncts.map((punct, j) => (
                        <PunctItem
                            key={j}
                            punct={punct}
                            i={i}
                            j={j}
                            themesArray={themesArray}
                            setThemesArray={setThemesArray}
                            deletePunct={deletePunct}
                            setShowAddTask={setShowAddTask}
                            openModal={openModal}
                        />
                    ))}
                    <Button  onClick={() => addPunct(i)} className='ml-[100px] mt-4' >Добавить тему</Button>
                </div>
            )}
        </div>
    )
}

export default ThemeItem;