import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFile } from '../../../entities/file/api/file.api';
import UserContainer from "../../../components/ui/UserContainer";
import type { File } from "../../../entities/file/model/type";
import {FiArrowLeft, FiCheck} from "react-icons/fi";
import {getContentProgress, updateProgress} from "../../../entities/progress/api/progress.api";
import { Context } from "../../../index";

const LectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const userContext = useContext(Context);

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);
    const completedRef = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    // -----------------------------
    // Загрузка файла + in_progress
    // -----------------------------
    useEffect(() => {
        if (!id) return;

        const fetchFile = async () => {
            try {
                setLoading(true);

                const data = await getFile(id);
                setFile(data);

                const enrollmentId = userContext.user.enrollmentId;

                // 1️⃣ Проверяем существующий прогресс
                const existing = await getContentProgress(
                    data.id,
                    'file',
                    enrollmentId,
                );

                if (!existing.exists) {
                    // 2️⃣ Если нет — создаём in_progress
                    await updateProgress({
                        enrollmentId,
                        contentType: 'file',
                        contentId: data.id,
                        status: 'in_progress'
                    });
                } else {
                    // 3️⃣ Если уже completed — сразу отображаем
                    if (existing.progress.status === 'completed') {
                        setIsCompleted(true);
                        setScrollProgress(100);
                        completedRef.current = true;
                    }
                }

                window.scrollTo({ top: 0, left: 0, behavior: "auto" });

            } catch (e) {
                console.error('Ошибка загрузки файла:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchFile();
    }, [id]);


    // -----------------------------
    // Отслеживание скролла + completed
    // -----------------------------
    useEffect(() => {
        if (!file) return;

        const handleScroll = async () => {
            if (!containerRef.current || !file) return;

            const container = containerRef.current;

            const rect = container.getBoundingClientRect();

            const windowHeight = window.innerHeight;
            const containerHeight = container.offsetHeight;

            // сколько пикселей контейнера уже прошло через экран
            const visibleHeight = Math.min(
                containerHeight,
                Math.max(0, windowHeight - rect.top)
            );

            const progress = Math.min(
                100,
                Math.max(0, (visibleHeight / containerHeight) * 100)
            );

            setScrollProgress(progress);

            if (progress >= 95 && !completedRef.current) {
                completedRef.current = true;
                try {
                    const enrollmentId = userContext.user.enrollmentId;

                    await updateProgress({
                        enrollmentId,
                        contentType: 'file',
                        contentId: file.id,
                        status: 'completed'
                    });
                    console.log('отправлено')
                    setIsCompleted(true)

                } catch (e) {
                    console.error("Ошибка обновления прогресса:", e);
                }
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        handleScroll(); // чтобы сразу посчитать

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [file]);

    // -----------------------------
    // Скачать файл
    // -----------------------------
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
        return (
            <UserContainer loading={loading}>
                <div className="p-10 text-center">Загрузка...</div>
            </UserContainer>
        );
    }

    const fileUrl = `${process.env.REACT_APP_API_URL}/${file.stored_name}`;

    return (
        <UserContainer isLeftPanel={true} loading={!loading}>



            {/* Назад */}
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
                <div ref={containerRef} className="relative bg-white shadow-2xl rounded-2xl py-6 px-6 w-full flex flex-col items-center">

                    <div
                        className="absolute left-0 top-0 h-full w-2 bg-gray-200 rounded-full hidden lg:block">
                        <div
                            className={`${isCompleted?'bg-green-400':'bg-blue-600'} w-2 rounded-full transition-all duration-300 ease-out`}
                            style={{height: `${isCompleted? 100 : scrollProgress-10}%`}}
                        />
                    </div>
                    {/* Заголовок */}
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0 flex items-center">
                            {file.original_name}{isCompleted&&<FiCheck className="text-green-500 ml-4"/>}
                        </h1>

                        <div
                            onClick={() => remakeFileName(fileUrl, file.original_name)}
                            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-green-600 transition cursor-pointer"
                        >
                            Скачать файл
                        </div>
                    </div>

                    {/* Контент */}
                    <div className=" w-full flex justify-center overflow-hidden rounded-xl">

                        <div
                            className="docx-content"
                            dangerouslySetInnerHTML={{__html: file.file_asset.content}}
                        />
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
