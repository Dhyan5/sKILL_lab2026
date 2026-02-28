'use client';
// app/dashboard/student/submit/page.tsx — Apple Pro complaint submission

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const CATEGORIES = ['Plumbing', 'Electrical', 'Furniture', 'Cleanliness', 'Security', 'Internet', 'Food', 'Other'];
const PRIORITIES = [
    { value: 'low', label: 'Low', color: '#30d158', bg: 'rgba(48,209,88,0.1)', border: 'rgba(48,209,88,0.25)' },
    { value: 'medium', label: 'Medium', color: '#ffd60a', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.25)' },
    { value: 'high', label: 'High', color: '#ff453a', bg: 'rgba(255,69,58,0.1)', border: 'rgba(255,69,58,0.25)' },
];

export default function SubmitComplaintPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [form, setForm] = useState({ category: '', description: '', priority: 'medium' });
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.category) { toast.error('Choose a category'); return; }
        if (form.description.trim().length < 10) { toast.error('Description too short (min 10 chars)'); return; }
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/complaints', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || 'Failed to submit'); return; }
            setDone(true);
            setTimeout(() => router.push('/dashboard/student'), 2200);
        } catch { toast.error('Network error'); }
        finally { setLoading(false); }
    }

    if (!user) { router.push('/login'); return null; }

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
            <Sidebar role="student" userName={user.name} roomNumber={user.room_number} />
            <div style={{ flex: 1, marginLeft: 240 }}>
                <Navbar title="New Complaint" />
                <main style={{ padding: '36px 40px', maxWidth: 640, margin: '0 auto' }}>

                    <Link href="/dashboard/student"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: '#636366', textDecoration: 'none', marginBottom: 28 }}>
                        <ArrowLeft size={14} strokeWidth={1.5} /> Back
                    </Link>

                    <AnimatePresence mode="wait">
                        {done ? (
                            /* Success state */
                            <motion.div key="done"
                                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                style={{
                                    background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
                                    padding: '60px 24px', textAlign: 'center',
                                }}>
                                <motion.div animate={{ scale: [1, 1.12, 1] }} transition={{ duration: 0.6 }}
                                    style={{ marginBottom: 18, display: 'flex', justifyContent: 'center' }}>
                                    <CheckCircle2 size={40} color="#30d158" strokeWidth={1.5} />
                                </motion.div>
                                <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
                                    Complaint Submitted
                                </p>
                                <p style={{ fontSize: '0.875rem', color: '#636366', margin: 0 }}>
                                    We&apos;ll review and respond shortly.
                                </p>
                            </motion.div>
                        ) : (
                            /* Form */
                            <motion.div key="form" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
                                    padding: '28px 28px',
                                }}>
                                <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.03em', margin: '0 0 26px' }}>
                                    Submit a Complaint
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    {/* Category */}
                                    <div style={{ marginBottom: 24 }}>
                                        <label className="label">Category</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                                            {CATEGORIES.map(cat => (
                                                <motion.button key={cat} type="button"
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                    onClick={() => setForm({ ...form, category: cat })}
                                                    style={{
                                                        padding: '9px 6px', borderRadius: 10,
                                                        fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
                                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                                        background: form.category === cat ? 'rgba(0,113,227,0.15)' : 'rgba(255,255,255,0.04)',
                                                        border: form.category === cat ? '1px solid rgba(0,113,227,0.4)' : '1px solid rgba(255,255,255,0.07)',
                                                        color: form.category === cat ? '#0071e3' : '#86868b',
                                                    }}>
                                                    {cat}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Priority */}
                                    <div style={{ marginBottom: 24 }}>
                                        <label className="label">Priority</label>
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            {PRIORITIES.map(p => (
                                                <motion.button key={p.value} type="button"
                                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                                    onClick={() => setForm({ ...form, priority: p.value })}
                                                    style={{
                                                        flex: 1, padding: '9px 0', borderRadius: 10,
                                                        fontSize: '0.875rem', fontWeight: 500, fontFamily: 'inherit',
                                                        cursor: 'pointer', transition: 'all 0.3s ease',
                                                        background: form.priority === p.value ? p.bg : 'rgba(255,255,255,0.04)',
                                                        border: form.priority === p.value ? `1px solid ${p.border}` : '1px solid rgba(255,255,255,0.07)',
                                                        color: form.priority === p.value ? p.color : '#86868b',
                                                    }}>
                                                    {p.label}
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div style={{ marginBottom: 26 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                                            <label className="label" style={{ margin: 0 }}>Description</label>
                                            <span style={{ fontSize: '0.75rem', color: '#48484a' }}>{form.description.length} chars</span>
                                        </div>
                                        <textarea
                                            className="input-field"
                                            placeholder="Describe the issue clearly…"
                                            rows={5}
                                            style={{ resize: 'none' }}
                                            value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <motion.button type="submit" disabled={loading}
                                        whileHover={{ scale: loading ? 1 : 1.01 }} whileTap={{ scale: loading ? 1 : 0.99 }}
                                        className="btn-primary" style={{ width: '100%' }}>
                                        {loading ? 'Submitting…' : 'Submit Complaint'}
                                    </motion.button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
