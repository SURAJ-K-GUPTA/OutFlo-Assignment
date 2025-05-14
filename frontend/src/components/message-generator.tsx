import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import type { LinkedInProfile } from '../types';
import { messageApi } from '../services/api';

const LOCAL_STORAGE_KEY = 'messageGeneratorFormData';

const emptyProfile: LinkedInProfile = {
  name: '',
  job_title: '',
  company: '',
  location: '',
  summary: '',
};

function getInitialProfile() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  return emptyProfile;
}

export function MessageGenerator() {
  const [profile, setProfile] = useState<LinkedInProfile>(getInitialProfile);
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await messageApi.generateMessage(profile);
      setMessage(response.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setProfile(emptyProfile);
    setMessage('');
    setError('');
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 px-2 sm:px-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg sm:text-2xl">LinkedIn Message Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job_title">Job Title</Label>
              <Input
                id="job_title"
                value={profile.job_title}
                onChange={(e) => setProfile({ ...profile, job_title: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={profile.company}
                onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={profile.summary}
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                required
                rows={4}
                className="w-full"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? 'Generating...' : 'Generate Message'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 text-red-500 bg-red-50 rounded-md w-full text-center">
          {error}
        </div>
      )}

      {message && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Generated Message</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{message}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 