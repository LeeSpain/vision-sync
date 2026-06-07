import { ReactNode } from 'react';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';

interface ProjectPageTemplateProps {
  children: ReactNode;
}

const ProjectPageTemplate = ({ children }: ProjectPageTemplateProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default ProjectPageTemplate;