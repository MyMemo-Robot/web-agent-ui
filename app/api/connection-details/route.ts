import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import { RoomConfiguration } from '@livekit/protocol';

type ConnectionDetails = {
  serverUrl: string;
  roomName: string;
  participantName: string;
  participantToken: string;
};

// Environment variables as fallback
const ENV_API_KEY = process.env.LIVEKIT_API_KEY;
const ENV_API_SECRET = process.env.LIVEKIT_API_SECRET;
const ENV_LIVEKIT_URL = process.env.LIVEKIT_URL;

// don't cache the results
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const agentName: string = body?.room_config?.agents?.[0]?.agent_name;

    // Use credentials from request body, fall back to env vars
    const livekitUrl = body?.credentials?.url || ENV_LIVEKIT_URL;
    const apiKey = body?.credentials?.apiKey || ENV_API_KEY;
    const apiSecret = body?.credentials?.apiSecret || ENV_API_SECRET;

    if (!livekitUrl) {
      throw new Error('LIVEKIT_URL is not defined');
    }
    if (!apiKey) {
      throw new Error('LIVEKIT_API_KEY is not defined');
    }
    if (!apiSecret) {
      throw new Error('LIVEKIT_API_SECRET is not defined');
    }

    // Generate participant token
    const participantName = 'user';
    const participantIdentity = 'robot-client';
    const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;

    const participantToken = await createParticipantToken(
      { identity: participantIdentity, name: participantName },
      roomName,
      agentName,
      apiKey,
      apiSecret
    );

    // Return connection details
    const data: ConnectionDetails = {
      serverUrl: livekitUrl,
      roomName,
      participantToken: participantToken,
      participantName,
    };
    const headers = new Headers({
      'Cache-Control': 'no-store',
    });
    return NextResponse.json(data, { headers });
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return new NextResponse(error.message, { status: 500 });
    }
  }
}

function createParticipantToken(
  userInfo: AccessTokenOptions,
  roomName: string,
  agentName: string | undefined,
  apiKey: string,
  apiSecret: string
): Promise<string> {
  const at = new AccessToken(apiKey, apiSecret, {
    ...userInfo,
    ttl: '15m',
  });
  const grant: VideoGrant = {
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  };
  at.addGrant(grant);

  if (agentName) {
    at.roomConfig = new RoomConfiguration({
      agents: [{ agentName }],
    });
  }

  return at.toJwt();
}
