'use client';
// components/ComplaintCard.tsx — Apple Pro glassmorphism complaint card with room number

import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Wrench, ChevronRight, DoorOpen } from 'lucide-react';

export interface Complaint {
    id: number;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'resolved';
    created_at: string;
    user_name?: string;
    user_email?: string;
    user_room?: string;
}

interface ComplaintCardProps {
    complaint: Complaint;
    isAdmin?: boolean;
    onStatusChange?: (id: number, status: string) => void;
}

const statusMap = {
    pending: { label: 'Pending', color: '#ffd60a', bg: 'rgba(255,214,10,0.1)', border: 'rgba(255,214,10,0.2)', icon: Clock },
    in_progress: { label: 'In Progress', color: '#0a84ff', bg: 'rgba(10,132,255,0.1)', border: 'rgba(10,132,255,0.2)', icon: Wrench },
    resolved: { label: 'Resolved', color: '#30d158', bg: 'rgba(48,209,88,0.1)', border: 'rgba(48,209,88,0.2)', icon: CheckCircle2 },
};
const priorityDot = { low: '#30d158', medium: '#ffd60a', high: '#ff453a' };

export default function ComplaintCard({ complaint, isAdmin, onStatusChange }: ComplaintCardProps) {
    const s = statusMap[complaint.status] ?? statusMap.pending;
    const StatusIcon = s.icon;
    const dot = priorityDot[complaint.priority] ?? '#86868b';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
                background: 'rgba(28,28,30,0.72)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14, padding: '20px 22px',
                transition: 'border-color 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s cubic-bezier(0.25,0.46,0.45,0.94)',
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.45)';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
            }}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                            {complaint.category}
                        </span>
                    </div>

                    {/* Admin: show user + room */}
                    {isAdmin && complaint.user_name && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: '0.75rem', color: '#636366', letterSpacing: '-0.01em' }}>
                                {complaint.user_name}
                            </span>
                            {complaint.user_room && (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    fontSize: '0.6875rem', fontWeight: 500,
                                    color: '#0a84ff', letterSpacing: '0.01em',
                                    background: 'rgba(10,132,255,0.1)', border: '1px solid rgba(10,132,255,0.2)',
                                    borderRadius: 99, padding: '2px 8px',
                                }}>
                                    <DoorOpen size={9} strokeWidth={1.8} />
                                    Room {complaint.user_room}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Status pill */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    padding: '4px 10px', borderRadius: 99,
                    background: s.bg, border: `1px solid ${s.border}`,
                    flexShrink: 0, marginLeft: 12,
                }}>
                    <StatusIcon size={11} color={s.color} strokeWidth={1.8} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: s.color, letterSpacing: '0.01em' }}>
                        {s.label}
                    </span>
                </div>
            </div>

            {/* Description */}
            <p style={{
                fontSize: '0.875rem', color: '#86868b', lineHeight: 1.55,
                letterSpacing: '-0.01em', margin: '0 0 14px',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
                {complaint.description}
            </p>

            {/* Footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#48484a', letterSpacing: '-0.01em' }}>
                    {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' · '}<span style={{ textTransform: 'capitalize' }}>{complaint.priority}</span> priority
                </span>

                {isAdmin && onStatusChange ? (
                    <select value={complaint.status} onChange={e => onStatusChange(complaint.id, e.target.value)}
                        style={{
                            fontSize: '0.75rem', color: '#86868b',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, padding: '4px 10px',
                            cursor: 'pointer', outline: 'none', fontFamily: 'inherit',
                        }}>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                    </select>
                ) : (
                    <ChevronRight size={14} color="#3a3a3c" strokeWidth={1.5} />
                )}
            </div>
        </motion.div>
    );
}
