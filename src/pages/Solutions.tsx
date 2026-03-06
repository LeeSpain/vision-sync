import { useEffect, useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, Building2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Solutions() {
    const [solutions, setSolutions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSolutions = async () => {
            const { data } = await supabase
                .from('solutions')
                .select('*')
                .eq('is_active', true)
                .order('sort_order', { ascending: true });

            if (data) setSolutions(data);
            setLoading(false);
        };

        fetchSolutions();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-midnight-navy mb-6">
                            Ready-to-Use AI Blueprints
                        </h1>
                        <p className="text-lg text-cool-gray">
                            Not sure where to start with AI? We've created simple, pre-built packages tailored for your industry that plug right into your business.
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-electric-blue" />
                        </div>
                    ) : solutions.length === 0 ? (
                        <div className="text-center text-cool-gray py-20 bg-white rounded-xl shadow-sm">
                            <Building2 className="h-12 w-12 mx-auto text-cool-gray mb-4 opacity-50" />
                            <p className="text-lg font-medium">More ready-to-use blueprints are being built.</p>
                            <p className="text-sm">Check back soon for more simple AI workflows tailored to your industry.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {solutions.map((sol) => (
                                <Card key={sol.id} className={`flex flex-col h-full bg-white relative overflow-hidden transition-all duration-300 border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 ${sol.is_featured ? 'border-electric-blue/50 shadow-electric-blue/10' : ''}`}>
                                    {sol.is_featured && (
                                        <div className="absolute top-0 right-0 p-3">
                                            <Star className="h-5 w-5 text-electric-blue fill-electric-blue/20" />
                                        </div>
                                    )}
                                    <div className="h-2 w-full bg-gradient-to-r from-electric-blue to-sky-blue" />
                                    <CardHeader className="pt-8">
                                        <CardTitle className="text-xl text-midnight-navy">{sol.name}</CardTitle>
                                        <CardDescription className="text-sm mt-2 font-medium text-electric-blue">
                                            {sol.summary}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-sm text-slate-600 line-clamp-4">
                                            {sol.description || "A simple, ready-to-use AI workflow designed specifically to make your daily operations smoother and faster."}
                                        </p>

                                        {Array.isArray(sol.industries) && sol.industries.length > 0 && (
                                            <div className="mt-6 flex flex-wrap gap-2">
                                                {sol.industries.map((ind: string, idx: number) => (
                                                    <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                                        {ind}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="pt-6 pb-8">
                                        <Button asChild variant="outline" className="w-full justify-between group hover:bg-electric-blue hover:text-white hover:border-electric-blue transition-colors">
                                            <Link to={sol.cta_link || "/contact"}>
                                                {sol.cta_label || "See How It Works"}
                                                <ArrowRight className="h-4 w-4 text-electric-blue group-hover:text-white transition-colors" />
                                            </Link>
                                        </Button>
                                    </CardFooter>
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
