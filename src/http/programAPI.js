import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";


export const getOneProgram = async (id) => {
    const {data} = await $authHost.get(`api/program/${id}`)

    return data;
}


export const createProgram = async (formData) => {
    const {data} = await $authHost.post(`api/program/`, formData)
    
    return data;
}

export const remakeProgram = async (id, title, admin_id, number_of_practical_work, number_of_test, number_of_videos, themes) => {
    const {data} = await $authHost.post(`api/program/remake`, {id, title, admin_id, number_of_practical_work, number_of_test, number_of_videos, themes})
    
    return data;
}

export const deleteProgram = async (id) => {
    const {data} = await $authHost.post(`api/program/delete`, {id})
    
    return data;
}

export const getAllPrograms = async (id) => {
    const {data} = await $authHost.get(`api/program/`)

    return data;
}