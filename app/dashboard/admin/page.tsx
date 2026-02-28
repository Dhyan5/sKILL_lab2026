'use client';
// app/dashboard/admin/page.tsx — Admin dashboard with overview stats
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle2, Wrench, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';

interface User { id: number; name: string; email: string; role: 'student' | 'admin'; }

function StatCard({ icon: Icon, label, value, sub, color, delay }: {
    icon: React.ElementType; label: string; value: number; sub?: string; color: string; delay: number;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="glass-card p-5">
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                    <Icon size={18} className="text-white" />
                </div>
                {sub && <span className="text-xs text-green-400 font-medium">{sub}</span>}
            </div>
            <p className="text-white text-3xl font-bold mb-1">{value}</p>
            <p className="text-slate-400 text-xs">{label}</p>
        </motion.div>
    );
}

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) { router.push('/login'); return; }
        const parsed: User = JSON.parse(stored);
        if (parsed.role !== 'admin') { router.push('/dashboard/student'); return; }
        setUser(parsed);
        fetchComplaints();
    }, [router]);

    async function fetchComplaints() {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/complaints', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { router.push('/login'); return; }
            const data = await res.json();
            setComplaints(data.complaints);
        } catch {
            toast.error('Failed to load');
        } finally {
            setLoading(false);
        }
    }

    async function handleStatusChange(id: number, status: string) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`/api/complaints/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) { toast.error('Failed to update'); return; }
            toast.success('Status updated!');
            setComplaints((prev) => prev.map((c) => c.id === id ? { ...c, status: status as Complaint['status'] } : c));
        } catch {
            toast.error('Network error');
        }
    }

    if (!user) return null;

    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;
    const highPriority = complaints.filter((c) => c.priority === 'high').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar role="admin" userName={user.name} />
            <div className="flex-1 ml-64">
                <Navbar title="Admin Dashboard" />
                <main className="p-6 space-y-6">

                    {/* Welcome banner */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-l-4 border-yellow-500">
                        <h2 className="text-xl font-bold text-white mb-1">Admin Panel 🛡️</h2>
                        <p className="text-slate-400 text-sm">Manage all complaints and maintenance requests across the hostel.</p>
                    </motion.div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            <>{[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-28" />)}</>
                        ) : (
                            <>
                                <StatCard icon={ClipboardList} label="Total Complaints" value={complaints.length} color="bg-purple-600/40" delay={0} />
                                <StatCard icon={Clock} label="Pending" value={pending} color="bg-yellow-500/40" delay={0.1} />
                                <StatCard icon={Wrench} label="In Progress" value={inProgress} color="bg-blue-500/40" delay={0.2} />
                                <StatCard icon={CheckCircle2} label="Resolved" value={resolved} color="bg-green-500/40" delay={0.3} />
                            </>
                        )}
                    </div>

                    {/* Quick info row */}
                    <div className="flex gap-4">
                        <div className="glass-card px-5 py-3 flex items-center gap-3">
                            <TrendingUp size={16} className="text-red-400" />
                            <span className="text-slate-300 text-sm"><span className="text-white font-bold">{highPriority}</span> high-priority open</span>
                        </div>
                        <div className="glass-card px-5 py-3 flex items-center gap-3">
                            <Users size={16} className="text-purple-400" />
                            <span className="text-slate-300 text-sm">
                                <span className="text-white font-bold">
                                    {[...new Set(complaints.map(c => c.user_email).filter(Boolean))].length}
                                </span> students active
                            </span>
                        </div>
                    </div>

                    {/* Recent complaints */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold">Recent Complaints</h3>
                            <a href="/dashboard/admin/complaints" className="text-purple-400 text-xs hover:text-purple-300">View all →</a>
                        </div>
                        {loading ? (
                            <div className="grid gap-4">{[1, 2].map(i => <div key={i} className="skeleton h-32" />)}</div>
                        ) : (
                            <div className="grid gap-4">
                                {complaints.slice(0, 5).map((c) => (
                                    <ComplaintCard key={c.id} complaint={c} isAdmin onStatusChange={handleStatusChange} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
