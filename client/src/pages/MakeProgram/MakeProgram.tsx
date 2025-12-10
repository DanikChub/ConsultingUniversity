import React from 'react';
import { useProgramForm } from '../../hooks/useProgramForm';
import { useModals } from '../../hooks/useModals';
import { handleAddTask } from '../../utils/handlers';
import LeftMenu from '../../components/LeftMenu/LeftMenu';
import ProgramHeader from '../../components/MakeProgram/ProgramHeader';
import ThemeList from '../../components/MakeProgram/ThemeList';
import ModalsContainer from '../../components/ModalsContainer/ModalsContainer';

import './MakeProgram.css'
import AppContainer from '../../components/ui/AppContainer';
import LoadingAlert from "../../components/ui/LoadingAlert";

const MakeProgram = () => {
    const form = useProgramForm();
    const { modals, openModal, closeModal, setModals } = useModals();

   
    return (
        <AppContainer>
            {
                form.loaded &&
                    <>
                        <ProgramHeader {...form} />
                        <ThemeList {...form} setShowAddTask={(payload) => openModal('addTask', payload)} openModal={openModal} />
                        <div className='login_form_message'>{form.serverMessage}</div>
                        <div className='button_container'>
                            <div onClick={form.handleSave} className='admin_button'>Сохранить</div>

                        </div>

                    </>



            }
            <LoadingAlert show={!form.saveLoaded}/>

            <ModalsContainer 
                modals={modals} 
                setModals={setModals} 
                openModal={openModal}
                themesArray={form.themesArray} 
                setThemesArray={form.setThemesArray} 
                setCounter={{ video: form.setVideoCounter, test: form.setTestCounter, practicalWork: form.setTestCounter }}
                allAddHandler={(makeOpen, i, j, value) => handleAddTask({ makeOpen, i, j, value, themesArray: form.themesArray, setThemesArray: form.setThemesArray, openModal, closeModal, presentationSrcHandler: form.presentationSrcHandler })}
                
            />
        </AppContainer>
                    
     
    )
}

export default MakeProgram;
