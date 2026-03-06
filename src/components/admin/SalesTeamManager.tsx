import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Link as LinkIcon, ExternalLink, Percent, Mail, Plus, ShieldCheck, Copy, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';

export function SalesTeamManager() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [inviteEmail, setInviteEmail] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const mockInviteLink = "https://vision-sync.app/invite/sales/t_9x8a7f";

    const handleCopy = () => {
        navigator.clipboard.writeText(mockInviteLink);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        toast({
            title: "Link Copied!",
            description: "Invite link copied to clipboard.",
        });
    };

    const handleSendInvite = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail) return;
        toast({
            title: "Invite Sent!",
            description: `An invitation has been sent to ${inviteEmail}`,
        });
        setInviteEmail('');
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
                                            <CardDescription>Add a new agent to your CRM.</CardDescription>
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
                                        <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700">
                                            <Plus className="mr-2 h-4 w-4" /> Send Email Invite
                                        </Button>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                        <Label className="text-sm font-medium mb-2 block">Or share invite link</Label>
                                        <div className="flex gap-2">
                                            <Input readOnly value={mockInviteLink} className="bg-slate-50 text-slate-500 dark:bg-slate-900/50 font-mono text-xs" />
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
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-brand/10 text-brand dark:bg-brand/20 dark:text-brand-light rounded-md">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">Active Agents</CardTitle>
                                            <CardDescription>Manage your current sales force.</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {/* Mock Team Member 1 */}
                                        <div className="py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                    JD
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">John Doe</p>
                                                    <p className="text-sm text-slate-500">john.doe@example.com</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-none">Active</Badge>
                                                <Button variant="ghost" size="sm" className="text-slate-500">Manage</Button>
                                            </div>
                                        </div>

                                        {/* Mock Team Member 2 */}
                                        <div className="py-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                    SA
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">Sarah Adams</p>
                                                    <p className="text-sm text-slate-500">sarah.a@example.com</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-none">Pending Invite</Badge>
                                                <Button variant="ghost" size="sm" className="text-slate-500">Resend</Button>
                                            </div>
                                        </div>
                                    </div>
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
