import React, { useEffect, useState } from "react"
import {useNavigate, useParams} from "react-router-dom"
import { Document, Page, pdfjs } from "react-pdf"
import {getFile} from "../../../entities/file/api/file.api";
import UserContainer from "../../../components/ui/UserContainer";
import {COURSE_ROUTE, USER_ROUTE} from "../../../shared/utils/consts";
import {FiArrowLeft} from "react-icons/fi";

// Используем CDN воркер — гарантировано работает
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface FileDto {
    id: number
    original_name: string
    stored_name: string
    type: string
}

const PdfPage = () => {
    const { id } = useParams()

    const [file, setFile] = useState<FileDto | null>(null)
    const [numPages, setNumPages] = useState(0)
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        if (!id) return

        getFile(id)
            .then(data => {
                setFile(data)
            })
            .catch(err => {
                console.error(err)
            })
    }, [id])

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages)
        setLoading(false)
    }
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
        return <div className="p-6">Загрузка файла...</div>
    }

    const fileUrl = `${process.env.REACT_APP_API_URL}/${file.stored_name}`

    const progressPercent = ((pageNumber / numPages) * 100).toFixed(0)
    return (
        <UserContainer loading={true}>
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
                            Скачать PDF
                        </div>
                    </div>

                    {/* Прогресс бар */}
                    <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                        <div
                            className="bg-blue-500 h-3 rounded-full transition-all"
                            style={{width: `${progressPercent}%`}}
                        />
                    </div>

                    {/* Навигация */}
                    <div className="flex justify-between items-center w-full mb-6">
                        <button
                            disabled={pageNumber <= 1}
                            onClick={() => setPageNumber(p => p - 1)}
                            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            ← Назад
                        </button>

                        <span className="text-sm text-gray-700 font-medium">
            Страница {pageNumber} из {numPages} ({progressPercent}%)
          </span>

                        <button
                            disabled={pageNumber >= numPages}
                            onClick={() => setPageNumber(p => p + 1)}
                            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            Вперед →
                        </button>
                    </div>

                    {/* PDF */}
                    <div className="w-full flex justify-center overflow-hidden rounded-xl">
                        <Document
                            file={fileUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div className="text-gray-500">Загрузка PDF...</div>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                width={Math.min(1200, window.innerWidth - 80)}
                            />
                        </Document>
                    </div>

                    {loading && (
                        <div className="mt-6 text-gray-500 text-center animate-pulse">
                            Загружаем документ...
                        </div>
                    )}
                </div>
            </div>
            <button
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                onClick={() => navigate(-1)}
            >
                Назад
            </button>
        </UserContainer>

    )
}

export default PdfPage
