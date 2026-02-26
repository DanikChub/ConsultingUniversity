import { Link } from "react-router-dom"
import {
    FiCheckCircle,
    FiClock,
    FiXCircle,
    FiClipboard,
    FiChevronRight
} from "react-icons/fi"
import { MdLock } from "react-icons/md"
import { TEST_OVERVIEW_ROUTE } from "../../../../shared/utils/consts"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import { getContentStatus } from "../../../../entities/progress/model/selectors"
import { useModals } from "../../../../hooks/useModals"

interface TestBlockProps {
    test: {
        id: number
        title?: string
        final_test?: boolean
    }
    progress: ProgramProgress | null
    locked?: boolean
}

const TestBlock = ({ test, progress, locked = false }: TestBlockProps) => {

    const { openModal } = useModals()

    const getStatus = () => {
        if (!progress) return "not_started"

        const status = getContentStatus(progress, "test", test.id)

        if (status === "completed") return "completed"
        if (status === "failed") return "failed"
        if (status === "in_progress") return "in_progress"

        return "not_started"
    }

    const status = getStatus()

    const statusColor: Record<string, string> = {
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
                    <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
                        <FiClock />
                        В процессе
                    </div>
                )

            case "completed":
                return (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <FiCheckCircle />
                        Пройден
                    </div>
                )

            case "failed":
                return (
                    <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
                        <FiXCircle />
                        Не пройден
                    </div>
                )

            default:
                return (
                    <div className="text-gray-400 text-sm">
                        Не начат
                    </div>
                )
        }
    }

    const handleClickLocked = () => {
        openModal("alert", {
            title: "Финальный тест недоступен",
            description:
                "Чтобы приступить к финальному тестированию, необходимо успешно завершить все предыдущие этапы."
        })
    }

    const content = (
        <>
            {/* Левая часть */}
            <div className="flex items-center gap-4 flex-1">

                {/* Иконка */}
                <div
                    className={`
                        w-10 h-10
                        flex items-center justify-center
                        rounded-xl
                        bg-white
                        border
                        ${
                        locked
                            ? "border-gray-300 text-gray-400"
                            : "border-gray-200 text-blue-600"
                    }
                        group-hover:scale-105
                        transition
                    `}
                >
                    {locked ? <MdLock /> : <FiClipboard />}
                </div>

                {/* Текст */}
                <div>
                    <div className="text-sm font-semibold text-gray-900">
                        {test.final_test
                            ? "Финальный тест"
                            : "Тест"}
                    </div>

                    <div className="text-sm text-gray-600">
                        {test.title}
                    </div>
                </div>
            </div>

            {/* Правая часть */}
            <div className="flex items-center gap-4">
                {renderStatus()}

                {!locked && (
                    <FiChevronRight
                        className="
                            text-gray-400
                            group-hover:translate-x-1
                            transition
                        "
                    />
                )}
            </div>
        </>
    )

    if (locked) {
        return (
            <div
                onClick={handleClickLocked}
                className={`
                    group
                    w-full
                    flex items-center justify-between
                    px-5 py-4
                    rounded-2xl
                    transition-all
                    cursor-not-allowed
                    opacity-80
                    ${statusColor[status]}
                `}
            >
                {content}
            </div>
        )
    }

    return (
        <Link
            to={TEST_OVERVIEW_ROUTE.replace(":id", `${test.id}`)}
            className={`
                group
                w-full
                flex items-center justify-between
                px-5 py-4
                rounded-2xl
                transition-all
                
                active:scale-[0.99]
                ${statusColor[status]}
            `}
        >
            {content}
        </Link>
    )
}

export default TestBlock
