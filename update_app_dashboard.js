const fs = require('fs');

const path = 'src/app/app/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Imports
if (!content.includes('import { useSession }')) {
  content = content.replace(
    'import { useState, useEffect } from "react";',
    'import { useState, useEffect } from "react";\nimport { useSession } from "@/lib/auth-client";\nimport Image from "next/image";'
  );
}

// 2. Add useSession to component
if (!content.includes('const { data: session } = useSession();')) {
  content = content.replace(
    'export default function DiscoverPage() {',
    'export default function DiscoverPage() {\n  const { data: session } = useSession();'
  );
}

// 3. Update Greeting
content = content.replace(
  '<h1 className="text-3xl font-bold font-display text-foreground">Hi Joe!</h1>',
  '<h1 className="text-3xl font-bold font-display text-foreground">{session?.user?.name ? `Hi ${session.user.name}!` : "Hi!"}</h1>'
);

// 4. Hero section (Replace SVG with Image)
// Using regex to replace the specific motion div content
const heroRegex = /<motion\.div[\s\S]*?className="relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-\[160px\] flex items-center"[\s\S]*?>([\s\S]*?)<\/motion\.div>/;

const newHeroContent = `
            <Image src="https://images.unsplash.com/photo-1560066984-138dadb4c035" alt="Salon Background" fill className="object-cover" priority sizes="(max-width: 1200px) 100vw, 800px" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/20 z-0" />

            {/* Content */}
            <div className="relative z-10 p-7 max-w-xs">
              <h2 className="text-xl font-bold text-white leading-snug mb-1">
                Book your next appointment
              </h2>
              <p className="text-white/80 text-sm mb-5">
                Check out top-rated salons near you
              </p>
              <Link href="/app/search?tab=salons">
                <Button className="rounded-full px-5 gap-2 shadow-sm hover:scale-105 transition-transform bg-white text-black hover:bg-white/90">
                  <MapPin className="w-4 h-4" />
                  Find a Salon
                </Button>
              </Link>
            </div>
`;

content = content.replace(heroRegex, (match, p1) => {
    return match.replace(p1, newHeroContent);
});

// 5. Enhance Cards styling
content = content.replaceAll(
  'bg-card rounded-2xl border border-border shadow-sm p-5',
  'bg-card rounded-3xl border border-border shadow-md hover:shadow-lg transition-shadow p-5'
);

// Dashboard loyalty bar
content = content.replace(
  'className="h-2 bg-secondary rounded-full overflow-hidden"',
  'className="h-3 bg-secondary/50 rounded-full overflow-hidden"'
);

content = content.replace(
  'className="h-full bg-foreground rounded-full"',
  'className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"'
);

// My Bookings inner card
content = content.replace(
  'rounded-lg border border-border/70 p-3 bg-secondary/30',
  'rounded-lg border border-border/50 p-3 bg-secondary/50'
);

// 6. Marketplace banner
const svgMarketplaceRegex = /<svg width="200" height="100" viewBox="0 0 200 100" fill="none">[\s\S]*?<\/svg>/;
const newMarketplaceImage = `<Image src="https://images.unsplash.com/photo-1558171813-4c088753af8f" alt="Marketplace" fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 320px" />`;
content = content.replace(svgMarketplaceRegex, newMarketplaceImage);


fs.writeFileSync(path, content, 'utf8');
console.log('Update complete.');
