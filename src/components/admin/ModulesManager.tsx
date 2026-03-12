import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Search, Star, Download, ToggleLeft, ToggleRight,
  Grid3X3, List, AlertTriangle, X, Package, DollarSign, BarChart3, Sparkles
} from 'lucide-react';
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

type ModuleStatus = 'active' | 'beta' | 'inactive' | 'deprecated';
type PricingModel = 'included' | 'addon' | 'beta';
type ModuleCategory = 'sales' | 'support' | 'analytics' | 'integrations' | 'communication' | 'content';
type ViewMode = 'grid' | 'list';

interface Module {
  id: string;
  name: string;
  slug: string;
  version: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  pricingModel: PricingModel;
  price: number;
  color: string;
  icon: string;
  installCount: number;
  rating: number;
  plans: string[];
  tags: string[];
  isActive: boolean;
}

type CategoryFilter = 'all' | ModuleCategory;

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

const CATEGORY_LABELS: Record<ModuleCategory, string> = {
  sales: 'Sales',
  support: 'Support',
  analytics: 'Analytics',
  integrations: 'Integrations',
  communication: 'Communication',
  content: 'Content',
};

const STATUS_STYLES: Record<ModuleStatus, { bg: string; text: string; label: string }> = {
  active:     { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Active' },
  beta:       { bg: 'bg-purple-500/20',  text: 'text-purple-400',  label: 'Beta' },
  inactive:   { bg: 'bg-white/10',       text: 'text-cool-gray',    label: 'Inactive' },
  deprecated: { bg: 'bg-red-500/20',     text: 'text-red-400',     label: 'Deprecated' },
};

const PRICING_STYLES: Record<PricingModel, { bg: string; text: string; label: string }> = {
  included: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Included' },
  addon:    { bg: 'bg-amber-500/20',   text: 'text-amber-400',   label: 'Add-on' },
  beta:     { bg: 'bg-purple-500/20',  text: 'text-purple-400',  label: 'Beta' },
};

const EMOJI_GRID = [
  '🤖', '🧠', '📊', '🔗', '🎙️', '📚', '💬', '📧',
  '🛒', '🎯', '📈', '🔔', '🛡️', '⚡', '🌐', '🔍',
  '📱', '🗂️', '💡', '🔧', '📋', '🎨', '🏷️', '💳',
];

const PLAN_OPTIONS = ['Starter', 'Growth', 'Enterprise'] as const;

// ─── Seed Data ────────────────────────────────────────────────

const makeSeedModules = (): Module[] => [
  {
    id: crypto.randomUUID(), name: 'Email Follow-Up Agent', slug: 'email-follow-up-agent', version: '1.0.0',
    description: 'Automated personalised follow-ups that convert leads while you sleep. Sends personalised sequences triggered by enquiry type, urgency, and behaviour.',
    category: 'sales', status: 'active', pricingModel: 'addon', price: 199, color: 'blue', icon: '📧',
    installCount: 312, rating: 4.7, plans: ['Growth', 'Enterprise'], tags: ['email', 'follow-up', 'lead-gen', 'automation'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Voice Assistant', slug: 'voice-assistant', version: '1.0.0',
    description: 'AI answers your phone line in English and Spanish \u2014 24/7, zero hold times. Handles FAQs, captures caller details, and escalates urgently.',
    category: 'communication', status: 'active', pricingModel: 'addon', price: 349, color: 'emerald', icon: '\uD83C\uDFA4',
    installCount: 187, rating: 4.5, plans: ['Growth', 'Enterprise'], tags: ['voice', 'phone', 'inbound', 'multilingual'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Data Intelligence Hub', slug: 'data-intelligence-hub', version: '1.0.0',
    description: 'Live dashboards showing leads, conversations, conversions, and agent performance \u2014 updated in real-time across all your AI agents.',
    category: 'analytics', status: 'active', pricingModel: 'included', price: 0, color: 'purple', icon: '\uD83D\uDCCA',
    installCount: 487, rating: 4.8, plans: ['Starter', 'Growth', 'Enterprise'], tags: ['analytics', 'dashboards', 'reporting', 'real-time'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'CRM Sync', slug: 'crm-sync', version: '1.0.0',
    description: 'Every lead and conversation pushed to your CRM automatically. Bi-directional sync with Zapier/Make compatibility.',
    category: 'integrations', status: 'active', pricingModel: 'addon', price: 149, color: 'indigo', icon: '\uD83D\uDD17',
    installCount: 256, rating: 4.3, plans: ['Growth', 'Enterprise'], tags: ['CRM', 'sync', 'integration', 'zapier'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Appointment Booking', slug: 'appointment-booking', version: '1.0.0',
    description: 'AI books, confirms, and reminds \u2014 your calendar stays full automatically. Multi-staff booking with cancellation handling.',
    category: 'sales', status: 'active', pricingModel: 'addon', price: 199, color: 'cyan', icon: '\uD83D\uDCC5',
    installCount: 203, rating: 4.6, plans: ['Growth', 'Enterprise'], tags: ['booking', 'calendar', 'appointments', 'reminders'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Lead Qualifier', slug: 'lead-qualifier', version: '1.0.0',
    description: 'Score every lead instantly so you focus only on the ones that will close. Custom scoring model with intent classification.',
    category: 'sales', status: 'active', pricingModel: 'addon', price: 249, color: 'amber', icon: '\uD83C\uDFAF',
    installCount: 178, rating: 4.4, plans: ['Growth', 'Enterprise'], tags: ['lead-scoring', 'qualification', 'intent', 'routing'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Review Manager', slug: 'review-manager', version: '1.0.0',
    description: 'Monitor, respond to, and grow your Google reviews on autopilot. AI-drafted responses with negative review alerts.',
    category: 'content', status: 'active', pricingModel: 'addon', price: 129, color: 'pink', icon: '\u2B50',
    installCount: 342, rating: 4.5, plans: ['Growth', 'Enterprise'], tags: ['reviews', 'google', 'reputation', 'monitoring'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'Social Media Responder', slug: 'social-media-responder', version: '1.0.0',
    description: 'Auto-reply to Instagram and Facebook DMs and comments in seconds. Lead capture from social with brand voice training.',
    category: 'communication', status: 'active', pricingModel: 'addon', price: 179, color: 'pink', icon: '\uD83D\uDCAC',
    installCount: 156, rating: 4.2, plans: ['Growth', 'Enterprise'], tags: ['social', 'instagram', 'facebook', 'DMs'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'WhatsApp Agent', slug: 'whatsapp-agent', version: '1.0.0',
    description: 'An AI sales agent inside WhatsApp Business \u2014 where your customers already are. Handles enquiries, sends quotes, and books appointments.',
    category: 'communication', status: 'active', pricingModel: 'addon', price: 299, color: 'emerald', icon: '\uD83D\uDCF1',
    installCount: 221, rating: 4.6, plans: ['Growth', 'Enterprise'], tags: ['whatsapp', 'messaging', 'sales', 'multilingual'],
    isActive: true,
  },
  {
    id: crypto.randomUUID(), name: 'AI Chatbot Widget', slug: 'ai-chatbot-widget', version: '1.0.0',
    description: 'A fully trained chat agent embedded on your website \u2014 live in 48 hours. Custom brand styling with lead capture forms.',
    category: 'support', status: 'active', pricingModel: 'included', price: 0, color: 'blue', icon: '\uD83E\uDD16',
    installCount: 521, rating: 4.9, plans: ['Starter', 'Growth', 'Enterprise'], tags: ['chatbot', 'widget', 'website', 'lead-capture'],
    isActive: true,
  },
];

// ─── Helpers ──────────────────────────────────────────────────

const emptyModuleForm = (): Module => ({
  id: '', name: '', slug: '', version: '1.0.0', description: '',
  category: 'sales', status: 'active', pricingModel: 'addon', price: 0,
  color: 'indigo', icon: '🤖', installCount: 0, rating: 0,
  plans: [], tags: [], isActive: true,
});

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const stars: string[] = [];
  for (let i = 0; i < full; i++) stars.push('full');
  if (half) stars.push('half');
  while (stars.length < 5) stars.push('empty');
  return stars;
};

// ─── Component ────────────────────────────────────────────────

export function ModulesManager() {
  const [modules, setModules] = useState<Module[]>(makeSeedModules);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module>(emptyModuleForm());
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Module | null>(null);
  const [newTag, setNewTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // ─── Computed ───────────────────────────────────────────────

  const stats = useMemo(() => {
    const active = modules.filter(m => m.isActive);
    const addonRev = modules
      .filter(m => m.pricingModel === 'addon' || m.pricingModel === 'beta')
      .reduce((s, m) => s + m.price * m.installCount, 0);
    const totalInstalls = modules.reduce((s, m) => s + m.installCount, 0);
    const avgRating = modules.length > 0
      ? modules.reduce((s, m) => s + m.rating, 0) / modules.length
      : 0;
    return { totalInstalls, activeModules: active.length, addonRevenue: addonRev, avgRating: parseFloat(avgRating.toFixed(1)) };
  }, [modules]);

  const filteredModules = useMemo(() => {
    let result = modules;
    if (categoryFilter !== 'all') {
      result = result.filter(m => m.category === categoryFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [modules, categoryFilter, searchQuery]);

  // ─── Handlers ───────────────────────────────────────────────

  const openCreate = () => {
    setEditingModule(emptyModuleForm());
    setIsEditing(false);
    setNewTag('');
    setShowEmojiPicker(false);
    setIsModalOpen(true);
  };

  const openEdit = (mod: Module) => {
    setEditingModule({ ...mod, plans: [...mod.plans], tags: [...mod.tags] });
    setIsEditing(true);
    setNewTag('');
    setShowEmojiPicker(false);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingModule.name.trim()) { toast.error('Module name is required'); return; }
    if (!editingModule.slug.trim()) { toast.error('Module slug is required'); return; }

    if (isEditing) {
      setModules(prev => prev.map(m => m.id === editingModule.id ? editingModule : m));
      toast.success(`"${editingModule.name}" updated`);
    } else {
      setModules(prev => [...prev, { ...editingModule, id: crypto.randomUUID() }]);
      toast.success(`"${editingModule.name}" created`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setModules(prev => prev.filter(m => m.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const toggleActive = (id: string) => {
    setModules(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const updated = { ...m, isActive: !m.isActive };
        toast.success(`"${m.name}" ${updated.isActive ? 'activated' : 'deactivated'}`);
        return updated;
      })
    );
  };

  const addTag = () => {
    const t = newTag.trim();
    if (!t || editingModule.tags.includes(t)) return;
    setEditingModule(prev => ({ ...prev, tags: [...prev.tags, t] }));
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setEditingModule(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const togglePlan = (plan: string) => {
    setEditingModule(prev => ({
      ...prev,
      plans: prev.plans.includes(plan) ? prev.plans.filter(p => p !== plan) : [...prev.plans, plan],
    }));
  };

  const updateField = <K extends keyof Module>(key: K, value: Module[K]) => {
    setEditingModule(prev => ({ ...prev, [key]: value }));
  };

  // ─── Category Tabs ──────────────────────────────────────────

  const categoryTabs: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'sales', label: 'Sales' },
    { key: 'support', label: 'Support' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'integrations', label: 'Integrations' },
    { key: 'communication', label: 'Communication' },
    { key: 'content', label: 'Content' },
  ];

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-navy flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg">
              🧩
            </div>
            Modules Manager
          </h1>
          <p className="text-cool-gray mt-1 ml-[52px]">Manage AI capability modules and add-ons</p>
        </div>
        <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Module
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Installs', value: stats.totalInstalls.toLocaleString(), icon: Download, ic: 'text-blue-400', ib: 'bg-blue-500/20' },
          { label: 'Active Modules', value: stats.activeModules.toString(), icon: Package, ic: 'text-emerald-400', ib: 'bg-emerald-500/20' },
          { label: 'Add-on Revenue', value: `\u20AC${stats.addonRevenue.toLocaleString()}`, icon: DollarSign, ic: 'text-amber-400', ib: 'bg-amber-500/20' },
          { label: 'Avg Rating', value: `${stats.avgRating} / 5`, icon: Star, ic: 'text-indigo-400', ib: 'bg-indigo-500/20' },
        ].map(s => (
          <div key={s.label} className="bg-gradient-card shadow-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cool-gray text-sm">{s.label}</p>
                <p className="text-2xl font-bold text-midnight-navy mt-1">{s.value}</p>
              </div>
              <div className={`h-11 w-11 rounded-lg ${s.ib} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.ic}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + View Toggle + Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cool-gray/60" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search modules..."
            className="pl-10 bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {categoryTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setCategoryFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                categoryFilter === tab.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-cool-gray hover:bg-soft-lilac/10 hover:text-midnight-navy'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-cool-gray hover:text-cool-gray'}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-cool-gray hover:text-cool-gray'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Module Cards */}
      {filteredModules.length === 0 ? (
        <div className="bg-gradient-card shadow-card rounded-xl p-16 text-center">
          <Package className="h-12 w-12 mx-auto text-cool-gray/40 mb-4" />
          <h3 className="text-lg font-medium text-midnight-navy/60">No modules found</h3>
          <p className="text-cool-gray/60 mt-1">Try a different search or category filter</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredModules.map(mod => {
            const c = getColor(mod.color);
            const st = STATUS_STYLES[mod.status];
            const pr = PRICING_STYLES[mod.pricingModel];
            return (
              <div
                key={mod.id}
                className={`bg-gradient-card shadow-card rounded-xl overflow-hidden transition-all hover:shadow-lg hover:border-soft-lilac/40 ${
                  !mod.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className={`h-1.5 ${c.accent}`} />
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center text-lg`}>
                        {mod.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-midnight-navy">{mod.name}</h3>
                        <p className="text-cool-gray/60 text-xs">v{mod.version} &middot; {CATEGORY_LABELS[mod.category]}</p>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.bg} ${st.text}`}>
                      {st.label}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pr.bg} ${pr.text}`}>
                      {mod.pricingModel === 'included' ? 'Included' : mod.pricingModel === 'beta' ? `Beta \u20AC${mod.price}/mo` : `+\u20AC${mod.price}/mo`}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-cool-gray text-xs mb-4 line-clamp-2">{mod.description}</p>

                  {/* Metrics row */}
                  <div className="flex items-center gap-4 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-cool-gray">
                      <Download className="h-3 w-3" />
                      {mod.installCount}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {renderStars(mod.rating).map((s, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            s === 'full' ? 'text-amber-400 fill-amber-400' :
                            s === 'half' ? 'text-amber-400 fill-amber-400/50' :
                            'text-cool-gray/40'
                          }`}
                        />
                      ))}
                      <span className="text-cool-gray ml-1">{mod.rating}</span>
                    </div>
                  </div>

                  {/* Plan pills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mod.plans.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-full bg-white text-cool-gray text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {mod.tags.map(t => (
                      <span key={t} className={`px-1.5 py-0.5 rounded text-[10px] ${c.bg} ${c.text}`}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-soft-lilac/20">
                    <button
                      onClick={() => toggleActive(mod.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        mod.isActive ? 'text-emerald-400 hover:text-emerald-300' : 'text-cool-gray hover:text-midnight-navy/60'
                      }`}
                    >
                      {mod.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                      {mod.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-indigo-400 hover:bg-indigo-500/10" onClick={() => openEdit(mod)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(mod)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          {filteredModules.map(mod => {
            const c = getColor(mod.color);
            const st = STATUS_STYLES[mod.status];
            const pr = PRICING_STYLES[mod.pricingModel];
            return (
              <div
                key={mod.id}
                className={`bg-gradient-card shadow-card rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-white ${
                  !mod.isActive ? 'opacity-60' : ''
                }`}
              >
                <div className={`h-10 w-10 rounded-lg ${c.bg} flex items-center justify-center text-lg shrink-0`}>
                  {mod.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-midnight-navy truncate">{mod.name}</h3>
                    <span className="text-cool-gray/40 text-xs">v{mod.version}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${pr.bg} ${pr.text}`}>
                      {mod.pricingModel === 'included' ? 'Included' : `\u20AC${mod.price}/mo`}
                    </span>
                  </div>
                  <p className="text-cool-gray text-xs mt-0.5 truncate">{mod.description}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-cool-gray shrink-0">
                  <span className="flex items-center gap-1"><Download className="h-3 w-3" />{mod.installCount}</span>
                  <span className="flex items-center gap-1"><Star className="h-3 w-3 text-amber-400 fill-amber-400" />{mod.rating}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => toggleActive(mod.id)} className={`p-1.5 rounded transition-colors ${mod.isActive ? 'text-emerald-400 hover:bg-emerald-500/10' : 'text-cool-gray/60 hover:bg-soft-lilac/10'}`}>
                    {mod.isActive ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                  </button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-indigo-400 hover:bg-indigo-500/10" onClick={() => openEdit(mod)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(mod)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
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
            <DialogTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              {isEditing ? 'Edit Module' : 'Create New Module'}
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              {isEditing ? 'Update module configuration' : 'Add a new AI capability module'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Name + Slug */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Name *</Label>
                <Input value={editingModule.name} onChange={e => updateField('name', e.target.value)} placeholder="AI Sales Agent" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Slug *</Label>
                <Input value={editingModule.slug} onChange={e => updateField('slug', e.target.value)} placeholder="ai-sales-agent" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              </div>
            </div>

            {/* Version + Category */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Version</Label>
                <Input value={editingModule.version} onChange={e => updateField('version', e.target.value)} placeholder="1.0.0" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Category</Label>
                <Select value={editingModule.category} onValueChange={v => updateField('category', v as ModuleCategory)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <SelectItem key={k} value={k} className="text-midnight-navy hover:bg-soft-lilac/10">{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-cool-gray">Description</Label>
              <Textarea value={editingModule.description} onChange={e => updateField('description', e.target.value)} placeholder="Module description..." rows={2} className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60 resize-none" />
            </div>

            {/* Status + Pricing + Price */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Status</Label>
                <Select value={editingModule.status} onValueChange={v => updateField('status', v as ModuleStatus)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="active" className="text-midnight-navy hover:bg-soft-lilac/10">Active</SelectItem>
                    <SelectItem value="beta" className="text-midnight-navy hover:bg-soft-lilac/10">Beta</SelectItem>
                    <SelectItem value="inactive" className="text-midnight-navy hover:bg-soft-lilac/10">Inactive</SelectItem>
                    <SelectItem value="deprecated" className="text-midnight-navy hover:bg-soft-lilac/10">Deprecated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Pricing Model</Label>
                <Select value={editingModule.pricingModel} onValueChange={v => updateField('pricingModel', v as PricingModel)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="included" className="text-midnight-navy hover:bg-soft-lilac/10">Included</SelectItem>
                    <SelectItem value="addon" className="text-midnight-navy hover:bg-soft-lilac/10">Add-on</SelectItem>
                    <SelectItem value="beta" className="text-midnight-navy hover:bg-soft-lilac/10">Beta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Price ({'\u20AC'}/mo)</Label>
                <Input type="number" value={editingModule.price || ''} onChange={e => updateField('price', parseFloat(e.target.value) || 0)} className="bg-white border-slate-200 text-midnight-navy" />
              </div>
            </div>

            {/* Icon Picker + Color Picker */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Icon</Label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-white/10 rounded-md text-left"
                  >
                    <span className="text-lg">{editingModule.icon}</span>
                    <span className="text-cool-gray text-sm">Click to change</span>
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute z-10 mt-1 p-3 bg-[#1a2035] border border-white/10 rounded-lg shadow-xl grid grid-cols-8 gap-1.5">
                      {EMOJI_GRID.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => { updateField('icon', emoji); setShowEmojiPicker(false); }}
                          className={`h-8 w-8 rounded flex items-center justify-center text-lg hover:bg-soft-lilac/10 transition-colors ${
                            editingModule.icon === emoji ? 'bg-indigo-500/30 ring-1 ring-indigo-500' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Accent Color</Label>
                <div className="flex gap-2 pt-1">
                  {COLOR_OPTIONS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateField('color', c)}
                      className={`h-7 w-7 rounded-full ${COLOR_MAP[c].accent} transition-all ${
                        editingModule.color === c ? 'ring-2 ring-offset-2 ring-offset-white ' + COLOR_MAP[c].ring : 'opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Plan Checkboxes */}
            <div className="space-y-2">
              <Label className="text-cool-gray">Available on Plans</Label>
              <div className="flex gap-3">
                {PLAN_OPTIONS.map(plan => (
                  <label key={plan} className="flex items-center gap-2 cursor-pointer text-sm text-cool-gray">
                    <input
                      type="checkbox"
                      checked={editingModule.plans.includes(plan)}
                      onChange={() => togglePlan(plan)}
                      className="rounded border-slate-200 bg-white text-indigo-600"
                    />
                    {plan}
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-cool-gray">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  placeholder="Type tag and press Enter"
                  className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {editingModule.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
                    #{t}
                    <button type="button" onClick={() => removeTag(t)} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-soft-lilac/20 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-white/10 text-cool-gray hover:bg-soft-lilac/10">Cancel</Button>
            <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {isEditing ? 'Update Module' : 'Create Module'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─────────────────────────────── */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="max-w-md bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Delete Module
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Are you sure you want to delete <strong className="text-white">{deleteTarget?.name}</strong>?
              This will remove it from all plans and affect {deleteTarget?.installCount} installs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-white/10 text-cool-gray hover:bg-soft-lilac/10">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete Module</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
