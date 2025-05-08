import {$authHost, $host} from "./index";



export const createPracticalWork = async (formData) => {
    const {data} = await $authHost.post('api/practical_work', formData )

    return data
}

export const createPracticalAnswer = async (id, answer) => {
    const {data} = await $authHost.post('api/practical_work/answer', {id, answer} )

    return data
}


export const getOnePracticalWork = async (id) => {
    const {data} = await $authHost.get(`api/practical_work/${id}`)

    return data
}

export const getAllPracticalWork = async () => {
    const {data} = await $authHost.get(`api/practical_work/`)

    return data
}

