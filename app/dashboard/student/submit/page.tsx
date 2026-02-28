'use client';
// app/dashboard/student/submit/page.tsx — Submit complaint form
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const CATEGORIES = ['Plumbing', 'Electrical', 'Furniture', 'Cleanliness', 'Security', 'Internet', 'Food', 'Other'];

export default function SubmitComplaintPage() {
    const router = useRouter();
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;

    const [form, setForm] = useState({ category: '', description: '', priority: 'medium' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form.category) { toast.error('Please select a category'); return; }
        if (form.description.trim().length < 10) { toast.error('Description must be at least 10 characters'); return; }
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
            setSuccess(true);
            toast.success('Complaint submitted successfully!');
            setTimeout(() => router.push('/dashboard/student'), 2000);
        } catch {
            toast.error('Network error');
        } finally {
            setLoading(false);
        }
    }

    if (!user) { router.push('/login'); return null; }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex">
            <Sidebar role="student" userName={user.name} />
            <div className="flex-1 ml-64">
                <Navbar title="Submit Complaint" />
                <main className="p-6 max-w-2xl">
                    <Link href="/dashboard/student" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>

                    {/* Success animation */}
                    {success ? (
                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-12 text-center">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }}
                                className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                                <Send size={28} className="text-green-400" />
                            </motion.div>
                            <h3 className="text-white text-xl font-bold mb-2">Complaint Submitted!</h3>
                            <p className="text-slate-400 text-sm">Your complaint has been recorded. Admin will review it shortly.</p>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
                            <h2 className="text-white font-bold text-lg mb-6">New Complaint</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Category */}
                                <div>
                                    <label className="text-slate-300 text-xs font-medium mb-2 block">Category</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {CATEGORIES.map((cat) => (
                                            <motion.button key={cat} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={() => setForm({ ...form, category: cat })}
                                                className={`py-2 px-3 rounded-xl text-xs font-medium transition-all border
                          ${form.category === cat
                                                        ? 'bg-purple-600/40 border-purple-500/60 text-purple-200'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-purple-500/30 hover:text-white'
                                                    }`}
                                            >
                                                {cat}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Priority */}
                                <div>
                                    <label className="text-slate-300 text-xs font-medium mb-2 block">Priority</label>
                                    <div className="flex gap-3">
                                        {['low', 'medium', 'high'].map((p) => (
                                            <motion.button key={p} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                                onClick={() => setForm({ ...form, priority: p })}
                                                className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all border
                          ${form.priority === p
                                                        ? p === 'high' ? 'bg-red-500/20 border-red-500/40 text-red-300'
                                                            : p === 'medium' ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300'
                                                                : 'bg-green-500/20 border-green-500/40 text-green-300'
                                                        : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                                                    }`}
                                            >
                                                {p}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-slate-300 text-xs font-medium mb-1.5 block">
                                        Description <span className="text-slate-500">({form.description.length} chars)</span>
                                    </label>
                                    <textarea placeholder="Describe the issue in detail..." rows={5}
                                        className="input-field resize-none"
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        required
                                    />
                                </div>

                                <motion.button type="submit" disabled={loading}
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                    className="btn-primary w-full">
                                    <Send size={16} />
                                    {loading ? 'Submitting...' : 'Submit Complaint'}
                                </motion.button>
                            </form>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}
