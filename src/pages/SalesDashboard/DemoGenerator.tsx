import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    PlaySquare,
    Search,
    Monitor,
    CheckCircle2,
    Image as ImageIcon,
    Type,
    Palette,
    Eye,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock templates and deals
const MOCK_TEMPLATES = [
    { id: "t1", name: "Modern Real Estate", category: "Real Estate", thumbnail: "bg-slate-200" },
    { id: "t2", name: "Local Service Pro", category: "Services", thumbnail: "bg-blue-100" },
    { id: "t3", name: "Healthcare Clinic", category: "Healthcare", thumbnail: "bg-brand/10" },
    { id: "t4", name: "Restaurant Delivery", category: "Hospitality", thumbnail: "bg-emerald-100" }
];

export default function DemoGenerator() {
    const [searchParams] = useSearchParams();
    const dealId = searchParams.get("deal");

    const [step, setStep] = useState(1);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [demoName, setDemoName] = useState("Demo for Prospect");
    const [primaryColor, setPrimaryColor] = useState("#6366f1");

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Demo Generator</h2>
                        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 shadow-none border-none">
                            Beta
                        </Badge>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Instantly spin up a mockup website or landing page to present to a prospect.
                    </p>
                </div>
                {dealId && (
                    <div className="text-sm px-4 py-2 bg-indigo-50 border border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-300 rounded-lg flex items-center shadow-sm">
                        <Link to={`/sales-dashboard/deals/${dealId}`} className="hover:underline font-medium">
                            Attached to Deal: {dealId}
                        </Link>
                    </div>
                )}
            </div>

            {/* Progress Stepper */}
            <div className="flex items-center gap-4 py-4 px-2 max-w-3xl">
                {[
                    { num: 1, label: "Select Template" },
                    { num: 2, label: "Brand Details" },
                    { num: 3, label: "Preview & Save" }
                ].map((s) => (
                    <div key={s.num} className="flex-1">
                        <div className={`h-1.5 w-full rounded-full mb-2 ${step >= s.num ? 'bg-brand' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${step >= s.num ? 'text-brand' : 'text-slate-400'}`}>
                            Step {s.num} <span className="hidden sm:inline">- {s.label}</span>
                        </p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 min-h-[500px] flex flex-col">

                {/* STEP 1: Template Selection */}
                {step === 1 && (
                    <div className="flex-1 p-6 lg:p-8 animate-fade-in">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">1. Choose a Starting Template</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input placeholder="Search templates..." className="pl-9 h-9" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {MOCK_TEMPLATES.map((tpl) => (
                                <div
                                    key={tpl.id}
                                    onClick={() => setSelectedTemplate(tpl.id)}
                                    className={`relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden group ${selectedTemplate === tpl.id
                                            ? 'border-brand ring-4 ring-brand/10'
                                            : 'border-slate-200 dark:border-slate-800 hover:border-brand/40'
                                        }`}
                                >
                                    <div className={`w-full aspect-video ${tpl.thumbnail} dark:opacity-80 flex items-center justify-center`}>
                                        <Monitor className={`h-12 w-12 ${selectedTemplate === tpl.id ? 'text-brand' : 'text-slate-300 dark:text-slate-600'}`} />
                                    </div>
                                    <div className="p-4 bg-white dark:bg-slate-900">
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{tpl.category}</p>
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand transition-colors">{tpl.name}</h4>
                                    </div>
                                    {selectedTemplate === tpl.id && (
                                        <div className="absolute top-3 right-3 bg-brand text-white rounded-full p-1 shadow-md">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <Button
                                className="bg-brand hover:bg-brand-dark text-white px-8"
                                disabled={!selectedTemplate}
                                onClick={() => setStep(2)}
                            >
                                Next: Brand Details <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: Branding */}
                {step === 2 && (
                    <div className="flex-1 p-6 lg:p-8 animate-fade-in flex flex-col md:flex-row gap-8">
                        <div className="flex-1 max-w-xl space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">2. Customize Brand Settings</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 text-sm">
                                    Let AI autofill the copy, or tweak it yourself.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Demo Project Name</label>
                                    <Input
                                        value={demoName}
                                        onChange={(e) => setDemoName(e.target.value)}
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Brand Color</label>
                                    <div className="flex gap-3 items-center">
                                        <Input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="h-11 w-20 p-1 bg-slate-50 dark:bg-slate-800/50 cursor-pointer"
                                        />
                                        <Input
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="h-11 flex-1 font-mono uppercase bg-slate-50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 pt-2">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name (for copy)</label>
                                    <Input
                                        placeholder="e.g. Marina Dental"
                                        className="h-11 bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-between border-t border-slate-100 dark:border-slate-800 mt-8">
                                <Button variant="outline" onClick={() => setStep(1)}>
                                    Back
                                </Button>
                                <Button className="bg-brand hover:bg-brand-dark text-white px-8" onClick={() => setStep(3)}>
                                    Generate Demo <PlaySquare className="h-4 w-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                            <div className="text-center p-8">
                                <Type className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">AI Copy Engine Ready</h4>
                                <p className="text-sm text-slate-500 max-w-xs mx-auto">
                                    Once you proceed, Vision-Sync will rapidly assemble a functioning prototype with tailored copy.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Preview */}
                {step === 3 && (
                    <div className="flex-1 animate-fade-in flex flex-col h-[600px]">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/20">
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Adjust Settings
                                </Button>
                                <div className="h-4 w-px bg-slate-300 dark:bg-slate-700"></div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{demoName}</h3>
                                <Badge className="bg-emerald-100 text-emerald-700 shadow-none border-none dark:bg-emerald-900/30 dark:text-emerald-400">Preview Ready</Badge>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="hidden sm:flex">
                                    <Eye className="h-4 w-4 mr-2" /> Open Fullscreen
                                </Button>
                                <Button size="sm" className="bg-brand hover:bg-brand-dark text-white">
                                    Save to Deal Room
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1 bg-slate-200 dark:bg-slate-950 p-4 lg:p-8 flex items-center justify-center overflow-hidden relative">
                            {/* Fake Browser Window Chrome */}
                            <div className="w-full max-w-4xl h-full bg-white dark:bg-slate-900 rounded-lg shadow-2xl overflow-hidden flex flex-col border border-slate-300 dark:border-slate-700 mx-auto">
                                <div className="h-10 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-4 gap-2">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                                    </div>
                                    <div className="mx-auto bg-white dark:bg-slate-900 px-4 py-1 rounded-md text-xs text-slate-500 font-mono shadow-sm border border-slate-200 dark:border-slate-700">
                                        preview.vision-sync.com/demo/temp-xyz
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto w-full relative group">
                                    {/* Mock Page Content */}
                                    <div className="h-96 flex flex-col items-center justify-center text-center p-8" style={{ backgroundColor: primaryColor + '10' }}>
                                        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Transform Your Business Online</h1>
                                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8">
                                            This is a randomly generated placeholder showcasing the chosen template structure.
                                        </p>
                                        <Button style={{ backgroundColor: primaryColor }} className="text-white px-8 py-6 text-lg rounded-full">
                                            Book a Consultation
                                        </Button>
                                    </div>
                                    <div className="h-64 bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-300 text-2xl uppercase tracking-widest">
                                        Content Section
                                    </div>

                                    {/* Overlay presentation mode CTA */}
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                        <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-6 text-lg font-bold shadow-2xl">
                                            <PlaySquare className="h-6 w-6 mr-3 text-brand" /> Launch Presentation Mode
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
