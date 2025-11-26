import {$authHost, $host} from "./index";



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
