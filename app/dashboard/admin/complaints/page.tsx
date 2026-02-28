'use client';
// app/dashboard/admin/complaints/page.tsx — All complaints with filters
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RefreshCw, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

const CATEGORIES = ['', 'Plumbing', 'Electrical', 'Furniture', 'Cleanliness', 'Security', 'Internet', 'Food', 'Other'];

export default function AdminComplaintsPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [search, setSearch] = useState('');

    async function fetchComplaints() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (statusFilter) params.set('status', statusFilter);
            if (categoryFilter) params.set('category', categoryFilter);
            const res = await fetch(`/api/complaints?${params}`, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            const data = await res.json();
            setComplaints(data.complaints);
        } catch {
            toast.error('Failed to load');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { if (user) fetchComplaints(); }, [statusFilter, categoryFilter]);

    async function handleStatusChange(id: number, status: string) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) { toast.error('Update failed'); return; }
            toast.success('Status updated!');
            setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: status as Complaint['status'] } : c));
        } catch {
            toast.error('Network error');
        }
    }

    const filtered = complaints.filter((c) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q) ||
            (c.user_name || '').toLowerCase().includes(q)
        );
    });

    if (!user) { router.push('/login'); return null; }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar role="admin" userName={user.name} />
            <div className="flex-1 ml-64">
                <Navbar title="All Complaints" />
                <main className="p-6 space-y-5">
                    {/* Search */}
                    <div className="relative max-w-sm">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input type="text" placeholder="Search complaints..." className="input-field pl-9"
                            value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    {/* Status filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <Filter size={14} className="text-slate-500" />
                        <span className="text-slate-500 text-xs">Status:</span>
                        {['', 'pending', 'in_progress', 'resolved'].map((s) => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border
                  ${statusFilter === s ? 'bg-purple-600/40 border-purple-500/60 text-purple-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                                {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Category filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-slate-500 text-xs ml-5">Category:</span>
                        {CATEGORIES.map((cat) => (
                            <button key={cat} onClick={() => setCategoryFilter(cat)}
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all border
                  ${categoryFilter === cat ? 'bg-indigo-600/40 border-indigo-500/60 text-indigo-200' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}>
                                {cat || 'All'}
                            </button>
                        ))}
                        <button onClick={fetchComplaints} className="ml-auto text-slate-400 hover:text-white">
                            <RefreshCw size={14} />
                        </button>
                    </div>

                    <p className="text-slate-500 text-xs">{filtered.length} complaint(s) shown</p>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="grid gap-4">{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32" />)}</div>
                        ) : filtered.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="glass-card p-12 text-center">
                                <p className="text-slate-400">No complaints found.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="list" className="grid gap-4">
                                {filtered.map((c) => (
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
