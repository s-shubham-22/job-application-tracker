import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Briefcase, Building2, Link, DollarSign, MapPin, Calendar, AlignLeft } from 'lucide-react';
import { ApplicationStatus } from '@/types/job.types';
import { useCreateJob } from '@/hooks/useJobs';
import Select from '@/components/ui/Select';

const statusValues = Object.values(ApplicationStatus) as [string, ...string[]];

const jobSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  companyName: z.string().min(1, 'Company is required'),
  companyWebsite: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  companyLocation: z.string().optional(),
  jobUrl: z.string().optional(),
  salary: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(statusValues).optional(),
  followUpDate: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  onClose: () => void;
  defaultStatus?: ApplicationStatus;
}

export default function JobForm({ onClose, defaultStatus }: JobFormProps) {
  const createJob = useCreateJob();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      status: defaultStatus || ApplicationStatus.APPLIED,
    },
  });

  const onSubmit = async (values: JobFormValues) => {
    let followUpDateStr = undefined;
    if (values.followUpDate) {
      followUpDateStr = new Date(values.followUpDate).toISOString();
    }

    await createJob.mutateAsync({
      ...values,
      status: values.status as ApplicationStatus,
      companyWebsite: values.companyWebsite || undefined,
      jobUrl: values.jobUrl || undefined,
      followUpDate: followUpDateStr,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: 600 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, marginBottom: 4 }}>Add Application</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Track a new job opportunity</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label"><Briefcase size={13} style={{ display: 'inline', marginRight: 4 }} />Job Title *</label>
              <input className={`input ${errors.jobTitle ? 'error' : ''}`} placeholder="e.g. Software Engineer" {...register('jobTitle')} />
              {errors.jobTitle && <p className="error-text">{errors.jobTitle.message}</p>}
            </div>
            <div>
              <label className="label"><Building2 size={13} style={{ display: 'inline', marginRight: 4 }} />Company *</label>
              <input className={`input ${errors.companyName ? 'error' : ''}`} placeholder="e.g. Google" {...register('companyName')} />
              {errors.companyName && <p className="error-text">{errors.companyName.message}</p>}
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label"><Link size={13} style={{ display: 'inline', marginRight: 4 }} />Company Website</label>
              <input className={`input ${errors.companyWebsite ? 'error' : ''}`} placeholder="https://company.com" {...register('companyWebsite')} />
              {errors.companyWebsite && <p className="error-text">{errors.companyWebsite.message}</p>}
            </div>
            <div>
              <label className="label"><Link size={13} style={{ display: 'inline', marginRight: 4 }} />Job URL</label>
              <input className="input" placeholder="https://careers.company.com/..." {...register('jobUrl')} />
            </div>
          </div>

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label className="label"><DollarSign size={13} style={{ display: 'inline', marginRight: 4 }} />Salary</label>
              <input className="input" placeholder="$120,000" {...register('salary')} />
            </div>
            <div>
              <label className="label"><MapPin size={13} style={{ display: 'inline', marginRight: 4 }} />Location</label>
              <input className="input" placeholder="Remote / NYC" {...register('location')} />
            </div>
            <div>
              <label className="label">Status</label>
              <Select className="input" {...register('status')}>
                {Object.values(ApplicationStatus).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </div>
          </div>

          {/* Row 4: Follow-up + Description */}
          <div style={{ marginBottom: 16 }}>
            <label className="label"><Calendar size={13} style={{ display: 'inline', marginRight: 4 }} />Follow-Up Date</label>
            <input type="date" className="input" {...register('followUpDate')} />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="label"><AlignLeft size={13} style={{ display: 'inline', marginRight: 4 }} />Description / Notes</label>
            <textarea className="input" rows={3} placeholder="Brief description of the role..." {...register('description')} />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting || createJob.isPending}>
              {createJob.isPending ? 'Adding...' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
