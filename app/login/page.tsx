'use client';
// app/login/page.tsx — Apple Pro login page

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || 'Sign in failed'); return; }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            toast.success(`Welcome, ${data.user.name}`);
            setShowLoader(true);
            setTimeout(() => router.push(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student'), 900);
        } catch { toast.error('Network error'); }
        finally { setLoading(false); }
    }

    return (
        <>
            <Loader show={showLoader} />
            <div style={{
                minHeight: '100vh', background: '#000', display: 'flex',
                alignItems: 'center', justifyContent: 'center', padding: '0 20px',
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ width: '100%', maxWidth: 380 }}
                >
                    {/* App icon */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{
                                width: 64, height: 64, borderRadius: 18,
                                background: 'rgba(28,28,30,0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px',
                            }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                        </motion.div>
                        <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 6px' }}>
                            Sign In
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>
                            Sahyadri Hostel Portal
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{
                        background: 'rgba(28,28,30,0.72)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        borderRadius: 16, padding: '28px 28px',
                    }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: 16 }}>
                                <label className="label">Email</label>
                                <input
                                    type="email" placeholder="you@example.com"
                                    className="input-field"
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 22 }}>
                                <label className="label">Password</label>
                                <input
                                    type="password" placeholder="••••••••"
                                    className="input-field"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    required
                                />
                            </div>
                            <motion.button
                                type="submit" disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.99 }}
                                className="btn-primary"
                                style={{ width: '100%' }}
                            >
                                {loading ? 'Signing in…' : 'Sign In'}
                            </motion.button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#636366' }}>
                        New to Sahyadri?{' '}
                        <Link href="/register" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>
                            Create account
                        </Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
}
