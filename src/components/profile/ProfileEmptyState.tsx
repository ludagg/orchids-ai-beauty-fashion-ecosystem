// [Jules - Extracted ProfileEmptyState from monolithic ProfileView.tsx]
import { Video, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProfileEmptyState({ type, onUpload }: { type: string, onUpload?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center space-y-6">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
        <Video className="w-8 h-8 text-muted-foreground" />
      </div>

      <div className="space-y-2 max-w-xs sm:max-w-sm px-4">
        <h3 className="text-lg font-semibold text-foreground">No videos yet</h3>
        <p className="text-sm text-muted-foreground">
          Start sharing your style journey by uploading your first video.
        </p>
      </div>

      {onUpload && (
        <Button onClick={onUpload}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Your First Video
        </Button>
      )}
    </div>
  );
}
