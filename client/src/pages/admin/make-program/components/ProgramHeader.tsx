import React, { useEffect, useState } from 'react';
import type {Program} from "../../../../entities/program/model/type";
import {useModals} from "../../../../hooks/useModals";

import {NumericFormat} from 'react-number-format';
import {useDropzone} from "react-dropzone";


type Props = {
    program: Program;
    onChange: (field: keyof Program, value: any) => void;
    updateProgramImage: (file: File) => void;
    deleteProgramImage: () => void;
    onImportProgram: () => void;

};

const ProgramHeader: React.FC<Props> = ({
                                            program,
                                            onChange,
                                            updateProgramImage,
                                            deleteProgramImage,
                                            onImportProgram,

    }) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        multiple: false,
        accept: { 'image/*': [] },
        onDrop: (files) => handleImageChange(files[0]),
    });

    useEffect(() => {
        if (program.img && typeof program.img === 'string') {
            setPreview(`${process.env.REACT_APP_API_URL}${program.img}`);
        }
    }, [program.img]);



// Обновление картинки — сразу на сервер
    const handleImageChange = async (file?: File) => {
        if (!file) return;

        // Локальный превью пока загружается
        const url = URL.createObjectURL(file);
        setPreview(url);
        setIsUploading(true); // показываем загрузку

        try {
            const fetchImg = await updateProgramImage(file); // сохраняем на сервере
            setPreview(fetchImg.img); // заменяем локальный превью на серверный
        } catch (err) {
            console.error("Ошибка загрузки картинки:", err);
            setPreview(program.img ? `${process.env.REACT_APP_API_URL}${program.img}` : null);
        } finally {
            setIsUploading(false); // скрываем индикатор
        }
    };

    // Удаление картинки — сразу на сервер
    const handleImageDelete = async (e) => {
        e.stopPropagation()
        setPreview(null);

        try {
            await deleteProgramImage(); // удаляем на сервере
        } catch (err) {
            console.error("Ошибка удаления картинки:", err);
            setPreview(program.img ? `${process.env.REACT_APP_API_URL}${program.img}` : null);
        }
    };

    const { openModal } = useModals();





    return (
        <div className="mt-12 relative">
            {/* Верхняя панель: можно добавить заголовок слева и кнопку справа */}
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-semibold text-[#2C3E50]">Редактирование программы</h2>

                <button
                    type="button"
                    onClick={onImportProgram} // функция для открытия модалки импорта
                    className="bg-[#33CCCC] hover:bg-[#2C3E50] text-white font-medium py-2 px-5 text-sm rounded-lg transition-colors"
                >
                    Импортировать программу
                </button>
            </div>



            <div className="mt-5 w-full py-6 px-6 border border-gray-200 rounded-lg bg-white shadow-sm  transition-shadow">

                {/* Краткое название */}
                <div className="grid grid-cols-[1fr_6fr] items-center">
                    <label className="text-right mr-3 font-semibold text-[#2C3E50] text-base">Краткое название:</label>
                    <input
                        className="flex-1 bg-transparent text-gray-800 text-md placeholder-gray-400 outline-none focus:border-b-1 focus:border-blue-500 transition-all border-b border-gray-300 py-1"
                        value={program.short_title || ''}
                        onChange={e => onChange('short_title', e.target.value)}
                        placeholder="Введите краткое название"
                    />
                </div>

                {/* Цена */}
                <div className="mt-5 grid grid-cols-[1fr_6fr] items-center">
                    <label className="text-right mr-3 font-semibold text-[#2C3E50] text-base">Цена:</label>
                    <NumericFormat
                        className="flex-1 bg-transparent text-gray-800 text-md placeholder-gray-400 outline-none border-b border-gray-300 py-1 focus:border-blue-500 transition-all"
                        value={program.price || ''}
                        thousandSeparator=" "
                        suffix=" ₽"
                        placeholder="Введите цену"
                        onValueChange={(values) => {
                            const { value } = values; // чистое число без форматирования
                            onChange('price', value);
                        }}
                    />
                </div>

                {/* Картинка */}
                {/* Картинка */}
                <div className="mt-5 grid grid-cols-[1fr_6fr]">
                    <label className="text-right mr-3 font-semibold text-[#2C3E50] text-base">
                        Картинка:
                    </label>
                    <div
                        {...getRootProps()}
                        className=' w-[350px]'
                    >
                        <input {...getInputProps()} />

                        {preview ? (
                            <div className="relative h-[200px] w-[350px] rounded-xl overflow-hidden shadow-lg group transition-all duration-300 flex items-center justify-center bg-gray-100">
                                <img
                                    src={preview}
                                    alt="preview"
                                    className={`h-full w-full object-cover transition-transform duration-300 ${isUploading ? 'blur-sm' : 'group-hover:scale-105'}`}
                                />

                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}

                                {!isUploading && (
                                    <button
                                        type="button"
                                        onClick={handleImageDelete}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md opacity-80 hover:opacity-100 transition-all duration-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                                            <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <label
                                className={`flex items-center justify-center h-[200px] w-[350px] border-2 border-dashed ${!isDragActive ? 'border-gray-300 text-gray-500' : ''} rounded-xl  cursor-pointer hover:border-blue-500 hover:text-blue-500 transition-colors duration-200 ${
                                    isDragActive ? 'border-blue-500 text-blue-500' : ''
                                }`}
                            >
                                {isDragActive ? 'Отпустите файл здесь...' : 'Выбрать файл или перетащить сюда'}
                            </label>
                        )}
                    </div>
                </div>


            </div>


            {/* Название */}
            <div className="mt-5 flex items-center">
                <label className="text-right mr-3 font-semibold text-[#2C3E50] text-base">Название:</label>
                <input
                    className="flex-1 bg-transparent text-gray-800 text-md placeholder-gray-400 outline-none focus:border-b-1 focus:border-blue-500 transition-all border-b border-gray-300 py-1"
                    value={program.title || ''}
                    onChange={e => onChange('title', e.target.value)}
                    placeholder="Введите название"
                />
            </div>
        </div>


    );
};

export default ProgramHeader;
