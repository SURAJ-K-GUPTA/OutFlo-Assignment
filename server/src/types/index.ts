import { Types } from 'mongoose';

export type CampaignStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED';

export interface ICampaign {
  name: string;
  description: string;
  status: CampaignStatus;
  leads: string[];
  accountIDs: Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILinkedInProfile {
  name: string;
  job_title: string;
  company: string;
  location: string;
  summary: string;
}

export interface IMessageResponse {
  message: string;
} 