import { useNavigate } from "react-router-dom"
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
import type { Test } from "../../../../entities/test/model/type"
import React, {useContext, useEffect, useState} from "react"
import { Context } from "../../../../index"

interface TestBlockProps {
    test: Test
    progress: ProgramProgress | null
    locked?: boolean
}

const TestBlock = ({ test, progress, locked = false }: TestBlockProps) => {
    const userContext = useContext(Context)
    const { openModal } = useModals()
    const navigate = useNavigate()

    const enrollmentId = userContext.user.enrollmentId
    const lastOpened = userContext.user.getLastOpened(enrollmentId)
    const [highlight, setHighlight] = useState(false)
    const isLast =
        lastOpened?.type === "test" &&
        lastOpened?.id === test.id

    useEffect(() => {
        if (isLast) {
            setHighlight(true)

            const timer = setTimeout(() => {
                setHighlight(false)
            }, 4000)

            return () => clearTimeout(timer)
        }
    }, [isLast])

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

    const handleClick = () => {
        userContext.user.setLastOpened(enrollmentId, {
            type: "test",
            id: test.id,
            themeId: test.themeId,
            punctId: test.punctId
        })

        navigate(TEST_OVERVIEW_ROUTE.replace(":id", `${test.id}`))
    }

    const baseClasses = `
        group
        w-full
        flex items-center justify-between
        px-5 py-4
        rounded-2xl
        transition-all
        active:scale-[0.99]
        ${statusColor[status]}
        ${highlight ? "ring-2 ring-blue-200 shadow-lg scale-[1.01]" : ""}
    `

    const content = (
        <>
            <div className="flex items-center gap-4 flex-1">
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
                        transition
                    `}
                >
                    {locked ? <MdLock /> : <FiClipboard />}
                </div>

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
                {highlight && (
                    <span className="ml-3 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full animate-pulse">
                        Вы остановились здесь
                    </span>
                )}
            </div>

            <div className="flex items-center gap-4">
                {renderStatus()}
                {!locked && (
                    <FiChevronRight className="text-gray-400 transition" />
                )}
            </div>
        </>
    )

    if (locked) {
        return (
            <div
                id={`test-${test.id}`}
                onClick={handleClickLocked}
                className={`${baseClasses} cursor-not-allowed opacity-80`}
            >
                {content}
            </div>
        )
    }

    return (
        <div
            id={`test-${test.id}`}
            onClick={handleClick}
            className={`${baseClasses} cursor-pointer`}
        >
            {content}
        </div>
    )
}

export default TestBlock
