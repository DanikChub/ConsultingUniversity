import { FiCheck, FiChevronDown } from "react-icons/fi"
import { useEffect, useRef, useState } from "react"
import PunctBlock from "./PunctBlock"
import FileBlock from "./FileBlock"
import type { Theme } from "../../../../entities/theme/model/type"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { isContentCompleted } from "../../../../entities/progress/model/selectors"
import type { File } from "../../../../entities/file/model/type"

interface ThemeBlockProps {
    theme: Theme
    open: boolean
    toggle: () => void
    progress: ProgramProgress | null
    setPlayerActive: (active: boolean) => void
    setActiveAudio: (track: File) => void
    map_order_index: number
}

const ThemeBlock = ({
                        theme,
                        open,
                        toggle,
                        progress,
                        setPlayerActive,
                        setActiveAudio,
                        map_order_index
                    }: ThemeBlockProps) => {

    // ---------------------------
    // 🔹 Прогресс
    // ---------------------------

    const allTests =
        theme.puncts?.flatMap(punct => punct.tests || []) || []

    const regularTests =
        allTests.filter(test => !test.final_test)

    const finalTests =
        allTests.filter(test => test.final_test)

    const totalTests = allTests.length

    const completedTests = allTests.reduce((acc, test) => {
        if (isContentCompleted(progress, "test", test.id)) {
            return acc + 1
        }
        return acc
    }, 0)

    const progressPercent =
        totalTests > 0
            ? Math.round((completedTests / totalTests) * 100)
            : 0

    const isThemeCompleted =
        totalTests > 0 && completedTests === totalTests

    const allRegularCompleted =
        regularTests.length === 0 ||
        regularTests.every(test =>
            isContentCompleted(progress, "test", test.id)
        )

    // ---------------------------
    // 🔥 Анимация раскрытия
    // ---------------------------

    const contentRef = useRef<HTMLDivElement>(null)
    const [height, setHeight] = useState(0)

    useEffect(() => {
        if (!contentRef.current) return

        if (open) {
            setHeight(contentRef.current.scrollHeight)
        } else {
            setHeight(0)
        }
    }, [open])

    // ---------------------------

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">

            {/* HEADER */}
            <div
                onClick={toggle}
                className="p-6 cursor-pointer transition-all duration-300 hover:bg-gray-50"
            >
                <div className="flex justify-between items-center">

                    <div className="flex flex-col w-full">

                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg text-gray-800">
                                {map_order_index}. {theme.title}
                            </h3>

                            {isThemeCompleted && (
                                <FiCheck className="text-green-500 animate-fadeIn" />
                            )}
                        </div>

                        {/* Progress */}
                        <div className="mt-4">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Прогресс модуля</span>
                                <span>{progressPercent}%</span>
                            </div>

                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Arrow */}
                    <FiChevronDown
                        className={`ml-4 text-gray-500 transition-transform duration-500 ease-out ${
                            open ? "rotate-180" : "rotate-0"
                        }`}
                        size={22}
                    />
                </div>

                {/* Reference files */}
                {theme.files?.length > 0 && (
                    <div className="space-y-2 mt-5">
                        <h4 className="font-semibold text-gray-700 mb-2 text-right">
                            Справочные материалы
                        </h4>
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

            {/* CONTENT (WOW animation) */}
            <div
                style={{
                    height,
                    opacity: open ? 1 : 0,
                    transform: open ? "translateY(0px)" : "translateY(-8px)",
                    transition:
                        "height 500ms cubic-bezier(0.4, 0, 0.2, 1), " +
                        "opacity 300ms ease, " +
                        "transform 400ms ease"
                }}
                className="overflow-hidden"
            >
                <div
                    ref={contentRef}
                    className="border-t bg-gray-50 px-6 py-6 space-y-6"
                >
                    {theme.puncts?.map((punct, index) => (
                        <div
                            key={punct.id}
                            style={{
                                opacity: open ? 1 : 0,
                                transform: open
                                    ? "translateY(0px)"
                                    : "translateY(10px)",
                                transition: `all 400ms ease ${index * 60}ms`
                            }}
                        >
                            <PunctBlock
                                map_order_index={index+1}
                                punct={punct}
                                progress={progress}
                                setPlayerActive={setPlayerActive}
                                setActiveAudio={setActiveAudio}

                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ThemeBlock
