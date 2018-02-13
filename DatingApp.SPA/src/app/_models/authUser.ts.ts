import { Users } from "./Users";

export interface AuthUser {
    tokenString: string;
    user: Users;
}