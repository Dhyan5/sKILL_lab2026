'use client';
// app/dashboard/student/page.tsx — Student dashboard home
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ClipboardList, Clock, CheckCircle2, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import ComplaintCard, { type Complaint } from '@/components/ComplaintCard';
import Loader from '@/components/Loader';

interface User { id: number; name: string; email: string; role: 'student' | 'admin'; }

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="glass-card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon size={22} className="text-white" />
            </div>
            <div>
                <p className="text-slate-400 text-xs font-medium">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
            </div>
        </motion.div>
    );
}

function SkeletonCard() {
    return <div className="skeleton h-32 w-full" />;
}

export default function StudentDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (!stored) { router.push('/login'); return; }
        const parsed: User = JSON.parse(stored);
        if (parsed.role !== 'student') { router.push('/dashboard/admin'); return; }
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
            toast.error('Failed to load complaints');
        } finally {
            setLoading(false);
        }
    }

    if (!user) return <Loader show />;

    const pending = complaints.filter((c) => c.status === 'pending').length;
    const inProgress = complaints.filter((c) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c) => c.status === 'resolved').length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar role="student" userName={user.name} />

            {/* Main content — offset by sidebar width */}
            <div className="flex-1 ml-64">
                <Navbar title="Student Dashboard" />

                <main className="p-6 space-y-6">
                    {/* Welcome banner */}
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-l-4 border-purple-500">
                        <h2 className="text-xl font-bold text-white mb-1">Welcome back, {user.name} 👋</h2>
                        <p className="text-slate-400 text-sm">Track your hostel complaints and maintenance requests here.</p>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {loading ? (
                            <>
                                <SkeletonCard /><SkeletonCard /><SkeletonCard />
                            </>
                        ) : (
                            <>
                                <StatCard icon={ClipboardList} label="Total Complaints" value={complaints.length} color="bg-purple-600/30" />
                                <StatCard icon={Clock} label="Pending" value={pending} color="bg-yellow-500/30" />
                                <StatCard icon={Wrench} label="In Progress" value={inProgress} color="bg-blue-500/30" />
                            </>
                        )}
                    </div>

                    {/* Recent complaints */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-white font-semibold text-base">Recent Complaints</h3>
                            <span className="text-slate-400 text-xs">{complaints.length} total</span>
                        </div>
                        {loading ? (
                            <div className="space-y-3"> <SkeletonCard /><SkeletonCard /> </div>
                        ) : complaints.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="glass-card p-12 text-center">
                                <CheckCircle2 size={40} className="text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400">No complaints yet. Use the sidebar to submit one.</p>
                            </motion.div>
                        ) : (
                            <div className="grid gap-4">
                                {complaints.slice(0, 6).map((c) => (
                                    <ComplaintCard key={c.id} complaint={c} />
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
