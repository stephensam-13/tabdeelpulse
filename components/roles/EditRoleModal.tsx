import React, { useState, FormEvent, useEffect } from 'react';
import type { Role, Permission } from '../../types';
import { XMarkIcon, CheckIcon } from '../icons/Icons';
import { allPermissions } from './permissions';

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role;
  onSave: (roleId: string, permissions: Permission[]) => void;
}

const EditRoleModal: React.FC<EditRoleModalProps> = ({ isOpen, onClose, role, onSave }) => {
  const [selectedPermissions, setSelectedPermissions] = useState<Set<Permission>>(new Set());

  useEffect(() => {
    if (role) {
      setSelectedPermissions(new Set(role.permissions));
    }
  }, [role]);
  
  const handlePermissionChange = (permission: Permission) => {
    setSelectedPermissions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(permission)) {
        newSet.delete(permission);
      } else {
        newSet.add(permission);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(role.id, Array.from(selectedPermissions));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

      <div className="relative inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <form onSubmit={handleSubmit}>
          <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
                    Edit Permissions for <span className="text-primary">{role.name}</span>
                </h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
              <fieldset>
                <legend className="sr-only">Permissions</legend>
                <div className="space-y-4">
                  {allPermissions.map(permission => (
                    <div key={permission.id} className="relative flex items-start p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <div className="flex items-center h-5">
                         <input
                            id={permission.id}
                            aria-describedby={`${permission.id}-description`}
                            name="permissions"
                            type="checkbox"
                            checked={selectedPermissions.has(permission.id)}
                            onChange={() => handlePermissionChange(permission.id)}
                            className="focus:ring-primary h-5 w-5 text-primary border-gray-300 dark:border-gray-500 rounded bg-gray-100 dark:bg-gray-600"
                          />
                      </div>
                      <div className="ml-4 text-sm">
                        <label htmlFor={permission.id} className="font-medium text-gray-900 dark:text-white">
                          {permission.label}
                        </label>
                        <p id={`${permission.id}-description`} className="text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-card/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoleModal;