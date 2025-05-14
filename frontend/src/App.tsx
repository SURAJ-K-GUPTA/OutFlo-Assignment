import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { CampaignForm } from './components/campaign-form';
import { CampaignList } from './components/campaign-list';
import { MessageGenerator } from './components/message-generator';
import type { Campaign } from './types';
import { campaignApi } from './services/api';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchCampaigns = async () => {
    try {
      const data = await campaignApi.getAll();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (data: Omit<Campaign, '_id'>) => {
    setIsLoading(true);
    try {
      await campaignApi.create(data);
      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-background px-2 sm:px-4 md:px-8 py-4 sm:py-8">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Outflo Campaign Manager</h1>

      {error && (
        <div className="p-4 mb-4 text-red-500 bg-red-50 rounded-md w-full max-w-xl mx-auto text-center">
          {error}
        </div>
      )}

      <Tabs defaultValue="campaigns" className="w-full max-w-3xl flex flex-col items-center">
        <TabsList className="flex justify-center w-full">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="message">Message Generator</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6 w-full">
          <div className="mx-auto w-full max-w-xl px-2 sm:px-0">
            <div className="mb-8">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl">Create New Campaign</CardTitle>
                </CardHeader>
                <CardContent>
                  <CampaignForm onSubmit={handleCreateCampaign} isLoading={isLoading} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">Your Campaigns</h2>
              {isLoading ? (
                <p className="text-center">Loading campaigns...</p>
              ) : (
                <CampaignList
                  campaigns={campaigns}
                  onCampaignUpdate={fetchCampaigns}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="message" className="mx-auto w-full max-w-xl px-2 sm:px-0">
          <MessageGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
