'use client';
// components/Sidebar.tsx — Apple Pro sidebar with room number badge

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, PlusCircle, ClipboardList, LogOut, Menu, X, DoorOpen } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface SidebarProps {
    role: 'student' | 'admin';
    userName: string;
    roomNumber?: string;
}

const studentLinks = [
    { href: '/dashboard/student', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/student/submit', label: 'New Complaint', icon: PlusCircle },
    { href: '/dashboard/student/complaints', label: 'My Complaints', icon: ClipboardList },
];
const adminLinks = [
    { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin/complaints', label: 'All Complaints', icon: ClipboardList },
];

export default function Sidebar({ role, userName, roomNumber }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const links = role === 'admin' ? adminLinks : studentLinks;
    const initials = userName.slice(0, 2).toUpperCase();

    async function handleLogout() {
        await fetch('/api/auth/logout', { method: 'POST' });
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        toast.success('Signed out');
        router.push('/login');
    }

    return (
        <>
            <button onClick={() => setOpen(v => !v)}
                className="fixed top-5 left-5 z-50 md:hidden flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: 'rgba(44,44,46,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {open ? <X size={14} color="#f5f5f7" /> : <Menu size={14} color="#f5f5f7" />}
            </button>

            <motion.aside
                initial={{ x: 0 }} animate={{ x: open ? 0 : -260 }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                className="fixed top-0 left-0 h-full z-40 flex flex-col"
                style={{
                    width: 240, background: 'rgba(12,12,14,0.94)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                    borderRight: '1px solid rgba(255,255,255,0.07)',
                }}>

                {/* Logo */}
                <div style={{ padding: '28px 20px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9,22 9,12 15,12 15,22" />
                            </svg>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Sahyadri</p>
                            <p style={{ fontSize: '0.6875rem', color: '#636366', letterSpacing: '0.02em' }}>Hostel System</p>
                        </div>
                    </div>
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px' }} />

                {/* User */}
                <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                            background: role === 'admin' ? 'rgba(0,113,227,0.25)' : 'rgba(48,209,88,0.2)',
                            border: `1px solid ${role === 'admin' ? 'rgba(0,113,227,0.3)' : 'rgba(48,209,88,0.25)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.6875rem', fontWeight: 700,
                            color: role === 'admin' ? '#0a84ff' : '#30d158',
                        }}>
                            {initials}
                        </div>
                        <div style={{ overflow: 'hidden', flex: 1 }}>
                            <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#f5f5f7', letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                                {userName}
                            </p>
                            <p style={{ fontSize: '0.6875rem', color: role === 'admin' ? '#0a84ff' : '#30d158', textTransform: 'capitalize', letterSpacing: '0.01em', margin: 0 }}>
                                {role}
                            </p>
                        </div>
                    </div>

                    {/* Room number badge — students only */}
                    {role === 'student' && roomNumber && (
                        <div style={{
                            marginTop: 10,
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            background: 'rgba(0,113,227,0.1)',
                            border: '1px solid rgba(0,113,227,0.22)',
                            borderRadius: 99, padding: '5px 11px',
                        }}>
                            <DoorOpen size={11} color="#0071e3" strokeWidth={1.8} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#0071e3', letterSpacing: '-0.01em' }}>
                                Room {roomNumber}
                            </span>
                        </div>
                    )}
                </div>

                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 20px 10px' }} />

                {/* Nav */}
                <nav style={{ flex: 1, padding: '4px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {links.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href || pathname.startsWith(href + '/');
                        return (
                            <Link key={href} href={href} style={{ textDecoration: 'none' }}>
                                <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.2 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        padding: '8px 12px', borderRadius: 8,
                                        background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                                        cursor: 'pointer', transition: 'background 0.2s ease',
                                    }}
                                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                                    <Icon size={15} color={active ? '#f5f5f7' : '#636366'} strokeWidth={active ? 2 : 1.5} />
                                    <span style={{ fontSize: '0.875rem', fontWeight: active ? 500 : 400, color: active ? '#f5f5f7' : '#86868b', letterSpacing: '-0.01em' }}>
                                        {label}
                                    </span>
                                    {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: '#0071e3' }} />}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div style={{ padding: '10px 10px 28px' }}>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '0 10px 10px' }} />
                    <motion.button whileHover={{ x: 2 }} transition={{ duration: 0.2 }} onClick={handleLogout}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,69,58,0.08)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}>
                        <LogOut size={15} color="#636366" strokeWidth={1.5} />
                        <span style={{ fontSize: '0.875rem', color: '#636366', letterSpacing: '-0.01em' }}>Sign Out</span>
                    </motion.button>
                </div>
            </motion.aside>

            <AnimatePresence>
                {open && (
                    <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)} className="fixed inset-0 z-30 md:hidden"
                        style={{ background: 'rgba(0,0,0,0.6)' }} />
                )}
            </AnimatePresence>
        </>
    );
}
