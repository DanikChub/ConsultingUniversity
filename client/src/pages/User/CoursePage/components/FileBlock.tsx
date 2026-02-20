import { FiHeadphones, FiFileText, FiCheck } from "react-icons/fi"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { isContentCompleted } from "../../../../entities/progress/model/selectors"
import type { File } from "../../../../entities/file/model/type"
import { useNavigate } from "react-router-dom"
import {LECTION_ROUTE, PDF_ROUTE} from "../../../../shared/utils/consts"
import { updateProgress } from "../../../../entities/progress/api/progress.api"
import {useContext, useState} from "react"
import {AiFillFilePdf} from "react-icons/ai";
import {Context} from "../../../../index";

interface FileBlockProps {
    file: File
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: string) => void
    isReference: boolean
}

const FileBlock = ({ file, progress, setPlayerActive, setActiveAudio, isReference=false }: FileBlockProps) => {

    const navigate = useNavigate()
    const completed = isContentCompleted(progress, 'file', file.id)
    const [loading, setLoading] = useState(false)
    const userContext = useContext(Context);

    const handleClick = async () => {
        if (loading) return
        setLoading(true)
        const enrollmentId = userContext.user.enrollmentId;
        try {
            await updateProgress({
                enrollmentId,
                contentType: 'file',
                contentId: file.id,
                status: 'completed'
            })
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }

        if (file.type == 'audio') {
            setPlayerActive(true)
            setActiveAudio(file.stored_name)
        }

        if (file.type == 'docx') {
            navigate(LECTION_ROUTE.replace(':id', `${file.id}`))
        }

        if (file.type == 'pdf') {
            navigate(PDF_ROUTE.replace(':id', `${file.id}`))
        }
    }

    const icon = (() => {
        switch (file.type) {
            case "audio":
                return <FiHeadphones className="text-blue-500" />
            case "docx":
                return <FiFileText className="text-green-500" />
            case "pdf":
                return <AiFillFilePdf className="text-red-500" />
            default:
                return <FiFileText className="text-gray-500" />
        }
    })()

    return (
        <div
            onClick={handleClick}
            className={!isReference ?`flex items-center justify-between p-4 rounded-xl cursor-pointer transition shadow-sm ${
                completed
                    ? "bg-green-50 hover:bg-green-100"
                    : "bg-white hover:bg-gray-50 border border-gray-100"
            }`:
                `flex items-center justify-between p-4 space-x-4 max-w-max rounded-xl cursor-pointer transition shadow-sm ${
                    completed
                        ? "bg-green-50 hover:bg-green-100"
                        : "bg-white hover:bg-gray-50 border border-gray-100"
                }`
            }
        >
            <div className="flex items-center gap-3 text-gray-700">
                {icon}
                <span>{file.original_name}</span>
            </div>

            {completed && (
                <div className="flex items-center">
                    <FiCheck className="text-green-500" />
                    {
                        !isReference &&
                        <span className="text-green-500 ml-2 font-light text-sm">{file.type == 'audio' ? 'Прослушано' : 'Прочитано'}</span>
                    }

                </div>

            )}
        </div>
    )
}

export default FileBlock
