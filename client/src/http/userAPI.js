import {$authHost, $host} from "./index";
import { jwtDecode } from "jwt-decode";


export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const forgotPassword = async (email) => {
    const {data} = await $host.post('api/user/forgot_password', {email})

    return data
}

export const checkForgotPassword = async (email, code, pass) => {
    const {data} = await $host.post('api/user/check_forgot_password', {email, code, pass})

    return data
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const getUserById = async (id) => {
    const {data} = await $authHost.get(`api/user/getUser/${id}`)
    
    return data;
}

export const getAllUsers = async () => {
    const {data} = await $authHost.get(`api/user/getUser/`)
    
    return data;
}

export const getUsersWithLastMessages = async () => {
    const {data} = await $authHost.get(`api/user/getUsersWithLastMessages/`)
    
    return data;
}

export const getAllUsersGraduation = async () => {
    const {data} = await $authHost.get(`api/user/getAllUsersGraduation/`)
    
    return data;
}

export const getAllAdmins = async () => {
    const {data} = await $authHost.get(`api/user/getAdmins/`)
    
    return data;
}

export const searchUsers = async (page, q) => {
    const {data} = await $authHost.get(`api/user/search/${page}?q=${q}`)
    
    return data;
}

export const getAllUsersWithPage = async (page, sort_type, sort_down) => {
    const {data} = await $authHost.get(`api/user/getAllUser/${page}?sort_type=${sort_type}&sort_down=${sort_down}`)
    
    return data;
}

export const registrateUser = async (email, password, role, name, number, organiztion, programs_id, diplom, inn, address) => {
    const {data} = await $authHost.post('api/user/registration', {email, password, role, name, number, organiztion, programs_id, diplom, inn, address})

    return data
}

export const registrateAdmin = async (email, password, role, name, number) => {
    const {data} = await $authHost.post('api/user/registrationAdmin', {email, password, role, name, number})

    return data
}

export const remakeUser = async (id, email, password, role, name, number, organiztion, programs_id, diplom, inn, address) => {
    const {data} = await $authHost.post('api/user/remake', {id, email, password, role, name, number, organiztion, programs_id, diplom, inn, address})

    return data
}

export const remakeAdmin = async (id, email, password, name, number) => {
    const {data} = await $authHost.post('api/user/remakeAdmin', {id, email, password, name, number})

    return data
}


export const deleteUser = async (id) => {
    const {data} = await $authHost.post('api/user/delete', {id})

    return data
}
export const setWellTest = async(id) => {
    const {data} = await $authHost.post('api/user/set_well_tests', {id});

    return data;
}

export const setWellVideos = async(id) => {
    const {data} = await $authHost.post('api/user/set_well_videos', {id});

    return data;
}

export const setWellPracticalWorks = async(id) => {
    const {data} = await $authHost.post('api/user/set_well_practical_works', {id});

    return data;
}

export const setGraduationDate = async (id, graduation_date) => {
    const {data} = await $host.post('api/user/setGraduationDate', {id, graduation_date})

    return data
}