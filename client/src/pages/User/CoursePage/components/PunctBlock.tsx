import {FiCheckCircle, FiClock, FiXCircle} from "react-icons/fi"
import { Link } from "react-router-dom"
import {TEST_OVERVIEW_ROUTE, TEST_ROUTE} from "../../../../shared/utils/consts"
import type { Punct } from "../../../../entities/punct/model/type"
import FileBlock from "./FileBlock"

import type { ProgramProgress } from "../../../../entities/progress/model/type"
import {getContentStatus, isContentCompleted} from "../../../../entities/progress/model/selectors"
import type {File} from "../../../../entities/file/model/type";
import TestBlock from "./TestBlock";

interface PunctBlockProps {
    punct: Punct
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
    allRegularCompleted: boolean;
}

const PunctBlock = ({ punct, progress, setPlayerActive, setActiveAudio, allRegularCompleted }: PunctBlockProps) => {

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

            <div className="flex items-start justify-between gap-4">
                <div>
                    <h4 className="font-semibold text-gray-800">
                        {punct.title}
                    </h4>

                    {punct.description && (
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                            {punct.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                    {completedCount} / {allItemsCount}
                    {isPunctCompleted && (
                        <FiCheckCircle className="text-green-500"/>
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

                    const isFinal = test.final_test

                    // 🔥 финальный тест блокируем если обычные не завершены
                    const locked = isFinal && !allRegularCompleted

                    return (
                        <TestBlock
                            key={test.id}
                            test={test}
                            progress={progress}
                            locked={locked}

                        />
                    )
                })}

            </div>
        </div>
    )
}

export default PunctBlock