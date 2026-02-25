import { Link } from "react-router-dom"
import {FiCheckCircle, FiClock, FiLock, FiXCircle} from "react-icons/fi"
import { TEST_OVERVIEW_ROUTE } from "../../../../shared/utils/consts"
import type { ProgramProgress } from "../../../../entities/progress/model/type"
import {getContentStatus} from "../../../../entities/progress/model/selectors";
import {useModals} from "../../../../hooks/useModals";
import {HiOutlineLockClosed} from "react-icons/hi";

import {MdAssignmentTurnedIn, MdLock} from "react-icons/md";

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

    // 🔹 получаем статус теста
    const getStatus = () => {
        if (!progress) return "not_started"
        const status = getContentStatus(progress, 'test', test.id) // пример, как хранится прогресс
        if (status === "completed") return "completed"
        if (status === "failed") return "failed"
        if (status === "in_progress") return "in_progress"
        return "not_started"
    }

    const status = getStatus()

    const statusStyles: Record<string, string> = {
        not_started: "bg-white hover:bg-gray-50 border border-gray-100",
        in_progress: "bg-blue-50 hover:bg-blue-100 border border-blue-100",
        completed: "bg-green-50 hover:bg-green-100 border border-green-100",
        failed: "bg-red-50 hover:bg-red-100 border border-red-100"
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

    const {openModal} = useModals();

    const handleClickLocked = () => {
        openModal('alert', {
            title: 'Финальный тест недоступен',
            description: 'Чтобы приступить к финальному тестированию, необходимо успешно завершить все предыдущие этапы. Пожалуйста, убедитесь, что все тесты выполнены и отмечены как пройденные.'
        })
    }

    // если заблокирован — отключаем ссылку
    if (locked) return (
        <div onClick={handleClickLocked} className={`flex items-center justify-between p-4 rounded-xl transition shadow-sm ${statusStyles[status]} opacity-80 cursor-not-allowed`}>
            <div className="flex items-center gap-3 text-gray-700">
                <span><MdLock/></span>
                <span className="ml-1 font-bold">{test.final_test ? 'Финальный тест:' : 'Тест'}</span>
                <span>{test.title}</span>
            </div>
            {renderStatus()}
        </div>
    )

    return <Link to={TEST_OVERVIEW_ROUTE.replace(":id", `${test.id}`)}
                className={`flex items-center justify-between p-4 rounded-xl transition shadow-sm ${
                    statusStyles[status]
                }`}>
            <div className="flex items-center gap-3 text-gray-700">
                <span><MdAssignmentTurnedIn className="text-blue-500"/></span>
                <span className="ml-1 font-bold">{test.final_test ? 'Финальный тест:' : 'Тест:'}</span>
                <span>{test.title}</span>

            </div>
        </Link>
}

export default TestBlock
