import {FiCheckCircle, FiClock, FiXCircle} from "react-icons/fi"
import { Link } from "react-router-dom"
import {TEST_OVERVIEW_ROUTE, TEST_ROUTE} from "../../../../shared/utils/consts"
import type { Punct } from "../../../../entities/punct/model/type"
import FileBlock from "./FileBlock"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import {getContentStatus, isContentCompleted} from "../../../../entities/progress/model/selectors"
import type {File} from "../../../../entities/file/model/type";

interface PunctBlockProps {
    punct: Punct
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
}

const PunctBlock = ({ punct, progress, setPlayerActive, setActiveAudio }: PunctBlockProps) => {

    const allItemsCount =
        (punct.files?.length || 0) +
        (punct.tests?.length || 0)

    let completedCount = 0

    punct.files?.forEach(file => {
        if (isContentCompleted(progress, 'file', file.id)) completedCount++
    })

    punct.tests?.forEach(test => {
        if (isContentCompleted(progress, 'test', test.id)) completedCount++
    })

    const isPunctCompleted =
        allItemsCount > 0 && completedCount === allItemsCount

    return (
        <div className="space-y-3">

            <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">
                    {punct.title}
                </h4>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {completedCount} / {allItemsCount}
                    {isPunctCompleted && (
                        <FiCheckCircle className="text-green-500" />
                    )}
                </div>
            </div>

            <div className="space-y-2 pl-4 border-l border-gray-200">
                {punct.files?.map(file => (
                    <FileBlock
                        key={file.id}
                        file={file}
                        progress={progress}
                        setPlayerActive={setPlayerActive}
                        setActiveAudio={setActiveAudio}
                    />
                ))}

                {punct.tests?.map(test => {
                    const status = getContentStatus(progress, 'test', test.id)

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
                                        <FiCheckCircle />
                                        <span className="ml-2 text-sm font-light">
                            Пройден
                        </span>
                                    </div>
                                )

                            case "failed":
                                return (
                                    <div className="flex items-center text-red-600">
                                        <FiXCircle />
                                        <span className="ml-2 text-sm font-light">
                            Не пройден
                        </span>
                                    </div>
                                )

                            default:
                                return null
                        }
                    }

                    return (
                        <Link
                            key={test.id}
                            to={TEST_OVERVIEW_ROUTE.replace(':id', `${test.id}`)}
                            className={`flex items-center justify-between p-3 rounded-xl transition shadow-sm ${
                                statusStyles[status]
                            }`}
                        >
                            <div className="flex items-center gap-3 text-gray-700">
                                <span>🧪</span>
                                <span>Тест</span>
                            </div>

                            {renderStatus()}
                        </Link>
                    )
                })}

            </div>
        </div>
    )
}

export default PunctBlock
