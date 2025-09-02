import React, { useState } from 'react';
import PaymentInstructionsTab from './PaymentInstructionsTab';
import CollectionsTab from './CollectionsTab';
import DepositsTab from './DepositsTab';

type FinanceTab = 'instructions' | 'collections' | 'deposits';

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FinanceTab>('instructions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'instructions':
        return <PaymentInstructionsTab />;
      case 'collections':
        return <CollectionsTab />;
      case 'deposits':
        return <DepositsTab />;
      default:
        return null;
    }
  };
  
  const TabButton: React.FC<{ tabId: FinanceTab; label: string }> = ({ tabId, label }) => (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabId
          ? 'bg-primary text-white'
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Finance</h1>
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-dark-card p-1 rounded-lg">
          <TabButton tabId="instructions" label="Payment Instructions" />
          <TabButton tabId="collections" label="Collections" />
          <TabButton tabId="deposits" label="Deposits" />
        </div>
      </div>
      
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default FinancePage;
