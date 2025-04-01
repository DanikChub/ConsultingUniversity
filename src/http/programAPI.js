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

export const remakeProgram = async (formData) => {
    const {data} = await $authHost.post(`api/program/remake`, formData)
    
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