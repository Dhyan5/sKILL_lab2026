// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getPool } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, role = 'student', room_number } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }
        if (!['student', 'admin'].includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }
        // Students must provide a room number
        if (role === 'student' && !room_number?.trim()) {
            return NextResponse.json({ error: 'Room number is required for students' }, { status: 400 });
        }

        const db = getPool();
        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await db.query(
            `INSERT INTO users (name, email, password, role, room_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, room_number`,
            [name, email, hashedPassword, role, room_number?.trim() || null]
        );

        const user = result.rows[0];
        const token = await signToken({ id: user.id, email: user.email, role: user.role, name: user.name });

        const response = NextResponse.json({ user, token }, { status: 201 });
        response.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
        return response;
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
