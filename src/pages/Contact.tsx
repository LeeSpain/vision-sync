import { useState } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { leadManager } from '@/utils/leadManager';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadManager.saveLead({
        ...formData,
        source: 'contact'
      });
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (error) {
      alert('There was an error sending your message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-hero">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-midnight-navy mb-6">
            Contact{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Us Today
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-cool-gray mb-8 max-w-3xl mx-auto">
            Ready to transform your business with AI? Let's discuss your project and explore how we can help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="p-8">
              <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-6">
                Get In Touch
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-midnight-navy mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-midnight-navy mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-midnight-navy mb-2">
                    Company
                  </label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-midnight-navy mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project requirements..."
                    className="min-h-[120px]"
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Send className="h-5 w-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-heading font-bold text-midnight-navy mb-6">
                  Let's Start a Conversation
                </h2>
                <p className="text-lg text-cool-gray mb-8">
                  Whether you're looking to implement AI solutions, need a custom platform, or want to discuss investment opportunities, we're here to help turn your vision into reality.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-emerald-green/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-emerald-green" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight-navy mb-1">Email Us</h3>
                    <p className="text-cool-gray">hello@vision-sync.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-royal-purple/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-royal-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight-navy mb-1">Call Us</h3>
                    <p className="text-cool-gray">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-coral-orange/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-coral-orange" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-midnight-navy mb-1">Visit Us</h3>
                    <p className="text-cool-gray">San Francisco, CA</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-royal-purple/10 to-emerald-green/10 p-6 rounded-lg">
                <h3 className="font-heading font-semibold text-midnight-navy mb-2">
                  Response Time
                </h3>
                <p className="text-cool-gray">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please mention it in your message.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;