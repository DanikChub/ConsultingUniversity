import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getFile } from '../../../entities/file/api/file.api';
import downloadIcon from "../../../assets/imgs/download.png";

import './LectionPage.css';
import UserContainer from "../../../components/ui/UserContainer";
import type {File} from "../../../entities/file/model/type";
import {FiArrowLeft} from "react-icons/fi";

// Тип для файла лекции


const LectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [queryParams] = useSearchParams();
    const navigate = useNavigate();

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchFile = async () => {
            try {
                setLoading(false);
                const data = await getFile(id);

                setFile(data);
                window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
            } catch (e) {
                console.error('Ошибка загрузки файла:', e);
            } finally {
                setLoading(true);
            }
        };

        fetchFile();
    }, [id]);

    // Функция для скачивания файла с переименованием
    const remakeFileName = (url: string, newName: string) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            const blob = this.response;
            const link = document.createElement("a");
            link.style.display = "none";
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", newName);
            link.click();
        };
        xhr.send();
    };



    if (!file) {
        return <UserContainer loading={loading}>
            <div className="p-10 text-center">Загрузка...</div>
        </UserContainer>;
    }

    const fileUrl = `${process.env.REACT_APP_API_URL}/${file.stored_name}`

    return (
        <UserContainer loading={loading}>
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition group"
            >
                <div className="p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition">
                    <FiArrowLeft size={20}/>
                </div>
                <span className="text-lg font-medium">Назад</span>
            </button>
            <div className="min-h-[787px] flex flex-col items-center py-8">
                <div className="bg-white shadow-2xl rounded-2xl py-6 px-6 w-full flex flex-col items-center">

                    {/* Заголовок документа */}
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0">
                            {file.original_name}
                        </h1>

                        <div
                            onClick={() => remakeFileName(fileUrl, file.original_name)}
                            className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
                        >
                            Скачать файл
                        </div>
                    </div>


                    {/* PDF */}
                    <div className="w-full flex justify-center overflow-hidden rounded-xl">
                        <div className="docx-content" dangerouslySetInnerHTML={{__html: file.file_asset.content}}/>
                    </div>


                </div>
            </div>
            <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => navigate(-1)}
            >
                Назад
            </button>
        </UserContainer>
    );
};

export default LectionPage;
