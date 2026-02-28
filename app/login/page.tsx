'use client';
// app/login/page.tsx — Login page with animated form
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Building2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) { toast.error(data.error || 'Login failed'); return; }

            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            toast.success(`Welcome back, ${data.user.name}!`);
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
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
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
                        <h1 className="text-3xl font-bold text-white mb-1">Sahyadri Hostel</h1>
                        <p className="text-slate-400 text-sm">Sign in to your account</p>
                    </div>

                    {/* Card */}
                    <div className="glass-card p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        className="input-field pl-9"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-300 text-xs font-medium mb-1.5 block">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="input-field pl-9"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="btn-primary w-full mt-2"
                            >
                                <LogIn size={16} />
                                {loading ? 'Signing in...' : 'Sign In'}
                            </motion.button>
                        </form>

                        <p className="text-center text-slate-400 text-sm mt-6">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                                Register here
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
