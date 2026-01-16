export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  timestamp: number;
  response?: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  timestamp: number;
  lastMessage?: string;
  messages: ChatMessage[];
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}
