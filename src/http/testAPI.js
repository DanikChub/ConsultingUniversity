import {$authHost, $host} from "./index";



export const createTest = async (title, time_limit, puncts) => {
   
    const {data} = await $authHost.post('api/test', {title, time_limit, puncts: puncts} )

    return data;
}

export const updateTestStatistic = async (user_id, test_id, punctsStatistic) => {
   
    const {data} = await $authHost.post('api/test/updateTest', {user_id, test_id, punctsStatistic} )

    return data;
}

export const getTestStatistic = async (user_id, test_id) => {
   
    const {data} = await $authHost.post('api/test/getStatistic', {user_id, test_id} )

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
