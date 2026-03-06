import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Layers, Zap, Shield, Database, Cpu, ArrowRight } from 'lucide-react';

export default function Platform() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
            <Header />
            <main className="flex-grow pt-32 pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto mb-20 animate-fade-in">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-midnight-navy mb-6 leading-tight">
                            Meet Your New Digital Team
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto">
                            Vision-Sync makes Artificial Intelligence accessible, safe, and easy to use. Think of us as your digital workforce that never sleeps—ready to help with repetitive tasks so your human team can focus on what they do best.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-electric-blue hover:bg-electric-blue/90 text-white rounded-full px-8">
                                <Link to="/solutions">Explore Solutions</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full px-8 text-midnight-navy border-slate-300 hover:bg-slate-100">
                                <Link to="/contact">Request a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
                            </Button>
                        </div>
                    </div>

                    {/* Architecture Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto mt-24">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-royal-purple/30 transition-colors">
                            <div className="h-12 w-12 bg-royal-purple/10 rounded-xl flex items-center justify-center mb-6">
                                <Cpu className="h-6 w-6 text-royal-purple" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">Smart, Friendly AI Helpers</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Deploy virtual assistants that actually learn your business. Unlike frustrating, robotic chatbots, our AI helpers can understand context, hold natural conversations, and complete real tasks for you.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-green/30 transition-colors">
                            <div className="h-12 w-12 bg-emerald-green/10 rounded-xl flex items-center justify-center mb-6">
                                <Database className="h-6 w-6 text-emerald-green" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">Connects Safely to Your Tools</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Don't worry about migrating your data. Vision-Sync securely plugs into the software you already use every day. We keep your information private, encrypted, and completely secure.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-electric-blue/30 transition-colors">
                            <div className="h-12 w-12 bg-electric-blue/10 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-electric-blue" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">Automates the Boring Stuff</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Say goodbye to tedious manual data entry. Our platform can automatically handle routine chores—like sorting new leads, organizing emails, or answering common customer questions—while you sleep.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:border-coral-orange/30 transition-colors">
                            <div className="h-12 w-12 bg-coral-orange/10 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-coral-orange" />
                            </div>
                            <h3 className="text-2xl font-bold text-midnight-navy mb-4">You're Always in Control</h3>
                            <p className="text-slate-600 leading-relaxed">
                                No rogue AI here. Every single action our digital assistants take can be set to require your human approval first. You have complete visibility and you always hold the keys.
                            </p>
                        </div>
                    </div>

                    {/* Modular Add-ons Banner */}
                    <div className="mt-32 bg-gradient-to-br from-midnight-navy to-royal-purple rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Layers className="h-64 w-64" />
                        </div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Grow at Your Own Pace</h2>
                            <p className="text-lg text-slate-300 mb-8">
                                Start simple with just one smart AI assistant. As you become more comfortable, you can easily add more skills and capabilities from our growing library.
                            </p>
                            <Button asChild size="lg" className="bg-white text-midnight-navy hover:bg-slate-100">
                                <Link to="/modules">Browse AI Skills</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
