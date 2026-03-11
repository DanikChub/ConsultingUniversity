

/*
========================
        USER
========================
*/

// создать чат (если нет активного)
import type {Chat, GetMessagesParams, Message, PaginatedChats, SendMessageDto} from "../model/type";
import {$authHost} from "../../../shared/api/axios";

export const createChat = async (userId: number): Promise<Chat> => {
    const { data } = await $authHost.post<Chat>(`api/chat/${userId}`)
    return data
}

// мои чаты
export const getMyChats = async (): Promise<Chat[]> => {
    const { data } = await $authHost.get<Chat[]>("api/chat/my")
    return data
}

// получить один чат
export const getChatById = async (chatId: number): Promise<Chat> => {
    const { data } = await $authHost.get<Chat>(`api/chat/${chatId}`)
    return data
}

// получить сообщения (с пагинацией)
export const getMessages = async (
    params: GetMessagesParams
): Promise<Message[]> => {
    const { chatId, limit = 40, before } = params

    const query = new URLSearchParams({
        limit: String(limit),
        ...(before ? { before } : {})
    }).toString()

    const { data } = await $authHost.get<Message[]>(
        `api/chat/${chatId}/messages?${query}`
    )

    return data
}

// отправить сообщение
export const sendMessage = async (
    chatId: number,
    payload: SendMessageDto
): Promise<Message> => {

    const formData = new FormData()

    if (payload.text) {
        formData.append("text", payload.text)
    }

    if (payload.files) {
        payload.files.forEach(file => {
            formData.append("files", file)
        })
    }

    const { data } = await $authHost.post<Message>(
        `api/chat/${chatId}/messages`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )

    return data
}


/*
========================
        ADMIN
========================
*/

// все чаты (пагинация)
export const getAllChats = async (
    page = 1,
    limit = 20,
    status?: "open" | "closed"
): Promise<PaginatedChats> => {

    const query = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        ...(status ? { status } : {})
    })

    const { data } = await $authHost.get<PaginatedChats>(
        `api/chat?${query.toString()}`
    )

    return data
}

// закрыть чат
export const closeChat = async (chatId: number): Promise<Chat> => {
    const { data } = await $authHost.patch<{ chat: Chat }>(
        `api/chat/${chatId}/close`
    )

    return data.chat
}

// закрыть чат
export const markMessagesAsRead = async (chatId: number): Promise<Chat> => {
    const { data } = await $authHost.post<{ chat: Chat }>(
        `api/chat/${chatId}/read`
    )

    return data.chat
}

export const deleteMessage = async (messageId: number): Promise<Chat> => {
    const { data } = await $authHost.delete<{ chat: Chat }>(
        `api/chat/messages/${messageId}`
    )

    return data.chat
}

export const updateMessage = async (
    messageId: number,
    payload: SendMessageDto
): Promise<Message> => {

    const formData = new FormData()

    if (payload.text) {
        formData.append("text", payload.text)
    }


    const { data } = await $authHost.patch<Message>(
        `api/chat/messages/${messageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    )

    return data
}