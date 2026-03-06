import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const Footer = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter.",
    });
    setEmail('');
  };
  return (
    <footer className="bg-midnight-navy text-slate-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <span className="text-xl font-heading font-bold">Vision-Sync</span>
            </div>
            <p className="text-slate-white/80 mb-6 max-w-md">
              "Design. Automate. Scale. Sync your vision with the future."
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white" asChild>
                <a href="mailto:contact@vision-sync.com"><Mail className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white" asChild>
                <a href="https://github.com/LeeSpain" target="_blank" rel="noreferrer"><Github className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white" asChild>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer"><Linkedin className="h-5 w-5" /></a>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white" asChild>
                <a href="https://twitter.com" target="_blank" rel="noreferrer"><Twitter className="h-5 w-5" /></a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/platform" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  Platform
                </Link>
              </li>
              <li>
                <Link to="/solutions" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/modules" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  Modules
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Stay Updated</h3>
            <p className="text-slate-white/80 text-sm mb-4">
              Get notified about new AI modules and platform updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="bg-slate-white/10 border-slate-white/20 text-slate-white placeholder:text-slate-white/60"
                required
              />
              <Button type="submit" variant="invest" size="sm">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-white/20 mt-8 pt-8 text-center">
          <p className="text-slate-white/60 text-sm">
            © {new Date().getFullYear()} Vision-Sync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;