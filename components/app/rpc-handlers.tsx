'use client';

import { useFaceAnimationRpc } from '@/hooks/use-face-animation-rpc';

/**
 * Component that initializes all RPC handlers for the application.
 * This should be rendered inside the session context when connected.
 */
export function RpcHandlers() {
  // Register face animation RPC handler
  useFaceAnimationRpc();

  // Future: add other RPC handlers here
  // useWaveArmRpc();

  return null;
}
