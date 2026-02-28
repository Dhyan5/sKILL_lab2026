'use client';
// components/ComplaintCard.tsx — Glassmorphism complaint card with motion

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, Clock, Wrench } from 'lucide-react';

export interface Complaint {
    id: number;
    category: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'in_progress' | 'resolved';
    created_at: string;
    user_name?: string;
    user_email?: string;
}

interface ComplaintCardProps {
    complaint: Complaint;
    isAdmin?: boolean;
    onStatusChange?: (id: number, status: string) => void;
}

const statusConfig = {
    pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/20', icon: Clock },
    in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', icon: Wrench },
    resolved: { label: 'Resolved', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/20', icon: CheckCircle2 },
};

const priorityConfig = {
    low: { label: 'Low', dot: 'bg-green-400' },
    medium: { label: 'Medium', dot: 'bg-yellow-400' },
    high: { label: 'High', dot: 'bg-red-400' },
};

export default function ComplaintCard({ complaint, isAdmin, onStatusChange }: ComplaintCardProps) {
    const status = statusConfig[complaint.status] ?? statusConfig.pending;
    const priority = priorityConfig[complaint.priority] ?? priorityConfig.medium;
    const StatusIcon = status.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(139,92,246,0.15)' }}
            transition={{ duration: 0.3 }}
            className="relative rounded-2xl overflow-hidden
        bg-white/5 backdrop-blur-md border border-white/10
        hover:border-purple-500/30 transition-all duration-300 p-5"
        >
            {/* Priority stripe */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${priority.dot}`} />

            <div className="pl-3">
                {/* Header row */}
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <span className="text-white font-semibold text-sm">{complaint.category}</span>
                        {isAdmin && complaint.user_name && (
                            <p className="text-slate-400 text-xs mt-0.5">{complaint.user_name} · {complaint.user_email}</p>
                        )}
                    </div>
                    {/* Status badge */}
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
                        <StatusIcon size={11} />
                        {status.label}
                    </span>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">{complaint.description}</p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                        <span className="text-slate-400 text-xs">{priority.label} priority</span>
                        <span className="text-slate-600 text-xs mx-1">·</span>
                        <span className="text-slate-500 text-xs">
                            {new Date(complaint.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>

                    {/* Admin status updater */}
                    {isAdmin && onStatusChange && (
                        <select
                            value={complaint.status}
                            onChange={(e) => onStatusChange(complaint.id, e.target.value)}
                            className="text-xs bg-white/10 border border-white/20 text-white rounded-lg px-2 py-1
                focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
                        >
                            <option value="pending" className="bg-slate-800">Pending</option>
                            <option value="in_progress" className="bg-slate-800">In Progress</option>
                            <option value="resolved" className="bg-slate-800">Resolved</option>
                        </select>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
