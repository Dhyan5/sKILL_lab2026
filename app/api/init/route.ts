// app/api/init/route.ts
// Called once to create DB tables. Idempotent (CREATE IF NOT EXISTS).
import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
    try {
        await initDB();
        return NextResponse.json({ message: 'Database initialized successfully' });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
