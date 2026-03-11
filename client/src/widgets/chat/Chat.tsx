import React, { useContext, useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import {Context} from "../../index";
import type {Chat as ChatType, Message} from "../../entities/chat/model/type";
import {useSocket} from "../../hooks/useSocket";
import {deleteMessage, getChatById, getMessages, sendMessage, updateMessage} from "../../entities/chat/api/chat.api";
import AppContainer from "../../components/ui/AppContainer";
import ButtonBack from "../../shared/ui/buttons/ButtonBack";
import ChatMessage from "./components/ChatMessage";
import AutoResizeTextarea from "../../components/ui/AutoResizeTextarea";
import {getUserById} from "../../entities/user/api/user.api";
import type {User} from "../../entities/user/model/type";
import {API_URL} from "../../shared/config/api";

import admin_avatar from '../../assets/imgs/admin_avatar.jpg'

type ChatProps = {
    chatId: number | null;
    own: 'USER' | 'ADMIN';
}

const makeTime = (time: string) => {
    const date = new Date(time)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
}

const Chat: React.FC<ChatProps> = ({chatId, own}) => {
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const LIMIT = 40


    const { user } = useContext(Context)

    const [isOnline, setIsOnline] = useState(false)
    const [chatUser, setChatUser] = useState<User | null>(null)

    const [chat, setChat] = useState<ChatType | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [loading, setLoading] = useState(false)
    const [typing, setTyping] = useState(false)

    const [editingId, setEditingId] = useState<number | null>(null)

    const [previewImage, setPreviewImage] = useState<string | null>(null)

    const [dragActive, setDragActive] = useState(false)


    const chatRef = useRef<HTMLDivElement | null>(null)
    const socket = useSocket()



    const scrollToBottom = () => {
        const container = chatRef.current
        if (container) {
            container.scrollTop = container.scrollHeight
        }
    }

    /*
    ========================
        LOAD MESSAGES
    ========================
    */

    const getLastMessageId = () => {
        if (messages.length === 0) return null
        return messages[messages.length - 1].id
    }

    useEffect(() => {
        if (!chatId) return


        setLoading(false)


        async function load() {
            const chat = await getChatById(chatId)

            const otherUserId = chat.userId

            if (otherUserId) {
                const userData = await getUserById(otherUserId)
                setChatUser(userData)
            }

            const messages = await getMessages({
                chatId,
                limit: LIMIT
            })

            const sorted = messages.reverse()

            setMessages(sorted)
            setChat(chat)

            if (messages.length < LIMIT) {
                setHasMore(false)
            }

            const lastMessage = sorted[sorted.length - 1]

            if (lastMessage && lastMessage.senderId !== user.id) {
                socket.emit("mark_read", {
                    chatId,
                    lastReadMessageId: lastMessage.id
                })
            }

            setTimeout(scrollToBottom, 50)
            setLoading(true)
        }


        load()


        // Получаем чат + пользователя

    }, [chatId])

    /*
    ========================
        SOCKET
    ========================
    */

    useEffect(() => {
        if (!socket || !chatId) return

        socket.emit("join_chat", chatId)

        if (chatUser) {
            socket.emit("check_user_online", chatUser.id)

            socket.on("user_online_status", ({ userId, isOnline }) => {
                if (userId === chatUser.id) {
                    setIsOnline(isOnline)
                }
            })
        }

        socket.on("new_message", (message: Message) => {
            setMessages(prev => [...prev, message])
            setTimeout(scrollToBottom, 50)
            if (
                message.chatId === chatId &&
                message.senderId !== user.id
            ) {
                socket.emit("mark_read", {
                    chatId,
                    lastReadMessageId: message.id
                })
            }
        })

        socket.on("message_updated", (updated: Message) => {
            setMessages(prev =>
                prev.map(m => m.id === updated.id ? updated : m)
            )
        })

        socket.on("message_deleted", ({ messageId }) => {

            setMessages(prev =>
                prev.filter(m => m.id !== Number(messageId))
            )
        })

        socket.on("chat_read_updated", ({ readerId, readerRole, lastReadMessageId }) => {
            if (readerId === user.id) return

            // обновляем сообщения
            setMessages(prev =>
                prev.map(m =>
                    m.senderId === user.id && m.id <= lastReadMessageId
                        ? { ...m, readAt: new Date().toISOString() }
                        : m
                )
            )

            // обновляем chat.lastRead...
            setChat(prev => {
                if (!prev) return prev

                if (readerRole === "ADMIN") {
                    return {
                        ...prev,
                        lastReadAdminMessageId: lastReadMessageId
                    }
                } else {
                    return {
                        ...prev,
                        lastReadUserMessageId: lastReadMessageId
                    }
                }
            })
        })

        socket.on("user_online", ({ userId }) => {
            if (chatUser?.id === userId) {
                setIsOnline(true)
            }
        })

        socket.on("user_offline", ({ userId }) => {
            if (chatUser?.id === userId) {
                setIsOnline(false)
            }
        })

        socket.on("user_typing", () => {
            setTyping(true)
            setTimeout(() => setTyping(false), 1500)
        })


        return () => {
            socket.off("new_message")
            socket.off("message_updated")
            socket.off("message_deleted")
            socket.off("messages_read")
            socket.off("user_online")
            socket.off("user_offline")
            socket.off("user_typing")
        }
    }, [socket, chatId, chatUser])

    const loadOlderMessages = async () => {
        if (!hasMore || loadingMore || messages.length === 0) return

        setLoadingMore(true)

        const oldestMessage = messages[0]

        const older = await getMessages({
            chatId,
            limit: LIMIT,
            before: oldestMessage.createdAt
        })

        if (older.length < LIMIT) {
            setHasMore(false)
        }

        const container = chatRef.current
        const previousHeight = container?.scrollHeight || 0

        const sorted = older.reverse()

        setMessages(prev => [...sorted, ...prev])

        setTimeout(() => {
            if (container) {
                const newHeight = container.scrollHeight
                container.scrollTop = newHeight - previousHeight
            }
        }, 0)

        setLoadingMore(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        // Проверяем, что курсор реально вышел за пределы контейнера
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return

        const droppedFiles = Array.from(e.dataTransfer.files)
        setFiles(prev => [...prev, ...droppedFiles])
    }


    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (!e.clipboardData) return

        const items = Array.from(e.clipboardData.items)

        const imageItems = items.filter(item =>
            item.type.startsWith("image/")
        )

        if (imageItems.length === 0) return

        e.preventDefault()

        const newFiles: File[] = []

        imageItems.forEach(item => {
            const file = item.getAsFile()
            if (file) {
                newFiles.push(file)
            }
        })

        if (newFiles.length > 0) {
            setFiles(prev => [...prev, ...newFiles])
        }
    }


    /*
    ========================
        SEND MESSAGE
    ========================
    */

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() && files.length === 0) return

        try {
            if (editingId) {
                await updateMessage(editingId, {
                    text: input,
                })
                setEditingId(null)
            } else {
                await sendMessage(chatId, {
                    text: input,
                    files,
                })
            }



            setInput("")
            setFiles([])
            setTimeout(scrollToBottom, 50)
        } catch (e: any) {
            alert(e?.response?.data?.message || "Ошибка отправки")
        }
    }

    const handleTyping = () => {
        if (!socket) return
        socket.emit("typing", { chatId })
    }

    const handleDelete = async (messageId: number) => {
        await deleteMessage(messageId)
    }

    const handleEdit = (message: Message) => {
        setInput(message.text || "")
        setEditingId(message.id)
    }

    return (

        <div className="rounded-r-2xl shadow-sm border border-gray-200">
            {
                chatId == null ?
                    (
                        <div className="relative flex-1 flex items-center justify-center h-[90vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-r-2xl">
                            <div className="text-center max-w-sm px-6">

                                {/* Иконка */}
                                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl">
                                    💬
                                </div>

                                {/* Заголовок */}
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                    Выберите чат
                                </h2>

                                {/* Подзаголовок */}
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Выберите диалог слева, чтобы начать общение.
                                    Здесь будут отображаться ваши сообщения.
                                </p>


                            </div>
                        </div>
                    )
                    :
                    loading ?
                    <>
                        {/* Chat Box */}
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className="relative flex-1 flex justify-center h-[90vh]">
                            <div className="w-full max-w-3xl flex flex-col">
                                {dragActive && (
                                    <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-2xl flex items-center justify-center z-50 pointer-events-none">
                                        <div className="text-blue-600 text-lg font-medium">
                                            Отпустите файл, чтобы загрузить
                                        </div>
                                    </div>
                                )}
                                <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
                                    <div>
                                        <div className="font-semibold text-gray-800">
                                            {
                                                own == "ADMIN" ?
                                                    chatUser?.name || "Собеседник"
                                                :
                                                    "Администратор"
                                            }

                                        </div>
                                        <div className="text-xs text-gray-500 flex">


                                            {isOnline ? (

                                                    <span className="text-green-500">● В сети</span>

                                                ) : (
                                                    "Не в сети"
                                                )}


                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div
                                    ref={chatRef}
                                    onScroll={(e) => {
                                        const target = e.currentTarget

                                        if (target.scrollTop < 100) {
                                            loadOlderMessages()
                                        }
                                    }}
                                    className="flex-1 overflow-y-auto px-4 py-6 chat-bg"
                                >
                                    {messages.map((msg, index) => {
                                        const prev = messages[index - 1]

                                        const currentDate = new Date(msg.createdAt)
                                        const prevDate = prev ? new Date(prev.createdAt) : null

                                        const showDateDivider =
                                            !prevDate ||
                                            currentDate.toDateString() !== prevDate.toDateString()

                                        const isSameSender =
                                            prev &&
                                            prev.senderId === msg.senderId &&
                                            prev.senderType === msg.senderType

                                        const isCloseInTime =
                                            prev &&
                                            Math.abs(currentDate.getTime() - new Date(prev.createdAt).getTime()) < 5 * 60 * 1000

                                        const isGrouped = isSameSender && isCloseInTime

                                        return (
                                            <React.Fragment key={msg.id}>

                                                {showDateDivider && (
                                                    <div className="flex justify-center my-4">
                                                        <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                                                            {currentDate.toLocaleDateString("ru-RU", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <ChatMessage
                                                    message={msg}
                                                    isOwn={msg.senderType === own}
                                                    own={own}
                                                    isGrouped={isGrouped}
                                                    avatarUrl={
                                                        !isGrouped && msg.senderType !== own
                                                            ? msg.senderType === "ADMIN"
                                                                ? admin_avatar
                                                                : process.env.REACT_APP_API_URL + chatUser?.img
                                                            : undefined
                                                    }
                                                    name={chatUser?.name}
                                                    lastReadUserMessageId={chat.lastReadUserMessageId}
                                                    lastReadAdminMessageId={chat.lastReadAdminMessageId}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                    setPreviewImage={setPreviewImage}
                                                />
                                            </React.Fragment>
                                        )
                                    })}

                                    {typing && (
                                        <div className="flex justify-start mt-2">
                                            <div className="bg-white border px-4 py-2 rounded-2xl shadow-sm flex gap-1 items-center">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    )}


                                </div>


                                {/* Input */}
                                <form
                                    onSubmit={handleSend}
                                    className="border-t p-4 bg-white flex gap-3 items-end"
                                >
                                    <div className="flex-1">
                                        <div className='flex mb-4'>
                                            {files.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-3">
                                                    {files.map((file, index) => {
                                                        const isImage = file.type.startsWith("image/")
                                                        const previewUrl = isImage ? URL.createObjectURL(file) : null

                                                        return (
                                                            <div
                                                                key={index}
                                                                className="relative group w-28"
                                                            >
                                                                {/* Remove button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFiles(prev =>
                                                                            prev.filter((_, i) => i !== index)
                                                                        )
                                                                    }
                                                                    className="
                                            absolute -top-2 -right-2
                                            bg-black/70 text-white
                                            w-6 h-6 rounded-full
                                            text-xs flex items-center justify-center
                                            opacity-0 group-hover:opacity-100
                                            transition
                                        "
                                                                >
                                                                    ✕
                                                                </button>

                                                                {/* IMAGE PREVIEW */}
                                                                {isImage ? (
                                                                    <div className="rounded-xl overflow-hidden border shadow-sm">
                                                                        <img
                                                                            src={previewUrl!}
                                                                            alt={file.name}
                                                                            className="w-28 h-28 object-cover"
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    /* DEFAULT FILE CARD */
                                                                    <div
                                                                        className="
                                                w-28 h-28
                                                flex flex-col items-center justify-center
                                                rounded-xl border bg-gray-100
                                                text-xs text-gray-600
                                                p-2 text-center
                                                hover:bg-gray-200 transition
                                            "
                                                                    >
                                                                        <div className="text-2xl mb-1">📄</div>
                                                                        <div className="truncate w-full">
                                                                            {file.name}
                                                                        </div>
                                                                        <div className="text-[10px] text-gray-400 mt-1">
                                                                            {(file.size / 1024).toFixed(1)} KB
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <AutoResizeTextarea
                                            value={input}
                                            onChange={(e) => {
                                                setInput(e.target.value)
                                                handleTyping()
                                            }}
                                            placeholder="Написать сообщение..."
                                            maxRows={6}
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-400 outline-none"
                                            onPaste={handlePaste}
                                        />


                                    </div>

                                    <label className="cursor-pointer bg-gray-100 px-3 py-2 rounded-xl hover:bg-gray-200 transition">
                                        📎
                                        <input
                                            type="file"
                                            multiple
                                            hidden
                                            onChange={(e) => {
                                                if (!e.target.files) return

                                                const newFiles = Array.from(e.target.files)

                                                setFiles(prev => [...prev, ...newFiles])

                                                // чтобы можно было выбрать тот же файл повторно
                                                e.target.value = ""
                                            }}
                                        />
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={!input.trim() && files.length === 0}
                                        className="px-5 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition disabled:opacity-40"
                                    >
                                        Отправить
                                    </button>
                                </form>
                            </div>
                            {previewImage && (
                                <div
                                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn"
                                    onClick={() => setPreviewImage(null)}
                                >
                                    <img
                                        src={previewImage}
                                        className="max-h-[90vh] rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                        :
                        (
                            <div className="relative flex-1 flex justify-center h-[90vh] bg-gray-50">
                                <div className="w-full max-w-3xl flex flex-col animate-pulse">

                                    {/* Header Skeleton */}
                                    <div className="px-6 py-4 border-b bg-white flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full" />
                                        <div className="flex flex-col gap-2">
                                            <div className="w-32 h-3 bg-gray-200 rounded" />
                                            <div className="w-20 h-2 bg-gray-200 rounded" />
                                        </div>
                                    </div>

                                    {/* Messages Skeleton */}
                                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

                                        {/* Left message */}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                            <div className="bg-white p-4 rounded-2xl shadow-sm w-2/3">
                                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
                                                <div className="h-3 bg-gray-200 rounded w-1/2" />
                                            </div>
                                        </div>

                                        {/* Right message */}
                                        <div className="flex justify-end">
                                            <div className="bg-white p-4 rounded-2xl shadow-sm w-1/2">
                                                <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
                                                <div className="h-3 bg-gray-200 rounded w-1/3" />
                                            </div>
                                        </div>

                                        {/* Another left message */}
                                        <div className="flex gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                            <div className="bg-white p-4 rounded-2xl shadow-sm w-3/4">
                                                <div className="h-3 bg-gray-200 rounded w-4/5 mb-2" />
                                                <div className="h-3 bg-gray-200 rounded w-2/3" />
                                            </div>
                                        </div>

                                    </div>

                                    {/* Input Skeleton */}
                                    <div className="border-t bg-white p-4">
                                        <div className="h-12 bg-gray-200 rounded-xl" />
                                    </div>

                                </div>
                            </div>
                        )
            }
        </div>
    )
}

export default Chat