import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Search, Star, Users, TrendingUp, Award,
  DollarSign, AlertTriangle, X, ChevronDown, ChevronUp, Factory, Globe, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

// ─── Types ────────────────────────────────────────────────────

type IndustryStatus = 'active' | 'beta' | 'inactive';
type FilterTab = 'all' | 'active' | 'beta' | 'featured';

interface BasePackage {
  name: string;
  price: number;
  setupFee: number;
  modules: string[];
}

interface Industry {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  status: IndustryStatus;
  region: string;
  description: string;
  isFeatured: boolean;
  clients: number;
  avgMRR: number;
  conversionRate: number;
  useCases: string[];
  seoKeywords: string[];
  basePackage: BasePackage;
}

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

const STATUS_STYLES: Record<IndustryStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Active' },
  beta:     { bg: 'bg-purple-500/20',  text: 'text-purple-400',  label: 'Beta' },
  inactive: { bg: 'bg-white/10',       text: 'text-cool-gray',    label: 'Inactive' },
};

const ICON_GRID = [
  '🛒', '🏠', '🏥', '⚖️', '🏨', '💻', '🎓', '🏦',
  '🍽️', '🚗', '✈️', '🏗️', '💊', '📱', '🎨', '🌿',
  '🏋️', '💼', '🔬', '📦', '🎵', '🏭', '🔧', '🌐',
];

const MODULE_OPTIONS = [
  'Support Desk AI',
  'Knowledge Base',
  'AI Sales Agent',
  'Analytics Brain',
  'CRM Connector',
  'Voice AI',
] as const;

const REGION_OPTIONS = ['Global', 'Europe', 'North America', 'Asia Pacific', 'Latin America', 'Middle East'] as const;

// ─── Seed Data (fallback when DB table unavailable) ─────────

