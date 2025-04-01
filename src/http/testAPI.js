import {$authHost, $host} from "./index";



export const createTest = async (title, time_limit, puncts) => {
   
    const {data} = await $authHost.post('api/test', {title, time_limit, puncts: puncts} )

    return data;
}


export const getOneTest = async (id) => {
    const {data} = await $authHost.get(`api/test/${id}`)

    return data;
}

export const remakeTest = async (id, title, time_limit, puncts) => {
    
    const {data} = await $authHost.post(`api/test/remake`, {id: id, title: title, time_limit, puncts: puncts})

    return data;
}
