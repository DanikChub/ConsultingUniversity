import React, {useContext, useEffect, useRef, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"

import {getFile} from "../../../entities/file/api/file.api";
import UserContainer from "../../../components/ui/UserContainer";

import {getContentProgress, updateProgress} from "../../../entities/progress/api/progress.api";
import {Context} from "../../../index";
import ButtonBack from "../../../shared/ui/buttons/ButtonBack";
import {FiCheck} from "react-icons/fi";
import type {File} from "../../../entities/file/model/type";
import VimeoPlayer from "./components/VimeoPlayer";



const VideoPage = () => {
    const { id } = useParams()

    const [file, setFile] = useState<File | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [loading, setLoading] = useState(false)
    const userContext = useContext(Context);
    const navigate = useNavigate()
    const [isCompleted, setIsCompleted] = useState(false)

    const completedRef = useRef(false)


    useEffect(() => {
        if (!id) return

        const fetchFile = async () => {
            try {
                setLoading(false)

                const data = await getFile(id)
                setFile(data)

                const enrollmentId = userContext.user.enrollmentId

                // 🔎 Проверяем существующий прогресс
                const existing = await getContentProgress(
                    data.id,
                    "file",
                    enrollmentId
                )

                if (!existing.exists) {
                    await updateProgress({
                        enrollmentId,
                        contentType: "file",
                        contentId: data.id,
                        status: "in_progress"
                    })
                } else {
                    if (existing.progress.status === "completed") {
                        setIsCompleted(true)
                        completedRef.current = true
                    }
                }

                window.scrollTo({ top: 0, left: 0, behavior: "auto" })
            } catch (e) {
                console.error("Ошибка загрузки файла:", e)
            } finally {
                setLoading(true)
            }
        }

        fetchFile()
    }, [id])


    const markCompleted = async () => {
        try {
            completedRef.current = true // ставим ДО await

            const enrollmentId = userContext.user.enrollmentId

            await updateProgress({
                enrollmentId,
                contentType: "file",
                contentId: file.id,
                status: "completed"
            })

            setIsCompleted(true)
        } catch (e) {
            completedRef.current = false
            console.error("Ошибка обновления прогресса:", e)
        }
    }



    if (!file) return <UserContainer>Загрузка...</UserContainer>

    const match = file.url.match(/vimeo\.com\/(\d+)/);
    const videoId = match[1]
    return (
        <UserContainer isLeftPanel={true} loading={loading}>
            <ButtonBack/>
            <div className="min-h-[787px] flex flex-col items-center py-8">
                <div className="bg-white shadow-2xl rounded-2xl py-6 px-6 w-full flex flex-col items-center">

                    {/* Заголовок документа */}
                    <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-3 md:mb-0 flex items-center">
                            {file.original_name}{isCompleted && <FiCheck className="text-green-500 ml-4"/>}
                        </h1>


                    </div>
                    <VimeoPlayer videoId={videoId} onComplete={markCompleted}/>


                </div>
            </div>

        </UserContainer>

    )
}

export default VideoPage
