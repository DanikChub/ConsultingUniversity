import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppContainer from '../../../components/ui/AppContainer'
import { getUsersWithLastMessages } from '../../../entities/user/api/user.api'
import { CHAR_PAGE_ROUTE } from '../../../shared/utils/consts'
import SearchInput from "../../../shared/ui/inputs/SearchInput";

interface ChatUser {
    id: number
    name: string
    role: 'admin' | 'user'
    organization: string
    message: string
    createdAt: string
    numberUnReadMessages?: number
}

const formatDate = (date: string) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('ru-RU')
}

const ChatUsersPage: React.FC = () => {
    const [users, setUsers] = useState<ChatUser[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [activeTab, setActiveTab] = useState<'inbox' | 'outbox' | ''>('')
    const [search, setSearch] = useState<string>('')

    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const data = await getUsersWithLastMessages()
            setUsers(data)
        } catch (error: any) {
            alert(
                error?.response?.data?.message ||
                error?.message ||
                'Ошибка загрузки пользователей'
            )
        } finally {
            setLoading(false)
        }
    }

    const filteredUsers = useMemo(() => {
        let result = [...users]

        if (activeTab === 'inbox') {
            result = result.filter((u) => u.role === 'user')
        }

        if (activeTab === 'outbox') {
            result = result.filter((u) => u.role === 'admin')
        }

        if (search.trim()) {
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(search.toLowerCase()) ||
                    u.organization?.toLowerCase().includes(search.toLowerCase()) ||
                    u.message?.toLowerCase().includes(search.toLowerCase())
            )
        }

        return result
    }, [users, activeTab, search])

    return (
        <AppContainer>
            <div className="mx-auto px-4 py-8">

                {/* Header */}
                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Сообщения
                    </h1>

                    <div className="flex gap-3">
                        <button
                            onClick={() =>
                                setActiveTab(activeTab === 'inbox' ? '' : 'inbox')
                            }
                            className={`px-4 py-2 rounded-xl text-sm transition ${
                                activeTab === 'inbox'
                                    ? 'bg-blue-500 text-white shadow'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            Входящие
                        </button>

                        <button
                            onClick={() =>
                                setActiveTab(activeTab === 'outbox' ? '' : 'outbox')
                            }
                            className={`px-4 py-2 rounded-xl text-sm transition ${
                                activeTab === 'outbox'
                                    ? 'bg-blue-500 text-white shadow'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                        >
                            Отправленные
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <SearchInput
                        className="mt-7"
                        value=''
                        onChange={e => console.log(e)}
                        placeholder="Поиск..."
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-gray-500">Загрузка...</div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-gray-400">Нет сообщений</div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                        {filteredUsers.map((user) => {
                            const hasUnread = user.numberUnReadMessages && user.numberUnReadMessages > 0

                            return (
                                <div
                                    key={user.id}
                                    className={`grid grid-cols-[40px_1.5fr_1.5fr_2fr_120px] items-center px-6 py-4 border-b last:border-none hover:bg-gray-50 transition ${
                                        hasUnread ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    {/* Checkbox */}
                                    <div>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            to={CHAR_PAGE_ROUTE.replace(':id', user.id.toString())}
                                            className={`hover:underline ${
                                                hasUnread
                                                    ? 'font-semibold text-gray-900'
                                                    : 'text-gray-700'
                                            }`}
                                        >
                                            {user.name}
                                        </Link>

                                        {hasUnread ?
                                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                {user.numberUnReadMessages}
                                              </span>
                                            :
                                            ''
                                        }
                                    </div>

                                    {/* Organization */}
                                    <div className="text-gray-600 text-sm truncate">
                                        {user.organization || '-'}
                                    </div>

                                    {/* Message */}
                                    <div
                                        className={`text-sm truncate ${
                                            hasUnread
                                                ? 'font-semibold text-gray-800'
                                                : 'text-gray-500'
                                        }`}
                                    >
                                        {user.message?.length > 50
                                            ? user.message.slice(0, 50) + '...'
                                            : user.message}
                                    </div>

                                    {/* Date */}
                                    <div className="text-sm text-gray-400 text-right">
                                        {formatDate(user.createdAt)}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </AppContainer>
    )
}

export default ChatUsersPage