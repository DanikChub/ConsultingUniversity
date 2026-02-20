import { FiCheckCircle } from "react-icons/fi"
import { Link } from "react-router-dom"
import {TEST_OVERVIEW_ROUTE, TEST_ROUTE} from "../../../../shared/utils/consts"
import type { Punct } from "../../../../entities/punct/model/type"
import FileBlock from "./FileBlock"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { isContentCompleted } from "../../../../entities/progress/model/selectors"

interface PunctBlockProps {
    punct: Punct
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: string) => void
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
                    const completed =
                        isContentCompleted(progress, 'test', test.id)

                    return (
                        <Link
                            key={test.id}
                            to={TEST_OVERVIEW_ROUTE.replace(':id', `${test.id}`)}
                            className={`flex items-center justify-between p-3 rounded-xl transition shadow-sm ${
                                completed
                                    ? "bg-green-50 hover:bg-green-100"
                                    : "bg-blue-50 hover:bg-blue-100"
                            }`}
                        >
                            <span>🧪 Тест</span>
                            {completed && <FiCheckCircle className="text-green-500" />}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default PunctBlock
