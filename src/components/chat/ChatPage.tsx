import { ChatBox } from './ChatBox';
import { DashboardLayout } from '../layout/DashboardLayout';

export function ChatPage() {
  return (
    <DashboardLayout currentPage="chat">
      <div className="h-[calc(100vh-8rem)]">
        <ChatBox isFullPage />
      </div>
    </DashboardLayout>
  );
}