export interface TokensResponse {
    access: string;
    refresh: string;
}

export interface JwtPayload {
    username: string;
}
