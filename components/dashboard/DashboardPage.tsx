
import React from 'react';
import KpiCard from './KpiCard';
import FinancialChart from './FinancialChart';
import ActivityFeed from './ActivityFeed';
import type { Kpi, FinancialDataPoint, ActivityItem } from '../../types';

const DashboardPage: React.FC = () => {
    const kpiData: Kpi[] = [
        {
            title: 'Total Revenue',
            value: 'AED 405,091.00',
            change: '+4.5%',
            changeType: 'increase',
        },
        {
            title: 'Pending Approvals',
            value: '12 (AED 15,230)',
            change: '+2.1%',
            changeType: 'increase',
        },
        {
            title: 'Active Service Jobs',
            value: '28',
            change: '-1.8%',
            changeType: 'decrease',
        },
        {
            title: 'Unread Messages',
            value: '4',
            change: '+1',
            changeType: 'increase',
        },
    ];

    const financialData: FinancialDataPoint[] = [
        { name: 'Jan', income: 4000, expenses: 2400 },
        { name: 'Feb', income: 3000, expenses: 1398 },
        { name: 'Mar', income: 5000, expenses: 3800 },
        { name: 'Apr', income: 4780, expenses: 3908 },
        { name: 'May', income: 5890, expenses: 4800 },
        { name: 'Jun', income: 4390, expenses: 3800 },
        { name: 'Jul', income: 5490, expenses: 4300 },
    ];

    const activityData: ActivityItem[] = [
        { id: 1, user: { name: 'Suhair Mahmoud', avatarUrl: 'https://picsum.photos/seed/suhair/40/40' }, action: 'approved payment to', target: 'Bosch Security Systems', timestamp: '2m ago' },
        { id: 2, user: { name: 'Shiraj', avatarUrl: 'https://picsum.photos/seed/shiraj/40/40' }, action: 'logged a collection of AED 50,000 from', target: 'Al Naboodah Construction', timestamp: '15m ago' },
        { id: 3, user: { name: 'Benhur', avatarUrl: 'https://picsum.photos/seed/benhur/40/40' }, action: 'resolved service job #SJ-9817 for', target: 'City Walk Building 7 BMS', timestamp: '1h ago' },
        { id: 4, user: { name: 'Mohammed Semeem', avatarUrl: 'https://picsum.photos/seed/semeem/40/40' }, action: 'created a new job: Install CCTV cameras for', target: 'City Walk Building 7 BMS', timestamp: '3h ago' },
        { id: 5, user: { name: 'Suhair Mahmoud', avatarUrl: 'https://picsum.photos/seed/suhair/40/40' }, action: 'rejected payment to', target: 'Hikvision Middle East', timestamp: '5h ago' },
        { id: 6, user: { name: 'NOUMAN', avatarUrl: 'https://picsum.photos/seed/nouman/40/40' }, action: 'updated status to "Completed" for job #SJ-9812 on', target: 'Al Quoz Labour Camp Internet', timestamp: '8h ago' },
    ];


  return (
    <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {kpiData.map((kpi, index) => <KpiCard key={index} kpi={kpi} />)}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Financial Overview Chart */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Financial Overview</h2>
                <FinancialChart data={financialData} />
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md">
                 <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Recent Activity</h2>
                <ActivityFeed items={activityData} />
            </div>
        </div>
    </div>
  );
};

export default DashboardPage;