
import { io } from 'socket.io-client';

const socket = io('http://10.0.2.2:8000', {
  transports: ['websocket'],
  forceNew: true,
  reconnection: true,
});

export default socket;
