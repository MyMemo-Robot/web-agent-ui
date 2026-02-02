'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { LiveKitCredentials } from '@/hooks/use-livekit-credentials';

interface CredentialsFormProps {
  initialCredentials?: LiveKitCredentials | null;
  onSave: (credentials: LiveKitCredentials) => void;
  onCancel?: () => void;
}

export function CredentialsForm({ initialCredentials, onSave, onCancel }: CredentialsFormProps) {
  const [url, setUrl] = useState(initialCredentials?.url ?? '');
  const [apiKey, setApiKey] = useState(initialCredentials?.apiKey ?? '');
  const [apiSecret, setApiSecret] = useState(initialCredentials?.apiSecret ?? '');
  const [showSecret, setShowSecret] = useState(false);
  const [errors, setErrors] = useState<{ url?: string; apiKey?: string; apiSecret?: string }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!url.startsWith('wss://') && !url.startsWith('ws://')) {
      newErrors.url = 'URL must start with wss:// or ws://';
    }

    if (!apiKey.trim()) {
      newErrors.apiKey = 'API Key is required';
    }

    if (!apiSecret.trim()) {
      newErrors.apiSecret = 'API Secret is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        url: url.trim(),
        apiKey: apiKey.trim(),
        apiSecret: apiSecret.trim(),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="livekit-url" className="text-sm font-medium">
          LiveKit URL
        </label>
        <Input
          id="livekit-url"
          type="text"
          placeholder="wss://your-app.livekit.cloud"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-invalid={!!errors.url}
        />
        {errors.url && <p className="text-destructive text-xs">{errors.url}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="api-key" className="text-sm font-medium">
          API Key
        </label>
        <Input
          id="api-key"
          type="text"
          placeholder="APIxxxxxxxxxx"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          aria-invalid={!!errors.apiKey}
        />
        {errors.apiKey && <p className="text-destructive text-xs">{errors.apiKey}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="api-secret" className="text-sm font-medium">
          API Secret
        </label>
        <div className="relative">
          <Input
            id="api-secret"
            type={showSecret ? 'text' : 'password'}
            placeholder="Your API Secret"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            aria-invalid={!!errors.apiSecret}
            className="pr-16"
          />
          <button
            type="button"
            onClick={() => setShowSecret(!showSecret)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs"
          >
            {showSecret ? 'Hide' : 'Show'}
          </button>
        </div>
        {errors.apiSecret && <p className="text-destructive text-xs">{errors.apiSecret}</p>}
      </div>

      <div className="mt-2 flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1">
          Save
        </Button>
      </div>
    </form>
  );
}
