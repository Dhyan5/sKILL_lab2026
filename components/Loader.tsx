'use client';
// components/Loader.tsx — Full-screen animated loader with spinner + text

import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps {
    show?: boolean;
}

export default function Loader({ show = true }: LoaderProps) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"
                >
                    {/* Outer ring */}
                    <div className="relative w-24 h-24 mb-8">
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-purple-500/30"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        />
                        <motion.div
                            className="absolute inset-0 rounded-full border-4 border-t-purple-400 border-r-transparent border-b-transparent border-l-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        {/* Core icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl"
                                animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </div>
                    </div>

                    {/* Brand name */}
                    <motion.h1
                        className="text-3xl font-bold text-white mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        Sahyadri Hostel
                    </motion.h1>

                    {/* Animated loading text */}
                    <motion.p
                        className="text-purple-300 text-sm tracking-widest uppercase"
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        HostelOps Loading...
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
