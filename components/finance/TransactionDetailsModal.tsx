import React from 'react';
import type { PaymentInstruction, TransactionHistory } from '../../types';
import { XMarkIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '../icons/Icons';

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  instruction: PaymentInstruction;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({ isOpen, onClose, instruction }) => {
  if (!isOpen) return null;

  const DetailItem: React.FC<{ label: string; value: string | number | undefined; className?: string }> = ({ label, value, className }) => (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`text-sm font-semibold text-gray-900 dark:text-white ${className}`}>{value || '-'}</p>
    </div>
  );
  
  const HistoryItem: React.FC<{ item: TransactionHistory, isLast: boolean }> = ({ item, isLast }) => {
      let icon, color;
      switch(item.status) {
        case 'Approved': icon = <CheckCircleIcon className="h-5 w-5 text-white"/>; color = 'bg-green-500'; break;
        case 'Rejected': icon = <XCircleIcon className="h-5 w-5 text-white"/>; color = 'bg-red-500'; break;
        default: icon = <ClockIcon className="h-5 w-5 text-white"/>; color = 'bg-yellow-500'; break;
      }
      
      return (
        <li className="relative pb-6">
            {!isLast && <div className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300 dark:bg-gray-600"></div>}
            <div className="relative flex items-start space-x-3">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${color}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1 pt-1.5">
                    <div className="text-sm text-gray-700 dark:text-gray-300">
                        Status changed to <span className="font-medium">{item.status}</span> by <span className="font-medium">{item.user}</span>
                    </div>
                    {item.remarks && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">"{item.remarks}"</p>}
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{item.timestamp}</div>
                </div>
            </div>
        </li>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
      <div className="relative inline-block bg-white dark:bg-dark-card rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full">
        <div className="bg-white dark:bg-dark-card px-4 pt-5 pb-4 sm:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">Transaction Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Instruction ID: {instruction.id}</p>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500"><XMarkIcon className="h-6 w-6" /></button>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Details</h4>
              <DetailItem label="Payee" value={instruction.payee} />
              <DetailItem label="Amount" value={`${instruction.amount.toFixed(2)} ${instruction.currency}`} className="text-lg" />
              <DetailItem label="Due Date" value={instruction.dueDate} />
              <DetailItem label="Submitted By" value={instruction.submittedBy} />
              <DetailItem label="Current Status" value={instruction.status} />
              <DetailItem label="Recurring" value={instruction.isRecurring ? 'Yes' : 'No'} />
              {instruction.isRecurring && (
                <>
                  <DetailItem label="Next Due Date" value={instruction.nextDueDate} />
                  <DetailItem label="Balance Amount" value={instruction.balance?.toFixed(2)} />
                </>
              )}
            </div>

            {/* Right Column: History */}
            <div>
              <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">Approval History</h4>
              <ul className="mt-4">
                  {instruction.history.map((item, index) => (
                      <HistoryItem key={index} item={item} isLast={index === instruction.history.length - 1} />
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;