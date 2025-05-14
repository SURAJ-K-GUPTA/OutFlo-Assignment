# Outflo Backend Server

This is the backend server for the Outflo application, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Campaign Management (CRUD operations)
- LinkedIn Personalized Message Generation
- MongoDB Integration
- TypeScript Support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- OpenAI API Key

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/outflo
OPENAI_API_KEY=your_openai_api_key_here
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development with hot-reload:
```bash
npm run dev
```

## API Endpoints

### Campaign Endpoints

- `GET /api/campaigns` - Get all active campaigns
- `GET /api/campaigns/:id` - Get a specific campaign
- `POST /api/campaigns` - Create a new campaign
- `PUT /api/campaigns/:id` - Update a campaign
- `DELETE /api/campaigns/:id` - Soft delete a campaign

### Message Generation Endpoint

- `POST /api/personalized-message` - Generate a personalized LinkedIn message

## Example Requests

### Create Campaign
```json
POST /api/campaigns
{
  "name": "Campaign 1",
  "description": "this is a campaign to find leads",
  "status": "ACTIVE",
  "leads": [
    "https://linkedin.com/in/profile-1",
    "https://linkedin.com/in/profile-2"
  ],
  "accountIDs": ["123", "456"]
}
```

### Generate Personalized Message
```json
POST /api/personalized-message
{
  "name": "John Doe",
  "job_title": "Software Engineer",
  "company": "TechCorp",
  "location": "San Francisco, CA",
  "summary": "Experienced in AI & ML..."
}
``` 