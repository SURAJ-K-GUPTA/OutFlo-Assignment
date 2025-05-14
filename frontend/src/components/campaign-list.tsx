import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CampaignForm } from './campaign-form';
import type { Campaign } from '../types';
import { campaignApi } from '../services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from './ui/dialog';

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignUpdate: () => void;
}

export function CampaignList({ campaigns, onCampaignUpdate }: CampaignListProps) {
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Campaign | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsLoading(true);
    try {
      await campaignApi.delete(deleteTarget._id);
      setDeleteTarget(null);
      onCampaignUpdate();
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusToggle = async (campaign: Campaign) => {
    setIsLoading(true);
    try {
      await campaignApi.update(campaign._id, {
        status: campaign.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
      });
      onCampaignUpdate();
    } catch (error) {
      console.error('Failed to update campaign status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (editingCampaign) {
    return (
      <div className="max-w-xl w-full mx-auto px-2 sm:px-0">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Edit Campaign</h2>
        <CampaignForm
          initialData={editingCampaign}
          onSubmit={async (data) => {
            setIsLoading(true);
            try {
              await campaignApi.update(editingCampaign._id, data);
              setEditingCampaign(null);
              onCampaignUpdate();
            } catch (error) {
              console.error('Failed to update campaign:', error);
            } finally {
              setIsLoading(false);
            }
          }}
          isLoading={isLoading}
        />
        <Button
          variant="outline"
          className="mt-4 w-full sm:w-auto"
          onClick={() => setEditingCampaign(null)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-xl mx-auto px-2 sm:px-0">
      {campaigns.map((campaign) => (
        <Card key={campaign._id} className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <CardTitle className="text-lg sm:text-xl">{campaign.name}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{campaign.description}</p>
              </div>
              <Badge
                variant={campaign.status === 'ACTIVE' ? 'default' : 'secondary'}
                className="mt-2 sm:mt-0"
              >
                {campaign.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 overflow-x-auto">
              <h4 className="font-medium">LinkedIn Leads:</h4>
              <ul className="list-disc list-inside">
                {campaign.leads.map((lead, index) => (
                  <li key={index} className="text-sm break-all">
                    <a
                      href={lead}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {lead}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
              <Button
                variant="outline"
                onClick={() => handleStatusToggle(campaign)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {campaign.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingCampaign(campaign)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                onClick={() => setDeleteTarget(campaign)}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-semibold">{deleteTarget?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 