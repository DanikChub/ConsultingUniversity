import {$authHost, $host} from "../../../shared/api/axios";



export const createApplication = async (name, email, number) => {
    const {data} = await $host.post('api/application', {name, email, number} )

    return data
}


export const getAllApplications = async () => {
    const {data} = await $authHost.get('api/application')

    return data
}


export const destroyApplication = async (id) => {
    const {data} = await $authHost.post('api/application/delete', {id})

    return data;
}