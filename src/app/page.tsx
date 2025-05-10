
import InstantConnectForm from '@/components/InstantConnectForm';

// Custom SVG component for the HolaMeeto Icon
const HolaMeetoIcon = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 180 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="HolaMeeto Taco Icon"
    role="img"
  >
    {/* Taco Shell */}
    <path
      d="M60 135C40 135 30 110 30 90C30 70 40 45 60 45C70 45 78 55 80 65"
      stroke="hsl(var(--foreground))"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--accent))"
    />
    <path
      d="M120 135C140 135 150 110 150 90C150 70 140 45 120 45C110 45 102 55 100 65"
      stroke="hsl(var(--foreground))"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="hsl(var(--accent))"
    />
    <ellipse cx="90" cy="130" rx="35" ry="15" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="5" />

    {/* Fillings */}
    <path
      d="M55 55 Q 65 40 75 50 Q 85 35 95 50 Q 105 40 115 50 Q 125 35 135 55"
      fill="hsl(var(--primary))" 
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
    />
    <path
      d="M60 65 Q 70 50 80 60 Q 90 45 100 60 Q 110 50 120 65"
      fill="hsl(120 60% 50%)" // Green for lettuce
      stroke="hsl(var(--foreground))"
      strokeWidth="3"
      transform="translate(0, -5)"
    />

    {/* Eyes */}
    <circle cx="70" cy="80" r="8" fill="hsl(var(--foreground))" />
    <circle cx="110" cy="80" r="8" fill="hsl(var(--foreground))" />
    <circle cx="72" cy="78" r="3" fill="hsl(var(--background))" />
    <circle cx="112" cy="78" r="3" fill="hsl(var(--background))" />

    {/* Smile */}
    <path
      d="M75 100 Q 90 115 105 100"
      stroke="hsl(var(--foreground))"
      strokeWidth="4"
      fill="transparent"
      strokeLinecap="round"
    />

    {/* Laptop (simplified) */}
    <rect x="40" y="105" width="40" height="25" rx="3" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="3"/>
    <rect x="35" y="128" width="50" height="5" rx="2" fill="hsl(var(--muted))" stroke="hsl(var(--foreground))" strokeWidth="2"/>

    {/* Waving Arm (simplified) */}
     <path d="M115 95 Q 130 90 135 75" stroke="hsl(var(--foreground))" strokeWidth="5" fill="none" strokeLinecap="round"/>


    {/* HolaMeeto Text (Optional, as it's already in h1) - Keeping it simple for icon purpose */}
    {/* If space/complexity is an issue, this could be removed or made smaller */}
    {/*
    <text x="90" y="165" fontFamily="Manrope, sans-serif" fontSize="20" fill="hsl(var(--primary))" textAnchor="middle" fontWeight="bold">
      HolaMeeto
    </text>
    */}
  </svg>
);


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative z-0">
      <div className="w-full max-w-2xl relative z-10">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-primary/10 text-primary shadow-md border border-primary/20">
            {/* Replaced LinkIcon with HolaMeetoIcon SVG */}
            <HolaMeetoIcon />
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
