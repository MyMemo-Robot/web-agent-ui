import { WarningIcon } from '@phosphor-icons/react/dist/ssr';
import { AnimationsGrid } from '@/components/face-animations/animations-grid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function checkLiveKitConfig(): { isConfigured: boolean; missingVars: string[] } {
  const missingVars: string[] = [];

  if (!process.env.LIVEKIT_URL) {
    missingVars.push('LIVEKIT_URL');
  }
  if (!process.env.LIVEKIT_API_KEY) {
    missingVars.push('LIVEKIT_API_KEY');
  }
  if (!process.env.LIVEKIT_API_SECRET) {
    missingVars.push('LIVEKIT_API_SECRET');
  }

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
  };
}

export default function FaceAnimationsPage() {
  const { isConfigured, missingVars } = checkLiveKitConfig();

  if (!isConfigured) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <WarningIcon className="h-4 w-4" />
          <AlertTitle>Configuration Required</AlertTitle>
          <AlertDescription>
            <p className="mb-2">
              The following environment variables must be set to view this page:
            </p>
            <ul className="list-inside list-disc space-y-1 font-mono text-xs">
              {missingVars.map((varName) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="min-h-svh p-6 pt-20">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">Face Animations</h1>
          <p className="text-muted-foreground">All available agent face animations</p>
        </header>
        <AnimationsGrid />
      </div>
    </main>
  );
}
