'use client';
// app/dashboard/student/page.tsx — Apple Pro student dashboard with room number

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Wrench, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';
import Loader from '@/components/Loader';

interface User { id: number; name: string; email: string; role: 'student' | 'admin'; room_number?: string; }

function StatCard({ icon: Icon, label, value, accent, delay }: {
    icon: React.ElementType; label: string; value: number; accent: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ marginBottom: 16 }}><Icon size={18} color={accent} strokeWidth={1.5} /></div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '0.8125rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>{label}</p>
        </motion.div>
    );
}

export default function StudentDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const s = localStorage.getItem('user');
        if (!s) { router.push('/login'); return; }
        const u: User = JSON.parse(s);
        if (u.role !== 'student') { router.push('/dashboard/admin'); return; }
        setUser(u);
        fetchComplaints();
    }, []);

    async function fetchComplaints() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            setComplaints((await res.json()).complaints);
        } catch { toast.error('Failed to load complaints'); }
        finally { setLoading(false); }
    }

    if (!user) return <Loader show />;

    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
            <Sidebar role="student" userName={user.name} roomNumber={user.room_number} />

            <div style={{ flex: 1, marginLeft: 240 }}>
                <Navbar title="Overview" />

                <main style={{ padding: '36px 40px', maxWidth: 900, margin: '0 auto' }}>

                    {/* Greeting + room number badge */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                        style={{ marginBottom: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                            <div>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 6px' }}>
                                    Good morning, {user.name.split(' ')[0]}
                                </h2>
                                <p style={{ fontSize: '0.9375rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>
                                    Here&apos;s a summary of your hostel requests.
                                </p>
                            </div>
                            {/* Room number display */}
                            {user.room_number && (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                                    style={{
                                        background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                                        border: '1px solid rgba(255,255,255,0.09)', borderRadius: 14,
                                        padding: '14px 20px', textAlign: 'center', minWidth: 110,
                                    }}>
                                    <p style={{ fontSize: '0.6875rem', color: '#636366', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 4px' }}>YOUR ROOM</p>
                                    <p style={{ fontSize: '1.375rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.03em', margin: 0 }}>
                                        {user.room_number}
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 110 }} />)}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
                            <StatCard icon={ClipboardList} label="Total Submitted" value={complaints.length} accent="#f5f5f7" delay={0} />
                            <StatCard icon={Clock} label="Awaiting Response" value={pending} accent="#ffd60a" delay={0.06} />
                            <StatCard icon={Wrench} label="Being Addressed" value={inProgress} accent="#0a84ff" delay={0.12} />
                        </div>
                    )}

                    {/* Recent complaints */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.02em', margin: 0 }}>
                            Recent Complaints
                        </h3>
                        <Link href="/dashboard/student/complaints"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#0071e3', textDecoration: 'none' }}>
                            View all <ArrowRight size={13} strokeWidth={1.8} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[1, 2].map(i => <div key={i} className="skeleton" style={{ height: 112 }} />)}
                        </div>
                    ) : complaints.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{
                                background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                                padding: '48px 24px', textAlign: 'center',
                            }}>
                            <p style={{ fontSize: '0.9375rem', color: '#48484a', margin: '0 0 16px' }}>No complaints yet</p>
                            <Link href="/dashboard/student/submit">
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="btn-primary" style={{ fontSize: '0.875rem', padding: '10px 22px' }}>
                                    Submit your first complaint
                                </motion.button>
                            </Link>
                        </motion.div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {complaints.slice(0, 5).map(c => <ComplaintCard key={c.id} complaint={c} />)}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
