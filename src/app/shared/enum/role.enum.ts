let Role = ["ADMIN", "USER", "GUEST"]; 

export type RoleType = typeof Role[number];

export enum RoleEnum {
    "Administrator" = "ADMIN",
    "User" = "USER",
    "Guest" = "GUEST"
}