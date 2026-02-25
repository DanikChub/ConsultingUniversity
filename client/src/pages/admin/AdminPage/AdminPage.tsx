import React, { useContext, useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import AppContainer from "../../../components/ui/AppContainer"
import { deleteEvents, getAllEvents } from "../../../entities/event/api/event.api"
import { useModals } from "../../../hooks/useModals"
import { Context } from "../../../index"
import {ADMIN_ADMINISTRATORS_ROUTE, ADMIN_USER_ROUTE, ADMIN_VIEW_PROGRAM} from "../../../shared/utils/consts";

interface EventItem {
    id: number
    createdAt: string
    event_text: string
    name: string
    organization: string
    event_id: number
    type: "admin" | "user" | "program"
}

interface GroupedEvents {
    date: string
    items: EventItem[]
}

function formatDate(date: string) {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("ru-RU")
}

function formatTime(date: string) {
    if (!date) return "-"
    return new Date(date).toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

const AdminPage: React.FC = () => {
    const [events, setEvents] = useState<EventItem[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [openIndex, setOpenIndex] = useState<number | null>(0)
    const [selected, setSelected] = useState<number[]>([])

    const { openModal } = useModals()
    const navigate = useNavigate()

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        setLoading(true)
        const data = await getAllEvents()
        setEvents(data)
        setLoading(false)
    }

    const groupedEvents: GroupedEvents[] = useMemo(() => {
        const map: Record<string, EventItem[]> = {}

        events.forEach((event) => {
            const date = formatDate(event.createdAt)
            if (!map[date]) map[date] = []
            map[date].push(event)
        })

        return Object.entries(map).map(([date, items]) => ({
            date,
            items,
        }))
    }, [events])

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const toggleSelect = (id: number) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        )
    }

    const handleSelectAll = () => {
        const allIds = events.map((e) => e.id)

        if (selected.length === allIds.length) {
            setSelected([])
        } else {
            setSelected(allIds)
        }
    }

    const handleNavigate = (event: EventItem) => {
        if (!event.event_id) return

        switch (event.type) {
            case "user":
                navigate(ADMIN_USER_ROUTE.replace(':id', `${event.event_id}`))
                break
            case "program":
                navigate(ADMIN_VIEW_PROGRAM.replace(':id', `${event.event_id}`))
                break
            case "admin":
                navigate(ADMIN_ADMINISTRATORS_ROUTE)
                break
            default:
                break
        }
    }

    const userRole = useContext(Context).user.user.role

    const handleDelete = async () => {
        if (!selected.length) return

        if (userRole === "ADMIN") {
            const confirmed = await openModal("confirm", {
                title: `Вы действительно хотите удалить ${selected.length} событий?`,
                description: "Это действие нельзя отменить",
                variant: "danger",
                confirmText: "Удалить",
            })

            if (!confirmed) return

            const formData = new FormData()
            selected.forEach((id) => formData.append("ids", id.toString()))

            await deleteEvents(formData)
            setSelected([])
            fetchEvents()
        } else if (userRole === "VIEWER") {
            await openModal("alert", {
                title: "Недостаточно прав доступа",
                description:
                    "У вас нет прав для выполнения этого действия. Если вы считаете, что это ошибка, обратитесь к администратору платформы.",
                buttonText: "Понятно",
            })
        }
    }

    return (
        <AppContainer>
            <div className="mx-auto py-8 px-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Последние события
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSelectAll}
                            className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition text-sm"
                        >
                            {selected.length === events.length
                                ? "Снять выбор"
                                : "Выбрать все"}
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={!selected.length}
                            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-40 text-sm"
                        >
                            Удалить
                        </button>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-gray-500">Загрузка...</div>
                ) : groupedEvents.length === 0 ? (
                    <div className="text-gray-400">Нет событий</div>
                ) : (
                    <div className="space-y-4">
                        {groupedEvents.map((group, index) => (
                            <div
                                key={group.date}
                                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Accordion Header */}
                                <button
                                    onClick={() => toggleAccordion(index)}
                                    className="w-full flex justify-between items-center px-6 py-4 bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <span className="font-semibold text-gray-700">
                                        {group.date}
                                    </span>

                                    <span
                                        className={`transform transition ${
                                            openIndex === index
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {/* Table */}
                                {openIndex === index && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100 text-gray-600">
                                            <tr>
                                                <th className="px-4 py-3 text-left w-10"></th>
                                                <th className="px-4 py-3 text-left w-24">
                                                    Время
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Событие
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Объект
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Тип
                                                </th>
                                                <th className="px-4 py-3 text-left">
                                                    Организация
                                                </th>
                                            </tr>
                                            </thead>

                                            <tbody>
                                            {group.items.map((event) => (
                                                <tr
                                                    key={event.id}
                                                    className="border-t hover:bg-gray-50 transition"
                                                >
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={selected.includes(
                                                                event.id
                                                            )}
                                                            onChange={() =>
                                                                toggleSelect(
                                                                    event.id
                                                                )
                                                            }
                                                            className="w-4 h-4"
                                                        />
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-500 font-medium">
                                                        {formatTime(
                                                            event.createdAt
                                                        )}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-800">
                                                        {event.event_text}
                                                    </td>

                                                    <td className="px-4 py-3">
                                                        <button
                                                            onClick={() =>
                                                                handleNavigate(
                                                                    event
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition"
                                                        >
                                                            {event.name}
                                                        </button>
                                                    </td>

                                                    <td className="px-4 py-3">
                                                            <span
                                                                className={`
                                                                px-2 py-1 rounded-full text-xs font-semibold
                                                                ${
                                                                    event.type ===
                                                                    "user"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : event.type ===
                                                                        "program"
                                                                            ? "bg-purple-100 text-purple-700"
                                                                            : "bg-amber-100 text-amber-700"
                                                                }
                                                            `}
                                                            >
                                                                {event.type}
                                                            </span>
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-600">
                                                        {event.organization}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppContainer>
    )
}

export default AdminPage
