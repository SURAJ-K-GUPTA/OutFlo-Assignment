import type { Campaign, LinkedInProfile, MessageResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Campaign APIs
export const campaignApi = {
  getAll: async (): Promise<Campaign[]> => {
    const response = await fetch(`${API_URL}/campaigns`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaigns');
    }
    return response.json();
  },

  getById: async (id: string): Promise<Campaign> => {
    const response = await fetch(`${API_URL}/campaigns/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch campaign');
    }
    return response.json();
  },

  create: async (campaign: Omit<Campaign, '_id'>): Promise<Campaign> => {
    const response = await fetch(`${API_URL}/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });
    if (!response.ok) {
      throw new Error('Failed to create campaign');
    }
    return response.json();
  },

  update: async (id: string, campaign: Partial<Campaign>): Promise<Campaign> => {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(campaign),
    });
    if (!response.ok) {
      throw new Error('Failed to update campaign');
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/campaigns/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete campaign');
    }
  },
};

// Message Generation API
export const messageApi = {
  generateMessage: async (profile: LinkedInProfile): Promise<MessageResponse> => {
    const response = await fetch(`${API_URL}/personalized-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error('Failed to generate message');
    }
    return response.json();
  },
}; 