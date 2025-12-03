import React, { useEffect, useState } from 'react';

const ProgramHeader = ({ programTitle, setProgramTitle, programShortTitle, setProgramShortTitle, programPrice, setProgramPrice, programImg, handleImg, setProgramImg }) => {
    const [preview, setPreview] = useState(null);

    const handleImageChange = (e) => {
        const url = handleImg(e.target.files[0]);
        setPreview(url);
        
    }

    const handleImageDelete = () => {
        setPreview(null)
        setProgramImg(null)
    }
    
    return (
        <div className='MakeProgramContainer'>
            <div className='MakeProgramInputs_group'>
                <label>Краткое название:</label>
                <input className='MakeProgramInput' value={programShortTitle} onChange={e => setProgramShortTitle(e.target.value)} />
            </div>
            <div className='MakeProgramInputs_group'>
                <label>Цена:</label>
                <input className='MakeProgramInput' value={programPrice} onChange={e => setProgramPrice(e.target.value)} />
            </div>
            <div className='MakeProgramInputs_group'>
                <label>Картинка: </label>
                <input id='add_img' className='MakeProgram_Punct_Material_input' onChange={(e => handleImageChange(e))}  type='file' accept='.png'/>
                {preview || programImg ? (
                    <div className='relative h-[200px] w-[max-content]'>
                        <button className='MakeProgramInputs_group_preview_delete' onClick={() => handleImageDelete()}>x</button>
                        
                          
                        <img 
                            src={preview || `${process.env.REACT_APP_API_URL + programImg}`} 
                            alt="preview"
                            className='abolute h-full w-full object-contain'
                        />
                        
                    </div>
                    
                ) : (
                    <label htmlFor='add_img' className='MakeProgramInputs_group_label'>Выбрать файл</label>
                )}
            </div>
            <hr className='MakeProgram_hr'/>
            <div className='MakeProgramInputs_group long'>
                <label>Название:</label>
                <input  className='MakeProgramInput' value={programTitle} onChange={e => setProgramTitle(e.target.value)} />
            </div>
        </div>
    )
}

export default ProgramHeader;
