import { useState } from "react";
import { Heart, Camera, Calendar, User, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile } from "@/hooks/useProfile";
import { getAllPhotos, DailyPhoto } from "@/lib/firestore/photos";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface StreakGalleryViewProps {
  onBack?: () => void;
}

const StreakGalleryView = ({ onBack }: StreakGalleryViewProps) => {
  const { user } = useFirebaseAuth();
  const { data: profile } = useProfile();
  const [selectedPhoto, setSelectedPhoto] = useState<DailyPhoto | null>(null);

  // Fetch all photos for the couple (both user and partner)
  const { data: allPhotos, isLoading } = useQuery({
    queryKey: ['couple-streak-photos', user?.uid, profile?.partner_id],
    queryFn: async () => {
      if (!user) return [];

      // Get user's photos
      const userPhotos = await getAllPhotos(user.uid);

      // Get partner's photos if connected
      let partnerPhotos: DailyPhoto[] = [];
      if (profile?.partner_id) {
        const pPhotos = await getAllPhotos(profile.partner_id);
        partnerPhotos = pPhotos;
      }

      // Combine all photos
      const allPhotosList = [...userPhotos, ...partnerPhotos];

      // Sort by date descending
      return allPhotosList.sort((a, b) => 
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
      );
    },
    enabled: !!user,
  });

  const isMyPhoto = (photo: DailyPhoto) => photo.userId === user?.uid;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-3 p-4">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Heart className="w-6 h-6 text-primary fill-primary/20" />
          <h1 className="text-xl font-bold text-foreground">Our Love Moments</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-4 pb-24">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : !allPhotos || allPhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Camera className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Photos Yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Start your daily photo streak! Upload photos from the home screen to see them here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm text-center mb-4">
              {allPhotos.length} moments captured 💕
            </p>

            {/* Photo Grid */}
            <div className="grid grid-cols-2 gap-3">
              {allPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                >
                  {photo.photoUrl ? (
                    <img
                      src={photo.photoUrl}
                      alt={`Photo from ${photo.uploadDate}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Camera className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}

                  {/* Overlay with date and owner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="flex items-center gap-1 text-white text-xs">
                        <User className="w-3 h-3" />
                        <span>{isMyPhoto(photo) ? "You" : profile?.partner_nickname || "Partner"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>{format(new Date(photo.uploadDate), "MMM d, yyyy")}</span>
                      </div>
                    </div>
                  </div>

                  {/* Owner indicator */}
                  <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${
                    isMyPhoto(photo) ? "bg-primary" : "bg-secondary"
                  }`} />
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>Your photos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                <span>Partner's photos</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-lg w-full">
            {selectedPhoto.photoUrl && (
              <img
                src={selectedPhoto.photoUrl}
                alt={`Photo from ${selectedPhoto.uploadDate}`}
                className="w-full rounded-xl"
              />
            )}
            <div className="text-center mt-4">
              <p className="text-white font-medium">
                {isMyPhoto(selectedPhoto) ? "You" : profile?.partner_nickname || "Partner"}
              </p>
              <p className="text-white/60 text-sm">
                {format(new Date(selectedPhoto.uploadDate), "MMMM d, yyyy")}
              </p>
              {selectedPhoto.caption && (
                <p className="text-white/80 mt-2 italic">"{selectedPhoto.caption}"</p>
              )}
            </div>
            <p className="text-white/50 text-center text-sm mt-4">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakGalleryView;
