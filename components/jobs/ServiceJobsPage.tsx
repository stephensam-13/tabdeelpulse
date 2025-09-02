

import React, { useState } from 'react';
import { ServiceJob, JobStatus } from '../../types';
import KanbanBoard from './KanbanBoard';
import JobDetailsModal from './JobDetailsModal';
import CreateJobModal from './CreateJobModal';
import { PlusIcon } from '../icons/Icons';

const initialJobs: ServiceJob[] = [
    { id: 'SJ-9812', title: 'Install new Wi-Fi APs in Block C', project: 'Al Quoz Labour Camp Internet', technician: { name: 'NOUMAN', avatarUrl: 'https://picsum.photos/seed/nouman/40/40' }, status: 'Completed', priority: 'High' },
    { id: 'SJ-9813', title: 'Troubleshoot low connectivity in East Wing', project: 'Jebel Ali Labour Village Connectivity', technician: { name: 'Benhur', avatarUrl: 'https://picsum.photos/seed/benhur/40/40' }, status: 'In Progress', priority: 'High' },
    { id: 'SJ-9814', title: 'Configure Access Control System', project: 'ICD Brookfield Place Security System Upgrade', technician: { name: 'NOUMAN', avatarUrl: 'https://picsum.photos/seed/nouman/40/40' }, status: 'In Progress', priority: 'Medium' },
    { id: 'SJ-9815', title: 'Install CCTV cameras on 5th floor', project: 'City Walk Building 7 BMS', technician: { name: 'Benhur', avatarUrl: 'https://picsum.photos/seed/benhur/40/40' }, status: 'Assigned', priority: 'Medium' },
    { id: 'SJ-9816', title: 'Set up bandwidth management portal', project: 'Al Quoz Labour Camp Internet', technician: { name: 'Nakul', avatarUrl: 'https://picsum.photos/seed/nakul/40/40' }, status: 'Assigned', priority: 'Low' },
    { id: 'SJ-9817', title: 'Integrate fire alarm with BMS', project: 'City Walk Building 7 BMS', technician: { name: 'Benhur', avatarUrl: 'https://picsum.photos/seed/benhur/40/40' }, status: 'Resolved', priority: 'High' },
];

const ServiceJobsPage: React.FC = () => {
    const [jobs, setJobs] = useState<ServiceJob[]>(initialJobs);
    const [selectedJob, setSelectedJob] = useState<ServiceJob | null>(null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const handleJobStatusChange = (jobId: string, newStatus: JobStatus) => {
        setJobs(jobs.map(job => job.id === jobId ? { ...job, status: newStatus } : job));
    };

    const handleSelectJob = (job: ServiceJob) => {
        setSelectedJob(job);
    };

    const handleCloseModal = () => {
        setSelectedJob(null);
    };
    
    const handleAddJob = (newJobData: Omit<ServiceJob, 'id' | 'status'>) => {
        const newJob: ServiceJob = {
            ...newJobData,
            id: `SJ-${Date.now().toString().slice(-4)}`,
            status: 'Assigned',
        };
        setJobs(prevJobs => [newJob, ...prevJobs]);
        setCreateModalOpen(false);
    };


    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Service Jobs</h1>
                <button 
                    onClick={() => setCreateModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Job
                </button>
            </div>

            <KanbanBoard
                jobs={jobs}
                onJobStatusChange={handleJobStatusChange}
                onSelectJob={handleSelectJob}
            />

            {selectedJob && (
                <JobDetailsModal
                    job={selectedJob}
                    isOpen={!!selectedJob}
                    onClose={handleCloseModal}
                />
            )}
            
            <CreateJobModal 
                isOpen={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onAddJob={handleAddJob}
            />
        </div>
    );
};

export default ServiceJobsPage;