import axios from 'axios';

let authToken = localStorage.getItem('authToken');

const AxiosInstance = axios.create({
    baseURL: 'https://duantotnghiep-api-a32664265dc1.herokuapp.com/'
});

AxiosInstance.interceptors.request.use(
    (config) => {
        // Kiểm tra xem token đã được lưu trữ hay không
        if (authToken) {
            // Nếu có token, thêm token vào header Authorization
            config.headers.Authorization = `Bearer ${authToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setAuthToken = (token) => {
    authToken = token;
    localStorage.setItem('authToken', token);
};

export default AxiosInstance;

