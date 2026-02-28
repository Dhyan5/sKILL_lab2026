// lib/auth.ts
// JWT utility helpers using 'jose' (edge-compatible)
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback_secret_change_me'
);

export interface TokenPayload extends JWTPayload {
    id: number;
    email: string;
    role: 'student' | 'admin';
    name: string;
}

/** Sign a JWT valid for 7 days */
export async function signToken(payload: Omit<TokenPayload, keyof JWTPayload>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(SECRET);
}

/** Verify and decode a JWT, throwing on failure */
export async function verifyToken(token: string): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as TokenPayload;
}

/** Extract token from Authorization header or cookie */
export function extractToken(request: Request): string | null {
    const auth = request.headers.get('Authorization');
    if (auth?.startsWith('Bearer ')) return auth.slice(7);

    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/token=([^;]+)/);
    return match ? match[1] : null;
}
