import axios, { AxiosRequestConfig } from "axios";

// Обычный axios экземпляр (без авторизации)
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Axios с авторизацией
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Интерсептор для добавления токена
const authInterceptor = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
};

// Применяем интерсептор
$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
