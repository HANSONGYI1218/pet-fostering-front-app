import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

const DEFAULT_SOCKET_URL = 'http://localhost:4000';

let socket: Socket | null = null;

const resolveSocketUrl = () =>
  process.env.NEXT_PUBLIC_SOCKET_URL?.trim() || DEFAULT_SOCKET_URL;

export const getSocket = (): Socket | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!socket) {
    socket = io(resolveSocketUrl(), {
      transports: ['websocket'],
    });
  }

  return socket;
};

export const resetSocket = () => {
  socket?.disconnect();
  socket = null;
};
