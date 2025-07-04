import axios from 'axios';
import { HTTP_URL } from '@/config';

export async function getExistingShapes(roomId: string) {
  try {
    const res = await axios.get(`${HTTP_URL}/api/v1/chats/${roomId}`);
    const messages = res.data;

    return messages.map((x: { message: string }) => {
      try {
        return JSON.parse(x.message).shape;
      } catch (err) {
        console.warn("Invalid shape message:", x.message);
        return null;
      }
    }).filter(Boolean); 
  } catch (err) {
    console.error("Failed to fetch shapes:", err);
    return [];
  }
}
