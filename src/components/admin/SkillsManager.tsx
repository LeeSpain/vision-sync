import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import {
  Plus, Edit2, Trash2, Search, AlertTriangle, X, Loader2, Zap,
  Mail, Phone, RefreshCw, BarChart3, Calendar, UserCheck, Star,
  MessageCircle, MessageSquare, Bot, GripVertical
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

type SkillStatus = 'active' | 'beta' | 'inactive';

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconKey: string;
  color: string;
  status: SkillStatus;
  isPopular: boolean;
  sortOrder: number;
}

// ─── Icon Map ─────────────────────────────────────────────────

type IconComponent = React.FC<{ className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Mail, Phone, RefreshCw, BarChart3, Calendar, UserCheck, Star,
  MessageCircle, MessageSquare, Bot, Zap,
};

const ICON_OPTIONS = Object.keys(ICON_MAP);

// ─── Color System ─────────────────────────────────────────────

const COLOR_OPTIONS = ['blue', 'emerald', 'purple', 'amber', 'cyan', 'pink', 'red', 'indigo'] as const;

const COLOR_MAP: Record<string, { bg: string; text: string; accent: string }> = {
  blue:    { bg: 'bg-blue-500/10',    text: 'text-blue-500',    accent: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', accent: 'bg-emerald-500' },
  purple:  { bg: 'bg-purple-500/10',  text: 'text-purple-500',  accent: 'bg-purple-500' },
  amber:   { bg: 'bg-amber-500/10',   text: 'text-amber-500',   accent: 'bg-amber-500' },
  cyan:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-500',    accent: 'bg-cyan-500' },
  pink:    { bg: 'bg-pink-500/10',    text: 'text-pink-500',    accent: 'bg-pink-500' },
  red:     { bg: 'bg-red-500/10',     text: 'text-red-500',     accent: 'bg-red-500' },
  indigo:  { bg: 'bg-indigo-500/10',  text: 'text-indigo-500',  accent: 'bg-indigo-500' },
};

const getColor = (color: string) => COLOR_MAP[color] || COLOR_MAP.blue;

const STATUS_STYLES: Record<SkillStatus, { bg: string; text: string; label: string }> = {
  active:   { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
  beta:     { bg: 'bg-purple-100',  text: 'text-purple-700',  label: 'Beta' },
  inactive: { bg: 'bg-slate-100',   text: 'text-slate-500',   label: 'Inactive' },
};

// ─── Seed Data ────────────────────────────────────────────────

const STORAGE_KEY = 'vs_skills';

const SEED_SKILLS: Skill[] = [
  { id: crypto.randomUUID(), name: 'Email Follow-Up Agent', slug: 'email-followup', description: 'Automated personalised follow-up sequences that convert leads while you sleep.', iconKey: 'Mail', color: 'blue', status: 'active', isPopular: true, sortOrder: 0 },
  { id: crypto.randomUUID(), name: 'Voice Assistant', slug: 'voice-assistant', description: 'AI answers your phone line in English and Spanish — 24/7, zero hold times.', iconKey: 'Phone', color: 'emerald', status: 'active', isPopular: true, sortOrder: 1 },
  { id: crypto.randomUUID(), name: 'CRM Sync', slug: 'crm-sync', description: 'Every lead and conversation pushed to your CRM automatically.', iconKey: 'RefreshCw', color: 'indigo', status: 'active', isPopular: false, sortOrder: 2 },
  { id: crypto.randomUUID(), name: 'Data Intelligence Hub', slug: 'analytics-brain', description: 'Live dashboards showing leads, conversations, conversions, and agent performance.', iconKey: 'BarChart3', color: 'purple', status: 'active', isPopular: false, sortOrder: 3 },
  { id: crypto.randomUUID(), name: 'Appointment Booking', slug: 'appointment-booking', description: 'AI books, confirms, and reminds — your calendar stays full automatically.', iconKey: 'Calendar', color: 'cyan', status: 'active', isPopular: true, sortOrder: 4 },
  { id: crypto.randomUUID(), name: 'Lead Qualifier', slug: 'lead-qualifier', description: 'Score every lead instantly so you focus only on the ones that will close.', iconKey: 'UserCheck', color: 'amber', status: 'active', isPopular: false, sortOrder: 5 },
  { id: crypto.randomUUID(), name: 'Review Manager', slug: 'review-manager', description: 'Monitor, respond to, and grow your Google reviews on autopilot.', iconKey: 'Star', color: 'pink', status: 'active', isPopular: false, sortOrder: 6 },
  { id: crypto.randomUUID(), name: 'Social Media Responder', slug: 'social-responder', description: 'Auto-reply to Instagram and Facebook DMs and comments in seconds.', iconKey: 'MessageCircle', color: 'pink', status: 'active', isPopular: false, sortOrder: 7 },
  { id: crypto.randomUUID(), name: 'WhatsApp Agent', slug: 'whatsapp-agent', description: 'An AI sales agent inside WhatsApp Business — where your customers already are.', iconKey: 'MessageSquare', color: 'emerald', status: 'active', isPopular: true, sortOrder: 8 },
  { id: crypto.randomUUID(), name: 'AI Chatbot Widget', slug: 'chatbot-widget', description: 'A fully trained chat agent embedded on your website — live in 48 hours.', iconKey: 'Bot', color: 'blue', status: 'active', isPopular: true, sortOrder: 9 },
];

function getLocalSkills(): Skill[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw) as Skill[];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SKILLS));
  return [...SEED_SKILLS];
}

