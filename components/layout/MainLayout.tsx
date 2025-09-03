import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardPage from '../dashboard/DashboardPage';
import UserManagementPage from '../users/UserManagementPage';
import UserProfilePage from '../users/UserProfilePage';
import RoleManagementPage, { initialRoles } from '../roles/RoleManagementPage';
import FinancePage from '../finance/FinancePage';
import ServiceJobsPage from '../jobs/ServiceJobsPage';
import MessagesPage from '../messages/MessagesPage';
import ProjectsPage from '../projects/ProjectsPage';
import AccountHeadsPage from '../accounts/AccountHeadsPage';
import SettingsPage from '../settings/SettingsPage';
import type { Role } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface MainLayoutProps {
  onLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onLogout, isDarkMode, toggleDarkMode }) => {
  const [activePage, setActivePage] = useState('dashboard');
  const [roles, setRoles] = useState<Role[]>(() => {
    try {
        const storedRoles = localStorage.getItem('tabdeel-pulse-roles');
        if (storedRoles) {
            return JSON.parse(storedRoles);
        }
    } catch (error) {
        console.error("Failed to parse roles from localStorage", error);
    }
    return initialRoles;
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  useEffect(() => {
    try {
        localStorage.setItem('tabdeel-pulse-roles', JSON.stringify(roles));
    } catch (error) {
        console.error("Failed to save roles to localStorage", error);
    }
  }, [roles]);

  if (!user) {
    // Handle loading state or redirect
    return <div>Loading...</div>;
  }

  const renderContent = () => {
    switch (activePage) {
      case 'finance':
        return <FinancePage />;
      case 'service-jobs':
        return <ServiceJobsPage />;
      case 'messages':
        return <MessagesPage />;
      case 'users':
        return <UserManagementPage roles={roles} />;
      case 'profile':
        return <UserProfilePage user={user} />;
      case 'roles':
        return <RoleManagementPage roles={roles} setRoles={setRoles} />;
      case 'projects':
        return <ProjectsPage />;
      case 'account-heads':
        return <AccountHeadsPage />;
      case 'settings':
        return <SettingsPage isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };
  
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSidebarOpen(false); // Close sidebar on navigation
  }

  return (
    <div className="flex h-screen bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text overflow-hidden">
      <Sidebar activePage={activePage} onNavigate={handleNavigate} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} onLogout={onLogout} onNavigate={handleNavigate} onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light-bg dark:bg-dark-bg p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;