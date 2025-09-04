import React, { useState, useMemo } from 'react';
import type { Task } from '../../types';
import { PlusIcon } from '../icons/Icons';
import AddTaskModal from './AddTaskModal';

interface TaskManagementPageProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onToggleTask: (taskId: string) => void;
}

const TaskManagementPage: React.FC<TaskManagementPageProps> = ({ tasks, onAddTask, onToggleTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { incompleteTasks, completedTasks } = useMemo(() => {
    const incomplete: Task[] = [];
    const completed: Task[] = [];
    tasks.forEach(task => {
      if (task.isCompleted) {
        completed.push(task);
      } else {
        incomplete.push(task);
      }
    });
    return { incompleteTasks: incomplete, completedTasks: completed };
  }, [tasks]);

  const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
    <div className="flex items-center p-3 bg-white dark:bg-dark-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <input
        type="checkbox"
        checked={task.isCompleted}
        onChange={() => onToggleTask(task.id)}
        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
        aria-label={`Mark task "${task.description}" as ${task.isCompleted ? 'incomplete' : 'complete'}`}
      />
      <div className="ml-4 flex-grow">
        <p className={`text-sm font-medium text-gray-900 dark:text-white ${task.isCompleted ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
          {task.description}
        </p>
        <p className={`text-xs text-gray-500 dark:text-gray-400 ${task.isCompleted ? 'line-through' : ''}`}>
          Due: {task.deadline}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Tasks</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Task
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Incomplete</h2>
          <div className="space-y-3">
            {incompleteTasks.length > 0 ? (
              incompleteTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No pending tasks. Great job!</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">Completed</h2>
          <div className="space-y-3">
             {completedTasks.length > 0 ? (
              completedTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No tasks completed yet.</p>
            )}
          </div>
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddTask}
      />
    </div>
  );
};

export default TaskManagementPage;
