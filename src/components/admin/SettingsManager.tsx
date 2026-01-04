import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  User, Settings, Shield, Users, Bell, Save, Loader2, 
  Mail, Lock, CheckCircle, AlertCircle 
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: string | null;
}

interface SiteSettings {
  site_title: string;
  site_tagline: string;
  contact_email: string;
}

interface SettingsManagerProps {
  userId: string;
  userEmail?: string;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export function SettingsManager({ userId, userEmail, onProfileUpdate }: SettingsManagerProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  // Site settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_title: 'Vision-Sync',
    site_tagline: 'Build. Showcase. Sell. Invest. Sync your vision with the future.',
    contact_email: 'contact@vision-sync.com'
  });
  
  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Users list
  const [users, setUsers] = useState<UserProfile[]>([]);
  
  // Notifications state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [leadAlerts, setLeadAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProfile(),
        fetchSiteSettings(),
        fetchUsers()
      ]);
    } catch (error) {
      console.error('Error fetching settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      const profileData = data as UserProfile;
      setProfile(profileData);
      setFirstName(profileData.first_name || '');
      setLastName(profileData.last_name || '');
    }
  };

  const fetchSiteSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_key, setting_value');
    
    if (!error && data) {
      const settings: SiteSettings = { ...siteSettings };
      data.forEach((item: any) => {
        const value = typeof item.setting_value === 'string' 
          ? item.setting_value.replace(/^"|"$/g, '') 
          : item.setting_value;
        if (item.setting_key === 'site_title') settings.site_title = value;
        if (item.setting_key === 'site_tagline') settings.site_tagline = value;
        if (item.setting_key === 'contact_email') settings.contact_email = value;
      });
      setSiteSettings(settings);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setUsers(data as UserProfile[]);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: firstName.trim() || null,
          last_name: lastName.trim() || null
        })
        .eq('id', userId);
      
      if (error) throw error;
      
      const updatedProfile = { 
        ...profile!, 
        first_name: firstName.trim() || null, 
        last_name: lastName.trim() || null 
      };
      setProfile(updatedProfile);
      onProfileUpdate?.(updatedProfile);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const saveSiteSettings = async () => {
    setSaving(true);
    try {
      const updates = [
        { setting_key: 'site_title', setting_value: JSON.stringify(siteSettings.site_title) },
        { setting_key: 'site_tagline', setting_value: JSON.stringify(siteSettings.site_tagline) },
        { setting_key: 'contact_email', setting_value: JSON.stringify(siteSettings.contact_email) }
      ];
      
      for (const update of updates) {
        const { error } = await supabase
          .from('site_settings')
          .upsert(update, { onConflict: 'setting_key' });
        if (error) throw error;
      }
      
      toast({
        title: "Settings Saved",
        description: "Site settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New password and confirmation don't match.",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to change password",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case 'admin': return 'default';
      case 'moderator': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-midnight-navy">Settings</h1>
        <p className="text-cool-gray">Manage your profile, site settings, and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="site" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Site</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <User className="h-5 w-5 text-electric-blue" />
                My Profile
              </CardTitle>
              <CardDescription>
                Update your personal information. Your first name will be used in the dashboard greeting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <p className="text-xs text-cool-gray">
                    This name will appear in "Good morning, {firstName || 'Name'}"
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={userEmail || profile?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-cool-gray">
                  Email cannot be changed from here
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant={getRoleBadgeVariant(profile?.role)}>
                    {profile?.role?.charAt(0).toUpperCase()}{profile?.role?.slice(1) || 'User'}
                  </Badge>
                  <span className="text-sm text-cool-gray">
                    {profile?.role === 'admin' ? 'Full access to all features' : 'Limited access'}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={saving} variant="premium">
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="site">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Settings className="h-5 w-5 text-royal-purple" />
                Site Settings
              </CardTitle>
              <CardDescription>
                Configure global site settings and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="siteTitle">Site Title</Label>
                <Input
                  id="siteTitle"
                  value={siteSettings.site_title}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteTagline">Site Tagline</Label>
                <Input
                  id="siteTagline"
                  value={siteSettings.site_tagline}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_tagline: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={siteSettings.contact_email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                />
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button onClick={saveSiteSettings} disabled={saving} variant="premium">
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-green" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-midnight-navy flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={changePassword} 
                  disabled={saving || !newPassword || !confirmPassword}
                  variant="outline"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4 mr-2" />
                  )}
                  Update Password
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-midnight-navy">Session Information</h3>
                <div className="p-4 bg-gradient-subtle rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-emerald-green">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Active Session</span>
                  </div>
                  <p className="text-sm text-cool-gray">
                    Logged in as: {userEmail || profile?.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Users className="h-5 w-5 text-sky-blue" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage system users ({users.length} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.length === 0 ? (
                  <p className="text-cool-gray text-center py-8">No users found</p>
                ) : (
                  users.map((user) => (
                    <div 
                      key={user.id} 
                      className="flex items-center justify-between p-4 border border-soft-lilac/30 rounded-lg hover:bg-gradient-subtle transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-electric-blue to-royal-purple flex items-center justify-center text-white font-medium">
                          {(user.first_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-midnight-navy">
                            {user.first_name && user.last_name 
                              ? `${user.first_name} ${user.last_name}`
                              : user.full_name || user.email?.split('@')[0] || 'Unknown'}
                          </div>
                          <div className="text-sm text-cool-gray">{user.email}</div>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role?.charAt(0).toUpperCase()}{user.role?.slice(1) || 'User'}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-medium">Role Management</p>
                    <p className="mt-1">
                      User roles can only be changed directly in the database for security reasons.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="font-heading flex items-center gap-2">
                <Bell className="h-5 w-5 text-coral-orange" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Configure how you receive alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-soft-lilac/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-midnight-navy flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Notifications
                    </div>
                    <p className="text-sm text-cool-gray">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-soft-lilac/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-midnight-navy">New Lead Alerts</div>
                    <p className="text-sm text-cool-gray">
                      Get notified when a new lead comes in
                    </p>
                  </div>
                  <Switch
                    checked={leadAlerts}
                    onCheckedChange={setLeadAlerts}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 border border-soft-lilac/30 rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium text-midnight-navy">Weekly Digest</div>
                    <p className="text-sm text-cool-gray">
                      Receive a weekly summary of activity
                    </p>
                  </div>
                  <Switch
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
                  />
                </div>
              </div>

              <div className="p-4 bg-gradient-subtle rounded-lg">
                <p className="text-sm text-cool-gray">
                  <strong>Note:</strong> Notification settings are stored locally. 
                  Email notification functionality requires additional backend configuration.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
