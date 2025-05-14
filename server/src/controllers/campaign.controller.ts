import { Request, Response } from 'express';
import { Campaign } from '../models/campaign.model';
import { ICampaign } from '../types';

export const campaignController = {
  // Get all campaigns (excluding DELETED)
  getAllCampaigns: async (req: Request, res: Response) => {
    try {
      const campaigns = await Campaign.find({ status: { $ne: 'DELETED' } });
      res.json(campaigns);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaigns', error });
    }
  },

  // Get single campaign by ID
  getCampaignById: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findOne({
        _id: req.params.id,
        status: { $ne: 'DELETED' },
      });
      
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      res.json(campaign);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching campaign', error });
    }
  },

  // Create new campaign
  createCampaign: async (req: Request, res: Response) => {
    try {
      const campaignData: ICampaign = req.body;
      const campaign = new Campaign(campaignData);
      await campaign.save();
      res.status(201).json(campaign);
    } catch (error) {
      res.status(400).json({ message: 'Error creating campaign', error });
    }
  },

  // Update campaign
  updateCampaign: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Ensure status is either ACTIVE or INACTIVE
      if (updateData.status && !['ACTIVE', 'INACTIVE'].includes(updateData.status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }

      const campaign = await Campaign.findOneAndUpdate(
        { _id: id, status: { $ne: 'DELETED' } },
        updateData,
        { new: true, runValidators: true }
      );

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      res.json(campaign);
    } catch (error) {
      res.status(400).json({ message: 'Error updating campaign', error });
    }
  },

  // Soft delete campaign
  deleteCampaign: async (req: Request, res: Response) => {
    try {
      const campaign = await Campaign.findOneAndUpdate(
        { _id: req.params.id, status: { $ne: 'DELETED' } },
        { status: 'DELETED' },
        { new: true }
      );

      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }

      res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting campaign', error });
    }
  },
}; 