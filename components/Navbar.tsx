'use client';
// components/Navbar.tsx — Apple Pro top navigation bar

import { motion } from 'framer-motion';
import { Bell, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps { title: string; }

export default function Navbar({ title }: NavbarProps) {
    const [isDark, setIsDark] = useState(true);

    return (
        <motion.header
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
                height: 52,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 28px',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(0,0,0,0.72)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                position: 'sticky',
                top: 0,
                zIndex: 20,
            }}
        >
            <h1 style={{
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#f5f5f7',
                letterSpacing: '-0.02em',
                margin: 0,
            }}>
                {title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {/* Notification */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Notifications"
                    style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                >
                    <Bell size={14} color="#86868b" strokeWidth={1.5} />
                </motion.button>

                {/* Theme toggle */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Toggle theme"
                    onClick={() => setIsDark(v => !v)}
                    style={{
                        width: 32, height: 32, borderRadius: 8,
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                >
                    {isDark
                        ? <Sun size={14} color="#86868b" strokeWidth={1.5} />
                        : <Moon size={14} color="#86868b" strokeWidth={1.5} />
                    }
                </motion.button>
            </div>
        </motion.header>
    );
}
