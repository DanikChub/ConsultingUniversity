/*
========================
        BASE TYPES
========================
*/

import type {User} from "../../user/model/type";

export type ChatStatus = "open" | "closed"

export type SenderType = "USER" | "ADMIN"

export interface MessageAttachment {
    id: number
    messageId: number
    originalName: string
    storedName: string
    mimeType: string
    size: number
    storage: "local" | "s3"
    url: string
    createdAt: string
    updatedAt: string
}

export interface Message {
    id: number
    chatId: number
    senderId: number
    senderType: "USER" | "ADMIN"
    text: string | null
    createdAt: string
    editedAt?: string | null
    readAt?: string | null
    message_attachments?: MessageAttachment[]
}


export interface Chat {
    id: number
    userId: number
    status: ChatStatus
    lastMessageAt: string | null
    unreadCount: number
    createdAt: string
    updatedAt: string
    lastReadAdminMessageId: number
    lastReadUserMessageId: number
    user?: User
    messages?: Message[]
}

/*
========================
        PAGINATION
========================
*/

export interface PaginatedChats {
    total: number
    pages: number
    currentPage: number
    rows: Chat[]
}

/*
========================
        DTO
========================
*/

export interface SendMessageDto {
    text?: string
    files?: File[]
}

export interface GetMessagesParams {
    chatId: number
    page?: number
    limit?: number
    before?: string | null
}