export interface UserSession{
    id: String;
    userId: String;
    username: String;
    start: number;
    lastAccess: number;
    ipAddress: String;
}