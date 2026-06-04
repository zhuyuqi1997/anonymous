export type Page = 'home' | 'rooms' | 'lobby' | 'active' | 'history' | 'profile';

export interface Industry {
  id: string;
  name: string;
  icon: string;
  color: string;
  gradient: string;
}

export interface Room {
  id: string;
  industryId: string;
  name: string;
  description: string;
  maxParticipants: number;
  currentParticipants: number;
  duration: number; // minutes
  status: 'waiting' | 'active' | 'ended';
  tags: string[];
  participants: Participant[];
}

export interface Participant {
  id: string;
  avatar: string;
  nickname: string;
  isSpeaking: boolean;
  joinedAt: number;
}

export interface UserHistory {
  id: string;
  roomName: string;
  industry: string;
  date: string;
  duration: number;
  rating: number;
}
