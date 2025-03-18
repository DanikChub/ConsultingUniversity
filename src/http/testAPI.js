import {$authHost, $host} from "./index";



export const createTest = async (title, puncts) => {
   
    const {data} = await $authHost.post('api/test', {title, puncts: puncts} )

    return data;
}


export const getOneTest = async (id) => {
    const {data} = await $authHost.get(`api/test/${id}`)

    return data;
}
