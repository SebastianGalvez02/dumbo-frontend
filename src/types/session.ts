import type {Role} from "./role";

export interface Session {
    id: number;
    name: string;
    lastName: string;
    mail: string;
    role: Role;
    hasToChangePassword: boolean;
    token: string;
    tokenExpiration: string;
}
