'use client';
// components/Sidebar.tsx — Animated collapsible sidebar

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    PlusCircle,
    ClipboardList,
    LogOut,
    Menu,
    X,
    Building2,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SidebarProps {
    role: 'student' | 'admin';
    userName: string;
}

const studentLinks = [
    { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/student/submit', label: 'Submit Complaint', icon: PlusCircle },
    { href: '/dashboard/student/complaints', label: 'My Complaints', icon: ClipboardList },
];

const adminLinks = [
    { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/admin/complaints', label: 'All Complaints', icon: ClipboardList },
];

export default function Sidebar({ role, userName }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(true);

    const links = role === 'admin' ? adminLinks : studentLinks;

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        router.push('/login');
    }

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setOpen((v) => !v)}
                className="fixed top-4 left-4 z-50 md:hidden bg-white/10 backdrop-blur-sm p-2 rounded-lg text-white"
            >
                {open ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar panel */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: open ? 0 : -280 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          border-r border-white/10 shadow-2xl"
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        <Building2 size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-white font-bold text-sm leading-none">Sahyadri</p>
                        <p className="text-purple-300 text-xs">Hostel System</p>
                    </div>
                </div>

                {/* User info */}
                <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium truncate max-w-[130px]">{userName}</p>
                            <div className="flex items-center gap-1">
                                <ShieldCheck size={10} className={role === 'admin' ? 'text-yellow-400' : 'text-green-400'} />
                                <p className="text-xs capitalize" style={{ color: role === 'admin' ? '#facc15' : '#4ade80' }}>
                                    {role}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-4 space-y-1">
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href;
                        return (
                            <Link key={href} href={href}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer
                    ${active
                                            ? 'bg-purple-600/30 border border-purple-500/40 text-purple-200'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="text-sm font-medium">{label}</span>
                                    {active && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 py-4 border-t border-white/10">
                    <motion.button
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400
              hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Sign Out</span>
                    </motion.button>
                </div>
            </motion.aside>

            {/* Overlay for mobile */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
