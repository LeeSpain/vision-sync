import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, Image, Link, Upload } from 'lucide-react';

export function ContentManager() {
  const [sections, setSections] = useState([
    { id: 1, title: "🔥 Featured Projects", type: "project-grid", order: 1, visible: true },
    { id: 2, title: "💼 Investment Opportunities", type: "investment-grid", order: 2, visible: true },
    { id: 3, title: "🛒 Platforms for Sale", type: "sale-grid", order: 3, visible: true },
    { id: 4, title: "🧠 Internal Tools", type: "internal-grid", order: 4, visible: false },
  ]);

  const [assets, setAssets] = useState([
    { id: 1, name: "hero-background.jpg", type: "image", size: "2.3 MB", uploaded: "2024-01-15" },
    { id: 2, name: "logo-main.svg", type: "image", size: "45 KB", uploaded: "2024-01-14" },
    { id: 3, name: "pitch-deck.pdf", type: "document", size: "8.7 MB", uploaded: "2024-01-13" },
  ]);

  const [newSection, setNewSection] = useState({
    title: '',
    type: 'project-grid',
    visible: true
  });

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);

  const handleAddSection = () => {
    const section = {
      id: Date.now(),
      ...newSection,
      order: sections.length + 1
    };
    setSections([...sections, section]);
    setNewSection({ title: '', type: 'project-grid', visible: true });
    setIsAddSectionOpen(false);
  };

  const toggleSectionVisibility = (id: number) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, visible: !s.visible } : s
    ));
  };

  const deleteSection = (id: number) => {
    if (confirm('Are you sure you want to delete this section?')) {
      setSections(sections.filter(s => s.id !== id));
    }
  };

  const moveSection = (id: number, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newSections[currentIndex], newSections[targetIndex]] = 
    [newSections[targetIndex], newSections[currentIndex]];
    
    setSections(newSections);
  };

  return (
    <div className="space-y-6">
      {/* Homepage Layout Manager */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading">Homepage Layout</CardTitle>
              <CardDescription>Drag and drop to rearrange homepage sections</CardDescription>
            </div>
            <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
              <DialogTrigger asChild>
                <Button variant="premium">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Section</DialogTitle>
                  <DialogDescription>
                    Create a new section for your homepage
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Title</label>
                    <Input
                      value={newSection.title}
                      onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                      placeholder="e.g., 🚀 Latest Projects"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Type</label>
                    <select 
                      className="w-full p-2 border rounded-lg"
                      value={newSection.type}
                      onChange={(e) => setNewSection({ ...newSection, type: e.target.value })}
                    >
                      <option value="project-grid">Project Grid</option>
                      <option value="text-block">Text Block</option>
                      <option value="image-gallery">Image Gallery</option>
                      <option value="testimonials">Testimonials</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>Cancel</Button>
                    <Button variant="premium" onClick={handleAddSection}>Add Section</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sections.map((section, index) => (
              <div 
                key={section.id} 
                className="p-4 border border-soft-lilac/30 rounded-lg bg-gradient-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium">{section.title}</span>
                    <Badge variant={section.visible ? "default" : "secondary"}>
                      {section.visible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveSection(section.id, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => moveSection(section.id, 'down')}
                      disabled={index === sections.length - 1}
                    >
                      ↓
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleSectionVisibility(section.id)}
                    >
                      {section.visible ? "Hide" : "Show"}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-heading">Content Library</CardTitle>
              <CardDescription>Manage images, documents, and assets</CardDescription>
            </div>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="images" className="space-y-4">
            <TabsList>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            
            <TabsContent value="images">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {assets.filter(a => a.type === 'image').map((asset) => (
                  <div key={asset.id} className="relative group">
                    <div className="aspect-square bg-gradient-hero rounded-lg flex items-center justify-center">
                      <Image className="h-12 w-12 text-royal-purple/30" />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium truncate">{asset.name}</p>
                      <p className="text-xs text-cool-gray">{asset.size}</p>
                    </div>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-white/90">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="aspect-square border-2 border-dashed border-soft-lilac/50 rounded-lg flex items-center justify-center hover:border-royal-purple/50 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-cool-gray mx-auto mb-2" />
                    <p className="text-sm text-cool-gray">Add Image</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="space-y-3">
                {assets.filter(a => a.type === 'document').map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 border border-soft-lilac/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-royal-purple" />
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-sm text-cool-gray">{asset.size} • {asset.uploaded}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="links">
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  <Link className="h-4 w-4 mr-2" />
                  Add External Link
                </Button>
                <p className="text-sm text-cool-gray text-center">
                  No external links added yet
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}