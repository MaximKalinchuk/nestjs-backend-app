import jwt_decode from 'jwt-decode';

export async function decodeToken(token: string) {
    return await jwt_decode(token)
}