import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, ExternalLink, Percent, Mail, Plus, ShieldCheck, Copy, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
    id: string;
    email: string | null;
    full_name: string | null;
    role: string | null;
    created_at: string;
}

export function SalesTeamManager() {
    const { toast } = useToast();
    const [inviteEmail, setInviteEmail] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [loadingTeam, setLoadingTeam] = useState(true);
    const [inviteLink, setInviteLink] = useState('');

    useEffect(() => {
        // Generate a real invite link using the current origin + a fresh UUID token
        const token = crypto.randomUUID();
        setInviteLink(`${window.location.origin}/auth?invite=${token}&role=sales`);
        loadTeamMembers();
    }, []);

    const loadTeamMembers = async () => {
        setLoadingTeam(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, full_name, role, created_at')
                .order('created_at', { ascending: false });

            if (error) throw new Error(`Failed to fetch team: ${error.message}`);
            setTeamMembers((data as TeamMember[]) || []);
        } catch (err) {
            console.error(err);
            toast({ title: "Error", description: "Failed to load team members.", variant: "destructive" });
        } finally {
            setLoadingTeam(false);
        }
    };

    const regenerateLink = () => {
        const token = crypto.randomUUID();
        setInviteLink(`${window.location.origin}/auth?invite=${token}&role=sales`);
        toast({ title: "New link generated", description: "Share this fresh invite link with your next team member." });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({ title: "Link Copied!", description: "Invite link copied to clipboard." });
    };

    const handleSendInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setIsSending(true);
        try {
            // Use Supabase magic link — sends a real email via Supabase Auth
            const { error } = await supabase.auth.signInWithOtp({
                email: inviteEmail,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth?role=sales`,
                    data: { invited_role: 'sales' }
                }
            });
            if (error) throw error;
            toast({ title: "Invite Sent!", description: `A magic link has been sent to ${inviteEmail}.` });
            setInviteEmail('');
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            toast({ title: "Failed to send invite", description: msg, variant: "destructive" });
        } finally {
            setIsSending(false);
        }
    };

    const getInitials = (name: string | null, email: string | null) => {
        if (name) return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
        if (email) return email.slice(0, 2).toUpperCase();
        return '??';
    };

    const getRoleBadge = (role: string | null) => {
        if (role === 'admin') return <Badge className="bg-purple-100 text-purple-700 border-none">Admin</Badge>;
        if (role === 'sales') return <Badge className="bg-emerald-100 text-emerald-700 border-none">Sales Rep</Badge>;
        return <Badge className="bg-slate-100 text-slate-700 border-none">{role ?? 'User'}</Badge>;
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Agency Sales Team</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage your sales representatives, commission structures, and platform access.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        onClick={() => window.open('/sales-dashboard', '_blank')}
                        className="bg-brand hover:bg-brand-dark text-white font-medium shadow-sm transition-colors"
                    >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Dashboard Template
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="team" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="team">Team & Invites</TabsTrigger>
                    <TabsTrigger value="commission">Commission Foundation</TabsTrigger>
                </TabsList>

                <TabsContent value="team" className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Invite Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-md">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Invite Representative</CardTitle>
                                            <CardDescription>Send a magic link to a new agent.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSendInvite} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="agent@example.com"
                                                value={inviteEmail}
                                                onChange={(e) => setInviteEmail(e.target.value)}
                                                className="bg-slate-50 dark:bg-slate-900/50"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700"
                                            disabled={isSending || !inviteEmail.trim()}
                                        >
                                            {isSending ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Plus className="mr-2 h-4 w-4" />
                                            )}
                                            Send Email Invite
                                        </Button>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-2">
                                            <Label className="text-sm font-medium">Or share invite link</Label>
                                            <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-500" onClick={regenerateLink}>
                                                <RefreshCw className="h-3 w-3 mr-1" /> New link
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Input
                                                readOnly
                                                value={inviteLink}
                                                className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 font-mono text-xs"
                                            />
                                            <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0">
                                                {isCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Active Team */}
                        <div className="lg:col-span-2">
                            <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-full">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light rounded-md">
                                                <Users className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">Platform Users</CardTitle>
                                                <CardDescription>All users with platform access.</CardDescription>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={loadTeamMembers} className="text-slate-500">
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {loadingTeam ? (
                                        <div className="py-8 flex items-center justify-center">
                                            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                                        </div>
                                    ) : teamMembers.length === 0 ? (
                                        <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                                            <Users className="h-10 w-10 mx-auto mb-2 text-slate-300 dark:text-slate-700" />
                                            <p className="text-sm">No team members yet. Send invites to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {teamMembers.map((member) => (
                                                <div key={member.id} className="py-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-10 w-10 rounded-full bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light flex items-center justify-center font-bold text-sm">
                                                            {getInitials(member.full_name, member.email)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                                {member.full_name ?? 'Unknown User'}
                                                            </p>
                                                            <p className="text-sm text-slate-500">{member.email ?? '—'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {getRoleBadge(member.role)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="commission" className="mt-6">
                    <Card className="border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-md">
                                    <Percent className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Global Commission Foundation</CardTitle>
                                    <CardDescription>Set the baseline commission rates applied to new deals closed within the Sales OS.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Setup Fee Commission (%)</Label>
                                        <div className="relative">
                                            <Input type="number" defaultValue={20} className="pl-8 bg-slate-50 dark:bg-slate-900/50" />
                                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                        <p className="text-xs text-slate-500">Applies to one-time agency onboarding fees.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Recurring MRR Commission (%)</Label>
                                        <div className="relative">
                                            <Input type="number" defaultValue={10} className="pl-8 bg-slate-50 dark:bg-slate-900/50" />
                                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                        </div>
                                        <p className="text-xs text-slate-500">Applies to ongoing monthly subscription revenue.</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg flex items-start gap-3 mt-4">
                                    <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Commission Tracking is automated</h4>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            When a deal successfully moves to 'Paid' inside the Sales OS, commissions are automatically tracked for the assigned agent based on these settings.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50 dark:bg-slate-800/20 py-4 border-t border-slate-100 dark:border-slate-800">
                            <Button className="bg-brand hover:bg-brand-dark text-white ml-auto">
                                Save Commission Settings
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
