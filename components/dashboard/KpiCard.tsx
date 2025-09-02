
import React from 'react';
import type { Kpi } from '../../types';
import { ArrowUpIcon, ArrowDownIcon } from '../icons/Icons';

interface KpiCardProps {
  kpi: Kpi;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const isIncrease = kpi.changeType === 'increase';
  const changeColor = isIncrease ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.title}</p>
        <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{kpi.value}</p>
        <div className="flex items-center mt-2 text-sm">
          <span className={`flex items-center font-semibold ${changeColor}`}>
            {isIncrease ? <ArrowUpIcon className="h-4 w-4 mr-1"/> : <ArrowDownIcon className="h-4 w-4 mr-1"/>}
            {kpi.change}
          </span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;