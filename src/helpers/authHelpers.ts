import Cookies from "js-cookie";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "@/constants";

export function isAuthenticated(): boolean {
    return !!Cookies.get(ACCESS_TOKEN);
}

export function setAccessToken(token: string): void {
    Cookies.set(ACCESS_TOKEN, token);
}

export function getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN);
}

export function setRefreshToken(token: string): void {
    Cookies.set(REFRESH_TOKEN, token);
}

export function getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN);
}

export function removeTokens(): void {
    Cookies.remove(ACCESS_TOKEN);
    Cookies.remove(REFRESH_TOKEN);
}



