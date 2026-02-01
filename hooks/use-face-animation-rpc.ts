'use client';

import { useEffect } from 'react';
import type { RpcInvocationData } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';
import {
  FACE_ANIMATIONS,
  type FaceAnimation,
  type PlayFaceAnimationPayload,
  type PlayFaceAnimationResponse,
  RPC_PLAY_FACE_ANIMATION,
} from '@/lib/face-animation/types';
import { useFaceAnimation } from './use-face-animation-context';

export function useFaceAnimationRpc() {
  const room = useRoomContext();
  const { setAnimation } = useFaceAnimation();

  useEffect(() => {
    if (!room?.localParticipant) {
      return;
    }

    // Handler for incoming face animation RPC calls
    const handleFaceAnimationRpc = async (data: RpcInvocationData): Promise<string> => {
      try {
        const payload: PlayFaceAnimationPayload = JSON.parse(data.payload);

        console.log(`[RPC] Received face animation: ${payload.animation}`, {
          requestId: data.requestId,
          caller: data.callerIdentity,
          duration: payload.duration,
        });

        // Validate animation type
        if (!FACE_ANIMATIONS.includes(payload.animation as FaceAnimation)) {
          const response: PlayFaceAnimationResponse = {
            success: false,
            message: `Invalid animation type: ${payload.animation}`,
            animation_played: null,
            error_code: 1400, // UNSUPPORTED_METHOD or similar
          };
          return JSON.stringify(response);
        }

        // Update the face animation state
        setAnimation(payload.animation, payload.duration);

        // Return success response (JSON string)
        const response: PlayFaceAnimationResponse = {
          success: true,
          message: `Animation '${payload.animation}' started`,
          animation_played: payload.animation,
          error_code: null,
        };

        return JSON.stringify(response);
      } catch (error) {
        console.error('[RPC] Error handling face animation:', error);

        const response: PlayFaceAnimationResponse = {
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error',
          animation_played: null,
          error_code: 1500, // APPLICATION_ERROR
        };

        return JSON.stringify(response);
      }
    };

    // Register the RPC method
    room.registerRpcMethod(RPC_PLAY_FACE_ANIMATION, handleFaceAnimationRpc);

    console.log(`[RPC] Registered handler for ${RPC_PLAY_FACE_ANIMATION}`);

    // Cleanup: unregister on unmount
    return () => {
      room.unregisterRpcMethod(RPC_PLAY_FACE_ANIMATION);
      console.log(`[RPC] Unregistered handler for ${RPC_PLAY_FACE_ANIMATION}`);
    };
  }, [room, setAnimation]);
}
