import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, TrendingUp, Users, CreditCard, BarChart3,
  Check, X, Star, ToggleLeft, ToggleRight,
  AlertTriangle, Loader2, Gem, SlidersHorizontal
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
import { PlanVersionsManager } from './PlanVersionsManager';

// ─── Types ────────────────────────────────────────────────────

interface PlanFeature {
  id: string;
  text: string;
}

interface Plan {
  id: string;
  name: string;
  slug: string;
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
  isActive: boolean;
  isPopular: boolean;
  sortOrder: number;
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
  violet:  { bg: 'bg-violet-500/10',  border: 'border-violet-500/30',  text: 'text-violet-400',  accent: 'bg-violet-500',  ring: 'ring-violet-500' },
};

const getColor = (color: string) => COLOR_MAP[color] || COLOR_MAP.indigo;

// ─── DB Mappers ──────────────────────────────────────────────

interface DbPlanRow {
  id: string;
  name: string;
  slug: string;
  monthly_price: number | null;
  yearly_price: number | null;
  setup_fee: number | null;
  custom_price_label: string | null;
  description: string | null;
  features: unknown;
  is_active: boolean;
  sort_order: number;
  billing_cycle: string | null;
  currency: string | null;
  color: string | null;
  badge: string | null;
  max_agents: number | null;
  max_conversations: number | null;
  max_contacts: number | null;
  is_popular: boolean | null;
}

const dbRowToPlan = (row: DbPlanRow): Plan => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description || '',
  price: row.monthly_price || 0,
  billingCycle: (row.billing_cycle as 'monthly' | 'yearly') || 'monthly',
  currency: row.currency || 'EUR',
  color: row.color || 'indigo',
  badge: row.badge || '',
  maxAgents: row.max_agents || 1,
  maxConversations: row.max_conversations || 100,
  maxContacts: row.max_contacts || 500,
  features: Array.isArray(row.features) ? (row.features as PlanFeature[]) : [],
  isActive: row.is_active ?? true,
  isPopular: row.is_popular ?? false,
  sortOrder: row.sort_order || 0,
});

const planToDbPayload = (plan: Plan) => ({
  name: plan.name,
  slug: plan.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  monthly_price: plan.price,
  yearly_price: plan.billingCycle === 'yearly' ? plan.price : plan.price * 10,
  description: plan.description,
  features: plan.features,
  billing_cycle: plan.billingCycle,
  currency: plan.currency,
  color: plan.color,
  badge: plan.badge || null,
  max_agents: plan.maxAgents,
  max_conversations: plan.maxConversations,
  max_contacts: plan.maxContacts,
  is_active: plan.isActive,
  is_popular: plan.isPopular,
});

// ─── Helpers ──────────────────────────────────────────────────

const emptyPlanForm = (): Plan => ({
  id: '',
  name: '',
  slug: '',
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
  isActive: true,
  isPopular: false,
  sortOrder: 0,
});

// ─── Component ────────────────────────────────────────────────

