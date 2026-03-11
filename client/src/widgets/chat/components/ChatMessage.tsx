import { useEffect, useRef, useState } from "react"
import {FiFile, FiDownload, FiMoreVertical, FiEdit2, FiTrash2, FiCheck} from "react-icons/fi"
import type { Message } from "../../../entities/chat/model/type"
import * as process from "node:process";
import {API_URL} from "../../../shared/config/api";

interface Props {
    message: Message
    isOwn: boolean
    own: 'USER' | 'ADMIN'
    isGrouped?: boolean
    avatarUrl?: string
    name?: string
    onEdit: (message: Message) => void
    lastReadUserMessageId: number
    lastReadAdminMessageId: number
    onDelete: (messageId: number) => void
    setPreviewImage: (newImg: string) => void
}

const makeTime = (time: string) => {
    const date = new Date(time)
    return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`
}

const ChatMessage: React.FC<Props> = ({ message,
                                          isOwn,
                                          own,
                                          onEdit,
                                          onDelete,
                                          setPreviewImage,
                                          isGrouped,
                                          avatarUrl,
                                          name,
                                          lastReadAdminMessageId,
                                          lastReadUserMessageId}) => {
    const [expanded, setExpanded] = useState(false)
    const [overflow, setOverflow] = useState(false)
    const textRef = useRef<HTMLDivElement>(null)

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    useEffect(() => {
        const el = textRef.current
        if (!el) return
        setOverflow(el.scrollHeight > el.clientHeight)
    }, [message.text])



    const isImage = (mime?: string) => {
        return mime?.startsWith("image/")
    }


    const attachments = message.message_attachments || []

    const images = attachments.filter(f => isImage(f.mimeType))
    const files = attachments.filter(f => !isImage(f.mimeType))

    const hasText = !!message.text
    const hasImages = images.length > 0
    const hasFiles = files.length > 0

    const isOnlyImages = hasImages && !hasText && !hasFiles
    const isOnlyFiles = hasFiles && !hasText && !hasImages

    const isRead =
        isOwn &&
        message.id <=
        (own === "USER"
            ? lastReadAdminMessageId
            : lastReadUserMessageId)
    return (
        <div
            className={`
      flex gap-2
      ${isOwn ? "justify-end" : "justify-start"}
      ${isGrouped ? "mt-1" : "mt-4"}
      animate-message
    `}
        >
            {/* AVATAR */}
            {!isOwn && !isGrouped && (
                avatarUrl ? (
                    <img
                        src={avatarUrl}
                        className="w-8 h-8 rounded-full object-cover shadow-sm"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600">
                        {name?.[0]?.toUpperCase()}
                    </div>
                )
            )}
            {!isOwn && isGrouped && <div className="w-8" />}

            <div className="relative group max-w-[65%]">

                {/* ======================= */}
                {/* 🖼 ONLY IMAGES MODE */}
                {/* ======================= */}

                {isOnlyImages && (
                    <div className="relative max-w-[420px]">

                        <div
                            className={`
              grid gap-1
              ${images.length === 1 && "grid-cols-1"}
              ${images.length === 2 && "grid-cols-2"}
              ${images.length >= 3 && "grid-cols-2"}
            `}
                        >
                            {images.slice(0, 4).map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setPreviewImage(API_URL + file.url)}
                                    className="relative overflow-hidden rounded-2xl cursor-pointer group"
                                >
                                    <img
                                        src={API_URL + file.url}
                                        className={`
                    w-full object-cover
                    ${images.length === 1 ? "max-h-[420px]" : "h-48"}
                    transition duration-300 group-hover:scale-[1.03]
                  `}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                                </div>
                            ))}
                        </div>

                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                            <span>{makeTime(message.createdAt)}</span>

                            {isOwn && (
                                <div className="flex items-center gap-[2px]">
                                    <FiCheck
                                        size={11}
                                        className={isRead ? "text-blue-300" : "text-white/70"}
                                    />
                                    {isRead && (
                                        <FiCheck
                                            size={11}
                                            className="text-blue-300 -ml-1"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ======================= */}
                {/* 📎 ONLY FILES MODE */}
                {/* ======================= */}

                {!isOnlyImages && !hasText && hasFiles && (
                    <div className="flex flex-col gap-2 max-w-[420px]">
                        {files.map((file) => (
                            <a
                                key={file.id}
                                href={API_URL + file.url}
                                download={file.originalName}
                                className={`
          group flex items-center gap-3 px-3 py-3 rounded-2xl
          transition shadow-sm hover:shadow-md
          ${
                                    isOwn
                                        ? "bg-[#3390ec] text-white"
                                        : "bg-white border border-gray-200 text-gray-800"
                                }
        `}
                            >
                                {/* FILE ICON */}
                                <div
                                    className={`
            w-10 h-10 rounded-xl flex items-center justify-center
            ${
                                        isOwn
                                            ? "bg-white/20"
                                            : "bg-[#3390ec]/10"
                                    }
          `}
                                >
                                    <FiFile
                                        size={18}
                                        className={isOwn ? "text-white" : "text-[#3390ec]"}
                                    />
                                </div>

                                {/* FILE INFO */}
                                <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium truncate max-w-[220px]">
            {file.originalName}
          </span>

                                    <span
                                        className={`
              text-xs
              ${isOwn ? "text-white/70" : "text-gray-500"}
            `}
                                    >
            {(file.size / 1024).toFixed(1)} KB
          </span>
                                </div>

                                {/* DOWNLOAD ICON */}
                                <FiDownload
                                    size={18}
                                    className={`
            ml-auto transition
            ${
                                        isOwn
                                            ? "text-white/70 group-hover:text-white"
                                            : "text-gray-400 group-hover:text-[#3390ec]"
                                    }
          `}
                                />
                            </a>
                        ))}

                        {/* TIME + READ */}
                        <div
                            className={`
        flex justify-end text-[11px] gap-1 pr-1
        ${isOwn ? "text-white/70" : "text-gray-500"}
      `}
                        >
                            <span>{makeTime(message.createdAt)}</span>

                            {isOwn && (
                                <>
                                    <FiCheck
                                        size={12}
                                        className={isRead ? "text-blue-200" : "text-white/60"}
                                    />
                                    {isRead && (
                                        <FiCheck
                                            size={12}
                                            className="text-blue-200 -ml-1"
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* ======================= */}
                {/* 📝 TEXT OR MIXED MODE */}
                {/* ======================= */}

                {!hasImages && hasText && !hasFiles && (
                    <div
                        className={`
                            relative
                            px-4 py-2.5 pr-[70px]
                            text-sm leading-relaxed break-words
                            rounded-2xl
                            shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                            transition
                            overflow-visible
                            ${isOwn
                                            ? "bg-[#3390ec] text-white"
                                            : "bg-gray-50 border border-gray-200 text-gray-800"}
                          `}
                    >
                        {message.text && (
                            <>
                                <div
                                    ref={textRef}
                                    className={`whitespace-pre-wrap break-words ${
                                        !expanded ? "line-clamp-4" : ""
                                    }`}
                                >
                                    {message.text}
                                </div>

                                {overflow && (
                                    <button
                                        onClick={() => setExpanded((v) => !v)}
                                        className="text-xs opacity-70 mt-1 hover:opacity-100 transition"
                                    >
                                        {expanded ? "Свернуть" : "Показать ещё"}
                                    </button>
                                )}
                            </>
                        )}



                        <div className="absolute right-3 bottom-1.5 flex items-end gap-1 text-[11px] opacity-70">
                            <span>{makeTime(message.createdAt)}</span>

                            {isOwn && (
                                <div className="flex items-center gap-[2px] ml-1">
                                    <FiCheck
                                        size={12}
                                        className={
                                            isRead ? "text-blue-200" : "text-white/70"
                                        }
                                    />
                                    {isRead && (
                                        <FiCheck
                                            size={12}
                                            className="text-blue-200 -ml-1"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {hasImages && hasText && !hasFiles && (
                    <div className="relative max-w-[420px]">

                        <div
                            className={`
                              grid gap-1
                              ${images.length === 1 && "grid-cols-1"}
                              ${images.length === 2 && "grid-cols-2"}
                              ${images.length >= 3 && "grid-cols-2"}
                            `}
                        >
                            {images.slice(0, 4).map((file) => (
                                <div
                                    key={file.id}
                                    onClick={() => setPreviewImage(API_URL + file.url)}
                                    className="relative overflow-hidden rounded-t-2xl cursor-pointer group"
                                >
                                    <img
                                        src={API_URL + file.url}
                                        className={`
                                        w-full object-cover
                                        ${images.length === 1 ? "max-h-[420px]" : "h-48"}
                                        transition duration-300 group-hover:scale-[1.03]
                                      `}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"/>
                                </div>
                            ))}
                        </div>

                        <div
                            className={`
                            relative
                            px-4 py-2.5 pr-[70px]
                            text-sm leading-relaxed break-words
                            rounded-b-2xl
                            shadow-[0_1px_2px_rgba(0,0,0,0.06)]
                            transition
                            overflow-visible
                            ${isOwn
                                ? "bg-[#3390ec] text-white"
                                : "bg-gray-50 border border-gray-200 text-gray-800"}
                          `}
                        >
                            {message.text && (
                                <>
                                    <div
                                        ref={textRef}
                                        className={`whitespace-pre-wrap break-words ${
                                            !expanded ? "line-clamp-4" : ""
                                        }`}
                                    >
                                        {message.text}
                                    </div>

                                    {overflow && (
                                        <button
                                            onClick={() => setExpanded((v) => !v)}
                                            className="text-xs opacity-70 mt-1 hover:opacity-100 transition"
                                        >
                                            {expanded ? "Свернуть" : "Показать ещё"}
                                        </button>
                                    )}
                                </>
                            )}


                            <div className="absolute right-3 bottom-1.5 flex items-end gap-1 text-[11px] opacity-70">
                                <span>{makeTime(message.createdAt)}</span>

                                {isOwn && (
                                    <div className="flex items-center gap-[2px] ml-1">
                                        <FiCheck
                                            size={12}
                                            className={
                                                isRead ? "text-blue-200" : "text-white/70"
                                            }
                                        />
                                        {isRead && (
                                            <FiCheck
                                                size={12}
                                                className="text-blue-200 -ml-1"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MENU */}
                {isOwn && (
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="p-1 rounded-full hover:bg-black/10 transition"
                        >
                            <FiMoreVertical size={16}/>
                        </button>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                className="absolute right-0 mt-2 w-36 bg-white shadow-xl rounded-xl border text-sm z-50 animate-fade-in"
                            >
                                <button
                                    onClick={() => {
                                        onEdit(message)
                                        setMenuOpen(false)
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-t-xl transition"
                                >
                                    <FiEdit2 size={14}/>
                                    Редактировать
                                </button>

                                <button
                                    onClick={() => {
                                        onDelete(message.id)
                                        setMenuOpen(false)
                                    }}
                                    className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-50 text-red-600 rounded-b-xl transition"
                                >
                                    <FiTrash2 size={14}/>
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatMessage
