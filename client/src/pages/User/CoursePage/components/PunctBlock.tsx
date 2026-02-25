import TestBlock from "./TestBlock"
import FileBlock from "./FileBlock"
import type { Punct } from "../../../../entities/punct/model/type"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import type { File } from "../../../../entities/file/model/type"
import {getContentStatus} from "../../../../entities/progress/model/selectors";

interface PunctBlockProps {
    punct: Punct
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
    allRegularCompleted: boolean
}

const PunctBlock = ({
                        punct,
                        progress,
                        setPlayerActive,
                        setActiveAudio,
                        allRegularCompleted
                    }: PunctBlockProps) => {

    return (
        <div className="bg-white rounded-xl p-5 shadow-sm space-y-4">

            <h4 className="font-semibold text-gray-800">
                {punct.title}
            </h4>

            {/* Файлы пункта */}
            {punct.files?.map(file => (
                <FileBlock
                    key={file.id}
                    file={file}
                    progress={progress}
                    setPlayerActive={setPlayerActive}
                    setActiveAudio={setActiveAudio}
                />
            ))}

            {/* Тесты */}
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
    )
}

export default PunctBlock
