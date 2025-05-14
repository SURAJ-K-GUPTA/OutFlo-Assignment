import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import type { Campaign, CampaignStatus } from '../types';

const LOCAL_STORAGE_KEY = 'campaignFormData';

interface CampaignFormProps {
  initialData?: Partial<Campaign>;
  onSubmit: (data: Omit<Campaign, '_id'>) => Promise<void>;
  isLoading?: boolean;
}

const defaultFormData: Omit<Campaign, '_id'> = {
  name: '',
  description: '',
  status: 'ACTIVE',
  leads: [''],
  accountIDs: [],
};

function getInitialFormData() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return defaultFormData;
}

export function CampaignForm({ initialData, onSubmit, isLoading }: CampaignFormProps) {
  const [formData, setFormData] = useState<Omit<Campaign, '_id'>>(getInitialFormData);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

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

  const handleClear = () => {
    setFormData({ ...defaultFormData, leads: [''] });
    localStorage.removeItem(LOCAL_STORAGE_KEY);
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
            setFormData({ ...formData, status: checked ? 'ACTIVE' : 'INACTIVE' as CampaignStatus })
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

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Saving...' : initialData ? 'Update Campaign' : 'Create Campaign'}
        </Button>
        <Button type="button" variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
          Clear Form
        </Button>
      </div>
    </form>
  );
} 