let Role = ["ADMIN", "USER", "GUEST"]; 

export type RoleType = typeof Role[number];

export enum RoleEnum {
    "ADMIN" = "ADMIN",
    "User" = "USER",
    "Guest" = "GUEST"
}