'use client';
// components/Loader.tsx — Apple Pro full-screen loader

import { motion, AnimatePresence } from 'framer-motion';

interface LoaderProps { show?: boolean; }

export default function Loader({ show = true }: LoaderProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          {/* Spinner ring */}
          <div className="relative w-16 h-16 mb-10">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: '1.5px solid rgba(255,255,255,0.06)' }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: '1.5px solid transparent',
                borderTopColor: 'rgba(255,255,255,0.65)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Brand */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
            style={{
              color: '#f5f5f7',
              fontSize: '1.1875rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            }}
          >
            Sahyadri Hostel
          </motion.p>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0] }}
            transition={{ delay: 0.4, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              color: '#636366',
              fontSize: '0.8125rem',
              marginTop: '0.4rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            HostelOps Loading…
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
