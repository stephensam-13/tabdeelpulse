import React from 'react';
import { ServiceJob } from '../../types';

interface JobCardProps {
  job: ServiceJob;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, jobId: string) => void;
  onClick: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onDragStart, onClick }) => {
    const priorityBorderColors = {
        High: 'border-l-red-500',
        Medium: 'border-l-yellow-500',
        Low: 'border-l-blue-500',
    };

    const priorityBadgeColors = {
        High: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        Low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    };

    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, job.id)}
            onClick={onClick}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 cursor-pointer border-l-4 ${priorityBorderColors[job.priority]} hover:shadow-lg transition-shadow`}
        >
            <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{job.project}</p>
            <div className="flex items-center justify-between mt-4">
                 <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium bg-primary/10 text-primary py-1 px-2 rounded-full">{job.id}</span>
                     <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadgeColors[job.priority]}`}>
                        {job.priority}
                    </span>
                </div>
                <div className="flex items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-300 mr-2">{job.technician.name}</span>
                    <img src={job.technician.avatarUrl} alt={job.technician.name} className="h-8 w-8 rounded-full object-cover"/>
                </div>
            </div>
        </div>
    );
};

export default JobCard;