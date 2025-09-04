import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { User, Permission } from '../types';
import { initialRoles } from '../components/roles/RoleManagementPage';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  originalUser: User | null;
  allUsers: User[];
  switchUser: (userId: number) => void;
  hasPermission: (permission: Permission) => boolean;
  addUser: (newUser: User) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (userId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const enhanceUser = (user: User, roles: typeof initialRoles): User => {
    const role = roles.find(r => r.id === user.roleId);
    return {
        ...user,
        permissions: role ? role.permissions : [],
        financialLimit: role?.id === 'Administrator' ? 100000 : (role?.id === 'Manager' ? 50000 : 0),
    };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => MOCK_USERS.map(u => enhanceUser(u, initialRoles)));
  
  // FIX: Rename `originalAdminUser` to `originalUser` to align with the context value.
  const originalUser = useMemo(() => allUsers.find(u => u.id === 1) || null, [allUsers]);

  const [activeUser, setActiveUser] = useState<User | null>(originalUser);

  const switchUser = useCallback((userId: number) => {
    const userToSwitchTo = allUsers.find(u => u.id === userId);
    setActiveUser(userToSwitchTo || null);
  }, [allUsers]);
  
  const addUser = (newUser: Omit<User, 'permissions' | 'financialLimit'>) => {
      const enhancedNewUser = enhanceUser(newUser as User, initialRoles);
      setAllUsers(prevUsers => [enhancedNewUser, ...prevUsers]);
  };
  
  const updateUser = (updatedUser: User) => {
      setAllUsers(users => users.map(user => user.id === updatedUser.id ? updatedUser : user));
      if (activeUser?.id === updatedUser.id) {
          setActiveUser(updatedUser);
      }
  };

  const deleteUser = (userId: number) => {
      if (activeUser?.id === userId) {
        if(originalUser) {
            switchUser(originalUser.id);
        }
      }
      setAllUsers(users => users.filter(user => user.id !== userId));
  };

  const hasPermission = useMemo(() => (permission: Permission): boolean => {
    if (!activeUser) return false;
    if (activeUser.permissions.includes('system:admin')) {
      return true;
    }
    return activeUser.permissions.includes(permission);
  }, [activeUser]);

  const value = { 
      user: activeUser, 
      originalUser,
      allUsers,
      switchUser,
      hasPermission,
      addUser,
      updateUser,
      deleteUser
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
