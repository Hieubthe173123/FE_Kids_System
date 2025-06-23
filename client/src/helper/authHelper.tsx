import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    role: string;
    [key: string]: unknown;
}

export const getUserFromToken = (token: string) => {
    try {
        return jwtDecode(token) as DecodedToken;
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
};
