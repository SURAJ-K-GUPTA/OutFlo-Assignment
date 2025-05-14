import { Request, Response } from 'express';
import OpenAI from 'openai';
import { ILinkedInProfile, IMessageResponse } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const messageController = {
  generatePersonalizedMessage: async (req: Request, res: Response) => {
    try {
      const profile: ILinkedInProfile = req.body;

      const prompt = `Generate a personalized LinkedIn outreach message for the following profile:
        Name: ${profile.name}
        Job Title: ${profile.job_title}
        Company: ${profile.company}
        Location: ${profile.location}
        Summary: ${profile.summary}

        The message should be:
        1. Professional but conversational
        2. Reference their specific role and company
        3. Mention how Outflo can help with their outreach and sales
        4. Keep it concise (2-3 sentences)
        5. End with a call to connect`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 150,
      });

      const message = completion.choices[0]?.message?.content || '';

      const response: IMessageResponse = {
        message: message.trim(),
      };

      res.json(response);
    } catch (error) {
      console.error('Error generating message:', error);
      res.status(500).json({ 
        message: 'Error generating personalized message',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  },
}; 