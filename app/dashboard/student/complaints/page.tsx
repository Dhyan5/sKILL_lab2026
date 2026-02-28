'use client';
// app/dashboard/student/complaints/page.tsx — All complaints list for student
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

export default function StudentComplaintsPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    async function fetchComplaints() {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = `/api/complaints${statusFilter ? `?status=${statusFilter}` : ''}`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            const data = await res.json();
            setComplaints(data.complaints);
        } catch {
            toast.error('Failed to load');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { if (user) fetchComplaints(); }, [statusFilter]);

    if (!user) { router.push('/login'); return null; }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar role="student" userName={user.name} />
            <div className="flex-1 ml-64">
                <Navbar title="My Complaints" />
                <main className="p-6 space-y-5">
                    {/* Filter bar */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <Filter size={16} className="text-slate-400" />
                        {['', 'pending', 'in_progress', 'resolved'].map((s) => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                  ${statusFilter === s
                                        ? 'bg-purple-600/40 border-purple-500/60 text-purple-200'
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                    }`}>
                                {s === '' ? 'All' : s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                        ))}
                        <button onClick={fetchComplaints} className="ml-auto text-slate-400 hover:text-white transition-colors">
                            <RefreshCw size={15} />
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {loading ? (
                            <div className="grid gap-4">
                                {[1, 2, 3].map((i) => <div key={i} className="skeleton h-32" />)}
                            </div>
                        ) : complaints.length === 0 ? (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="glass-card p-12 text-center">
                                <p className="text-slate-400">No complaints found for this filter.</p>
                            </motion.div>
                        ) : (
                            <motion.div key="list" className="grid gap-4">
                                {complaints.map((c) => <ComplaintCard key={c.id} complaint={c} />)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
