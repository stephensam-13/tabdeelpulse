import React, { useState, FormEvent, useEffect } from 'react';
import type { AccountHead } from '../../types';
import { XMarkIcon } from '../icons/Icons';

interface AddAccountHeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (account: Omit<AccountHead, 'id'>) => void;
}

const AddAccountHeadModal: React.FC<AddAccountHeadModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [errors, setErrors] = useState<{ name?: string; bankName?: string, accountNumber?: string } >({});

  useEffect(() => {
    if (isOpen) {
      setName('');
      setBankName('');
      setAccountNumber('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Account name is required.';
    if (!bankName.trim()) newErrors.bankName = 'Bank name is required.';
    if (!accountNumber.trim()) newErrors.accountNumber = 'Account number is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({ name, bankName, accountNumber, status: 'Pending Approval' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
      <div className="relative inline-block align-bottom bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">Add New Account Head</h3>
                <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon className="h-6 w-6" /></button>
            </div>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">New account heads require admin approval before becoming active.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="account-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Name</label>
                <input type="text" id="account-name" value={name} onChange={e => setName(e.target.value)} className={`mt-1 block w-full shadow-sm sm:text-sm ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary`} />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="bank-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
                <input type="text" id="bank-name" value={bankName} onChange={e => setBankName(e.target.value)} className={`mt-1 block w-full shadow-sm sm:text-sm ${errors.bankName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary`} />
                {errors.bankName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.bankName}</p>}
              </div>
               <div>
                <label htmlFor="account-number" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Account Number</label>
                <input type="text" id="account-number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className={`mt-1 block w-full shadow-sm sm:text-sm ${errors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary`} />
                {errors.accountNumber && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.accountNumber}</p>}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-card/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
            <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm">
              Submit for Approval
            </button>
            <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAccountHeadModal;