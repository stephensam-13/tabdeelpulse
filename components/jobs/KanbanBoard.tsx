import React, { useState } from 'react';
import { ServiceJob, JobStatus } from '../../types';
import JobCard from './JobCard';

interface KanbanBoardProps {
  jobs: ServiceJob[];
  onJobStatusChange: (jobId: string, newStatus: JobStatus) => void;
  onSelectJob: (job: ServiceJob) => void;
}

const columns: { id: JobStatus, title: string }[] = [
  { id: 'Assigned', title: 'Assigned' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'Completed', title: 'Completed' },
  { id: 'Resolved', title: 'Resolved' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({ jobs, onJobStatusChange, onSelectJob }) => {
    const [draggedJobId, setDraggedJobId] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, jobId: string) => {
        setDraggedJobId(jobId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: JobStatus) => {
        e.preventDefault();
        if (draggedJobId) {
            onJobStatusChange(draggedJobId, newStatus);
            setDraggedJobId(null);
        }
    };

    const getJobsForColumn = (status: JobStatus) => {
        return jobs.filter(job => job.status === status);
    };
    
    return (
        <div className="flex-1 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
            {columns.map(column => (
                <div 
                    key={column.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column.id)}
                    className="bg-gray-100 dark:bg-dark-card rounded-lg p-4 flex flex-col w-80 md:w-auto flex-shrink-0"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 px-2">{column.title} ({getJobsForColumn(column.id).length})</h2>
                    <div className="space-y-4 overflow-y-auto h-full pr-1">
                        {getJobsForColumn(column.id).map(job => (
                            <JobCard 
                                key={job.id} 
                                job={job} 
                                onDragStart={handleDragStart}
                                onClick={() => onSelectJob(job)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;