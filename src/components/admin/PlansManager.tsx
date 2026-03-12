import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, TrendingUp, Users, CreditCard, BarChart3,
  Check, X, Search, Crown, Gem, Star, ToggleLeft, ToggleRight,
  ChevronDown, AlertTriangle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// ─── Types ────────────────────────────────────────────────────

interface PlanFeature {
  id: string;
  text: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  currency: string;
  color: string;
  badge: string;
  maxAgents: number;
  maxConversations: number;
  maxContacts: number;
  features: PlanFeature[];
  subscribers: number;
  revenue: number;
  isActive: boolean;
  isPopular: boolean;
}

type FilterTab = 'all' | 'active' | 'inactive';

// ─── Color System ─────────────────────────────────────────────

const COLOR_OPTIONS = ['indigo', 'emerald', 'amber', 'pink', 'purple', 'cyan', 'red', 'blue'] as const;

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; accent: string; ring: string }> = {
  indigo:  { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/30',  text: 'text-indigo-400',  accent: 'bg-indigo-500',  ring: 'ring-indigo-500' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', accent: 'bg-emerald-500', ring: 'ring-emerald-500' },
  amber:   { bg: 'bg-amber-500/10',   border: 'border-amber-500/30',   text: 'text-amber-400',   accent: 'bg-amber-500',   ring: 'ring-amber-500' },
  pink:    { bg: 'bg-pink-500/10',    border: 'border-pink-500/30',    text: 'text-pink-400',    accent: 'bg-pink-500',    ring: 'ring-pink-500' },
  purple:  { bg: 'bg-purple-500/10',  border: 'border-purple-500/30',  text: 'text-purple-400',  accent: 'bg-purple-500',  ring: 'ring-purple-500' },
  cyan:    { bg: 'bg-cyan-500/10',    border: 'border-cyan-500/30',    text: 'text-cyan-400',    accent: 'bg-cyan-500',    ring: 'ring-cyan-500' },
  red:     { bg: 'bg-red-500/10',     border: 'border-red-500/30',     text: 'text-red-400',     accent: 'bg-red-500',     ring: 'ring-red-500' },
  blue:    { bg: 'bg-blue-500/10',    border: 'border-blue-500/30',    text: 'text-blue-400',    accent: 'bg-blue-500',    ring: 'ring-blue-500' },
};

const getColor = (color: string) => COLOR_MAP[color] || COLOR_MAP.indigo;

// ─── Seed Data ────────────────────────────────────────────────

