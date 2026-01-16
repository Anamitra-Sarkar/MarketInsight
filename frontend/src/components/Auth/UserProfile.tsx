import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './UserProfile.css';

interface UserProfileProps {
  onLoginClick: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ onLoginClick }) => {
  const { currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = React.useState(false);

  if (!currentUser) {
    return (
      <button className="user-login-btn" onClick={onLoginClick}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
        </svg>
        <span>Login / Sign Up</span>
      </button>
    );
  }

  const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="user-profile">
      <button 
        className="user-profile-btn" 
        onClick={() => setShowMenu(!showMenu)}
        aria-label="User menu"
      >
        {currentUser.photoURL ? (
          <img src={currentUser.photoURL} alt={displayName} className="user-avatar" />
        ) : (
          <div className="user-avatar-placeholder">{initials}</div>
        )}
        <div className="user-info">
          <span className="user-name">{displayName}</span>
          <span className="user-email">{currentUser.email}</span>
        </div>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className={`user-menu-icon ${showMenu ? 'open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {showMenu && (
        <>
          <div className="user-menu-backdrop" onClick={() => setShowMenu(false)} />
          <div className="user-menu">
            <button className="user-menu-item" onClick={logout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfile;
