import InstantConnectForm from '@/components/InstantConnectForm';
//import '../public';
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative z-0">
      <div className="w-full max-w-2xl relative z-10">
        <header className="mb-8 text-center">
          {/* Google Drive image used as logo icon */}
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary shadow-md border border-primary/20">
            <img
              src="/holameeto-icon.png"
              alt="HolaMeeto Logo"
              className="max-w-xs sm:max-w-sm md:max-w-md h-auto rounded-[999px] object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold text-primary">HolaMeeto</h1>
          <p className="text-lg text-muted-foreground mt-2">
            One-click Jitsi Meet link generator. Fast, simple, and ready to share.
          </p>
        </header>

        <InstantConnectForm />
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground relative z-10">
        <p>&copy; {new Date().getFullYear()} HolaMeeto. All rights reserved.</p>
        <p><strong><em>Roneel V. – Creator of HolaMeeto 🌮</em></strong></p>
        <p>Powered by Jitsi Meet</p>
      </footer>
    </main>
  );
}
