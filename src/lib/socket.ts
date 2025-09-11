// lib/socket.ts
import { io } from 'socket.io-client';

// .env.local에 서버 주소를 넣어주세요
// NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
export const socket = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000',
  {
    transports: ['websocket'],
  },
);
