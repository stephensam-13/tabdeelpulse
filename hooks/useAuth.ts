import React, { createContext, useContext } from 'react';
import type { User, Permission } from '../types';
import { initialRoles } from '../components/roles/RoleManagementPage';

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A mock user for demonstration. In a real app, this would come from an API.
const adminRole = initialRoles.find(r => r.id === 'Administrator');
const mockCurrentUser: User = {
  id: 1,
  name: 'Mohammed Semeem',
  email: 'semeem@tabdeel.io',
  mobile: '+971 50 111 2222',
  avatarUrl: 'https://picsum.photos/seed/semeem/100/100',
  roleId: 'Administrator',
  role: 'Administrator',
  status: 'Active',
  permissions: adminRole?.permissions || [],
  financialLimit: 100000, // Admins have a high limit
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = mockCurrentUser; // Using the mock user directly

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    // System admins have all permissions implicitly
    if (user.permissions.includes('system:admin')) {
      return true;
    }
    return user.permissions.includes(permission);
  };

  const value = { user, hasPermission };

  // FIX: Replaced JSX with React.createElement to be valid in a .ts file.
  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
