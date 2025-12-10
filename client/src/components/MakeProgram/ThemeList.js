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
            <button command="show-modal" commandfor="dialog"
                    className="rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20">Open
                dialog
            </button>

        </div>
    )
}

export default ThemeList;