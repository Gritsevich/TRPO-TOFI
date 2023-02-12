import { guestInstance, authInstance } from './index.js'




export const adminCreate = async (body) => {
    const { data } = await authInstance.post('order/admin/create', body)
    return data
}

export const adminGetAll = async () => {
    const { data } = await authInstance.get('order/admin/getall')
    return data
}

export const adminGetUser = async (id) => {
    const { data } = await authInstance.get(`order/admin/getall/user/${id}`)
    return data
}

export const adminGetOne = async (id) => {
    const { data } = await authInstance.get(`order/admin/getone/${id}`)
    return data
}

export const adminDelete = async (id) => {
    const { data } = await authInstance.delete(`order/admin/delete/${id}`)
    return data
}


export const userCreate = async (body) => {
    const { data } = await authInstance.post('order/user/create', body)
    return data
}

export const userGetAll = async () => {
    const { data } = await authInstance.get('order/user/getall')
    return data
}

export const userGetOne = async (id) => {
    const { data } = await authInstance.get(`order/user/getone/${id}`)
    return data
}


export const guestCreate = async (body) => {
    const { data } = await guestInstance.post('order/guest/create', body)
    return data
}
