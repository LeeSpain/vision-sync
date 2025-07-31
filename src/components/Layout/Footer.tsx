import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
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
              "Build. Showcase. Sell. Invest. Sync your vision with the future."
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white">
                <Mail className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-white/60 hover:text-slate-white">
                <Twitter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/for-investors" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  For Investors
                </Link>
              </li>
              <li>
                <Link to="/for-sale" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  For Sale
                </Link>
              </li>
              <li>
                <Link to="/custom-builds" className="text-slate-white/80 hover:text-slate-white transition-colors">
                  Custom Builds
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-white/60 hover:text-slate-white transition-colors text-sm">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-heading font-semibold mb-4">Stay Updated</h3>
            <p className="text-slate-white/80 text-sm mb-4">
              Get notified about new projects and opportunities.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Your email" 
                className="bg-slate-white/10 border-slate-white/20 text-slate-white placeholder:text-slate-white/60"
              />
              <Button variant="invest" size="sm">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-white/20 mt-8 pt-8 text-center">
          <p className="text-slate-white/60 text-sm">
            © 2024 Vision-Sync. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;