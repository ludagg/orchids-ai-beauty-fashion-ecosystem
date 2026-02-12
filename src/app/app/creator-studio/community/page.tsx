"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const subscribers = [
  { name: "Alice Johnson", handle: "@alicej", avatar: "https://i.pravatar.cc/150?u=a" },
  { name: "Bob Smith", handle: "@bobsmith", avatar: "https://i.pravatar.cc/150?u=b" },
  { name: "Charlie Brown", handle: "@charlieb", avatar: "https://i.pravatar.cc/150?u=c" },
  { name: "Diana Prince", handle: "@dianap", avatar: "https://i.pravatar.cc/150?u=d" },
  { name: "Evan Wright", handle: "@evanw", avatar: "https://i.pravatar.cc/150?u=e" },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold font-display">Community</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscribers.map((sub, i) => (
          <Card key={i} className="flex items-center p-4 gap-4">
             <Avatar className="h-12 w-12">
                <AvatarImage src={sub.avatar} />
                <AvatarFallback>{sub.name[0]}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <div className="font-semibold">{sub.name}</div>
                <div className="text-sm text-muted-foreground">{sub.handle}</div>
             </div>
             <Button variant="outline" size="sm">Message</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
