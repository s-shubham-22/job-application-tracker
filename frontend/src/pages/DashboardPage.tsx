import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCards from '@/components/analytics/StatsCards';
import StatusPieChart from '@/components/analytics/StatusPieChart';
import TimelineBarChart from '@/components/analytics/TimelineBarChart';
import JobForm from '@/components/jobs/JobForm';
import { useAnalyticsSummary, useAnalyticsTimeline } from '@/hooks/useAnalytics';
import { useAuthStore } from '@/store/auth.store';
import { Plus, TrendingUp, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [showJobForm, setShowJobForm] = useState(false);
  const { user } = useAuthStore();
  const { data: summary, isLoading: summaryLoading } = useAnalyticsSummary();
  const { data: timeline, isLoading: timelineLoading } = useAnalyticsTimeline();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppLayout>
      <div className="page-content">
        {/* Page Header */}
        <div className="dashboard-header">
          <div>
            <h1 style={{ fontSize: 28, marginBottom: 6 }}>
              {greeting}, <span className="gradient-text">{user?.fullName?.split(' ')[0] || 'there'}</span> 👋
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
              Here's an overview of your job search progress
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowJobForm(true)}>
            <Plus size={16} />
            Add Application
          </button>
        </div>

        {/* Stats Cards */}
        {summaryLoading ? (
          <div className="dashboard-stats-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 100 }} />
            ))}
          </div>
        ) : summary ? (
          <StatsCards summary={summary} />
        ) : null}

        {/* Charts Row */}
        <div className="dashboard-charts-grid">
          {/* Pie Chart */}
          <div className="card chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Applications by Status</h3>
            </div>
            {summaryLoading ? (
              <div className="skeleton" style={{ height: 280 }} />
            ) : summary ? (
              <StatusPieChart summary={summary} />
            ) : null}
          </div>

          {/* Bar Chart */}
          <div className="card chart-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1' }} />
              <h3 style={{ fontSize: 15, fontWeight: 600 }}>Activity (Last 6 Months)</h3>
              <TrendingUp size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </div>
            {timelineLoading ? (
              <div className="skeleton" style={{ height: 280 }} />
            ) : timeline ? (
              <TimelineBarChart data={timeline} />
            ) : null}
          </div>
        </div>

        {/* Quick Links */}
        <div className="dashboard-links-grid">
          {[
            { label: 'Kanban Board', desc: 'Visualize your pipeline', href: '/kanban', color: '#6366f1' },
            { label: 'All Applications', desc: 'View and filter your list', href: '/applications', color: '#10b981' },
            { label: 'Settings', desc: 'Manage profile & security', href: '/settings', color: '#f59e0b' },
          ].map(({ label, desc, href, color }) => (
            <a
              key={href}
              href={href}
              className="card"
              style={{
                padding: '20px',
                display: 'block',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginBottom: 12 }} />
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{desc}</div>
            </a>
          ))}
        </div>
      </div>

      {showJobForm && <JobForm onClose={() => setShowJobForm(false)} />}
    </AppLayout>
  );
}
