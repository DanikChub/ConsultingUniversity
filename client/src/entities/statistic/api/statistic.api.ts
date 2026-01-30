import {$authHost} from "../../../shared/api/axios";



export const updateVideos = async (users_id, programs_id, punct_id) => {
    const {data} = await $authHost.post('api/statistic/updateVideos', {users_id, programs_id, punct_id} )

    return data
}

export const updateTests = async (users_id, programs_id, punct_id, theme_id) => {
    const {data} = await $authHost.post('api/statistic/updateTests', {users_id, programs_id, punct_id, theme_id})

    return data
}

export const updatePracticalWorks = async (users_id, programs_id, theme_id) => {

    const {data} = await $authHost.post('api/statistic/updatePracticalWorks', {users_id, programs_id, theme_id})

    return data
}

export const getStatistic = async (users_id, programs_id) => {
    const {data} = await $authHost.post('api/statistic/', {users_id, programs_id})

    return data
}
