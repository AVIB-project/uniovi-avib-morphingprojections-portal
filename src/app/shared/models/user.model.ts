import { Role } from "./role.model";

export interface User{
    userId?: String;
    organizationId: string;
    externalId?: String;
    username: String;
    firstName: String;
    lastName: String;
    email: String;
    address?: String;
    city?: String;
    country?: String;
    phone?: String;    
    notes?: String;
    language: String;    
    role: Role;
    active: boolean;
}