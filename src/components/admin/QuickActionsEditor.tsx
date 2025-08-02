import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, GripVertical, Eye } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface QuickActionsEditorProps {
  value: string[] | string;
  onChange: (actions: string[]) => void;
}

export function QuickActionsEditor({ value, onChange }: QuickActionsEditorProps) {
  const [actions, setActions] = useState<string[]>([]);
  const [newAction, setNewAction] = useState('');

  // Parse the initial value
  useEffect(() => {
    try {
      let parsedActions: string[] = [];
      if (typeof value === 'string') {
        parsedActions = JSON.parse(value);
      } else if (Array.isArray(value)) {
        parsedActions = value;
      }
      setActions(parsedActions || []);
    } catch (error) {
      console.error('Error parsing quick actions:', error);
      setActions([]);
    }
  }, [value]);

  const addAction = () => {
    if (newAction.trim()) {
      const updatedActions = [...actions, newAction.trim()];
      setActions(updatedActions);
      onChange(updatedActions);
      setNewAction('');
    }
  };

  const removeAction = (index: number) => {
    const updatedActions = actions.filter((_, i) => i !== index);
    setActions(updatedActions);
    onChange(updatedActions);
  };

  const updateAction = (index: number, newValue: string) => {
    const updatedActions = actions.map((action, i) => 
      i === index ? newValue : action
    );
    setActions(updatedActions);
    onChange(updatedActions);
  };

  const moveAction = (fromIndex: number, toIndex: number) => {
    const updatedActions = [...actions];
    const [movedItem] = updatedActions.splice(fromIndex, 1);
    updatedActions.splice(toIndex, 0, movedItem);
    setActions(updatedActions);
    onChange(updatedActions);
  };

  const loadTemplate = (template: string[]) => {
    setActions(template);
    onChange(template);
  };

  const templates = {
    'AI Solutions': [
      'Tell me about AI solutions',
      'I need a custom app',
      'Show me AI pricing',
      'Schedule a consultation'
    ],
    'Investment': [
      'Show me investment opportunities',
      'I want to discuss pricing',
      'Tell me about ROI',
      'Schedule a meeting'
    ],
    'E-commerce': [
      'I need an online store',
      'Tell me about e-commerce features',
      'Show me pricing plans',
      'I want a demo'
    ],
    'Support': [
      'I need help',
      'Contact support',
      'Check my order status',
      'Report an issue'
    ]
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Quick Actions Editor
          </CardTitle>
          <CardDescription>
            Manage the quick action buttons that appear in your chat widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Actions */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Current Actions</Label>
            {actions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center border-2 border-dashed rounded-lg">
                No quick actions configured. Add some below.
              </p>
            ) : (
              actions.map((action, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                  <div className="flex-1">
                    <Input
                      value={action}
                      onChange={(e) => updateAction(index, e.target.value)}
                      className="border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAction(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Add New Action */}
          <div className="space-y-2">
            <Label htmlFor="new-action">Add New Action</Label>
            <div className="flex gap-2">
              <Input
                id="new-action"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="Enter a new quick action..."
                onKeyPress={(e) => e.key === 'Enter' && addAction()}
              />
              <Button onClick={addAction} disabled={!newAction.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Templates</CardTitle>
          <CardDescription>
            Load pre-configured action sets for different use cases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(templates).map(([name, template]) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => loadTemplate(template)}
                className="h-auto p-3 flex flex-col items-start gap-1"
              >
                <span className="font-medium">{name}</span>
                <span className="text-xs text-muted-foreground">
                  {template.length} actions
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview</CardTitle>
          <CardDescription>
            How your quick actions will appear in the chat widget
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-4 rounded-lg border">
            <div className="bg-background rounded-lg p-4 shadow-sm max-w-sm">
              <p className="text-sm font-medium mb-3">Quick Actions</p>
              <div className="space-y-2">
                {actions.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    No actions to preview
                  </p>
                ) : (
                  actions.map((action, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="block w-full justify-start p-2 h-auto cursor-pointer hover:bg-primary/10"
                    >
                      {action}
                    </Badge>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}