import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';
import { Mail, Lock, User, BriefcaseBusiness, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Must contain at least one letter and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const data = await authApi.register({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      setAuth(data.user as any, data.accessToken, data.refreshToken);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.error?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 14, boxShadow: '0 8px 24px rgba(79,70,229,0.4)',
          }}>
            <BriefcaseBusiness size={26} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, marginBottom: 6 }}>Create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
            Start tracking your job search like a pro
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ marginBottom: 14 }}>
            <label className="label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <User size={16} />
              </span>
              <input className={`input ${errors.fullName ? 'error' : ''}`} style={{ paddingLeft: 38 }} placeholder="Shubham Sareliya" {...register('fullName')} />
            </div>
            {errors.fullName && <p className="error-text">{errors.fullName.message}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Email address</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Mail size={16} />
              </span>
              <input className={`input ${errors.email ? 'error' : ''}`} style={{ paddingLeft: 38 }} placeholder="you@example.com" type="email" {...register('email')} />
            </div>
            {errors.email && <p className="error-text">{errors.email.message}</p>}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label className="label">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </span>
              <input className={`input ${errors.password ? 'error' : ''}`} style={{ paddingLeft: 38, paddingRight: 44 }} placeholder="Min 8 chars, letter+number" type={showPassword ? 'text' : 'password'} {...register('password')} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="error-text">{errors.password.message}</p>}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="label">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Lock size={16} />
              </span>
              <input className={`input ${errors.confirmPassword ? 'error' : ''}`} style={{ paddingLeft: 38 }} placeholder="Repeat password" type="password" {...register('confirmPassword')} />
            </div>
            {errors.confirmPassword && <p className="error-text">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15 }} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-brand-400)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
