'use client';
// app/dashboard/admin/complaints/page.tsx — Apple Pro admin complaints with search + filters

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

const STATUS_FILTERS = [{ value: '', label: 'All' }, { value: 'pending', label: 'Pending' }, { value: 'in_progress', label: 'In Progress' }, { value: 'resolved', label: 'Resolved' }];
const CATEGORY_FILTERS = ['', 'Plumbing', 'Electrical', 'Furniture', 'Cleanliness', 'Security', 'Internet', 'Food', 'Other'];

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} style={{
            padding: '5px 14px', borderRadius: 99,
            fontSize: '0.8125rem', fontWeight: 500, fontFamily: 'inherit',
            cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid',
            background: active ? 'rgba(0,113,227,0.14)' : 'transparent',
            borderColor: active ? 'rgba(0,113,227,0.35)' : 'rgba(255,255,255,0.08)',
            color: active ? '#0071e3' : '#86868b',
        }}>
            {label || 'All'}
        </button>
    );
}

export default function AdminComplaintsPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusF, setStatusF] = useState('');
    const [categoryF, setCategoryF] = useState('');
    const [search, setSearch] = useState('');

    async function load() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const p = new URLSearchParams();
            if (statusF) p.set('status', statusF);
            if (categoryF) p.set('category', categoryF);
            const res = await fetch(`/api/complaints?${p}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            setComplaints((await res.json()).complaints);
        } catch { toast.error('Failed to load'); }
        finally { setLoading(false); }
    }

    useEffect(() => { if (user) load(); }, [statusF, categoryF]);

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

    const filtered = complaints.filter(c => {
        if (!search) return true;
        const q = search.toLowerCase();
        return c.description.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || (c.user_name || '').toLowerCase().includes(q);
    });

    if (!user) { router.push('/login'); return null; }

    return (
        <div style={{ minHeight: '100vh', background: '#000', display: 'flex' }}>
            <Sidebar role="admin" userName={user.name} />
            <div style={{ flex: 1, marginLeft: 240 }}>
                <Navbar title="All Complaints" />
                <main style={{ padding: '36px 40px', maxWidth: 1000, margin: '0 auto' }}>

                    {/* Search */}
                    <div style={{ position: 'relative', maxWidth: 360, marginBottom: 28 }}>
                        <Search size={14} color="#48484a" strokeWidth={1.5} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input className="input-field" style={{ paddingLeft: 36, fontSize: '0.875rem' }}
                            placeholder="Search by name, category, description…"
                            value={search} onChange={e => setSearch(e.target.value)} />
                    </div>

                    {/* Status pills */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                        <span style={{ fontSize: '0.75rem', color: '#48484a', alignSelf: 'center', letterSpacing: '0.02em', textTransform: 'uppercase', marginRight: 4 }}>Status</span>
                        {STATUS_FILTERS.map(f => <FilterPill key={f.value} label={f.label} active={statusF === f.value} onClick={() => setStatusF(f.value)} />)}
                    </div>

                    {/* Category pills */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
                        <span style={{ fontSize: '0.75rem', color: '#48484a', alignSelf: 'center', letterSpacing: '0.02em', textTransform: 'uppercase', marginRight: 4 }}>Category</span>
                        {CATEGORY_FILTERS.map(f => <FilterPill key={f} label={f || 'All'} active={categoryF === f} onClick={() => setCategoryF(f)} />)}
                        <motion.button whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}
                            onClick={load} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', display: 'flex' }}>
                            <RefreshCw size={14} color="#48484a" strokeWidth={1.5} />
                        </motion.button>
                    </div>

                    <p style={{ fontSize: '0.75rem', color: '#48484a', marginBottom: 14 }}>
                        {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
                    </p>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 112 }} />)}
                            </div>
                        ) : filtered.length === 0 ? (
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
                                {filtered.map(c => (
                                    <ComplaintCard key={c.id} complaint={c} isAdmin onStatusChange={handleStatusChange} />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