function saveLocalSkills(items: Skill[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// ─── Helpers ──────────────────────────────────────────────────

const emptySkillForm = (): Skill => ({
  id: '', name: '', slug: '', description: '', iconKey: 'Zap',
  color: 'blue', status: 'active', isPopular: false, sortOrder: 99,
});

// ─── Component ────────────────────────────────────────────────

export function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>(getLocalSkills);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill>(emptySkillForm());
  const [isEditing, setIsEditing] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

  const persist = (items: Skill[]) => {
    setSkills(items);
    saveLocalSkills(items);
  };

  // ─── Computed ───────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: skills.length,
    active: skills.filter(s => s.status === 'active').length,
    popular: skills.filter(s => s.isPopular).length,
    beta: skills.filter(s => s.status === 'beta').length,
  }), [skills]);

  const filteredSkills = useMemo(() => {
    let result = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [skills, searchQuery]);

  // ─── Handlers ───────────────────────────────────────────────

  const openCreate = () => {
    setEditingSkill({ ...emptySkillForm(), sortOrder: skills.length });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEdit = (skill: Skill) => {
    setEditingSkill({ ...skill });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingSkill.name.trim()) { toast.error('Skill name is required'); return; }
    if (!editingSkill.slug.trim()) { toast.error('Skill slug is required'); return; }

    if (isEditing) {
      persist(skills.map(s => s.id === editingSkill.id ? editingSkill : s));
      toast.success(`"${editingSkill.name}" updated`);
    } else {
      persist([...skills, { ...editingSkill, id: crypto.randomUUID() }]);
      toast.success(`"${editingSkill.name}" created`);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    persist(skills.filter(s => s.id !== deleteTarget.id));
    toast.success(`"${deleteTarget.name}" deleted`);
    setDeleteTarget(null);
  };

  const togglePopular = (id: string) => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;
    persist(skills.map(s => s.id === id ? { ...s, isPopular: !s.isPopular } : s));
    toast.success(`"${skill.name}" ${!skill.isPopular ? 'marked popular' : 'unmarked'}`);
  };

  const updateField = <K extends keyof Skill>(key: K, value: Skill[K]) => {
    setEditingSkill(prev => ({ ...prev, [key]: value }));
  };

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-midnight-navy flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-cyan-500" />
            </div>
            Skills Manager
          </h1>
          <p className="text-cool-gray mt-1 ml-[52px]">Manage add-on AI skills for the quote wizard</p>
        </div>
        <Button onClick={openCreate} className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Skills', value: stats.total, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Active', value: stats.active, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Popular', value: stats.popular, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Beta', value: stats.beta, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(s => (
          <div key={s.label} className="bg-gradient-card shadow-card rounded-xl p-5">
            <p className="text-cool-gray text-sm">{s.label}</p>
            <p className="text-2xl font-bold text-midnight-navy mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cool-gray/60" />
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search skills..."
          className="pl-10 bg-white border-slate-200 text-midnight-navy placeholder:text-cool-gray/60"
        />
      </div>

      {/* Skills Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-gradient-card shadow-card rounded-xl p-16 text-center">
          <Zap className="h-12 w-12 mx-auto text-cool-gray/40 mb-4" />
          <h3 className="text-lg font-medium text-midnight-navy/60">No skills found</h3>
          <p className="text-cool-gray/60 mt-1">Try a different search or add a new skill</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map(skill => {
            const c = getColor(skill.color);
            const st = STATUS_STYLES[skill.status];
            const Icon = ICON_MAP[skill.iconKey] || Zap;
            return (
              <div key={skill.id} className="bg-gradient-card shadow-card rounded-xl overflow-hidden transition-all hover:shadow-elegant">
                <div className={`h-1 ${c.accent}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                        <Icon className={`h-5 w-5 ${c.text}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-midnight-navy text-sm">{skill.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${st.bg} ${st.text}`}>{st.label}</span>
                          {skill.isPopular && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                              <Star className="h-2.5 w-2.5 inline mr-0.5 fill-amber-500" />Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <button onClick={() => togglePopular(skill.id)} className={`p-1.5 rounded transition-colors ${skill.isPopular ? 'text-amber-500' : 'text-cool-gray/40 hover:text-amber-400'}`}>
                        <Star className={`h-3.5 w-3.5 ${skill.isPopular ? 'fill-amber-500' : ''}`} />
                      </button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-cyan-500" onClick={() => openEdit(skill)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-cool-gray hover:text-red-400" onClick={() => setDeleteTarget(skill)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-cool-gray text-xs leading-relaxed line-clamp-2">{skill.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Create / Edit Modal ─────────────────────────────── */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-white border-slate-200">
          <DialogHeader>
            <DialogTitle className="text-midnight-navy flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-500" />
              {isEditing ? 'Edit Skill' : 'Create New Skill'}
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              {isEditing ? 'Update this add-on skill' : 'Add a new AI skill for the quote wizard'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Name *</Label>
                <Input value={editingSkill.name} onChange={e => updateField('name', e.target.value)} placeholder="Email Follow-Up Agent" className="bg-white border-slate-200 text-midnight-navy" />
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Slug *</Label>
                <Input value={editingSkill.slug} onChange={e => updateField('slug', e.target.value)} placeholder="email-followup" className="bg-white border-slate-200 text-midnight-navy" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-cool-gray">Description</Label>
              <Textarea value={editingSkill.description} onChange={e => updateField('description', e.target.value)} placeholder="What does this skill do?" rows={2} className="bg-white border-slate-200 text-midnight-navy resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-cool-gray">Icon</Label>
                <Select value={editingSkill.iconKey} onValueChange={v => updateField('iconKey', v)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    {ICON_OPTIONS.map(key => {
                      const Ic = ICON_MAP[key];
                      return (
                        <SelectItem key={key} value={key} className="text-midnight-navy">
                          <span className="flex items-center gap-2"><Ic className="h-4 w-4" />{key}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-cool-gray">Status</Label>
                <Select value={editingSkill.status} onValueChange={v => updateField('status', v as SkillStatus)}>
                  <SelectTrigger className="bg-white border-slate-200 text-midnight-navy"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="active" className="text-midnight-navy">Active</SelectItem>
                    <SelectItem value="beta" className="text-midnight-navy">Beta</SelectItem>
                    <SelectItem value="inactive" className="text-midnight-navy">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-cool-gray">Accent Color</Label>
              <div className="flex gap-2">
                {COLOR_OPTIONS.map(co => (
                  <button key={co} type="button" onClick={() => updateField('color', co)}
                    className={`h-7 w-7 rounded-full ${COLOR_MAP[co].accent} transition-all ${editingSkill.color === co ? 'ring-2 ring-offset-2 ring-offset-white ring-cyan-500' : 'opacity-50 hover:opacity-100'}`} />
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm text-cool-gray">
              <input type="checkbox" checked={editingSkill.isPopular} onChange={e => updateField('isPopular', e.target.checked)} className="rounded border-slate-200 text-cyan-600" />
              Mark as popular
            </label>
          </div>

          <DialogFooter className="border-t border-slate-100 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="border-slate-200 text-cool-gray">Cancel</Button>
            <Button onClick={handleSave} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {isEditing ? 'Update Skill' : 'Create Skill'}
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
              Delete Skill
            </DialogTitle>
            <DialogDescription className="text-cool-gray">
              Are you sure you want to delete <strong className="text-midnight-navy">{deleteTarget?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)} className="border-slate-200 text-cool-gray">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white">Delete Skill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
