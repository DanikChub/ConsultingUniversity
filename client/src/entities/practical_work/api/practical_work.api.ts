import {$authHost, $host} from "../../../shared/api/axios";



export const createPracticalWork = async (formData) => {
    const {data} = await $authHost.post('api/practical_work', formData )

    return data
}

export const deletePracticalWork = async (id) => {
    const {data} = await $authHost.post('api/practical_work/delete', {id} )

    return data
}

export const createPracticalAnswer = async (id, answer, test) => {
    const {data} = await $authHost.post('api/practical_work/answer', {id, answer, test} )

    return data
}


export const getOnePracticalWork = async (id) => {
    const {data} = await $authHost.get(`api/practical_work/${id}`)

    return data
}

export const getOnePracticalWorkToUser = async (users_id, program_id, theme_id, punct_id) => {

    const {data} = await $authHost.post(`api/practical_work/getOneToUser/`, {users_id, program_id, theme_id, punct_id})

    return data
}

export const getAllPracticalWork = async () => {
    const {data} = await $authHost.get(`api/practical_work/`)

    return data
}

