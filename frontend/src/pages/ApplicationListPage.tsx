import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import StatusBadge from '@/components/ui/StatusBadge';
import JobForm from '@/components/jobs/JobForm';
import Select from '@/components/ui/Select';
import { useJobs, useDeleteJob } from '@/hooks/useJobs';
import { jobsApi } from '@/api/jobs.api';
import { ApplicationStatus } from '@/types/job.types';
import { STATUS_LABELS } from '@/utils/constants';
import { formatDate } from '@/utils/formatters';
import {
  Plus, Search, Filter, Download, Trash2,
  ChevronLeft, ChevronRight, Eye, ArrowUpDown,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ApplicationStatus | ''>('');
  const [sortBy, setSortBy] = useState('appliedAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [showJobForm, setShowJobForm] = useState(false);

  const { data, isLoading } = useJobs({ page, limit: 10, search, status, sortBy, sortOrder });
  const deleteJob = useDeleteJob();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleExport = async () => {
    try {
      await jobsApi.exportToExcel();
      toast.success('Export started!');
    } catch {
      toast.error('Export failed');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this application?')) return;
    deleteJob.mutate(id);
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC');
    } else {
      setSortBy(field);
      setSortOrder('DESC');
    }
    setPage(1);
  };

  return (
    <AppLayout>
      <div className="page-content" style={{ padding: '28px 32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, marginBottom: 4 }}>Applications</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {data ? `${data.total} total applications` : 'Loading...'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-secondary" onClick={handleExport}>
              <Download size={15} />
              Export Excel
            </button>
            <button className="btn-primary" onClick={() => setShowJobForm(true)}>
              <Plus size={16} />
              Add Application
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="input" style={{ paddingLeft: 36 }} placeholder="Search by company or title..." value={search} onChange={handleSearch} />
          </div>
          <Select className="input" style={{ width: 160 }} value={status} onChange={(e) => { setStatus(e.target.value as ApplicationStatus | ''); setPage(1); }}>
            <option value="">All Statuses</option>
            {Object.values(ApplicationStatus).map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </Select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>
                    <button onClick={() => toggleSort('jobTitle')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Job Title <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>
                    <button onClick={() => toggleSort('appliedAt')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Applied <ArrowUpDown size={12} />
                    </button>
                  </th>
                  <th>Follow-Up</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j}><div className="skeleton" style={{ height: 16, borderRadius: 4 }} /></td>
                      ))}
                    </tr>
                  ))
                ) : data?.items.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                      No applications found. Add your first one!
                    </td>
                  </tr>
                ) : (
                  data?.items.map((job) => (
                    <tr key={job.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/applications/${job.id}`)}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{job.jobTitle}</div>
                        {job.salary && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{job.salary}</div>}
                      </td>
                      <td>{job.company?.name}</td>
                      <td><StatusBadge status={job.status} /></td>
                      <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>{job.location || '—'}</td>
                      <td style={{ fontSize: 13 }}>{formatDate(job.appliedAt)}</td>
                      <td style={{ fontSize: 13 }}>{formatDate(job.followUpDate)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }} onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => navigate(`/applications/${job.id}`)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand-400)', padding: 4 }}
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => handleDelete(job.id, e)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 4 }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Page {page} of {Math.max(data.totalPages, 1)}
              </span>
              <div className="pagination">
                <button className="page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(data.totalPages, 7) }).map((_, i) => (
                  <button key={i + 1} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                <button className="page-btn" disabled={page >= data.totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showJobForm && <JobForm onClose={() => setShowJobForm(false)} />}
    </AppLayout>
  );
}
