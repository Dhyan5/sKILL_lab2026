'use client';
// app/dashboard/admin/page.tsx — Apple Pro admin overview dashboard

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, Wrench, CheckCircle2, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

interface User { id: number; name: string; email: string; role: 'student' | 'admin'; }

function StatCard({ icon: Icon, label, value, accent, delay }: {
    icon: React.ElementType; label: string; value: number; accent: string; delay: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
                background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px 24px',
            }}>
            <div style={{ marginBottom: 16 }}><Icon size={18} color={accent} strokeWidth={1.5} /></div>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
            <p style={{ fontSize: '0.8125rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>{label}</p>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const s = localStorage.getItem('user');
        if (!s) { router.push('/login'); return; }
        const u: User = JSON.parse(s);
        if (u.role !== 'admin') { router.push('/dashboard/student'); return; }
        setUser(u);
        loadComplaints();
    }, []);

    async function loadComplaints() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            setComplaints((await res.json()).complaints);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    async function handleStatusChange(id: number, status: string) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) { toast.error('Update failed'); return; }
            toast.success('Status updated');
            setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: status as Complaint['status'] } : c));
        } catch { toast.error('Network error'); }
    }

    if (!user) return null;

    const pending = complaints.filter(c => c.status === 'pending').length;
    const inProgress = complaints.filter(c => c.status === 'in_progress').length;
    const resolved = complaints.filter(c => c.status === 'resolved').length;
    const highPri = complaints.filter(c => c.priority === 'high' && c.status !== 'resolved').length;

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
            <Sidebar role="admin" userName={user.name} />
            <div style={{ flex: 1, marginLeft: 240 }}>
                <Navbar title="Overview" />
                <main style={{ padding: '36px 40px', maxWidth: 1000, margin: '0 auto' }}>

                    {/* Greeting */}
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                        style={{ marginBottom: 36 }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.04em', margin: '0 0 6px' }}>
                            Admin Panel
                        </h2>
                        <p style={{ fontSize: '0.9375rem', color: '#86868b', margin: 0, letterSpacing: '-0.01em' }}>
                            Manage all maintenance requests across Sahyadri Hostel.
                        </p>
                    </motion.div>

                    {/* Stats 4-col */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 110 }} />)}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 32 }}>
                            <StatCard icon={ClipboardList} label="Total" value={complaints.length} accent="#f5f5f7" delay={0} />
                            <StatCard icon={Clock} label="Pending" value={pending} accent="#ffd60a" delay={0.06} />
                            <StatCard icon={Wrench} label="In Progress" value={inProgress} accent="#0a84ff" delay={0.12} />
                            <StatCard icon={CheckCircle2} label="Resolved" value={resolved} accent="#30d158" delay={0.18} />
                        </div>
                    )}

                    {/* High priority alert */}
                    {highPri > 0 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                background: 'rgba(255,69,58,0.07)', border: '1px solid rgba(255,69,58,0.2)',
                                borderRadius: 12, padding: '12px 18px', marginBottom: 28,
                            }}>
                            <AlertTriangle size={15} color="#ff453a" strokeWidth={1.5} />
                            <p style={{ fontSize: '0.875rem', color: '#ff453a', margin: 0, letterSpacing: '-0.01em', fontWeight: 500 }}>
                                {highPri} high-priority complaint{highPri > 1 ? 's' : ''} awaiting attention
                            </p>
                        </motion.div>
                    )}

                    {/* Recent */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.02em', margin: 0 }}>
                            Recent Complaints
                        </h3>
                        <Link href="/dashboard/admin/complaints"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.875rem', color: '#0071e3', textDecoration: 'none' }}>
                            View all <ArrowRight size={13} strokeWidth={1.8} />
                        </Link>
                    </div>

                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 112 }} />)}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {complaints.slice(0, 5).map(c => (
                                <ComplaintCard key={c.id} complaint={c} isAdmin onStatusChange={handleStatusChange} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
