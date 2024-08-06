import { Role } from "./role.model";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    role: Role;
    language: string;
    externalId: string;
    active: boolean;
}