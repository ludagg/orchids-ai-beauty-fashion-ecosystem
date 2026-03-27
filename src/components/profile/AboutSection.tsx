import { Calendar, Star, Video, MapPin, Heart, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserData } from "./types";

export function AboutSection({ user }: { user: UserData }) {
  let socialLinks = { instagram: '', youtube: '', website: '' };
  try {
      if (user.socialLinks) {
          socialLinks = JSON.parse(user.socialLinks);
      }
  } catch (e) {
      console.error(e);
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
          <CardDescription>A little more about my journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '2024'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="w-4 h-4" />
                <span>Gold Member</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Video className="w-4 h-4" />
                <span>Content Creator</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Paris, France</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Fashion & Beauty Enthusiast</span>
              </div>
            </div>
          </div>

          {user.bio && (
            <>
                <Separator />
                <div>
                     <h4 className="font-semibold mb-2 text-sm">Bio</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
                </div>
            </>
          )}

          <Separator />

          <div>
            <h4 className="font-semibold mb-3 text-sm">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {['Fashion', 'Beauty', 'Hairstyle', 'Skincare', 'Makeup', 'Trends', 'Lifestyle'].map((interest) => (
                <Badge key={interest} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1 font-normal">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
            <CardDescription>Your milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: '🎬', title: 'First Video', unlocked: true },
                { icon: '⭐', title: '100 Likes', unlocked: true },
                { icon: '👥', title: '1K Followers', unlocked: true },
                { icon: '💎', title: '10K Views', unlocked: true },
                { icon: '🏆', title: 'Trending', unlocked: false },
                { icon: '👑', title: 'VIP Status', unlocked: false },
              ].map((achievement, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all",
                    achievement.unlocked
                      ? "bg-muted/50 border-primary/20"
                      : "bg-muted/20 border-border opacity-50 grayscale"
                  )}
                >
                  <span className="text-2xl mb-2">{achievement.icon}</span>
                  <p className="text-[10px] font-medium">{achievement.title}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect with me</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { platform: 'Instagram', handle: socialLinks.instagram || 'Add link', icon: 'I', url: socialLinks.instagram ? `https://instagram.com/${socialLinks.instagram.replace('@', '')}` : '#' },
              { platform: 'YouTube', handle: socialLinks.youtube || 'Add link', icon: 'Y', url: socialLinks.youtube ? `https://youtube.com/@${socialLinks.youtube.replace('@', '')}` : '#' },
              { platform: 'Website', handle: socialLinks.website || 'Add link', icon: 'W', url: socialLinks.website || '#' },
            ].map((social, i) => (
              <a
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3 rounded-lg border hover:border-primary/50 transition-colors bg-card hover:bg-accent/50 group"
                aria-label={`Connect on ${social.platform}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center group-hover:bg-background transition-colors">
                    <span className="text-foreground text-xs font-bold">{social.icon}</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{social.platform}</p>
                    <p className="text-xs text-muted-foreground">{social.handle}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