const makeSeedPlans = (): Plan[] => [
  {
    id: crypto.randomUUID(),
    name: 'Starter',
    description: 'Perfect for small businesses getting started with AI automation',
    price: 49,
    billingCycle: 'monthly',
    currency: 'EUR',
    color: 'emerald',
    badge: 'Entry',
    maxAgents: 2,
    maxConversations: 500,
    maxContacts: 1000,
    features: [
      { id: crypto.randomUUID(), text: '2 AI Agents' },
      { id: crypto.randomUUID(), text: '500 conversations/mo' },
      { id: crypto.randomUUID(), text: '1,000 contacts' },
      { id: crypto.randomUUID(), text: 'Email support' },
      { id: crypto.randomUUID(), text: 'Basic analytics' },
    ],
    subscribers: 127,
    revenue: 6223,
    isActive: true,
    isPopular: false,
  },
  {
    id: crypto.randomUUID(),
    name: 'Growth',
    description: 'For growing businesses that need advanced AI capabilities and integrations',
    price: 149,
    billingCycle: 'monthly',
    currency: 'EUR',
    color: 'indigo',
    badge: 'Most Popular',
    maxAgents: 10,
    maxConversations: 5000,
    maxContacts: 25000,
    features: [
      { id: crypto.randomUUID(), text: '10 AI Agents' },
      { id: crypto.randomUUID(), text: '5,000 conversations/mo' },
      { id: crypto.randomUUID(), text: '25,000 contacts' },
      { id: crypto.randomUUID(), text: 'Priority support' },
      { id: crypto.randomUUID(), text: 'Advanced analytics' },
      { id: crypto.randomUUID(), text: 'CRM integration' },
      { id: crypto.randomUUID(), text: 'Custom branding' },
    ],
    subscribers: 84,
    revenue: 12516,
    isActive: true,
    isPopular: true,
  },
  {
    id: crypto.randomUUID(),
    name: 'Enterprise',
    description: 'Unlimited power for large organizations with complex automation needs',
    price: 499,
    billingCycle: 'monthly',
    currency: 'EUR',
    color: 'amber',
    badge: 'Premium',
    maxAgents: 100,
    maxConversations: 50000,
    maxContacts: 500000,
    features: [
      { id: crypto.randomUUID(), text: 'Unlimited AI Agents' },
      { id: crypto.randomUUID(), text: '50,000 conversations/mo' },
      { id: crypto.randomUUID(), text: '500,000 contacts' },
      { id: crypto.randomUUID(), text: 'Dedicated account manager' },
      { id: crypto.randomUUID(), text: 'Enterprise analytics & reporting' },
      { id: crypto.randomUUID(), text: 'All integrations included' },
      { id: crypto.randomUUID(), text: 'White-label branding' },
      { id: crypto.randomUUID(), text: 'SLA guarantee (99.9%)' },
      { id: crypto.randomUUID(), text: 'Full API access' },
    ],
    subscribers: 31,
    revenue: 15469,
    isActive: true,
    isPopular: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────

const emptyPlanForm = (): Plan => ({
  id: '',
  name: '',
  description: '',
  price: 0,
  billingCycle: 'monthly',
  currency: 'EUR',
  color: 'indigo',
  badge: '',
  maxAgents: 1,
  maxConversations: 100,
  maxContacts: 500,
  features: [],
  subscribers: 0,
  revenue: 0,
  isActive: true,
  isPopular: false,
});

// ─── Component ────────────────────────────────────────────────

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>(makeSeedPlans);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan>(emptyPlanForm());
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  // ─── Computed ───────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = plans.filter(p => p.isActive);
    const totalSubs = plans.reduce((s, p) => s + p.subscribers, 0);
    const totalRev = plans.reduce((s, p) => s + p.revenue, 0);
    return {
      totalMRR: totalRev,
      totalSubscribers: totalSubs,
      activePlans: active.length,
      avgPerSubscriber: totalSubs > 0 ? Math.round(totalRev / totalSubs) : 0,
    };
  }, [plans]);

  const filteredPlans = useMemo(() => {
    if (activeTab === 'active') return plans.filter(p => p.isActive);
    if (activeTab === 'inactive') return plans.filter(p => !p.isActive);
    return plans;
  }, [plans, activeTab]);

  // ─── Handlers ───────────────────────────────────────────────

  const openCreate = () => {
    setEditingPlan(emptyPlanForm());
    setIsEditing(false);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  const openEdit = (plan: Plan) => {
    setEditingPlan({ ...plan, features: plan.features.map(f => ({ ...f })) });
    setIsEditing(true);
    setNewFeatureText('');
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingPlan.name.trim()) {
      toast.error('Plan name is required');
      return;
    }
    if (editingPlan.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (isEditing) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? editingPlan : p));
      toast.success(`"${editingPlan.name}" plan updated`);
    } else {
      const newPlan: Plan = { ...editingPlan, id: crypto.randomUUID() };
      setPlans(prev => [...prev, newPlan]);
      toast.success(`"${newPlan.name}" plan created`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setPlans(prev => prev.filter(p => p.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" plan deleted`);
    setDeleteTarget(null);
  };

  const toggleActive = (id: string) => {
    setPlans(prev =>
      prev.map(p => {
        if (p.id !== id) return p;
        const updated = { ...p, isActive: !p.isActive };
        toast.success(`"${p.name}" ${updated.isActive ? 'activated' : 'deactivated'}`);
        return updated;
      })
    );
  };

  const addFeature = () => {
    const text = newFeatureText.trim();
    if (!text) return;
    setEditingPlan(prev => ({
      ...prev,
      features: [...prev.features, { id: crypto.randomUUID(), text }],
    }));
    setNewFeatureText('');
  };

  const removeFeature = (featureId: string) => {
    setEditingPlan(prev => ({
      ...prev,
      features: prev.features.filter(f => f.id !== featureId),
    }));
  };

  const updateField = <K extends keyof Plan>(key: K, value: Plan[K]) => {
    setEditingPlan(prev => ({ ...prev, [key]: value }));
  };

  // ─── Filter Tabs Config ─────────────────────────────────────

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All Plans', count: plans.length },
    { key: 'active', label: 'Active', count: plans.filter(p => p.isActive).length },
    { key: 'inactive', label: 'Inactive', count: plans.filter(p => !p.isActive).length },
  ];

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0f1e] -m-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
              <Gem className="h-5 w-5 text-indigo-400" />
            </div>
            Plans Manager
          </h1>
          <p className="text-white/50 mt-1 ml-[52px]">Manage pricing tiers and subscriptions</p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Plan
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total MRR', value: `\u20AC${stats.totalMRR.toLocaleString()}`, icon: TrendingUp, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20' },
          { label: 'Total Subscribers', value: stats.totalSubscribers.toLocaleString(), icon: Users, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20' },
          { label: 'Active Plans', value: stats.activePlans.toString(), icon: CreditCard, iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/20' },
          { label: 'Avg per Subscriber', value: `\u20AC${stats.avgPerSubscriber}`, icon: BarChart3, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20' },
        ].map(stat => (
          <div key={stat.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/40 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white'
                : 'bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/70'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${activeTab === tab.key ? 'text-indigo-200' : 'text-white/30'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Plan Cards Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-16 text-center">
          <Gem className="h-12 w-12 mx-auto text-white/20 mb-4" />
          <h3 className="text-lg font-medium text-white/60">No plans found</h3>
          <p className="text-white/30 mt-1">Create your first pricing plan to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const c = getColor(plan.color);
            return (
              <div
                key={plan.id}
                className={`bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden transition-all hover:bg-white/[0.05] hover:border-white/[0.1] ${
                  !plan.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Color Accent Bar */}
                <div className={`h-1.5 ${c.accent}`} />

                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                        {plan.isPopular && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>
                      {plan.badge && (
                        <Badge className={`${c.bg} ${c.text} ${c.border} text-xs`}>
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">
                        {'\u20AC'}{plan.price}
                      </p>
                      <p className="text-white/40 text-xs">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{plan.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-5">
                    {plan.features.slice(0, 5).map(f => (
                      <div key={f.id} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className={`h-3.5 w-3.5 ${c.text} flex-shrink-0`} />
                        {f.text}
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-white/30 pl-5">
                        +{plan.features.length - 5} more features
                      </p>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-white/40 text-xs">Subscribers</p>
                      <p className="text-white font-semibold">{plan.subscribers}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-lg p-3">
                      <p className="text-white/40 text-xs">Revenue</p>
                      <p className="text-white font-semibold">{'\u20AC'}{plan.revenue.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                    <button
                      onClick={() => toggleActive(plan.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        plan.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-white/40 hover:text-white/60'
                      }`}
                    >
                      {plan.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10"
                        onClick={() => openEdit(plan)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => setDeleteTarget(plan)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create / Edit Modal ─────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f1629] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Gem className="h-5 w-5 text-indigo-400" />
              {isEditing ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
            <DialogDescription className="text-white/50">
              {isEditing ? 'Update plan details and features' : 'Configure a new pricing tier'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Row: Name + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Plan Name *</Label>
                <Input
                  value={editingPlan.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Growth"
                  className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Badge Label</Label>
                <Input
                  value={editingPlan.badge}
                  onChange={e => updateField('badge', e.target.value)}
                  placeholder="e.g. Most Popular"
                  className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-white/70">Description</Label>
              <Textarea
                value={editingPlan.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Brief description for the pricing card"
                rows={2}
                className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30 resize-none"
              />
            </div>

            {/* Row: Price + Billing Cycle + Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Price *</Label>
                <Input
                  type="number"
                  value={editingPlan.price || ''}
                  onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="149"
                  className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Billing Cycle</Label>
                <Select
                  value={editingPlan.billingCycle}
                  onValueChange={v => updateField('billingCycle', v as Plan['billingCycle'])}
                >
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2035] border-white/10">
                    <SelectItem value="monthly" className="text-white hover:bg-white/10">Monthly</SelectItem>
                    <SelectItem value="yearly" className="text-white hover:bg-white/10">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Currency</Label>
                <Select
                  value={editingPlan.currency}
                  onValueChange={v => updateField('currency', v)}
                >
                  <SelectTrigger className="bg-white/[0.05] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2035] border-white/10">
                    <SelectItem value="EUR" className="text-white hover:bg-white/10">EUR ({'\u20AC'})</SelectItem>
                    <SelectItem value="USD" className="text-white hover:bg-white/10">USD ($)</SelectItem>
                    <SelectItem value="GBP" className="text-white hover:bg-white/10">GBP ({'\u00A3'})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label className="text-white/70">Accent Color</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(c => (
                  <button
                    key={c}
                    onClick={() => updateField('color', c)}
                    className={`h-8 w-8 rounded-full ${COLOR_MAP[c].accent} transition-all ${
                      editingPlan.color === c ? 'ring-2 ring-offset-2 ring-offset-[#0f1629] ' + COLOR_MAP[c].ring : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Limits */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-white/70">Max Agents</Label>
                <Input
                  type="number"
                  value={editingPlan.maxAgents || ''}
                  onChange={e => updateField('maxAgents', parseInt(e.target.value) || 0)}
                  className="bg-white/[0.05] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Max Conversations</Label>
                <Input
                  type="number"
                  value={editingPlan.maxConversations || ''}
                  onChange={e => updateField('maxConversations', parseInt(e.target.value) || 0)}
                  className="bg-white/[0.05] border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/70">Max Contacts</Label>
                <Input
                  type="number"
                  value={editingPlan.maxContacts || ''}
                  onChange={e => updateField('maxContacts', parseInt(e.target.value) || 0)}
                  className="bg-white/[0.05] border-white/10 text-white"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label className="text-white/70">Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeatureText}
                  onChange={e => setNewFeatureText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="Type a feature and press Enter"
                  className="bg-white/[0.05] border-white/10 text-white placeholder:text-white/30"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  className="border-white/10 text-white/70 hover:bg-white/10 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {editingPlan.features.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 group">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <Check className="h-3.5 w-3.5 text-indigo-400" />
                      {f.text}
                    </div>
                    <button
                      onClick={() => removeFeature(f.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {editingPlan.features.length === 0 && (
                  <p className="text-white/20 text-sm text-center py-3">No features added yet</p>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 p-4 bg-white/[0.03] rounded-lg border border-white/[0.06]">
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPlan.isActive}
                  onCheckedChange={v => updateField('isActive', v)}
                />
                <Label className="text-white/70">Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPlan.isPopular}
                  onCheckedChange={v => updateField('isPopular', v)}
                />
                <Label className="text-white/70">Mark as Popular</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-white/[0.06] pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-white/10 text-white/70 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-[#0f1629] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Plan
            </DialogTitle>
            <DialogDescription className="text-white/50">
              Are you sure you want to delete <strong className="text-white">{deleteTarget?.name}</strong>?
              This action cannot be undone. All subscriber data associated with this plan will be affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-white/10 text-white/70 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
