import axios from 'axios'

const guestInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
})

const authInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
})


const authInterceptor = (config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.authorization = 'Bearer ' + localStorage.getItem('token')
    }
    return config
}
authInstance.interceptors.request.use(authInterceptor)

export {
    guestInstance,
    authInstance
}