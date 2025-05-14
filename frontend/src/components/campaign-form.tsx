import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import type { Campaign } from '../types';

interface CampaignFormProps {
  initialData?: Partial<Campaign>;
  onSubmit: (data: Omit<Campaign, '_id'>) => Promise<void>;
  isLoading?: boolean;
}

export function CampaignForm({ initialData, onSubmit, isLoading }: CampaignFormProps) {
  const [formData, setFormData] = useState<Omit<Campaign, '_id'>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'ACTIVE',
    leads: initialData?.leads || [''],
    accountIDs: initialData?.accountIDs || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleLeadChange = (index: number, value: string) => {
    const newLeads = [...formData.leads];
    newLeads[index] = value;
    setFormData({ ...formData, leads: newLeads });
  };

  const addLeadField = () => {
    setFormData({ ...formData, leads: [...formData.leads, ''] });
  };

  const removeLeadField = (index: number) => {
    const newLeads = formData.leads.filter((_, i) => i !== index);
    setFormData({ ...formData, leads: newLeads });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 px-0 sm:px-2 md:px-4">
      <div className="space-y-2">
        <Label htmlFor="name">Campaign Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status === 'ACTIVE'}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, status: checked ? 'ACTIVE' : 'INACTIVE' })
          }
        />
        <Label htmlFor="status">
          {formData.status === 'ACTIVE' ? 'Active' : 'Inactive'}
        </Label>
      </div>

      <div className="space-y-2">
        <Label>LinkedIn Leads</Label>
        {formData.leads.map((lead, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-2">
            <Input
              value={lead}
              onChange={(e) => handleLeadChange(index, e.target.value)}
              placeholder="https://linkedin.com/in/username"
              required
              className="w-full"
            />
            {formData.leads.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeLeadField(index)}
                className="w-full sm:w-auto"
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addLeadField} className="w-full sm:w-auto">
          Add Lead
        </Button>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? 'Saving...' : initialData ? 'Update Campaign' : 'Create Campaign'}
      </Button>
    </form>
  );
} 