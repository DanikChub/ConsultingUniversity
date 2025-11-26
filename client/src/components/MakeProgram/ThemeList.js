import React from 'react';
import Button from '../ui/Button';
import ThemeItem from './ThemeItem';

const ThemeList = ({ themesArray, setThemesArray, addTheme, deleteTheme, addPunct, deletePunct, toggleThemeHide, setShowAddTask, openModal, setPresentationCounter, presentationSrcHandler }) => {
    return (
        <div className='MakeProgram_Themes'>
            {themesArray.map((theme, i) => (
                <ThemeItem
                    key={i}
                    theme={theme}
                    i={i}
                    themesArray={themesArray}
                    setThemesArray={setThemesArray}
                    deleteTheme={deleteTheme}
                    addPunct={addPunct}
                    deletePunct={deletePunct}
                    toggleThemeHide={toggleThemeHide}
                    setShowAddTask={setShowAddTask}
                    openModal={openModal}
                    setPresentationCounter={setPresentationCounter}
                    presentationSrcHandler={presentationSrcHandler}
                />
            ))}
            <Button className='mt-4 ml-[57px]' onClick={addTheme}>Добавить модуль</Button>
        </div>
    )
}

export default ThemeList;