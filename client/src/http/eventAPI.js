import {$authHost, $host} from "./index";



export const createEvent = async ({event_text, name, organiztion}) => {
    console.log('asdasd')
    const {data} = await $host.post('api/event/create', {event_text, name, organiztion} )

    return data
}

export const getAllEvents = async () => {
    const {data} = await $host.get(`api/event/getAll`)

    return data
}

export const deleteEvent = async (id) => {
    const {data} = await $host.get(`api/event/delete/${id}`)

    return data
}

export const deleteEvents = async (formdata) => {
    const {data} = await $host.post(`api/event/delete`, formdata)

    return data
}