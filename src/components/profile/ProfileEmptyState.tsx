import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileEmptyState({ type, onUpload }: { type: string, onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground" />
      </div>
      <div className="max-w-md mx-auto px-4">
        <h3 className="text-2xl font-semibold mb-3 tracking-tight">No {type} yet</h3>
        <p className="text-muted-foreground mb-8 text-base leading-relaxed">
          Create and share your first video to start building your audience and unlock exclusive creator rewards.
        </p>
        <Button size="lg" className="w-full sm:w-auto h-12 px-8 font-medium shadow-xl hover:-translate-y-0.5 transition-all" onClick={onUpload}>
          Create First Video
        </Button>
      </div>
    </div>
  );
}
