"use client";

import {
  Users,
  MessageSquare,
  Heart,
  MoreVertical,
  Flag,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const SUBSCRIBERS = [
  { id: 1, name: "Alice Johnson", username: "@alice_j", date: "2 mins ago", avatar: null, status: "Active" },
  { id: 2, name: "Bob Smith", username: "@bobsmith", date: "1 hour ago", avatar: null, status: "Active" },
  { id: 3, name: "Charlie Brown", username: "@charlie_b", date: "1 day ago", avatar: null, status: "Inactive" },
  { id: 4, name: "Diana Prince", username: "@diana_p", date: "2 days ago", avatar: null, status: "Active" },
];

const COMMENTS = [
  { id: 1, user: "Alice Johnson", comment: "Love this video! Where did you get that top?", video: "Summer Fashion Trends", date: "10 mins ago" },
  { id: 2, user: "Bob Smith", comment: "Great tips, thanks for sharing.", video: "My Skincare Routine", date: "2 hours ago" },
];

export default function CommunityPage() {
  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold">Community</h1>
        <p className="text-muted-foreground">Engage with your audience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">1,234</div>
             <p className="text-xs text-muted-foreground">+20.1% from last month</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">New Comments</CardTitle>
             <MessageSquare className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">+142</div>
             <p className="text-xs text-muted-foreground">+10% from last month</p>
           </CardContent>
        </Card>
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Returning Viewers</CardTitle>
             <UserPlus className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">85%</div>
             <p className="text-xs text-muted-foreground">+5% from last month</p>
           </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Subscribers */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Recent Subscribers</h2>
          <Card>
            <CardContent className="p-0">
              {SUBSCRIBERS.map((sub, index) => (
                <div
                  key={sub.id}
                  className={`flex items-center justify-between p-4 ${index !== SUBSCRIBERS.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>{sub.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{sub.name}</p>
                      <p className="text-xs text-muted-foreground">{sub.username}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {sub.date}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Comments */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Recent Comments</h2>
          <div className="space-y-4">
            {COMMENTS.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="text-[10px]">{comment.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{comment.user}</span>
                      <span className="text-xs text-muted-foreground">• {comment.date}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm">{comment.comment}</p>
                  <div className="flex items-center gap-4 pt-2">
                     <span className="text-xs bg-secondary/50 px-2 py-1 rounded text-muted-foreground">
                        on {comment.video}
                     </span>
                     <div className="flex gap-2 ml-auto">
                       <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                         <Heart className="w-3 h-3" /> Like
                       </Button>
                       <Button variant="ghost" size="sm" className="h-6 text-xs gap-1">
                         <MessageSquare className="w-3 h-3" /> Reply
                       </Button>
                     </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
