import React, { useEffect } from 'react';


import './AddTask.css'

const AddTask = ({show, setShow, setMakeOpen, openModal}) => {



    return (
        <div className={show.show?"modal show": "modal"}>
            <div className='modal_container add_task'>
                <button onClick={() => setShow({
                                                        show: false, 
                                                        i:0,
                                                        j:0, 
                                                        value: '',
                                                        tasks: [
                                                            '',
                                                            '',
                                                            '',
                                                            '',
                                                            '',
                                                            
                                                            
                                                            
                                                        ]
                                                    })} className='modal_button'>x</button>
                
                {
                    show?.tasks[0] == 'test' &&
                    <div className='add_task_button' onClick={() => setMakeOpen('test', show.i, show.j)}>Добавить тест</div>
                }
                
                {
                    show?.tasks[1] == 'presentation' &&
                    <div>
                        <input id='theme_presentation' className='MakeProgram_Punct_Material_input' onChange={(e) => setMakeOpen('presentation', show.i, show.j, e.target.files[0])} accept='.pdf'  type="file"/>                                                    
                        <label className='add_task_button' htmlFor='theme_presentation' >Добавить презентацию</label>
                    </div>
                }

                {
                    show?.tasks[2] == 'practical_work' &&
                    <div className='add_task_button' onClick={() => setMakeOpen('practical_work', show.i, show.j)}>Добавить практическую работу</div>
                }

                
                {
                    show?.tasks[3] == 'lection' &&
                    <div>
                        <input id='punct_lection' className='MakeProgram_Punct_Material_input' onChange={(e) => setMakeOpen('lection', show.i, show.j, e.target.files[0])} accept='.docx'  type="file"/>                                                    
                        <label className='add_task_button' htmlFor='punct_lection' >Добавить лекцию</label>
                    </div>
                }

                {
                    show?.tasks[4] == 'video' &&
                    <div className='add_task_button' onClick={() => setMakeOpen('video', show.i, show.j)}>Добавить видео</div>
                }
                

                

                
                
            </div>
        </div>
    );
};

export default AddTask;