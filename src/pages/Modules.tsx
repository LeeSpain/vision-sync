import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Modules() {
    const [modules, setModules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchModules = async () => {
            const { data } = await supabase
                .from('modules')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) setModules(data);
            setLoading(false);
        };

        fetchModules();
    }, []);

    const fallbackModules = [
        {
            id: 'fallback-m1',
            name: 'Email Assistant',
            short_description: 'Drafts replies and organizes your inbox.',
            long_description: 'Connects to your business email to automatically sort incoming messages, flag urgent ones, and draft polite, accurate responses for your review.',
            monthly_addon_price: 199,
            features: ['Automatic Sorting', 'Drafting Replies', 'Spam Filtering'],
        },
        {
            id: 'fallback-m2',
            name: 'Website Greeter',
            short_description: 'A smart chat widget that actually helps.',
            long_description: 'Add a helpful assistant to your website that can guide visitors to the right products, answer pricing questions, or capture their contact information.',
            monthly_addon_price: 249,
            features: ['24/7 Availability', 'Natural Conversations', 'Lead Capture'],
        },
        {
            id: 'fallback-m3',
            name: 'Data Sync',
            short_description: 'Keeps your different software talking.',
            long_description: 'When a new customer signs up on your website, this skill automatically adds them to your CRM, emails your team, and updates your spreadsheets without you lifting a finger.',
            monthly_addon_price: null,
            features: ['Automatic Updates', 'Error Checking', 'Instant Transfers'],
        }
    ];

    const displayModules = modules.length > 0 ? modules : fallbackModules;

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-flex items-center justify-center p-3 bg-emerald-green/10 rounded-2xl mb-6">
                            <Layers className="h-6 w-6 text-emerald-green" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
                            Pick Your AI Superpowers
                        </h1>
                        <p className="text-lg text-cool-gray">
                            Add new skills to your business just like installing apps on your phone. Browse our library of ready-to-use AI helpers.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-emerald-green" />
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-5xl mx-auto">
                            {displayModules.map((mod) => (
                                <Card key={mod.id} className="flex flex-col md:flex-row overflow-hidden bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="md:w-2/3 p-6 md:p-8 flex flex-col justify-center">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h3 className="text-2xl font-bold text-midnight-navy">{mod.name}</h3>
                                            {mod.monthly_addon_price === null && (
                                                <span className="px-2.5 py-1 bg-cool-gray/10 text-cool-gray text-xs font-semibold rounded-full uppercase tracking-wider">
                                                    Core Feature
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-lg text-emerald-green font-medium mb-4">
                                            {mod.short_description}
                                        </p>
                                        <p className="text-slate-600 mb-6 line-clamp-3">
                                            {mod.long_description || "Add this specific skill to your AI assistant to handle this task completely automatically."}
                                        </p>

                                        {Array.isArray(mod.features) && mod.features.length > 0 && (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                                                {mod.features.map((feat: string, idx: number) => (
                                                    <div key={idx} className="flex items-start text-sm text-slate-700">
                                                        <CheckCircle2 className="h-4 w-4 mr-2 mt-0.5 text-emerald-green shrink-0" />
                                                        <span>{feat}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:w-1/3 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 p-6 md:p-8 flex flex-col justify-center items-center text-center">
                                        {mod.monthly_addon_price !== null ? (
                                            <div className="mb-6">
                                                <span className="text-sm font-semibold text-cool-gray uppercase tracking-wide">Add-on Price</span>
                                                <div className="mt-2 flex items-baseline justify-center text-midnight-navy">
                                                    <span className="text-4xl font-extrabold tracking-tight">${mod.monthly_addon_price}</span>
                                                    <span className="text-xl font-medium text-cool-gray ml-1">/mo</span>
                                                </div>
                                                {mod.setup_fee && (
                                                    <p className="text-xs text-slate-500 mt-2">+ ${mod.setup_fee} implementation</p>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                <div className="text-2xl font-bold text-midnight-navy">Included</div>
                                                <p className="text-sm text-slate-500 mt-1">Available on all paid plans</p>
                                            </div>
                                        )}

                                        <Button asChild className="w-full bg-emerald-green hover:bg-emerald-green/90 text-white group">
                                            <Link to="/contact">
                                                Add This Skill
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
