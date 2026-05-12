import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, saveTokens, clearTokens } from "./auth";


interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
 baseURL: BASE_URL,
 headers: {
   "Content-Type": "application/json",  
 },   
});

api.interceptors.request.use((config) => {
  const token =getAccessToken();
  if (token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError)=>{
        const originalRequest = error.config as RetryConfig;
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;
        
        try{
         const refreshToken = getRefreshToken();
         if(!refreshToken)throw new Error("No hay refresh token");

         const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const {access_token} = response.data; 
         saveTokens(access_token, refreshToken);

        // Reintenta la request original con el nuevo token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
    }catch{
      clearTokens()
      window.location.href = "/login"  
    }
 }
 return Promise.reject(error);
    }
);
export default api;