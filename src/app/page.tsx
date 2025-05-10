import InstantConnectForm from '@/components/InstantConnectForm';
import { Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative z-0"> {/* Removed bg-background, added relative z-0 to ensure content is above pseudo-elements if they were on main */}
      <div className="w-full max-w-2xl relative z-10"> {/* Added relative z-10 to ensure content is above body pseudo-elements */}
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary text-primary-foreground shadow-md">
            <Zap size={32} />
          </div>
          <h1 className="text-4xl font-bold text-primary">InstantConnect</h1>
          <p className="text-lg text-muted-foreground mt-2">
            One-click Jitsi Meet link generator. Fast, simple, and ready to share.
          </p>
        </header>
        <InstantConnectForm />
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground relative z-10"> {/* Added relative z-10 */}
        <p>&copy; {new Date().getFullYear()} InstantConnect. All rights reserved.</p>
        <p>Powered by Jitsi Meet</p>
      </footer>
    </main>
  );
}
