import { FiCheck, FiChevronDown } from "react-icons/fi"
import PunctBlock from "./PunctBlock"
import FileBlock from "./FileBlock"
import type { Theme } from "../../../../entities/theme/model/type"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { isContentCompleted } from "../../../../entities/progress/model/selectors"
import type {File} from "../../../../entities/file/model/type";

interface ThemeBlockProps {
    theme: Theme
    open: boolean
    toggle: () => void
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
}

const ThemeBlock = ({ theme, open, toggle, progress, setPlayerActive, setActiveAudio }: ThemeBlockProps) => {

    const completedPunctsCount = theme.puncts?.reduce((acc, punct) => {
        const allItemsCount = (punct.files?.length || 0) + (punct.tests?.length || 0)
        let completedCount = 0

        punct.files?.forEach(file => {
            if (isContentCompleted(progress, 'file', file.id)) completedCount++
        })
        punct.tests?.forEach(test => {
            if (isContentCompleted(progress, 'test', test.id)) completedCount++
        })

        return acc + (allItemsCount > 0 && completedCount === allItemsCount ? 1 : 0)
    }, 0) || 0

    const totalPuncts = theme.puncts?.length || 0
    const progressPercent = totalPuncts > 0
        ? Math.round((completedPunctsCount / totalPuncts) * 100)
        : 0

    const isThemeCompleted = totalPuncts > 0 && completedPunctsCount === totalPuncts

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div
                onClick={toggle}
                className="p-6 cursor-pointer hover:bg-gray-50 transition"
            >
                <div className="flex justify-between items-center">
                    <div className="flex flex-col w-full">

                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-gray-800">
                                {theme.title}
                            </h3>

                            {isThemeCompleted && (
                                <FiCheck className="text-green-500" />
                            )}
                        </div>

                        {totalPuncts > 0 && (
                            <div className="mt-3">
                                <div className="flex justify-between text-sm text-gray-500 mb-1">
                                    <span>Прогресс модуля</span>
                                    <span>{progressPercent}%</span>
                                </div>

                                <div className="h-2 bg-gray-100 rounded-full">
                                    <div
                                        className="h-2 bg-green-300 rounded-full transition-all"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <FiChevronDown
                        className={`ml-4 text-gray-500 transition-transform duration-300 ${
                            !open ? "rotate-180" : ""
                        }`}
                    />
                </div>

                {/* 🔹 Справочные файлы — всегда видны */}
                {theme.files?.length > 0 && (
                    <div className="space-y-2 mt-4">
                        <h4 className="font-semibold text-gray-700 mb-2 text-right">Справочные материалы</h4>
                        <div className="flex justify-end space-x-2">
                            {theme.files.map(file => (
                                <FileBlock
                                    key={file.id}
                                    file={file}
                                    isReference={true}
                                    progress={progress}
                                    setPlayerActive={setPlayerActive}
                                    setActiveAudio={setActiveAudio}
                                />
                            ))}
                        </div>

                    </div>
                )}
            </div>

            {open && (
                <div className="border-t bg-gray-50 p-6 space-y-6">



                    {theme.puncts?.map(punct => (
                        <PunctBlock
                            key={punct.id}
                            punct={punct}
                            progress={progress}
                            setPlayerActive={setPlayerActive}
                            setActiveAudio={setActiveAudio}
                        />
                    ))}

                </div>
            )}
        </div>
    )
}

export default ThemeBlock
