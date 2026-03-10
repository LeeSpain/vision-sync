import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { VisionFamilyApp } from "@/types/visionFamily";
import { ExternalLink } from "lucide-react";

export function VisionFamilySection() {
    const [apps, setApps] = useState<VisionFamilyApp[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const { data, error } = await supabase
                    .from("vision_family_apps")
                    .select("*")
                    .eq("is_published", true)
                    .order("display_order", { ascending: true });

                if (error) throw error;
                setApps(data || []);
            } catch (error) {
                console.error("Error fetching vision family apps:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    if (loading) {
        return (
            <section className="bg-slate-950 py-24">
                <div className="container mx-auto px-4 md:px-6 max-w-6xl">
                    <div className="flex flex-col items-center mb-16 text-center">
                        <div className="h-8 w-32 bg-slate-800 rounded animate-pulse mb-6"></div>
                        <div className="h-12 w-3/4 max-w-2xl bg-slate-800 rounded animate-pulse mb-6"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="md:col-span-2 h-80 bg-slate-900 rounded-2xl animate-pulse"></div>
                        <div className="h-80 bg-slate-900 rounded-2xl animate-pulse"></div>
                        <div className="h-80 bg-slate-900 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (apps.length === 0) {
        return null;
    }

    const featuredApps = apps.filter((app) => app.is_featured);
    const regularApps = apps.filter((app) => !app.is_featured);

    return (
        <section className="bg-slate-950 py-24 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-4 md:px-6 max-w-6xl relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <div className="inline-flex items-center justify-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-cyan-400 text-white font-bold text-xs">
                            V
                        </span>
                        <span className="text-sm font-medium text-slate-300">
                            Vision Ecosystem
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                        Part of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Vision Family</span>
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        A growing suite of interconnected tools and platforms designed to work seamlessly together.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredApps.map((app) => (
                        <div
                            key={app.id}
                            className="md:col-span-2 group relative bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden"
                            style={{ '--app-accent': app.accent_color } as React.CSSProperties}
                        >
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at center, var(--app-accent) 0%, transparent 70%)` }}
                            />

                            <div className="relative z-10 flex flex-col md:flex-row gap-8 h-full">
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10"
                                                    style={{ backgroundColor: `${app.accent_color}20`, color: app.accent_color }}
                                                >
                                                    {app.logo_url ? (
                                                        <img src={app.logo_url} alt={app.name} className="w-8 h-8 object-contain" />
                                                    ) : (
                                                        app.logo_emoji
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-bold text-white">{app.name}</h3>
                                                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 mt-1">
                                                        {app.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {app.url && (
                                                <a
                                                    href={app.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                                                    aria-label={`Visit ${app.name}`}
                                                >
                                                    <ExternalLink className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>

                                        <h4
                                            className="text-xl font-medium mb-3"
                                            style={{ color: app.accent_color }}
                                        >
                                            {app.tagline}
                                        </h4>

                                        <p className="text-slate-400 leading-relaxed mb-8">
                                            {app.description}
                                        </p>
                                    </div>

                                    {app.powered_by && app.powered_by.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider mr-2 self-center">Powered By:</span>
                                            {app.powered_by.map((tech, idx) => (
                                                <span key={idx} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-slate-400">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {regularApps.map((app) => (
                        <div
                            key={app.id}
                            className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 flex flex-col h-full overflow-hidden"
                            style={{ '--app-accent': app.accent_color } as React.CSSProperties}
                        >
                            <div
                                className="absolute top-0 left-0 w-full h-1 opacity-80"
                                style={{ backgroundColor: app.accent_color }}
                            />
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                                style={{ background: `radial-gradient(circle at top right, var(--app-accent) 0%, transparent 70%)` }}
                            />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-5">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md border border-white/10"
                                        style={{ backgroundColor: `${app.accent_color}15`, color: app.accent_color }}
                                    >
                                        {app.logo_url ? (
                                            <img src={app.logo_url} alt={app.name} className="w-6 h-6 object-contain" />
                                        ) : (
                                            app.logo_emoji
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        {app.url && (
                                            <a
                                                href={app.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-500 hover:text-white transition-colors"
                                                aria-label={`Visit ${app.name}`}
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/10 text-slate-300">
                                            {app.category}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
                                <h4
                                    className="text-sm font-medium mb-3"
                                    style={{ color: app.accent_color }}
                                >
                                    {app.tagline}
                                </h4>

                                <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-grow">
                                    {app.description}
                                </p>

                                {app.powered_by && app.powered_by.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-white/5">
                                        {app.powered_by.map((tech, idx) => (
                                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
