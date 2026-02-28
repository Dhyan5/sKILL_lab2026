'use client';
// app/register/page.tsx — Apple Pro registration with room number field

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

const roleOptions = [{ value: 'student', label: 'Student' }, { value: 'admin', label: 'Admin' }];

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', room_number: '' });
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        if (form.role === 'student' && !form.room_number.trim()) { toast.error('Please enter your room number'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || 'Registration failed'); return; }
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            toast.success('Account created');
            setShowLoader(true);
            setTimeout(() => router.push(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student'), 900);
        } catch { toast.error('Network error'); }
        finally { setLoading(false); }
    }

    return (
        <>
            <Loader show={showLoader} />
            <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ width: '100%', maxWidth: 380 }}
                >
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
                            style={{ width: 64, height: 64, borderRadius: 18, background: 'rgba(28,28,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </motion.div>
                        <h1 style={{ fontSize: '1.625rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 6px' }}>
                            Create Account
                        </h1>
                        <p style={{ fontSize: '0.9375rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>
                            Join Sahyadri Hostel Portal
                        </p>
                    </div>

                    {/* Card */}
                    <div style={{ background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 16, padding: '28px 28px' }}>
                        <form onSubmit={handleSubmit}>

                            {/* Text fields */}
                            {([
                                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
                                { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                                { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
                            ] as const).map(({ key, label, type, placeholder }) => (
                                <div key={key} style={{ marginBottom: 16 }}>
                                    <label className="label">{label}</label>
                                    <input type={type} placeholder={placeholder} className="input-field"
                                        value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })} required />
                                </div>
                            ))}

                            {/* Account type */}
                            <div style={{ marginBottom: 16 }}>
                                <label className="label">Account Type</label>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    {roleOptions.map(o => (
                                        <button key={o.value} type="button"
                                            onClick={() => setForm({ ...form, role: o.value })}
                                            style={{
                                                flex: 1, padding: '9px 0', borderRadius: 10,
                                                fontSize: '0.875rem', fontWeight: 500, fontFamily: 'inherit', cursor: 'pointer',
                                                transition: 'all 0.3s ease',
                                                background: form.role === o.value ? 'rgba(0,113,227,0.18)' : 'rgba(255,255,255,0.05)',
                                                border: form.role === o.value ? '1px solid rgba(0,113,227,0.4)' : '1px solid rgba(255,255,255,0.08)',
                                                color: form.role === o.value ? '#0071e3' : '#86868b',
                                            }}>
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Room number — only for students */}
                            {form.role === 'student' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    style={{ marginBottom: 16, overflow: 'hidden' }}>
                                    <label className="label">Room Number</label>
                                    <div style={{ position: 'relative' }}>
                                        {/* Door icon inside input */}
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#636366" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                                            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                                            <path d="M13 4H6a2 2 0 0 0-2 2v14" /><path d="M18 18a2 2 0 0 0 2-2V8l-6-4H6" /><path d="M12 12v.01" />
                                        </svg>
                                        <input
                                            type="text" placeholder="e.g. A-204"
                                            className="input-field"
                                            style={{ paddingLeft: 34 }}
                                            value={form.room_number}
                                            onChange={e => setForm({ ...form, room_number: e.target.value })}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.6875rem', color: '#48484a', marginTop: 5, letterSpacing: '0.01em' }}>
                                        Enter your assigned hostel room (e.g. A-101, B-204)
                                    </p>
                                </motion.div>
                            )}

                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
                                className="btn-primary" style={{ width: '100%', marginTop: 6 }}>
                                {loading ? 'Creating account…' : 'Create Account'}
                            </motion.button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: '#636366' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: '#0071e3', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </>
    );
}
