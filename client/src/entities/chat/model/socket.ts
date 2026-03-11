import type {Message} from "./type";


export interface ServerToClientEvents {
    new_message: (message: Message) => void

    message_updated: (message: Message) => void

    message_deleted: (data: {
        messageId: number
        chatId: number
    }) => void

    messages_read: (data: {
        chatId: number
        readerId: number
        readAt: string
    }) => void

    user_typing: (data: {
        chatId: number
        userId: number
    }) => void

    user_online: (data: { userId: number }) => void

    user_offline: (data: { userId: number }) => void


    user_online_status: (data: { userId: number, isOnline: boolean }) => void
}

export interface ClientToServerEvents {
    join_chat: (chatId: number) => void
    typing: (data: { chatId: number }) => void
    mark_read: (data: { chatId: number }) => void
    check_user_online: (userId: number) => void
}