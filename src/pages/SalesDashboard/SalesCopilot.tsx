import { useState, useRef, useEffect } from "react";
import {
    Bot,
    Send,
    Sparkles,
    AlignLeft,
    MessageSquare,
    Search,
    FileText,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
    id: number;
    role: "user" | "assistant";
    text: string;
}

export default function SalesCopilot() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            role: "assistant",
            text: t('salesDashboard.salesCopilot.initialMessage')
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId] = useState(() => `sales_copilot_${Date.now()}`);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent, overrideText?: string) => {
        e.preventDefault();
        const text = overrideText ?? inputValue;
        if (!text.trim() || isLoading) return;

        const userMsg: Message = { id: Date.now(), role: "user", text };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke('ai-router', {
                body: {
                    message: text,
                    sessionId,
                    forceBrain: true,
                    isAdmin: true,
                    context: 'sales_copilot'
                }
            });

            if (error) throw error;

            const responseText = data?.response || data?.message || "I couldn't generate a response. Please try again.";
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: "assistant",
                text: responseText
            }]);
        } catch (err) {
            console.error('SalesCopilot error:', err);
            toast.error("Failed to get a response. Please try again.");
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: "assistant",
                text: "I'm having trouble connecting right now. Please try again in a moment."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePromptClick = (prompt: string) => {
        setInputValue(prompt);
    };

    const prompts = [
        { icon: Search, label: t('salesDashboard.salesCopilot.prompts.analyze.label'), prompt: t('salesDashboard.salesCopilot.prompts.analyze.prompt') },
        { icon: AlignLeft, label: t('salesDashboard.salesCopilot.prompts.summarize.label'), prompt: t('salesDashboard.salesCopilot.prompts.summarize.prompt') },
        { icon: MessageSquare, label: t('salesDashboard.salesCopilot.prompts.whatsapp.label'), prompt: t('salesDashboard.salesCopilot.prompts.whatsapp.prompt') },
        { icon: FileText, label: t('salesDashboard.salesCopilot.prompts.quote.label'), prompt: t('salesDashboard.salesCopilot.prompts.quote.prompt') }
    ];

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <Bot className="h-6 w-6 text-indigo-500" />
                        {t('salesDashboard.salesCopilot.title')}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {t('salesDashboard.salesCopilot.subtitle')}
                    </p>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden relative">

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex max-w-[85%] ${msg.role === 'user' ? 'ml-auto' : 'mr-auto'} gap-3`}>
                            {msg.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                                    <Bot className="h-4 w-4" />
                                </div>
                            )}

                            <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-brand text-white rounded-tr-sm'
                                : 'bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-200 rounded-tl-sm'
                                }`}>
                                {msg.text}
                            </div>

                            {msg.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-1 text-xs font-bold">
                                    {t('salesDashboard.salesCopilot.me')}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex mr-auto gap-3 max-w-[85%]">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1">
                                <Bot className="h-4 w-4" />
                            </div>
                            <div className="p-4 rounded-xl rounded-tl-sm bg-slate-50 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                                <span className="text-sm text-slate-500 dark:text-slate-400">Thinking...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 shrink-0">

                    {/* Quick Prompts */}
                    {messages.length < 3 && (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-1"><Sparkles className="h-3 w-3 inline mr-1" /> {t('salesDashboard.salesCopilot.tryAsking')}</p>
                            <div className="flex flex-wrap gap-2">
                                {prompts.map((p, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handlePromptClick(p.prompt)}
                                        className="flex items-center text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand/40 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                                    >
                                        <p.icon className="h-3 w-3 mr-1.5 text-slate-400" />
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSend} className="relative">
                        <Input
                            placeholder={t('salesDashboard.salesCopilot.askAnything')}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            className="pr-12 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 h-14 text-base shadow-sm focus-visible:ring-brand"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            disabled={!inputValue.trim() || isLoading}
                            className="absolute right-2 top-2 h-10 w-10 bg-brand hover:bg-brand-dark text-white rounded-md"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                    <div className="text-center mt-2">
                        <span className="text-[10px] text-slate-400">{t('salesDashboard.salesCopilot.disclaimer')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
