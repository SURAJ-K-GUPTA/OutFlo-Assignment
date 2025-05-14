import mongoose, { Schema } from 'mongoose';
import { ICampaign } from '../types';

const campaignSchema = new Schema<ICampaign>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'DELETED'],
      default: 'ACTIVE',
    },
    leads: [{
      type: String,
      required: true,
    }],
    accountIDs: [{
      type: Schema.Types.ObjectId,
      required: false,
    }],
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
campaignSchema.index({ status: 1 });

export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema); 