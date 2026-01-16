import React, { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import type { ChatSession } from '../../types/auth';
import './ChatHistory.css';

interface ChatHistoryProps {
  onChatSelect?: (sessionId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onChatSelect }) => {
  const { currentUser } = useAuth();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setChatSessions([]);
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'chatSessions'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessions: ChatSession[] = [];
        snapshot.forEach((doc) => {
          sessions.push({ id: doc.id, ...doc.data() } as ChatSession);
        });
        setChatSessions(sessions);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching chat sessions:', error);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up chat history listener:', error);
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  if (loading) {
    return (
      <div className="chat-history">
        <h3 className="chat-history-title">Recent Chats</h3>
        <div className="chat-history-loading">Loading...</div>
      </div>
    );
  }

  if (chatSessions.length === 0) {
    return (
      <div className="chat-history">
        <h3 className="chat-history-title">Recent Chats</h3>
        <div className="chat-history-empty">
          <p>No chat history yet</p>
          <span>Start a conversation to see it here</span>
        </div>
      </div>
    );
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const truncateText = (text: string, maxLength: number = 60) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="chat-history">
      <h3 className="chat-history-title">Recent Chats</h3>
      <div className="chat-history-list">
        {chatSessions.map((session) => (
          <button
            key={session.id}
            className="chat-history-item"
            onClick={() => onChatSelect?.(session.id)}
            title={session.title || session.lastMessage}
          >
            <div className="chat-history-item-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <div className="chat-history-item-content">
              <span className="chat-history-item-title">
                {truncateText(session.title || session.lastMessage || 'New Chat')}
              </span>
              <span className="chat-history-item-time">
                {formatTimestamp(session.timestamp)}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;

// Helper function to save chat session
export const saveChatSession = async (
  userId: string,
  message: string,
  response?: string
) => {
  try {
    const chatData = {
      userId,
      title: message.substring(0, 100),
      lastMessage: message,
      timestamp: Date.now(),
      messages: [{
        id: Date.now().toString(),
        userId,
        message,
        timestamp: Date.now(),
        response
      }]
    };

    await addDoc(collection(db, 'chatSessions'), chatData);
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};
