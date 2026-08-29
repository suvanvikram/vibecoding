import { useState } from 'react';
import { PageHeader } from '@/components/ui/DateRangeSelector';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFinance } from '@/store/FinanceContext';
import { useNotification } from '@/store/NotificationContext';
import { User, Bell, Shield, Palette, Database, LogOut } from 'lucide-react';

export function SettingsPage() {
  const { user, displayName, updateProfile, signOut } = useFinance();
  const { notify } = useNotification();
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const { error } = await updateProfile(name.trim());
    setSaving(false);
    if (error) {
      notify('Failed to update profile', 'warning');
    } else {
      notify('Profile updated successfully');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    notify('Signed out successfully', 'warning');
  };

  const settingsSections = [
    { icon: Bell, title: 'Notifications', desc: 'Manage your alert preferences', enabled: true },
    { icon: Shield, title: 'Security', desc: 'Authentication and password settings', enabled: true },
    { icon: Palette, title: 'Appearance', desc: 'Theme and display preferences', enabled: false },
    { icon: Database, title: 'Data & Privacy', desc: 'Your data is stored securely in the cloud', enabled: true },
  ];

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile */}
        <Card className="p-5 lg:col-span-2" delay={0.05}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center text-white text-lg font-semibold">
              {(displayName || user?.email || '?').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Profile</h3>
              <p className="text-xs text-text-secondary">Update your personal information</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            <Input label="Email" value={user?.email ?? ''} disabled />
            <Button type="submit" loading={saving}>Save Changes</Button>
          </form>
        </Card>

        {/* Quick actions */}
        <div className="space-y-4">
          <Card className="p-5" delay={0.1}>
            <h3 className="text-base font-semibold text-text-primary mb-4">Account</h3>
            <div className="space-y-2">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50 hover:bg-danger/10 transition-colors text-left">
                <LogOut className="w-4 h-4 text-danger" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">Logout</div>
                  <div className="text-xs text-text-tertiary">Sign out of your account</div>
                </div>
              </button>
            </div>
          </Card>

          <Card className="p-5" delay={0.15}>
            <h3 className="text-base font-semibold text-text-primary mb-4">Preferences</h3>
            <div className="space-y-2">
              {settingsSections.map((s) => (
                <div key={s.title} className="flex items-center gap-3 p-3 rounded-xl bg-bg-elevated/50">
                  <s.icon className="w-4 h-4 text-text-secondary" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-text-primary">{s.title}</div>
                    <div className="text-xs text-text-tertiary">{s.desc}</div>
                  </div>
                  <div className={`w-9 h-5 rounded-full transition-colors ${s.enabled ? 'bg-success' : 'bg-bg-hover'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white mt-0.5 transition-transform ${s.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
