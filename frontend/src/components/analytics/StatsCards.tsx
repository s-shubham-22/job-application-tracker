import { AnalyticsSummary } from '@/api/analytics.api';
import { ApplicationStatus } from '@/types/job.types';
import { STATUS_COLORS } from '@/utils/constants';
import { TrendingUp, Briefcase, Star, XCircle, Activity, Award } from 'lucide-react';

interface StatsCardsProps {
  summary: AnalyticsSummary;
}

export default function StatsCards({ summary }: StatsCardsProps) {
  const inProgress = (summary.byStatus[ApplicationStatus.SCREENING] || 0)
    + (summary.byStatus[ApplicationStatus.INTERVIEW] || 0);

  const cards = [
    {
      label: 'Total Applied',
      value: summary.total,
      icon: Briefcase,
      color: '#6366f1',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      label: 'In Progress',
      value: inProgress,
      icon: Activity,
      color: '#10b981',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      label: 'Offers Received',
      value: summary.byStatus[ApplicationStatus.OFFER] || 0,
      icon: Award,
      color: '#22c55e',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      label: 'Rejections',
      value: summary.byStatus[ApplicationStatus.REJECTED] || 0,
      icon: XCircle,
      color: '#ef4444',
      gradient: 'from-red-500 to-rose-600',
    },
  ];

  return (
    <div className="dashboard-stats-grid">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="stat-card">
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 80, height: 80,
            borderRadius: '50%', background: color, opacity: 0.08,
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                {value}
              </p>
            </div>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${color}18`,
              border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={20} color={color} />
            </div>
          </div>
        </div>
      ))}

      {/* Rate cards */}
      <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <TrendingUp size={20} color="#6366f1" />
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>Response Rate</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#818cf8', fontFamily: 'Outfit, sans-serif' }}>
            {summary.responseRate}
          </p>
        </div>
      </div>

      <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Star size={20} color="#22c55e" />
        </div>
        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500, marginBottom: 4 }}>Offer Rate</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', fontFamily: 'Outfit, sans-serif' }}>
            {summary.offerRate}
          </p>
        </div>
      </div>
    </div>
  );
}
