import { ACCESS_TOKEN } from './constants';
import axios from 'axios';

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});
Api.interceptors.request.use(
    (config) => {
        const access_token = localStorage.getItem(ACCESS_TOKEN);
        if (access_token){
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }   
)

export default Api;