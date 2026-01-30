import {$authHost, $host} from "../../../shared/api/axios";



export const sendMessage = async (message, user_id, role) => {
    const {data} = await $host.post('api/chat/sendMessages', {message, user_id, role} )

    return data
}

export const getMessages = async (user_id) => {
    const {data} = await $host.get(`api/chat/getMessages/${user_id}`)

    return data
}

export const deleteMessages = async (id) => {
    const {data} = await $host.get(`api/chat/deleteMessages/${id}`)

    return data
}


export const getUnreadCount = async (id, viewerRole) => {
    const {data} = await $host.get(`api/chat/getUnreadCount/${id}?viewerRole=${viewerRole}`)

    return data
}
export const getAllUserUnreadCount = async () => {
    const {data} = await $host.get(`api/chat/getUnreadCount/`)

    return data
}


export const markChatAsRead = async (id, viewerRole) => {
    const {data} = await $host.post(`api/chat/markChatAsRead/${id}?viewerRole=${viewerRole}`)

    return data
}

