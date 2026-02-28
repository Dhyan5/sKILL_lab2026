'use client';
// components/Navbar.tsx — Top navbar with dark mode toggle and user menu

import { motion } from 'framer-motion';
import { Bell, Moon, Sun } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
    title: string;
}

export default function Navbar({ title }: NavbarProps) {
    const [isDark, setIsDark] = useState(true);

    function toggleTheme() {
        setIsDark((prev) => {
            const next = !prev;
            if (typeof document !== 'undefined') {
                document.documentElement.classList.toggle('dark', next);
            }
            return next;
        });
    }

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="h-16 flex items-center justify-between px-6 border-b border-white/10
        bg-slate-900/80 backdrop-blur-md sticky top-0 z-20"
        >
            <h1 className="text-white font-semibold text-lg">{title}</h1>

            <div className="flex items-center gap-3">
                {/* Notification bell */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Notifications"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <Bell size={17} />
                </motion.button>

                {/* Dark / light mode toggle */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    {isDark ? <Sun size={17} /> : <Moon size={17} />}
                </motion.button>
            </div>
        </motion.header>
    );
}
