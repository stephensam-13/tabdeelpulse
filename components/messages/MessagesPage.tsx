import React, { useState } from 'react';
import type { Thread, Message } from '../../types';
import ChatView from './ChatView';
import { PlusIcon } from '../icons/Icons';
import { useAuth } from '../../hooks/useAuth';
import CreateThreadModal from './CreateThreadModal';

const mockThreads: Thread[] = [
    {
        id: 'thread-1',
        title: 'Project Alpha Planning',
        participants: [{ name: 'Mohammed Semeem', avatarUrl: 'https://picsum.photos/seed/semeem/40/40' }, { name: 'Suhair Mahmoud', avatarUrl: 'https://picsum.photos/seed/suhair/40/40' }],
        messages: [
            { id: 1, user: { name: 'Mohammed Semeem', avatarUrl: 'https://picsum.photos/seed/semeem/40/40' }, text: 'We need to finalize the budget by EOD.', timestamp: '10:30 AM' },
            { id: 2, user: { name: 'Suhair Mahmoud', avatarUrl: 'https://picsum.photos/seed/suhair/40/40' }, text: 'I have the latest figures, will send them over in 10 minutes.', timestamp: '10:32 AM' },
            { id: 3, user: { name: 'Suhair Mahmoud', avatarUrl: 'https://picsum.photos/seed/suhair/40/40' }, text: 'Here are the updated budget figures for Project Alpha. I\'ve accounted for the increased material costs we discussed last week. The new total comes to AED 1.2M, which is slightly above our initial projection but manageable. I also included a contingency of 5%. Please review and let me know if you have any questions. I need your approval to proceed with the vendor negotiations. This is a very long message to test the summarization feature, hopefully it works as expected and provides a concise overview of this text.', timestamp: '10:45 AM' },
        ],
        lastMessage: 'Here are the updated budget figures...',
        timestamp: '10:45 AM',
        unreadCount: 1,
    },
    {
        id: 'thread-2',
        title: 'Q3 Marketing Campaign',
        participants: [{ name: 'Shiraj', avatarUrl: 'https://picsum.photos/seed/shiraj/40/40' }, { name: 'Mohammed Semeem', avatarUrl: 'https://picsum.photos/seed/semeem/40/40' }],
        messages: [{ id: 1, user: { name: 'Shiraj', avatarUrl: 'https://picsum.photos/seed/shiraj/40/40' }, text: 'The creatives for the new campaign are ready for review.', timestamp: 'Yesterday' }],
        lastMessage: 'The creatives for the new campaign...',
        timestamp: 'Yesterday',
        unreadCount: 0,
    }
];


const MessagesPage: React.FC = () => {
    const [threads, setThreads] = useState<Thread[]>(mockThreads);
    const [selectedThreadId, setSelectedThreadId] = useState<string | null>(threads.length > 0 ? threads[0].id : null);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const { user: currentUser } = useAuth();

    const handleSendMessage = (threadId: string, messageText: string) => {
        if (!currentUser) return;

        const newMessage: Message = {
            id: Date.now(),
            user: { name: currentUser.name, avatarUrl: currentUser.avatarUrl || '' },
            text: messageText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setThreads(prevThreads => prevThreads.map(thread => {
            if (thread.id === threadId) {
                return {
                    ...thread,
                    messages: [...thread.messages, newMessage],
                    lastMessage: messageText,
                    timestamp: newMessage.timestamp,
                };
            }
            return thread;
        }));
    };
    
    const handleCreateThread = (newThread: Omit<Thread, 'id' | 'lastMessage' | 'timestamp' | 'unreadCount'>) => {
        const fullNewThread: Thread = {
            ...newThread,
            id: `thread-${Date.now()}`,
            lastMessage: newThread.messages[0]?.text || 'No messages yet.',
            timestamp: newThread.messages[0]?.timestamp || new Date().toLocaleTimeString(),
            unreadCount: 0,
        };
        setThreads(prev => [fullNewThread, ...prev]);
        setSelectedThreadId(fullNewThread.id);
        setCreateModalOpen(false);
    };

    const activeThread = threads.find(t => t.id === selectedThreadId);

    const ThreadListItem: React.FC<{ thread: Thread; isActive: boolean }> = ({ thread, isActive }) => (
        <li
            onClick={() => setSelectedThreadId(thread.id)}
            className={`p-4 cursor-pointer rounded-lg transition-colors ${isActive ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
        >
            <div className="flex justify-between items-center">
                <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-800 dark:text-white'}`}>{thread.title}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">{thread.timestamp}</span>
            </div>
            <div className="flex justify-between items-start mt-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate pr-4">{thread.lastMessage}</p>
                {thread.unreadCount > 0 && (
                    <span className="flex-shrink-0 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{thread.unreadCount}</span>
                )}
            </div>
        </li>
    );

    return (
        <div className="flex h-[calc(100vh-9rem)] sm:h-[calc(100vh-10rem)] bg-white dark:bg-dark-card shadow-md rounded-lg overflow-hidden">
            {/* Left Panel: Thread List */}
            <div className={`w-full md:w-1/3 md:flex flex-col border-r border-gray-200 dark:border-gray-700 ${selectedThreadId && 'hidden'}`}>
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h2>
                    <button onClick={() => setCreateModalOpen(true)} className="p-2 rounded-full text-primary hover:bg-primary/10">
                        <PlusIcon className="h-6 w-6" />
                    </button>
                </div>
                <ul className="flex-1 overflow-y-auto p-2 space-y-1">
                    {threads.map(thread => (
                        <ThreadListItem key={thread.id} thread={thread} isActive={thread.id === selectedThreadId} />
                    ))}
                </ul>
            </div>

            {/* Right Panel: Chat View */}
            <div className={`w-full md:w-2/3 flex-col ${selectedThreadId ? 'flex' : 'hidden md:flex'}`}>
                {activeThread ? (
                    <ChatView 
                        key={activeThread.id} 
                        thread={activeThread} 
                        onBack={() => setSelectedThreadId(null)}
                        onSendMessage={handleSendMessage}
                    />
                 ) : (
                    <div className="flex-1 items-center justify-center text-gray-500 hidden md:flex">Select a conversation</div>
                )}
            </div>
            <CreateThreadModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onSave={handleCreateThread} />
        </div>
    );
};

export default MessagesPage;