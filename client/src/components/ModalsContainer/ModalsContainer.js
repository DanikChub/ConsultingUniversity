// components/ModalsContainer.jsx
import React from 'react';
import AddTask from '../AddTask/AddTask';
import CreateVideo from '../CreateVideo/CreateVideo';
import CreateTest from '../CreateTest/CreateTest';
import CreatePracticalWork from '../CreatePracticalWork/CreatePracticalWork';

const ModalsContainer = ({ modals, setModals, themesArray, setThemesArray, setCounter, allAddHandler, openModal }) => {
    const modalProps = { themesArray, setThemesArray };

    

    return (
        <>
            <AddTask show={modals.addTask} setShow={(payload) => setModals(prev => ({ ...prev, addTask: payload }))} setMakeOpen={allAddHandler}/>
            <CreateVideo show={modals.video} setShow={(payload) => setModals(prev => ({ ...prev, video: payload }))} {...modalProps} setCounter={setCounter.video} />
            <CreateTest show={modals.test} setShow={(payload) => setModals(prev => ({ ...prev, test: payload }))} {...modalProps} setCounter={setCounter.test} />
            <CreatePracticalWork show={modals.practicalWork} setShow={(payload) => setModals(prev => ({ ...prev, practicalWork: payload }))} {...modalProps} setCounter={setCounter.practicalWork} />
        </>
    )
}

export default ModalsContainer;
