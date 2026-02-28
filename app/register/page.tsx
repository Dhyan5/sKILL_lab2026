'use client';
// app/register/page.tsx — Registration page
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Lock, UserPlus, Building2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || 'Registration failed'); return; }

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            toast.success('Account created successfully!');
            setShowLoader(true);
            setTimeout(() => {
                router.push(data.user.role === 'admin' ? '/dashboard/admin' : '/dashboard/student');
            }, 1200);
        } catch {
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Loader show={showLoader} />
            <div className="min-h-screen flex items-center justify-center px-4
        bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">

                {/* Background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md relative z-10"
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                            className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 items-center justify-center mb-4 shadow-lg shadow-purple-500/30"
                        >
                            <Building2 size={28} className="text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
                        <p className="text-slate-400 text-sm">Join Sahyadri Hostel Portal</p>
                    </div>

                    {/* Card */}
                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Full Name</label>
                                <div className="relative">
                                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="text" placeholder="Your full name" className="input-field pl-9"
                                        value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="email" placeholder="you@example.com" className="input-field pl-9"
                                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input type="password" placeholder="Min. 6 characters" className="input-field pl-9"
                                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Account Type</label>
                                <div className="relative">
                                    <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <select className="input-field pl-9 cursor-pointer"
                                        value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                        <option value="student" className="bg-slate-800">Student</option>
                                        <option value="admin" className="bg-slate-800">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <motion.button type="submit" disabled={loading}
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="btn-primary w-full mt-2">
                                <UserPlus size={16} />
                                {loading ? 'Creating account...' : 'Create Account'}
                            </motion.button>
                        </form>

                        <p className="text-center text-slate-400 text-sm mt-6">
                            Already have an account?{' '}
                            <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
