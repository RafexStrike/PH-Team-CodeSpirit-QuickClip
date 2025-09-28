// Simple landing page, link to chat or chatbotinterface
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen space-y-4">
      <h1 className="text-3xl font-bold">Welcome to AI Chat</h1>
      <div className="space-x-4">
        <Link href="/chat" className="btn btn-primary">Go to Chat</Link>
      </div>


      

    
    </main>
  );
}