const SEED_INDUSTRIES: Industry[] = [
  {
    id: crypto.randomUUID(), name: 'Estate Agents', slug: 'estate-agents', icon: '🏠', color: 'blue',
    status: 'active', region: 'Europe', isFeatured: true, clients: 52, avgMRR: 349, conversionRate: 9.8,
    description: 'AI-powered lead qualification, property matching, and 24/7 bilingual enquiry handling for real estate businesses.',
    useCases: ['Lead qualification', 'Property enquiry handling', 'Viewing scheduling', 'Bilingual FAQ bot'],
    seoKeywords: ['estate agent AI', 'real estate automation', 'property chatbot'],
    basePackage: { name: 'Estate Agent Base', price: 349, setupFee: 499, modules: ['AI Sales Agent', 'Knowledge Base', 'CRM Connector'] },
  },
  {
    id: crypto.randomUUID(), name: 'Dental & Health Clinics', slug: 'dental-clinics', icon: '🏥', color: 'emerald',
    status: 'active', region: 'Europe', isFeatured: true, clients: 29, avgMRR: 489, conversionRate: 7.2,
    description: 'AI receptionist, appointment scheduling, and patient triage with voice agent for healthcare providers.',
    useCases: ['Appointment scheduling', 'Patient triage', 'Emergency routing', 'Bilingual reception'],
    seoKeywords: ['healthcare AI', 'dental clinic chatbot', 'medical receptionist AI'],
    basePackage: { name: 'Health Clinic Base', price: 489, setupFee: 599, modules: ['Support Desk AI', 'Voice AI', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Legal Firms & Gestorias', slug: 'legal-gestorias', icon: '⚖️', color: 'purple',
    status: 'active', region: 'Europe', isFeatured: false, clients: 18, avgMRR: 279, conversionRate: 6.1,
    description: 'Client intake automation, FAQ handling, and consultation scheduling for legal professionals and gestorias.',
    useCases: ['Client intake', 'Document FAQ', 'Consultation booking', 'Expat enquiry handling'],
    seoKeywords: ['legal AI', 'gestoria automation', 'law firm chatbot'],
    basePackage: { name: 'Legal Base', price: 279, setupFee: 499, modules: ['AI Sales Agent', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Holiday Rentals & Property Management', slug: 'holiday-rentals', icon: '🏨', color: 'cyan',
    status: 'active', region: 'Europe', isFeatured: true, clients: 37, avgMRR: 249, conversionRate: 11.3,
    description: 'Multilingual guest concierge, check-in automation, and maintenance request routing for holiday rental managers.',
    useCases: ['Guest concierge', 'Check-in automation', 'Maintenance routing', 'Booking enquiries'],
    seoKeywords: ['holiday rental AI', 'property management automation', 'guest chatbot'],
    basePackage: { name: 'Rental Base', price: 249, setupFee: 399, modules: ['Support Desk AI', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Gyms & Fitness Studios', slug: 'gyms-fitness', icon: '🏋️', color: 'emerald',
    status: 'active', region: 'Europe', isFeatured: false, clients: 22, avgMRR: 319, conversionRate: 10.5,
    description: 'AI sales agent and voice bot for membership enquiries, class bookings, and lead capture for fitness businesses.',
    useCases: ['Membership enquiries', 'Class scheduling', 'Lead follow-up', 'Voice call handling'],
    seoKeywords: ['gym AI', 'fitness studio automation', 'membership chatbot'],
    basePackage: { name: 'Fitness Base', price: 319, setupFee: 399, modules: ['AI Sales Agent', 'Voice AI', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Building & Renovation', slug: 'building-renovation', icon: '🏗️', color: 'amber',
    status: 'active', region: 'Europe', isFeatured: false, clients: 15, avgMRR: 209, conversionRate: 8.3,
    description: 'Quote intake, job qualification, and instant notifications for construction and renovation businesses.',
    useCases: ['Quote intake', 'Job qualification', 'FAQ handling', 'Owner notifications'],
    seoKeywords: ['building AI', 'renovation chatbot', 'construction automation'],
    basePackage: { name: 'Builder Base', price: 209, setupFee: 299, modules: ['AI Sales Agent', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Restaurants & Bars', slug: 'restaurants-bars', icon: '🍽️', color: 'red',
    status: 'active', region: 'Europe', isFeatured: true, clients: 41, avgMRR: 419, conversionRate: 12.1,
    description: 'AI reservations agent with voice, menu FAQ handling, and booking confirmations for hospitality businesses.',
    useCases: ['Reservation handling', 'Menu FAQ', 'Voice call management', 'Booking confirmations'],
    seoKeywords: ['restaurant AI', 'bar automation', 'reservations chatbot'],
    basePackage: { name: 'Restaurant Base', price: 419, setupFee: 499, modules: ['AI Sales Agent', 'Voice AI', 'Knowledge Base'] },
  },
  {
    id: crypto.randomUUID(), name: 'Beauty & Hair Salons', slug: 'beauty-hair', icon: '💇', color: 'pink',
    status: 'active', region: 'Europe', isFeatured: false, clients: 19, avgMRR: 249, conversionRate: 9.4,
    description: 'AI booking agent with voice for appointment scheduling, cancellation handling, and service enquiries.',
    useCases: ['Appointment booking', 'Cancellation handling', 'Service enquiries', 'Voice reception'],
    seoKeywords: ['beauty salon AI', 'hair salon automation', 'booking chatbot'],
    basePackage: { name: 'Salon Base', price: 249, setupFee: 399, modules: ['AI Sales Agent', 'Voice AI', 'Knowledge Base'] },
  },
];

// ─── localStorage Fallback ───────────────────────────────────

const STORAGE_KEY = 'vs_industries';
let tableMissing = false;

function isTableError(error: { message?: string; code?: string }): boolean {
  const msg = error.message || '';
  return msg.includes('schema cache') || msg.includes('relation') || msg.includes('does not exist') || error.code === 'PGRST204' || error.code === '42P01';
}

function getLocalIndustries(): Industry[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as Industry[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_INDUSTRIES));
  return [...SEED_INDUSTRIES];
}

function saveLocalIndustries(items: Industry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ─── DB Mappers ──────────────────────────────────────────────

interface DbIndustryRow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  slug: string | null;
  icon: string | null;
  color: string | null;
  status: string | null;
  region: string | null;
  is_featured: boolean | null;
  client_count: number | null;
  avg_mrr: number | null;
  conversion_rate: number | null;
  use_cases: unknown;
  seo_keywords: unknown;
  base_package: unknown;
}

const dbRowToIndustry = (row: DbIndustryRow): Industry => {
  const bp = (row.base_package && typeof row.base_package === 'object' && !Array.isArray(row.base_package))
    ? row.base_package as Record<string, unknown>
    : {};
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    icon: row.icon || '🏢',
    color: row.color || 'indigo',
    status: (row.status as IndustryStatus) || 'active',
    region: row.region || 'Global',
    description: row.description || '',
    isFeatured: row.is_featured ?? false,
    clients: row.client_count || 0,
    avgMRR: row.avg_mrr ? parseFloat(String(row.avg_mrr)) : 0,
    conversionRate: row.conversion_rate ? parseFloat(String(row.conversion_rate)) : 0,
    useCases: Array.isArray(row.use_cases) ? (row.use_cases as string[]) : [],
    seoKeywords: Array.isArray(row.seo_keywords) ? (row.seo_keywords as string[]) : [],
    basePackage: {
      name: (bp.name as string) || '',
      price: (bp.price as number) || 0,
      setupFee: (bp.setupFee as number) || 0,
      modules: Array.isArray(bp.modules) ? (bp.modules as string[]) : [],
    },
  };
};

const industryToDbPayload = (ind: Industry) => ({
  name: ind.name,
  slug: ind.slug,
  description: ind.description,
  icon: ind.icon,
  color: ind.color,
  status: ind.status,
  region: ind.region,
  is_active: ind.status !== 'inactive',
  is_featured: ind.isFeatured,
  client_count: ind.clients,
  avg_mrr: ind.avgMRR,
  conversion_rate: ind.conversionRate,
  use_cases: ind.useCases,
  seo_keywords: ind.seoKeywords,
  base_package: ind.basePackage,
});

// ─── Helpers ──────────────────────────────────────────────────

const emptyIndustryForm = (): Industry => ({
  id: '', name: '', slug: '', icon: '🏢', color: 'indigo',
  status: 'active', region: 'Global', description: '', isFeatured: false,
  clients: 0, avgMRR: 0, conversionRate: 0,
  useCases: [], seoKeywords: [],
  basePackage: { name: '', price: 0, setupFee: 0, modules: [] },
});

// ─── Component ────────────────────────────────────────────────

export function IndustryManager() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry>(emptyIndustryForm());
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Industry | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newUseCase, setNewUseCase] = useState('');
  const [newKeyword, setNewKeyword] = useState('');

  const [usingLocal, setUsingLocal] = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────

  useEffect(() => { fetchIndustries(); }, []);

  const fetchIndustries = async () => {
    setLoading(true);

    if (tableMissing) {
      setIndustries(getLocalIndustries());
      setUsingLocal(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('industries')
      .select('*')
      .order('name', { ascending: true });

    if (error && isTableError(error)) {
      tableMissing = true;
      setIndustries(getLocalIndustries());
      setUsingLocal(true);
    } else if (error) {
      toast.error('Failed to load industries');
      console.error('Error fetching industries:', error);
    } else {
      setIndustries((data || []).map((row: DbIndustryRow) => dbRowToIndustry(row)));
    }
    setLoading(false);
  };

  // ─── Computed ───────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalClients = industries.reduce((s, i) => s + i.clients, 0);
    const totalMRR = industries.reduce((s, i) => s + (i.clients * i.avgMRR), 0);
    const featured = industries.filter(i => i.isFeatured).length;
    const avgConversion = industries.length > 0
      ? industries.reduce((s, i) => s + i.conversionRate, 0) / industries.length
      : 0;
    return { totalClients, totalMRR, featured, avgConversion: parseFloat(avgConversion.toFixed(1)) };
  }, [industries]);

  const filteredIndustries = useMemo(() => {
    let result = industries;
    if (activeTab === 'active') result = result.filter(i => i.status === 'active');
    if (activeTab === 'beta') result = result.filter(i => i.status === 'beta');
    if (activeTab === 'featured') result = result.filter(i => i.isFeatured);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.seoKeywords.some(k => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [industries, activeTab, searchQuery]);

  // ─── Handlers ───────────────────────────────────────────────

  const openCreate = () => {
    setEditingIndustry(emptyIndustryForm());
    setIsEditing(false);
    setNewUseCase('');
    setNewKeyword('');
    setShowIconPicker(false);
    setIsModalOpen(true);
  };

  const openEdit = (ind: Industry) => {
    setEditingIndustry({
      ...ind,
      useCases: [...ind.useCases],
      seoKeywords: [...ind.seoKeywords],
      basePackage: { ...ind.basePackage, modules: [...ind.basePackage.modules] },
    });
    setIsEditing(true);
    setNewUseCase('');
    setNewKeyword('');
    setShowIconPicker(false);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingIndustry.name.trim()) { toast.error('Industry name is required'); return; }
    if (!editingIndustry.slug.trim()) { toast.error('Industry slug is required'); return; }

    setSaving(true);

    if (usingLocal) {
      if (isEditing) {
        const updated = industries.map(i => i.id === editingIndustry.id ? editingIndustry : i);
        setIndustries(updated);
        saveLocalIndustries(updated);
        toast.success(`"${editingIndustry.name}" updated`);
      } else {
        const newInd = { ...editingIndustry, id: crypto.randomUUID() };
        const updated = [...industries, newInd];
        setIndustries(updated);
        saveLocalIndustries(updated);
        toast.success(`"${editingIndustry.name}" created`);
      }
      setIsModalOpen(false);
      setSaving(false);
      return;
    }

    const payload = industryToDbPayload(editingIndustry);

    if (isEditing) {
      const { error } = await supabase
        .from('industries')
        .update(payload)
        .eq('id', editingIndustry.id);

      if (error) {
        toast.error('Failed to update industry');
        console.error('Update error:', error);
      } else {
        toast.success(`"${editingIndustry.name}" updated`);
        setIsModalOpen(false);
        await fetchIndustries();
      }
    } else {
      const { error } = await supabase
        .from('industries')
        .insert(payload);

      if (error) {
        toast.error('Failed to create industry');
        console.error('Insert error:', error);
      } else {
        toast.success(`"${editingIndustry.name}" created`);
        setIsModalOpen(false);
        await fetchIndustries();
      }
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);

    if (usingLocal) {
      const updated = industries.filter(i => i.id !== deleteTarget.id);
      setIndustries(updated);
      saveLocalIndustries(updated);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from('industries')
      .delete()
      .eq('id', deleteTarget.id);

    if (error) {
      toast.error('Failed to delete industry');
      console.error('Delete error:', error);
    } else {
      toast.success(`"${deleteTarget.name}" deleted`);
      await fetchIndustries();
    }
    setDeleteTarget(null);
    setSaving(false);
  };

  const toggleFeatured = async (id: string) => {
    const ind = industries.find(i => i.id === id);
    if (!ind) return;

    const newFeatured = !ind.isFeatured;

    if (usingLocal) {
      const updated = industries.map(i => i.id === id ? { ...i, isFeatured: newFeatured } : i);
      setIndustries(updated);
      saveLocalIndustries(updated);
      toast.success(`"${ind.name}" ${newFeatured ? 'featured' : 'unfeatured'}`);
      return;
    }

    const { error } = await supabase
      .from('industries')
      .update({ is_featured: newFeatured })
      .eq('id', id);

    if (error) {
      toast.error('Failed to update featured status');
    } else {
      toast.success(`"${ind.name}" ${newFeatured ? 'featured' : 'unfeatured'}`);
      await fetchIndustries();
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addUseCase = () => {
    const t = newUseCase.trim();
    if (!t) return;
    setEditingIndustry(prev => ({ ...prev, useCases: [...prev.useCases, t] }));
    setNewUseCase('');
  };

  const removeUseCase = (idx: number) => {
    setEditingIndustry(prev => ({ ...prev, useCases: prev.useCases.filter((_, i) => i !== idx) }));
  };

  const addKeyword = () => {
    const t = newKeyword.trim();
    if (!t || editingIndustry.seoKeywords.includes(t)) return;
    setEditingIndustry(prev => ({ ...prev, seoKeywords: [...prev.seoKeywords, t] }));
    setNewKeyword('');
  };

  const removeKeyword = (kw: string) => {
    setEditingIndustry(prev => ({ ...prev, seoKeywords: prev.seoKeywords.filter(k => k !== kw) }));
  };

  const toggleModule = (mod: string) => {
    setEditingIndustry(prev => ({
      ...prev,
      basePackage: {
        ...prev.basePackage,
        modules: prev.basePackage.modules.includes(mod)
          ? prev.basePackage.modules.filter(m => m !== mod)
          : [...prev.basePackage.modules, mod],
      },
    }));
  };

  const updateField = <K extends keyof Industry>(key: K, value: Industry[K]) => {
    setEditingIndustry(prev => ({ ...prev, [key]: value }));
  };

  const updatePackageField = <K extends keyof BasePackage>(key: K, value: BasePackage[K]) => {
    setEditingIndustry(prev => ({ ...prev, basePackage: { ...prev.basePackage, [key]: value } }));
  };

  // ─── Filter Tabs ────────────────────────────────────────────

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: industries.length },
    { key: 'active', label: 'Active', count: industries.filter(i => i.status === 'active').length },
    { key: 'beta', label: 'Beta', count: industries.filter(i => i.status === 'beta').length },
    { key: 'featured', label: 'Featured', count: industries.filter(i => i.isFeatured).length },
  ];

  // ─── Render ─────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
        <span className="ml-3 text-cool-gray">Loading industries...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-navy flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-lg">🏭</div>
            Industry Manager
          </h1>
          <p className="text-cool-gray mt-1 ml-[52px]">Manage industry packages and pricing</p>
        </div>
        <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Industry
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Clients', value: stats.totalClients.toLocaleString(), icon: Users, ic: 'text-blue-400', ib: 'bg-blue-500/20' },
          { label: 'Total Industry MRR', value: `\u20AC${stats.totalMRR.toLocaleString()}`, icon: DollarSign, ic: 'text-emerald-400', ib: 'bg-emerald-500/20' },
          { label: 'Featured Industries', value: stats.featured.toString(), icon: Award, ic: 'text-amber-400', ib: 'bg-amber-500/20' },
          { label: 'Avg Conversion Rate', value: `${stats.avgConversion}%`, icon: TrendingUp, ic: 'text-indigo-400', ib: 'bg-indigo-500/20' },
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

      {/* Search + Filter Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
        <div className="relative flex-1 w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cool-gray/60" />
          <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search industries..." className="pl-10 bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-soft-lilac/10 text-cool-gray hover:bg-white/[0.06] hover:text-cool-gray'}`}>
              {tab.label}
              <span className={`ml-1.5 ${activeTab === tab.key ? 'text-indigo-200' : 'text-cool-gray/60'}`}>{tab.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Industry Cards */}
      {filteredIndustries.length === 0 ? (
        <div className="bg-gradient-card shadow-card rounded-xl p-16 text-center">
          <Factory className="h-12 w-12 mx-auto text-cool-gray/40 mb-4" />
          <h3 className="text-lg font-medium text-midnight-navy/60">No industries found</h3>
          <p className="text-cool-gray/60 mt-1">Try a different search or filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredIndustries.map(ind => {
            const c = getColor(ind.color);
            const st = STATUS_STYLES[ind.status];
            const isExpanded = expandedCards.has(ind.id);
            return (
              <div key={ind.id} className="bg-gradient-card shadow-card rounded-xl overflow-hidden transition-all hover:bg-white/[0.04]">
                <div className={`h-1 ${c.accent}`} />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-12 w-12 rounded-xl ${c.bg} flex items-center justify-center text-2xl`}>{ind.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-midnight-navy">{ind.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                          {ind.isFeatured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-400">
                              <Star className="h-2.5 w-2.5 inline mr-0.5 fill-amber-400" />Featured
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white text-cool-gray">
                            <Globe className="h-2.5 w-2.5 inline mr-0.5" />{ind.region}
                          </span>
                        </div>
                        <p className="text-cool-gray text-sm mt-1 max-w-2xl">{ind.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => toggleFeatured(ind.id)}
                        className={`p-2 rounded-lg transition-colors ${ind.isFeatured ? 'text-amber-400 hover:bg-amber-500/10' : 'text-cool-gray/60 hover:bg-white'}`}>
                        <Star className={`h-4 w-4 ${ind.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-cool-gray hover:text-indigo-400 hover:bg-indigo-500/10" onClick={() => openEdit(ind)}>
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-cool-gray hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteTarget(ind)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-soft-lilac/10 rounded-lg p-3">
                      <p className="text-cool-gray text-xs">Clients</p>
                      <p className="text-xl font-bold text-midnight-navy">{ind.clients}</p>
                    </div>
                    <div className="bg-soft-lilac/10 rounded-lg p-3">
                      <p className="text-cool-gray text-xs">Avg MRR</p>
                      <p className="text-xl font-bold text-midnight-navy">{'\u20AC'}{ind.avgMRR}</p>
                    </div>
                    <div className="bg-soft-lilac/10 rounded-lg p-3">
                      <p className="text-cool-gray text-xs">Conversion Rate</p>
                      <p className="text-xl font-bold text-midnight-navy">{ind.conversionRate}%</p>
                    </div>
                  </div>

                  <div className={`${c.bg} rounded-lg p-4 mb-3`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xs font-medium ${c.text}`}>Base Package</p>
                        <p className="text-midnight-navy font-semibold">{ind.basePackage.name || 'Unnamed'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-midnight-navy font-bold">{'\u20AC'}{ind.basePackage.price}/mo</p>
                        <p className="text-cool-gray text-xs">+ {'\u20AC'}{ind.basePackage.setupFee} setup</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-cool-gray text-xs">{ind.basePackage.modules.length} modules:</span>
                      {ind.basePackage.modules.map(m => (
                        <span key={m} className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.08] text-cool-gray">{m}</span>
                      ))}
                    </div>
                  </div>

                  <button onClick={() => toggleExpanded(ind.id)} className="flex items-center gap-1 text-xs text-cool-gray hover:text-midnight-navy/60 transition-colors">
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    {isExpanded ? 'Collapse' : 'Show use cases, keywords & modules'}
                  </button>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-soft-lilac/20 space-y-4">
                      <div>
                        <p className="text-cool-gray text-xs font-medium mb-2">Use Cases</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ind.useCases.map(uc => (
                            <span key={uc} className="px-2 py-1 rounded-full bg-white text-cool-gray text-xs">{uc}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-cool-gray text-xs font-medium mb-2">SEO Keywords</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ind.seoKeywords.map(kw => (
                            <span key={kw} className={`px-2 py-1 rounded-full text-xs ${c.bg} ${c.text}`}>#{kw}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-cool-gray text-xs font-medium mb-2">Included Modules</p>
                        <div className="flex flex-wrap gap-1.5">
                          {ind.basePackage.modules.map(m => (
                            <span key={m} className="px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
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
              <Factory className="h-5 w-5 text-indigo-400" />
              {isEditing ? 'Edit Industry' : 'Create New Industry'}
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              {isEditing ? 'Update industry configuration and base package' : 'Add a new industry vertical'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Name *</Label>
                <Input value={editingIndustry.name} onChange={e => updateField('name', e.target.value)} placeholder="E-Commerce & Retail" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Slug *</Label>
                <Input value={editingIndustry.slug} onChange={e => updateField('slug', e.target.value)} placeholder="e-commerce-retail" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Icon</Label>
                <div className="relative">
                  <button type="button" onClick={() => setShowIconPicker(!showIconPicker)} className="w-full flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-md text-left">
                    <span className="text-lg">{editingIndustry.icon}</span>
                    <span className="text-cool-gray text-sm">Click to change</span>
                  </button>
                  {showIconPicker && (
                    <div className="absolute z-10 mt-1 p-3 bg-[#1a2035] border border-white/10 rounded-lg shadow-xl grid grid-cols-8 gap-1.5">
                      {ICON_GRID.map(emoji => (
                        <button key={emoji} type="button" onClick={() => { updateField('icon', emoji); setShowIconPicker(false); }}
                          className={`h-8 w-8 rounded flex items-center justify-center text-lg hover:bg-soft-lilac/10 transition-colors ${editingIndustry.icon === emoji ? 'bg-indigo-500/30 ring-1 ring-indigo-500' : ''}`}>
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
                  {COLOR_OPTIONS.map(co => (
                    <button key={co} type="button" onClick={() => updateField('color', co)}
                      className={`h-7 w-7 rounded-full ${COLOR_MAP[co].accent} transition-all ${editingIndustry.color === co ? 'ring-2 ring-offset-2 ring-offset-white ' + COLOR_MAP[co].ring : 'opacity-60 hover:opacity-100'}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Status</Label>
                <Select value={editingIndustry.status} onValueChange={v => updateField('status', v as IndustryStatus)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="active" className="text-midnight-navy hover:bg-soft-lilac/10">Active</SelectItem>
                    <SelectItem value="beta" className="text-midnight-navy hover:bg-soft-lilac/10">Beta</SelectItem>
                    <SelectItem value="inactive" className="text-midnight-navy hover:bg-soft-lilac/10">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Region</Label>
                <Select value={editingIndustry.region} onValueChange={v => updateField('region', v)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {REGION_OPTIONS.map(r => (
                      <SelectItem key={r} value={r} className="text-midnight-navy hover:bg-soft-lilac/10">{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-cool-gray">Description</Label>
              <Textarea value={editingIndustry.description} onChange={e => updateField('description', e.target.value)} placeholder="Industry description..." rows={2} className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60 resize-none" />
            </div>
            <div className="space-y-2">
              <Label className="text-cool-gray">Use Cases</Label>
              <div className="flex gap-2">
                <Input value={newUseCase} onChange={e => setNewUseCase(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addUseCase(); } }} placeholder="Type a use case and press Enter" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
                <Button type="button" onClick={addUseCase} variant="outline" className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10 shrink-0"><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {editingIndustry.useCases.map((uc, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/[0.06] text-cool-gray text-xs">
                    {uc}
                    <button type="button" onClick={() => removeUseCase(idx)} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-cool-gray">SEO Keywords</Label>
              <Input value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addKeyword(); } }} placeholder="Type keyword and press Enter" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {editingIndustry.seoKeywords.map(kw => (
                  <span key={kw} className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs">
                    #{kw}
                    <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-400"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-4 p-4 bg-soft-lilac/10 rounded-lg border border-soft-lilac/20">
              <p className="text-midnight-navy font-medium text-sm">Base Package</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-cool-gray">Package Name</Label>
                  <Input value={editingIndustry.basePackage.name} onChange={e => updatePackageField('name', e.target.value)} placeholder="Retail Starter" className="bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-cool-gray">Price ({'\u20AC'}/mo)</Label>
                  <Input type="number" value={editingIndustry.basePackage.price || ''} onChange={e => updatePackageField('price', parseFloat(e.target.value) || 0)} className="bg-white border-slate-200 text-midnight-navy" />
                </div>
                <div className="space-y-2">
                  <Label className="text-cool-gray">Setup Fee ({'\u20AC'})</Label>
                  <Input type="number" value={editingIndustry.basePackage.setupFee || ''} onChange={e => updatePackageField('setupFee', parseFloat(e.target.value) || 0)} className="bg-white border-slate-200 text-midnight-navy" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Included Modules</Label>
                <div className="grid grid-cols-2 gap-2">
                  {MODULE_OPTIONS.map(mod => (
                    <label key={mod} className="flex items-center gap-2 cursor-pointer text-sm text-cool-gray">
                      <input type="checkbox" checked={editingIndustry.basePackage.modules.includes(mod)} onChange={() => toggleModule(mod)} className="rounded border-slate-200 bg-white text-indigo-600" />
                      {mod}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t border-soft-lilac/20 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isEditing ? 'Update Industry' : 'Create Industry'}
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
              Delete Industry
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Are you sure you want to delete <strong className="text-midnight-navy">{deleteTarget?.name}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-slate-200 text-cool-gray hover:bg-soft-lilac/10">Cancel</Button>
            <Button onClick={handleDelete} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete Industry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
