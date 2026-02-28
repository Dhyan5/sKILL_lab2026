'use client';
// app/dashboard/student/complaints/page.tsx — Apple Pro complaints list

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

const FILTERS = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
];

export default function StudentComplaintsPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    async function fetch$() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `/api/complaints${filter ? `?status=${filter}` : ''}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            const data = await res.json();
            setComplaints(data.complaints);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    useEffect(() => { if (user) fetch$(); }, [filter]);

    if (!user) { router.push('/login'); return null; }

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
            <Sidebar role="student" userName={user.name} roomNumber={user.room_number} />
            <div style={{ flex: 1, marginLeft: 240 }}>
                <Navbar title="My Complaints" />
                <main style={{ padding: '36px 40px', maxWidth: 900, margin: '0 auto' }}>

                    {/* Filter bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28 }}>
                        {FILTERS.map(f => (
                            <button key={f.value} onClick={() => setFilter(f.value)} style={{
                                padding: '6px 16px', borderRadius: 99,
                                fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
                                cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid',
                                background: filter === f.value ? 'rgba(0,113,227,0.14)' : 'transparent',
                                borderColor: filter === f.value ? 'rgba(0,113,227,0.35)' : 'rgba(255,255,255,0.08)',
                                color: filter === f.value ? '#0071e3' : '#86868b',
                            }}>
                                {f.label}
                            </button>
                        ))}
                        <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
                            onClick={fetch$} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <RefreshCw size={15} color="#48484a" strokeWidth={1.5} />
                        </motion.button>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#48484a', marginBottom: 16 }}>
                        {complaints.length} result{complaints.length !== 1 ? 's' : ''}
                    </p>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 112 }} />)}
                            </div>
                        ) : complaints.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{
                                    background: 'rgba(28,28,30,0.72)', backdropFilter: 'blur(24px)',
                                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14,
                                    padding: '56px 24px', textAlign: 'center',
                                }}>
                                <p style={{ fontSize: '0.9375rem', color: '#48484a', margin: 0 }}>No complaints found</p>
                            </motion.div>
                        ) : (
                            <motion.div key="list" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {complaints.map(c => <ComplaintCard key={c.id} complaint={c} />)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
