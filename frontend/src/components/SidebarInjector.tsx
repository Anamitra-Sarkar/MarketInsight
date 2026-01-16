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

  useEffect(() => {
    let isInjected = false;
    let retryCount = 0;
    const maxRetries = 10;

    const injectAuthUI = () => {
      if (isInjected || retryCount >= maxRetries) return;
      retryCount++;

      // Look for the sidebar in C1Chat
      const selectors = [
        '[class*="sidebar"]',
        '[class*="Sidebar"]',
        '[class*="drawer"]',
        '[class*="Drawer"]',
        'aside',
        'nav'
      ];

      let sidebar: HTMLElement | null = null;

      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const el = element as HTMLElement;
          const computedStyle = window.getComputedStyle(el);
          
          // Check if this looks like a sidebar
          if (el.offsetHeight > 200 && 
              (computedStyle.position === 'fixed' || 
               computedStyle.position === 'absolute' ||
               el.offsetWidth < 500)) {
            sidebar = el;
            break;
          }
        }
        if (sidebar) break;
      }

      if (sidebar && !document.getElementById('custom-sidebar-auth')) {
        // Create container for our custom UI
        const container = document.createElement('div');
        container.id = 'custom-sidebar-auth';
        container.className = 'custom-sidebar-auth';
        
        // Insert at the beginning of sidebar
        if (sidebar.firstChild) {
          sidebar.insertBefore(container, sidebar.firstChild);
        } else {
          sidebar.appendChild(container);
        }

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

        isInjected = true;
      }
    };

    // Try multiple times with delays
    const timeouts = [500, 1000, 1500, 2000, 3000, 4000, 5000].map(delay => 
      setTimeout(injectAuthUI, delay)
    );

    // Also watch for DOM changes
    const observer = new MutationObserver(() => {
      if (!isInjected) {
        injectAuthUI();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      observer.disconnect();
      if (rootRef.current) {
        rootRef.current.unmount();
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
