import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import UserProfile from './Auth/UserProfile';
import ChatHistory from './Auth/ChatHistory';
import AuthModal from './Auth/AuthModal';
import { useAuth } from '../contexts/AuthContext';
import './SidebarInjector.css';

// Component that will be injected into the sidebar
const SidebarContent: React.FC<{ onLoginClick: () => void; currentUser: any }> = ({ onLoginClick, currentUser }) => {
  return (
    <div className="sidebar-auth-content">
      <UserProfile onLoginClick={onLoginClick} />
      {currentUser && <ChatHistory />}
    </div>
  );
};

const SidebarInjector: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  const rootRef = useRef<Root | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;
    let injectionInterval: number;

    const injectAuthUI = () => {
      if (attempts >= maxAttempts) {
        clearInterval(injectionInterval);
        return;
      }
      
      attempts++;

      // Skip if already injected
      if (containerRef.current && document.body.contains(containerRef.current)) {
        clearInterval(injectionInterval);
        return;
      }

      // Look for various sidebar elements used by chat UIs
      const possibleSelectors = [
        // Look for common sidebar patterns
        '[class*="sidebar" i]',
        '[class*="drawer" i]',
        '[class*="menu" i]',
        '[class*="nav" i]',
        'aside',
        'nav[role="navigation"]',
        // Look for C1Chat specific patterns
        '[class*="chat"][class*="sidebar" i]',
        '[class*="c1"][class*="sidebar" i]',
      ];

      for (const selector of possibleSelectors) {
        try {
          const elements = document.querySelectorAll(selector);
          
          for (const element of Array.from(elements)) {
            const el = element as HTMLElement;
            
            // Skip if already has our custom auth
            if (el.querySelector('#custom-sidebar-auth')) {
              continue;
            }

            // Check if this looks like a sidebar
            const rect = el.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(el);
            
            const isSidebarLike = (
              // Has reasonable dimensions
              (rect.width > 150 && rect.width < 600 && rect.height > 300) ||
              // Or is positioned like a sidebar
              (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') ||
              // Or has typical sidebar styling
              (el.offsetHeight > 400)
            );

            if (isSidebarLike) {
              // Create container for our custom UI
              const container = document.createElement('div');
              container.id = 'custom-sidebar-auth';
              container.className = 'custom-sidebar-auth';
              
              // Insert at the beginning of sidebar
              if (el.firstChild) {
                el.insertBefore(container, el.firstChild);
              } else {
                el.appendChild(container);
              }

              containerRef.current = container;

              // Render React component into the container
              if (!rootRef.current) {
                rootRef.current = createRoot(container);
              }
              
              rootRef.current.render(
                <SidebarContent 
                  onLoginClick={() => setShowAuthModal(true)} 
                  currentUser={currentUser}
                />
              );

              clearInterval(injectionInterval);
              return;
            }
          }
        } catch (error) {
          console.error('Error injecting auth UI:', error);
        }
      }
    };

    // Try to inject every 250ms for up to 5 seconds
    injectionInterval = setInterval(injectAuthUI, 250);
    
    // Also try immediately
    injectAuthUI();

    return () => {
      clearInterval(injectionInterval);
      if (rootRef.current && containerRef.current) {
        try {
          rootRef.current.unmount();
        } catch (error) {
          console.error('Error unmounting auth UI:', error);
        }
        rootRef.current = null;
      }
    };
  }, []);

  // Re-render sidebar content when user state changes
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.render(
        <SidebarContent 
          onLoginClick={() => setShowAuthModal(true)} 
          currentUser={currentUser}
        />
      );
    }
  }, [currentUser]);

  // Render the modal
  return <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />;
};

export default SidebarInjector;
