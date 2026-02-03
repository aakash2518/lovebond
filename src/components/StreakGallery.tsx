import { useState } from "react";
import { Heart, Camera, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useStreakImages, useSaveStreakImage, useDeleteStreakImage } from "@/hooks/useStreakImages";
import { useLoveStreak } from "@/hooks/useLoveStreak";
import { toast } from "sonner";
import { format } from "date-fns";

const StreakGallery = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: streakImages = [], isLoading } = useStreakImages();
  const { data: streak } = useLoveStreak();
  const saveStreakImage = useSaveStreakImage();
  const deleteStreakImage = useDeleteStreakImage();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSaveImage = async () => {
    if (!selectedFile || !streak) return;

    try {
      await saveStreakImage.mutateAsync({
        imageFile: selectedFile,
        streakCount: streak.current_streak,
        caption: caption.trim() || undefined,
      });

      toast.success("Streak image saved!");
      setIsDialogOpen(false);
      setSelectedFile(null);
      setCaption("");
      setPreviewUrl(null);
    } catch (error) {
      toast.error("Failed to save streak image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this streak image?")) {
      try {
        await deleteStreakImage.mutateAsync(imageId);
        toast.success("Streak image deleted");
      } catch (error) {
        toast.error("Failed to delete image");
      }
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setCaption("");
    setPreviewUrl(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Streak Gallery</h2>
            <p className="text-sm text-muted-foreground">
              Capture your love journey milestones
            </p>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetDialog();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Streak Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Streak Milestone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {streak && (
                <div className="text-center p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-lg border border-pink-500/20">
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold text-pink-500">{streak.current_streak} days</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="image">Select Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-border/30"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="caption">Caption (optional)</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption for this milestone..."
                  maxLength={200}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveImage}
                  disabled={!selectedFile || saveStreakImage.isPending}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  {saveStreakImage.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      {streakImages.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Streak Photos Yet</h3>
          <p className="text-muted-foreground mb-4">
            Start capturing your love journey milestones!
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {streakImages.map((image) => (
            <div
              key={image.id}
              className="group relative bg-card/60 backdrop-blur-xl rounded-lg overflow-hidden border border-border/30 hover:border-pink-500/30 transition-all duration-300"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={image.signedUrl || image.image_url}
                  alt={`Streak ${image.streak_count}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Streak Badge */}
                <div className="absolute top-2 left-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {image.streak_count} days
                </div>

                {/* Delete Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => handleDeleteImage(image.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">
                    Streak Milestone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(image.created_at), 'MMM dd, yyyy')}
                  </p>
                </div>
                
                {image.caption && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {image.caption}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StreakGallery;