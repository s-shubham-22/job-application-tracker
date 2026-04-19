import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useAuthStore } from '@/store/auth.store';
import { getInitials } from '@/utils/formatters';
import { User, Mail, Bell, Shield, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user } = useAuthStore();

  const handleSave = async () => {
    toast.success('Settings saved!');
  };

  return (
    <AppLayout>
      <div className="page-content" style={{ maxWidth: 800 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Manage your profile and preferences</p>
        </div>

        {/* Profile Card */}
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} color="var(--text-primary)" />
            Profile
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 700, color: '#fff',
            }}>
              {getInitials(user?.fullName)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.fullName}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{user?.email}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Full Name</label>
              <input className="input" defaultValue={user?.fullName} disabled />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" defaultValue={user?.email} disabled />
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>Profile editing coming soon</p>
        </div>


        {/* Account Security */}
        <div className="card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} color="var(--text-primary)" />
            Account
          </h2>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              fontSize: 13, color: '#22c55e', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e' }} />
              Account active
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
