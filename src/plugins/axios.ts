import axios, {type AxiosInstance} from "axios";
import { HttpResponseStatuses } from "../types/enum";
import {tokenService} from "../services/TokenService.ts";
import { ElMessage } from "element-plus";

interface Token {
    accessToken?: string;
    refreshToken?: string;
}


const $axios: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "Access-Control-Allow-Origin": "*",
    },
});

$axios.interceptors.request.use(
    (config: any) => {
        config.headers["Accept-Language"] = "uz";

        const token:Token = tokenService.get();

        if (token && token.accessToken) {
            const encodedToken = encodeURIComponent(token.accessToken);
            config.headers.Authorization = "Bearer " + encodedToken;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];
$axios.interceptors.response.use(
    (response: any) => {
        const resData = response.data;
        if (
            !resData?.success &&
            resData?.message &&
            Object.keys(resData.message).length > 0
        ) {
            Object.values(resData.message).forEach((value: any) => {
                if (typeof value === "string") {
                    ElMessage.error({ message: value, showClose: true });
                } else {
                    (value as String[]).forEach((error:any) => {
                        ElMessage.error({ message: error.message, showClose: true });
                    });
                }
            });
        }
        return Promise.resolve(response);
    },
    async (error: any) => {
        console.log(error, "err");
        if (!error.code) {
            const originalRequest = error.config;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const data = await tokenService.updateTokenRefresh(); // Use 'await' here
                    tokenService.save({ accessToken: data.data.accessToken });
                    tokenService.save({ refreshToken: data.data.refreshToken }); // Assuming the 'save' function sets both access and refresh tokens
                    originalRequest.headers.Authorization = "Bearer " + data.data.accessToken;

                    return $axios(originalRequest);
                } catch (refreshError) {
                    window.location.href = "/login";
                    ElMessage.error({
                        message: "Failed to refresh token",
                        showClose: true,
                    });
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                return new Promise<string>((resolve) => {
                    refreshSubscribers.push((token) => {
                        originalRequest.headers.Authorization = "Bearer " + token;
                        resolve($axios(originalRequest));
                    });
                });
            }
        } else {
            let errorMessages = Object.values(error.response.data.errors)
                .map(errorArray => errorArray.join('. '))
                .join('<br /><br /> '); // Теперь каждое сообщение об ошибке будет на новой строке

            ElMessage.error({
                message: errorMessages,
                showClose: true,
                dangerouslyUseHTMLString: true, // Это позволяет интерпретировать HTML-теги, если твоя библиотека уведомлений это поддерживает
            });
            return Promise.reject(error);
        }
    }
);

export default $axios;
