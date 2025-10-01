import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { quoteManager, QuoteLineItem } from "@/utils/quoteManager";
import { toast } from "sonner";
import { Plus, Trash2, Send } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface QuoteGeneratorProps {
  leadId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const QuoteGenerator = ({ leadId, onSuccess, onCancel }: QuoteGeneratorProps) => {
  const [formData, setFormData] = useState({
    project_name: "",
    project_description: "",
    terms_and_conditions: "Payment terms: 50% upfront, 50% on completion.\nDelivery timeline will be confirmed upon acceptance.\nThis quote is valid for 30 days.",
    notes: "",
    valid_until: undefined as Date | undefined,
    discount_amount: 0,
    tax_rate: 0.1, // 10% default tax
  });

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unit_price: 0,
      total: 0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unit_price: 0,
        total: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof QuoteLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unit_price") {
            updated.total = updated.quantity * updated.unit_price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const totals = quoteManager.calculateQuoteTotals(
    lineItems,
    formData.discount_amount,
    formData.tax_rate
  );

  const handleSubmit = async (e: React.FormEvent, sendImmediately = false) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const quote = await quoteManager.createQuote({
        lead_id: leadId,
        project_name: formData.project_name,
        project_description: formData.project_description,
        line_items: lineItems,
        subtotal: totals.subtotal,
        tax: totals.tax,
        total: totals.total,
        discount_amount: formData.discount_amount,
        status: sendImmediately ? "sent" : "draft",
        valid_until: formData.valid_until?.toISOString(),
        terms_and_conditions: formData.terms_and_conditions,
        notes: formData.notes,
        sent_at: sendImmediately ? new Date().toISOString() : undefined,
      });

      if (quote) {
        toast.success(sendImmediately ? "Quote created and sent!" : "Quote created successfully!");
        onSuccess?.();
      } else {
        toast.error("Failed to create quote");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      toast.error("An error occurred while creating the quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project_name">Project Name *</Label>
            <Input
              id="project_name"
              value={formData.project_name}
              onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project_description">Project Description</Label>
            <Textarea
              id="project_description"
              value={formData.project_description}
              onChange={(e) => setFormData({ ...formData, project_description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Valid Until</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.valid_until ? format(formData.valid_until, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.valid_until}
                  onSelect={(date) => setFormData({ ...formData, valid_until: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" size="sm" onClick={addLineItem}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineItems.map((item) => (
            <div key={item.id} className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div className="w-24 space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="w-32 space-y-2">
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(item.id, "unit_price", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="w-32 space-y-2">
                <Label>Total</Label>
                <Input value={`$${item.total.toFixed(2)}`} disabled />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => removeLineItem(item.id)}
                disabled={lineItems.length === 1}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Discount Amount</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                step="0.01"
                value={formData.discount_amount}
                onChange={(e) => setFormData({ ...formData, discount_amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_rate">Tax Rate (%)</Label>
              <Input
                id="tax_rate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={formData.tax_rate * 100}
                onChange={(e) => setFormData({ ...formData, tax_rate: (parseFloat(e.target.value) || 0) / 100 })}
              />
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Tax ({(formData.tax_rate * 100).toFixed(1)}%):</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Terms & Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="terms">Terms and Conditions</Label>
            <Textarea
              id="terms"
              value={formData.terms_and_conditions}
              onChange={(e) => setFormData({ ...formData, terms_and_conditions: e.target.value })}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Internal Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              placeholder="Internal notes (not visible to client)"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          type="button"
          variant="outline"
          onClick={(e) => handleSubmit(e, false)}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        <Button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={isSubmitting}
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Creating..." : "Create & Send"}
        </Button>
      </div>
    </div>
  );
};
