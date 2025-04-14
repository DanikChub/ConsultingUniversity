import {$authHost, $host} from "./index";



export const createPracticalWork = async (formData) => {
    const {data} = await $authHost.post('api/practical_work', formData )

    return data
}


export const getOneApplications = async (id) => {
    const {data} = await $authHost.get(`api/practical_work/${id}`)

    return data
}
