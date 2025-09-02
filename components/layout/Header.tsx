import React, { useState, useRef, useEffect } from 'react';
import type { User, Notification } from '../../types';
import { BellIcon, MagnifyingGlassIcon, UserCircleIcon, ArrowRightOnRectangleIcon, Bars3Icon, CreditCardIcon, ChatBubbleBottomCenterTextIcon, CheckCircleIcon, XCircleIcon } from '../icons/Icons';
import NotificationDropdown from './NotificationDropdown';

const mockNotifications: Notification[] = [
  { id: '1', title: 'Payment Approved', description: 'Payment of AED 42,500.75 to Bosch Security has been approved.', timestamp: '15m ago', read: false, icon: CheckCircleIcon },
  { id: '2', title: 'New Message', description: 'You have a new message from Shiraj in "Q3 Marketing Campaign".', timestamp: '1h ago', read: false, icon: ChatBubbleBottomCenterTextIcon },
  { id: '3', title: 'Payment Rejected', description: 'Payment to Hikvision Middle East was rejected.', timestamp: '3h ago', read: false, icon: XCircleIcon },
  { id: '4', title: 'Upcoming Payment', description: 'A recurring payment of AED 2850.50 to DEWA is due tomorrow.', timestamp: '1d ago', read: false, icon: CreditCardIcon },
  { id: '5', title: 'System Update', description: 'The system will be down for maintenance tonight at 2 AM.', timestamp: '2d ago', read: true, icon: CreditCardIcon },
];

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onNavigate: (pageId: string) => void;
  onToggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigate, onToggleSidebar }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleUserDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setNotificationOpen(false); // Close other dropdown
  }

  const toggleNotificationDropdown = () => {
    setNotificationOpen(!notificationOpen);
    setDropdownOpen(false); // Close other dropdown
  }

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-20 flex-shrink-0 flex items-center justify-between px-4 sm:px-6 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white mr-4"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-6">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={toggleNotificationDropdown} 
            className="relative text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary justify-center items-center text-xs text-white">{unreadCount}</span>
              </span>
            )}
          </button>
          {notificationOpen && (
            <NotificationDropdown 
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
            />
          )}
        </div>
        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleUserDropdown} className="flex items-center space-x-2">
            <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
            <div className="text-left hidden md:block">
              <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-dark-card shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile
                </button>
                <button
                  onClick={onLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;