export function PlansManager() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan>(emptyPlanForm());
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null);
  const [versionsTarget, setVersionsTarget] = useState<Plan | null>(null);
  const [newFeatureText, setNewFeatureText] = useState('');

  // ─── Data Fetching ──────────────────────────────────────────

  useEffect(() => { fetchPlans(); }, []);

  const fetchPlans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      toast.error('Failed to load plans');
      console.error('Error fetching plans:', error);
    } else {
      setPlans((data || []).map((row: DbPlanRow) => dbRowToPlan(row)));
    }
    setLoading(false);
  };

  // ─── Computed ───────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = plans.filter(p => p.isActive);
    return {
      totalMRR: 0,
      totalSubscribers: 0,
      activePlans: active.length,
      avgPerSubscriber: 0,
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

  const handleSave = async () => {
    if (!editingPlan.name.trim()) {
      toast.error('Plan name is required');
      return;
    }
    if (editingPlan.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    setSaving(true);
    const payload = planToDbPayload(editingPlan);

    if (isEditing) {
      const { error } = await supabase
        .from('plans')
        .update(payload)
        .eq('id', editingPlan.id);

      if (error) {
        toast.error('Failed to update plan');
        console.error('Update error:', error);
      } else {
        toast.success(`"${editingPlan.name}" plan updated`);
        setIsModalOpen(false);
        await fetchPlans();
      }
    } else {
      const { error } = await supabase
        .from('plans')
        .insert({ ...payload, sort_order: plans.length });

      if (error) {
        toast.error('Failed to create plan');
        console.error('Insert error:', error);
      } else {
        toast.success(`"${editingPlan.name}" plan created`);
        setIsModalOpen(false);
        await fetchPlans();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);

    const { error } = await supabase
      .from('plans')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      toast.error('Failed to delete plan');
      console.error('Delete error:', error);
    } else {
      toast.success(`"${deleteTarget.name}" plan deleted`);
      await fetchPlans();
    }
    setDeleteTarget(null);
    setSaving(false);
  };

  const toggleActive = async (id: string) => {
    const plan = plans.find(p => p.id === id);
    if (!plan) return;

    const newActive = !plan.isActive;
    const { error } = await supabase
      .from('plans')
      .update({ is_active: newActive })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update plan status');
    } else {
      toast.success(`"${plan.name}" ${newActive ? 'activated' : 'deactivated'}`);
      await fetchPlans();
    }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <span className="ml-3 text-cool-gray">Loading plans...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-navy flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Gem className="h-5 w-5 text-indigo-500" />
            </div>
            Plans Manager
          </h1>
          <p className="text-cool-gray mt-1 ml-[52px]">Manage pricing tiers and subscriptions</p>
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
          <div key={stat.label} className="bg-gradient-card shadow-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cool-gray text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-midnight-navy mt-1">{stat.value}</p>
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
                : 'bg-white/[0.03] text-cool-gray hover:bg-white/[0.06] hover:text-cool-gray'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${activeTab === tab.key ? 'text-indigo-200' : 'text-cool-gray/60'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Plan Cards Grid */}
      {filteredPlans.length === 0 ? (
        <div className="bg-gradient-card shadow-card rounded-xl p-16 text-center">
          <Gem className="h-12 w-12 mx-auto text-cool-gray/40 mb-4" />
          <h3 className="text-lg font-medium text-midnight-navy/60">No plans found</h3>
          <p className="text-cool-gray/60 mt-1">Create your first pricing plan to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map(plan => {
            const c = getColor(plan.color);
            return (
              <div
                key={plan.id}
                className={`bg-gradient-card shadow-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-soft-lilac/40 ${
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
                        <h3 className="text-lg font-semibold text-midnight-navy">{plan.name}</h3>
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
                      <p className="text-2xl font-bold text-midnight-navy">
                        {'\u20AC'}{plan.price}
                      </p>
                      <p className="text-cool-gray text-xs">/{plan.billingCycle === 'monthly' ? 'mo' : 'yr'}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-cool-gray text-sm mb-4 line-clamp-2">{plan.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-5">
                    {plan.features.slice(0, 5).map(f => (
                      <div key={f.id} className="flex items-center gap-2 text-sm text-cool-gray">
                        <Check className={`h-3.5 w-3.5 ${c.text} flex-shrink-0`} />
                        {f.text}
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-cool-gray/60 pl-5">
                        +{plan.features.length - 5} more features
                      </p>
                    )}
                  </div>

                  {/* Limits */}
                  <div className="grid grid-cols-3 gap-2 mb-5">
                    <div className="bg-soft-lilac/10 rounded-lg p-2 text-center">
                      <p className="text-cool-gray text-xs">Agents</p>
                      <p className="text-midnight-navy font-semibold text-sm">{plan.maxAgents}</p>
                    </div>
                    <div className="bg-soft-lilac/10 rounded-lg p-2 text-center">
                      <p className="text-cool-gray text-xs">Convos</p>
                      <p className="text-midnight-navy font-semibold text-sm">{plan.maxConversations.toLocaleString()}</p>
                    </div>
                    <div className="bg-soft-lilac/10 rounded-lg p-2 text-center">
                      <p className="text-cool-gray text-xs">Contacts</p>
                      <p className="text-midnight-navy font-semibold text-sm">{plan.maxContacts.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-soft-lilac/20">
                    <button
                      onClick={() => toggleActive(plan.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        plan.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-cool-gray hover:text-midnight-navy/60'
                      }`}
                    >
                      {plan.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cool-gray hover:text-indigo-400 hover:bg-indigo-500/10"
                        onClick={() => setVersionsTarget(plan)}
                        title="Levers & versions"
                      >
                        <SlidersHorizontal className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cool-gray hover:text-indigo-400 hover:bg-indigo-500/10"
                        onClick={() => openEdit(plan)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-cool-gray hover:text-red-400 hover:bg-red-500/10"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy flex items-center gap-2">
              <Gem className="h-5 w-5 text-indigo-400" />
              {isEditing ? 'Edit Plan' : 'Create New Plan'}
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              {isEditing ? 'Update plan details and features' : 'Configure a new pricing tier'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Row: Name + Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Plan Name *</Label>
                <Input
                  value={editingPlan.name}
                  onChange={e => updateField('name', e.target.value)}
                  placeholder="e.g. Growth"
                  className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Badge Label</Label>
                <Input
                  value={editingPlan.badge}
                  onChange={e => updateField('badge', e.target.value)}
                  placeholder="e.g. Most Popular"
                  className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-cool-gray">Description</Label>
              <Textarea
                value={editingPlan.description}
                onChange={e => updateField('description', e.target.value)}
                placeholder="Brief description for the pricing card"
                rows={2}
                className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray resize-none"
              />
            </div>

            {/* Row: Price + Billing Cycle + Currency */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Price *</Label>
                <Input
                  type="number"
                  value={editingPlan.price || ''}
                  onChange={e => updateField('price', parseFloat(e.target.value) || 0)}
                  placeholder="149"
                  className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Billing Cycle</Label>
                <Select
                  value={editingPlan.billingCycle}
                  onValueChange={v => updateField('billingCycle', v as Plan['billingCycle'])}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2035] border-white/10">
                    <SelectItem value="monthly" className="text-midnight-navy hover:bg-soft-lilac/10">Monthly</SelectItem>
                    <SelectItem value="yearly" className="text-midnight-navy hover:bg-soft-lilac/10">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Currency</Label>
                <Select
                  value={editingPlan.currency}
                  onValueChange={v => updateField('currency', v)}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2035] border-white/10">
                    <SelectItem value="EUR" className="text-midnight-navy hover:bg-soft-lilac/10">EUR ({'\u20AC'})</SelectItem>
                    <SelectItem value="USD" className="text-midnight-navy hover:bg-soft-lilac/10">USD ($)</SelectItem>
                    <SelectItem value="GBP" className="text-midnight-navy hover:bg-soft-lilac/10">GBP ({'\u00A3'})</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color Picker */}
            <div className="space-y-2">
              <Label className="text-cool-gray">Accent Color</Label>
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
                <Label className="text-cool-gray">Max Agents</Label>
                <Input
                  type="number"
                  value={editingPlan.maxAgents || ''}
                  onChange={e => updateField('maxAgents', parseInt(e.target.value) || 0)}
                  className="bg-white border-slate-200 text-midnight-navy"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Max Conversations</Label>
                <Input
                  type="number"
                  value={editingPlan.maxConversations || ''}
                  onChange={e => updateField('maxConversations', parseInt(e.target.value) || 0)}
                  className="bg-white border-slate-200 text-midnight-navy"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Max Contacts</Label>
                <Input
                  type="number"
                  value={editingPlan.maxContacts || ''}
                  onChange={e => updateField('maxContacts', parseInt(e.target.value) || 0)}
                  className="bg-white border-slate-200 text-midnight-navy"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <Label className="text-cool-gray">Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeatureText}
                  onChange={e => setNewFeatureText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                  placeholder="Type a feature and press Enter"
                  className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10 shrink-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {editingPlan.features.map(f => (
                  <div key={f.id} className="flex items-center justify-between bg-white/[0.03] rounded-lg px-3 py-2 group">
                    <div className="flex items-center gap-2 text-sm text-cool-gray">
                      <Check className="h-3.5 w-3.5 text-indigo-400" />
                      {f.text}
                    </div>
                    <button
                      onClick={() => removeFeature(f.id)}
                      className="text-cool-gray/40 hover:text-red-400 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                {editingPlan.features.length === 0 && (
                  <p className="text-cool-gray/40 text-sm text-center py-3">No features added yet</p>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-6 p-4 bg-white/[0.03] rounded-lg border border-soft-lilac/20">
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPlan.isActive}
                  onCheckedChange={v => updateField('isActive', v)}
                />
                <Label className="text-cool-gray">Active</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editingPlan.isPopular}
                  onCheckedChange={v => updateField('isPopular', v)}
                />
                <Label className="text-cool-gray">Mark as Popular</Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-soft-lilac/20 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Plan' : 'Create Plan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Plan
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Are you sure you want to delete <strong className="text-midnight-navy">{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Levers & Versions (D20) ─────────────────────────── */}
      <Dialog open={!!versionsTarget} onOpenChange={() => setVersionsTarget(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
              Levers & versions — {versionsTarget?.name}
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Edit this plan’s economic levers. Saving creates a new version; existing tenants keep their version until notified (D20).
            </DialogDescription>
          </DialogHeader>
          {versionsTarget && (
            <PlanVersionsManager
              planId={versionsTarget.id}
              planName={versionsTarget.name}
              defaultCurrency={versionsTarget.currency}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
