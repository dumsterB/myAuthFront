import AuthModule from "@dumster/auth_module";
export const authModule = new AuthModule(import.meta.env.VITE_APP_API_URL);