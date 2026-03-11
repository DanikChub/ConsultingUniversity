import {
    FiHeadphones,
    FiFileText,
    FiCheck,
    FiClock,
    FiXCircle
} from "react-icons/fi"
import { AiFillFilePdf } from "react-icons/ai"
import { FaVideo } from "react-icons/fa"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { getContentStatus } from "../../../../entities/progress/model/selectors"
import type { File } from "../../../../entities/file/model/type"
import { useNavigate } from "react-router-dom"
import { LECTION_ROUTE, PDF_ROUTE, VIDEO_ROUTE } from "../../../../shared/utils/consts"
import React, { useContext, useEffect, useState } from "react"
import { Context } from "../../../../index"
import { observer } from "mobx-react-lite"

interface FileBlockProps {
    file: File
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
    isReference?: boolean
}

const FileBlockComponent = ({
                                file,
                                progress,
                                setPlayerActive,
                                setActiveAudio,
                                isReference = false
                            }: FileBlockProps) => {

    const navigate = useNavigate()
    const status = getContentStatus(progress, 'file', file.id)
    const [loading, setLoading] = useState(false)
    const userContext = useContext(Context)

    // -------------------------------------------------
    // 🔥 ПРОГРЕСС-АНИМАЦИЯ (СТАРАЯ ЛОГИКА СОХРАНЕНА)
    // -------------------------------------------------

    const changes = userContext.user.getProgressChanges(userContext.user.enrollmentId)
    const isChanged = changes.includes(`file-${file.id}`)
    const [animateStage, setAnimateStage] = useState<"idle" | "delay" | "fill">("idle")
    const [highlight, setHighlight] = useState(false)
    useEffect(() => {
        if (isChanged && status === "completed") {

            setAnimateStage("delay")

            const delayTimer = setTimeout(() => {
                setAnimateStage("fill")
            }, 300)

            const resetTimer = setTimeout(() => {
                setAnimateStage("idle")
            }, 1200)

            return () => {
                clearTimeout(delayTimer)
                clearTimeout(resetTimer)
            }
        }
    }, [isChanged, status])

    // -------------------------------------------------
    // ⭐ LAST OPENED ЛОГИКА (НОВАЯ)
    // -------------------------------------------------

    const lastOpened = userContext.user.getLastOpened(userContext.user.enrollmentId)

    const isLast =
        lastOpened?.type === "file" &&
        lastOpened?.id === file.id



    useEffect(() => {
        if (isLast) {
            setHighlight(true)

            const timer = setTimeout(() => {
                setHighlight(false)
            }, 4000)

            return () => clearTimeout(timer)
        }
    }, [isLast])

    // -------------------------------------------------
    // CLICK
    // -------------------------------------------------

    const handleClick = async () => {
        if (loading) return
        setLoading(true)

        userContext.user.setLastOpened(userContext.user.enrollmentId, {
            type: 'file',
            id: file.id,
            themeId: file.themeId,
            punctId: file.punctId
        })

        if (file.type === 'audio') {
            setPlayerActive(true)
            setActiveAudio(file)
        }

        if (file.type === 'docx') {
            navigate(LECTION_ROUTE.replace(':id', `${file.id}`))
        }

        if (file.type === 'pdf') {
            navigate(PDF_ROUTE.replace(':id', `${file.id}`))
        }

        if (file.type === 'video') {
            navigate(VIDEO_ROUTE.replace(':id', `${file.id}`))
        }

        setLoading(false)
    }

    // -------------------------------------------------
    // ИКОНКА
    // -------------------------------------------------

    const fileIcon = (() => {
        switch (file.type) {
            case "audio":
                return <FiHeadphones className="text-blue-500" />
            case "docx":
                return <FiFileText className="text-green-500" />
            case "pdf":
                return <AiFillFilePdf className="text-red-500" />
            case "video":
                return <FaVideo className="text-blue-500" />
            default:
                return <FiFileText className="text-gray-500" />
        }
    })()

    // -------------------------------------------------
    // СТАТУС СТИЛИ
    // -------------------------------------------------

    const statusStyles: Record<string, string> = {
        not_started:
            "bg-white hover:bg-gray-50 border border-gray-100",
        in_progress:
            "bg-blue-50 hover:bg-blue-100 border border-blue-100",
        completed:
            "bg-green-50 hover:bg-green-100 border border-green-100",
        failed:
            "bg-red-50 hover:bg-red-100 border border-red-100"
    }

    const renderStatus = () => {
        switch (status) {
            case "in_progress":
                return (
                    <div className="flex items-center text-blue-600">
                        <FiClock />
                        <span className="ml-2 text-sm font-light">
                            В процессе
                        </span>
                    </div>
                )

            case "completed":
                return (
                    <div className="flex items-center text-green-600">
                        <FiCheck />
                        {!isReference && (
                            <span className="ml-2 text-sm font-light">
                                {file.type === 'audio'
                                    ? 'Прослушано'
                                    : 'Прочитано'}
                            </span>
                        )}
                    </div>
                )

            case "failed":
                return (
                    <div className="flex items-center text-red-600">
                        <FiXCircle />
                        <span className="ml-2 text-sm font-light">
                            Не пройдено
                        </span>
                    </div>
                )

            default:
                return null
        }
    }

    // -------------------------------------------------
    // RENDER
    // -------------------------------------------------

    return (
        <div
            id={`file-${file.id}`}
            onClick={handleClick}
            className={`
                relative overflow-hidden flex items-center justify-between p-4 rounded-xl 
                cursor-pointer transition-all duration-500 shadow-sm active:scale-[0.98]
                
                ${animateStage !== "idle" ? "progress-pop" : ""}
                ${animateStage === "idle" ? statusStyles[status] : ""}
                ${isReference ? "max-w-max space-x-4" : ""}
                
                ${highlight ? "ring-2 ring-blue-200 shadow-lg scale-[1.01]" : ""}
            `}
        >


            {/* completion анимация */}
            {animateStage === "fill" && (
                <div className="absolute inset-0 bg-green-100 progress-fill z-0" />
            )}

            <div className="relative flex items-center gap-3 text-gray-700 z-10">
                {fileIcon}
                <span>{file.original_name}</span>

                {highlight && (
                    <span className="ml-3 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
                        Вы остановились здесь
                    </span>
                )}
            </div>

            {animateStage === "idle" && (
                <div className="relative z-10 progress-status">
                    {renderStatus()}
                </div>
            )}
        </div>
    )
}

const FileBlock = observer(FileBlockComponent)
export default FileBlock
