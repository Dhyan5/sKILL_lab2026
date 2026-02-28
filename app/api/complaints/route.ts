// app/api/complaints/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';
import { extractToken, verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
    try {
        const token = extractToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await verifyToken(token);
        const db = getPool();
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const category = searchParams.get('category');

        let query: string;
        let params: (string | number)[] = [];

        if (user.role === 'admin') {
            // Include room_number for admin view
            query = `
        SELECT c.*, u.name AS user_name, u.email AS user_email, u.room_number AS user_room
        FROM complaints c
        JOIN users u ON c.user_id = u.id
        WHERE 1=1
      `;
            if (status) { query += ` AND c.status = $${params.length + 1}`; params.push(status); }
            if (category) { query += ` AND c.category = $${params.length + 1}`; params.push(category); }
            query += ' ORDER BY c.created_at DESC';
        } else {
            query = 'SELECT * FROM complaints WHERE user_id = $1';
            params.push(user.id);
            if (status) { query += ` AND status = $${params.length + 1}`; params.push(status); }
            if (category) { query += ` AND category = $${params.length + 1}`; params.push(category); }
            query += ' ORDER BY created_at DESC';
        }

        const result = await db.query(query, params);
        return NextResponse.json({ complaints: result.rows });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const token = extractToken(req);
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = await verifyToken(token);
        if (user.role !== 'student') {
            return NextResponse.json({ error: 'Only students can submit complaints' }, { status: 403 });
        }

        const { category, description, priority = 'medium' } = await req.json();
        if (!category || !description) {
            return NextResponse.json({ error: 'Category and description are required' }, { status: 400 });
        }

        const db = getPool();
        const result = await db.query(
            `INSERT INTO complaints (user_id, category, description, priority)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [user.id, category, description, priority]
        );
        return NextResponse.json({ complaint: result.rows[0] }, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
}
