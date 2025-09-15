import React from 'react';
import styled from 'styled-components';
import { ErrorBoundary } from 'react-error-boundary';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet';
import { useRouter } from 'next/router';
import { 
  FaPlane, 
  FaUser, 
  FaCog, 
  FaChartBar, 
  FaSignOutAlt,
  FaBell,
  FaHome
} from 'react-icons/fa';
import { User, Flight } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  user?: User | null;
  currentFlight?: Flight | null;
  title?: string;
  showNavigation?: boolean;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2d3748;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const FlightInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #4a5568;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FlightNumber = styled.span`
  font-weight: bold;
  color: #2d3748;
`;

const Route = styled.span`
  color: #718096;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #4a5568;
`;

const Navigation = styled.nav`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: center;
  gap: 2rem;
  position: sticky;
  top: 80px;
  z-index: 99;

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    gap: 1rem;
    overflow-x: auto;
  }
`;

const NavItem = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#667eea' : '#4a5568'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    white-space: nowrap;
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ErrorFallback = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin: 2rem;
`;

const ErrorTitle = styled.h2`
  color: #e53e3e;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  color: #4a5568;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s ease;

  &:hover {
    background: #5a67d8;
  }
`;

const NotificationBadge = styled.span`
  background: #e53e3e;
  color: white;
  border-radius: 50%;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 18px;
  text-align: center;
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: #4a5568;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.1);
  }
`;

const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  currentFlight,
  title = 'Airline In-Flight Ordering',
  showNavigation = true,
}) => {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState(3); // Mock notifications

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('[Layout] Error caught by boundary:', error, errorInfo);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      // await apiService.logout();
      router.push('/login');
    } catch (error) {
      console.error('[Layout] Logout error:', error);
    }
  };

  const navigationItems = [
    { label: 'Menu', path: '/menu', icon: FaHome },
    { label: 'My Orders', path: '/orders', icon: FaUser },
    { label: 'Dietary Profile', path: '/dietary', icon: FaUser },
    ...(user?.role === 'admin' ? [
      { label: 'Admin', path: '/admin', icon: FaCog },
      { label: 'Analytics', path: '/analytics', icon: FaChartBar },
    ] : []),
    ...(user?.role === 'crew' ? [
      { label: 'Crew Dashboard', path: '/crew', icon: FaPlane },
    ] : []),
  ];

  return (
    <LayoutContainer>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="Airline In-Flight Ordering System" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      <Header>
        <Logo onClick={() => router.push('/')}>
          <FaPlane />
          Airline Ordering
        </Logo>

        {currentFlight && (
          <FlightInfo>
            <FlightNumber>{currentFlight.flightNumber}</FlightNumber>
            <Route>
              {currentFlight.origin} → {currentFlight.destination}
            </Route>
          </FlightInfo>
        )}

        <UserSection>
          <NotificationButton onClick={() => router.push('/notifications')}>
            <FaBell />
            {notifications > 0 && (
              <NotificationBadge>{notifications}</NotificationBadge>
            )}
          </NotificationButton>

          {user && (
            <UserInfo>
              <FaUser />
              {user.name}
            </UserInfo>
          )}

          <NavItem onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </NavItem>
        </UserSection>
      </Header>

      {showNavigation && (
        <Navigation>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path;
            
            return (
              <NavItem
                key={item.path}
                active={isActive}
                onClick={() => router.push(item.path)}
              >
                <Icon />
                {item.label}
              </NavItem>
            );
          })}
        </Navigation>
      )}

      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => (
          <ErrorFallback>
            <ErrorTitle>Something went wrong</ErrorTitle>
            <ErrorMessage>
              {error.message || 'An unexpected error occurred'}
            </ErrorMessage>
            <RetryButton onClick={resetErrorBoundary}>
              Try again
            </RetryButton>
          </ErrorFallback>
        )}
        onError={handleError}
      >
        <Main>
          {children}
        </Main>
      </ErrorBoundary>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />
    </LayoutContainer>
  );
};

export default Layout; 