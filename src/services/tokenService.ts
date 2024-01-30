import Cookies from 'js-cookie';
import axios from 'axios'
enum StorageItems {
    ACCESS_TOKEN = 'ACCESS_TOKEN',
    REFRESH_TOKEN = 'REFRESH_TOKEN',
}

interface Token {
    accessToken?: string;
    refreshToken?: string;
}

export const tokenService = {
    save(value:Token):void {
        if (value.accessToken) {
            Cookies.set(StorageItems.ACCESS_TOKEN, value.accessToken);
        }
        if (value.refreshToken) {
            Cookies.set(StorageItems.REFRESH_TOKEN, value.refreshToken);
        }
    },
    get():Token {
        return {
            accessToken: Cookies.get(StorageItems.ACCESS_TOKEN),
            refreshToken: Cookies.get(StorageItems.REFRESH_TOKEN)
        }
    },
    remove() {
        Cookies.remove(StorageItems.ACCESS_TOKEN);
        Cookies.remove(StorageItems.REFRESH_TOKEN);
    },

    async updateTokenRefresh() {
        try {
            const res = await axios.post('api-auth/Auth/RefreshToken', {
                accessToken: Cookies.get(StorageItems.ACCESS_TOKEN),
                refreshToken: Cookies.get(StorageItems.REFRESH_TOKEN)
            });
            return res; // Извлечь новый токен доступа
        } catch (error) {
            throw error; // Перехватывать ошибку для обработки
        }
    }
}


