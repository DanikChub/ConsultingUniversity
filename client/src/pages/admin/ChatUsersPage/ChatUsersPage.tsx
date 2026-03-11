import React, { useEffect, useMemo, useState, useContext } from "react"
import AppContainer from "../../../components/ui/AppContainer"
import SearchInput from "../../../shared/ui/inputs/SearchInput"
import type { Chat as ChatType } from "../../../entities/chat/model/type"
import { closeChat, getAllChats } from "../../../entities/chat/api/chat.api"
import { CHAT_PAGE_ROUTE } from "../../../shared/utils/consts"
import {useNavigate, useSearchParams} from "react-router-dom"
import { Context } from "../../../index"
import {API_URL} from "../../../shared/config/api";
import Chat from "../../../widgets/chat/Chat";
import {useSocket} from "../../../hooks/useSocket";

const formatDate = (date: string | null) => {
    if (!date) return "-"
    return new Date(date).toLocaleDateString("ru-RU")
}

const ChatUsersPage: React.FC = () => {
    const socket = useSocket()

    const [chats, setChats] = useState<ChatType[]>([])
    const [loading, setLoading] = useState(true)
    const [activeStatus, setActiveStatus] = useState<"open" | "closed" | "">("")
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [activeChatId, setActiveChatId] = useState<number | null>(null);
    const [totalPages, setTotalPages] = useState(1)
    const [queryParams] = useSearchParams();
    const navigate = useNavigate()

    /*
    ============================
        LOAD CHATS
    ============================
    */

    useEffect(() => {
        setActiveChatId(queryParams.get('chatId'))
    }, []);

    useEffect(() => {
        fetchChats()
    }, [page, activeStatus])

    const fetchChats = async () => {
        try {
            setLoading(true)
            const data = await getAllChats(page, 20, activeStatus || undefined)

            setChats(data.rows)
            setTotalPages(data.pages)
        } catch (e: any) {
            alert("Ошибка загрузки чатов")
        } finally {
            setLoading(false)
        }
    }

    /*
    ============================
        SOCKET REALTIME
    ============================
    */

    useEffect(() => {
        if (!socket) return

        // админ присоединяется к комнате админов
        socket.emit("join_admins")

        socket.on("chat_updated", (payload: any) => {
            console.log(payload);
            setChats(prev => {
                const updated = prev.map(chat => {
                    if (chat.id !== payload.chatId) return chat

                    return {
                        ...chat,
                        unreadCount: payload.unreadCount,
                        lastMessageAt: payload.lastMessageAt,
                        messages: payload.lastMessage
                            ? [payload.lastMessage]
                            : chat.messages
                    }
                })

                return updated.sort(
                    (a, b) =>
                        new Date(b.lastMessageAt).getTime() -
                        new Date(a.lastMessageAt).getTime()
                )
            })
        })

        socket.on("chat_read_updated", ({ chatId, unreadCount }) => {
            setChats(prev =>
                prev.map(chat =>
                    chat.id === chatId
                        ? { ...chat, unreadCount }
                        : chat
                )
            )
        })

        socket.on("new_chat", (chat: ChatType) => {
            setChats(prev => [chat, ...prev])
        })

        return () => {
            socket.off("chat_read_updated")
            socket.off("chat_updated")
            socket.off("new_chat")
        }
    }, [socket])

    /*
    ============================
        SEARCH
    ============================
    */

    const filteredChats = useMemo(() => {
        if (!search.trim()) return chats
        return chats.filter(chat =>
            String(chat.userId).includes(search)
        )
    }, [chats, search])

    /*
    ============================
        CLOSE CHAT
    ============================
    */

    const handleCloseChat = async (chatId: number) => {
        if (!window.confirm("Закрыть чат?")) return

        try {
            await closeChat(chatId)

            setChats(prev =>
                prev.map(chat =>
                    chat.id === chatId
                        ? { ...chat, status: "closed" }
                        : chat
                )
            )
        } catch {
            alert("Ошибка закрытия чата")
        }
    }

    const handleSetActiveChatId = (newChatId) => {
        setActiveChatId(newChatId)
    }

    return (
        <AppContainer>
            <div className="mx-auto px-4 py-8">

                <div className="mb-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        Чаты пользователей
                    </h1>
                </div>

                <div className="mb-6">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Поиск по userId..."
                    />
                </div>

                {loading ? (
                    <div>Загрузка...</div>
                ) : filteredChats.length === 0 ? (
                    <div>Нет чатов</div>
                ) : (
                    <div className="grid grid-cols-2">

                        <div className="bg-white rounded-l-2xl  shadow-sm border divide-y">
                            {filteredChats.map(chat => {
                                const hasUnread = chat.unreadCount > 0
                                const lastMessage = chat.messages?.[0]


                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() =>
                                            handleSetActiveChatId(chat.id)
                                        }
                                        className={`
                                        flex items-center gap-4 px-6 py-4
                                        cursor-pointer transition
                                        hover:bg-gray-50
                                        ${hasUnread ? "bg-blue-50" : ""}
                                        ${chat.status === "closed" ? "opacity-60" : ""}
                                    `}
                                    >
                                        {/* Avatar */}
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            {chat.user?.img ? (
                                                <img
                                                    src={process.env.REACT_APP_API_URL + chat.user.img}
                                                    alt={chat.user.name}
                                                    className="w-12 h-12 rounded-full object-cover border"
                                                />
                                            ) : (
                                                <div
                                                    className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg">
                                                    {chat.user?.name?.[0]?.toUpperCase() || "U"}
                                                </div>
                                            )}

                                            {/* Online indicator */}
                                            {/*{chat.user?.isOnline && (*/}
                                            {/*    <div*/}
                                            {/*        className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>*/}
                                            {/*)}*/}
                                        </div>

                                        {/* Main info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-gray-800 truncate">
                                                    {chat.user?.name}
                                                </div>

                                                <div className="text-xs text-gray-400 whitespace-nowrap">
                                                    {formatDate(chat.lastMessageAt)}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-1">
                                                <div className="text-sm text-gray-500 truncate max-w-[80%]">
                                                    {lastMessage?.text
                                                        ? lastMessage.text
                                                        : lastMessage?.message_attachments?.length > 0
                                                            ? "📎 Вложение"
                                                            : "Нет сообщений"}
                                                </div>

                                                {hasUnread && (
                                                    <span
                                                        className="ml-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                                        {chat.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <Chat chatId={activeChatId} own="ADMIN"/>
                    </div>

                )}
            </div>
        </AppContainer>
    )
}

export default ChatUsersPage