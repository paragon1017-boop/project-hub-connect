import { useState, useEffect } from "react";
import { Camera, Trash2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PhotoEntry {
  id: string;
  date: string;
  imageData: string;
  note?: string;
}

export default function PhotoLog() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntry | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();

  // Load photos from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("photoLog");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPhotos(parsed.sort((a: PhotoEntry, b: PhotoEntry) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ));
      } catch {
        console.error("Failed to parse photo log");
      }
    }
  }, []);

  // Save photos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("photoLog", JSON.stringify(photos));
  }, [photos]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ variant: "destructive", title: "Error", description: "Please upload an image file." });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      const newPhoto: PhotoEntry = {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        imageData,
        note: "",
      };
      setPhotos(prev => [newPhoto, ...prev]);
      toast({ title: "Photo added!", description: "Your progress photo has been saved." });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = "";
  };

  const handleDelete = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
    setSelectedPhoto(null);
    toast({ title: "Photo deleted", description: "The photo has been removed." });
  };

  const handlePrevPhoto = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedPhoto(photos[currentIndex - 1]);
    }
  };

  const handleNextPhoto = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedPhoto(photos[currentIndex + 1]);
    }
  };

  const openPhoto = (photo: PhotoEntry, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-32 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <Camera className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Photo Log</h1>
      </header>

      {/* Upload Button */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Camera className="h-10 w-10 text-primary" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Take progress photos to track your journey. All photos are stored locally on your device.
            </p>
            <Button asChild className="w-full">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Camera className="mr-2 h-4 w-4" />
                Add Progress Photo
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No photos yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Start tracking your progress by adding your first photo!</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {photos.length} photo{photos.length !== 1 ? "s" : ""} saved
          </p>
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openPhoto(photo, index)}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted transition-all hover:ring-2 hover:ring-primary"
              >
                <img
                  src={photo.imageData}
                  alt={`Progress photo from ${format(new Date(photo.date), "MMM d, yyyy")}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-xs text-white flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(photo.date), "MMM d, yyyy")}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Photo Viewer Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {selectedPhoto && format(new Date(selectedPhoto.date), "MMMM d, yyyy")}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} of {photos.length}
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="space-y-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-muted">
                <img
                  src={selectedPhoto.imageData}
                  alt="Progress photo"
                  className="h-full w-full object-contain"
                />
                
                {/* Navigation Arrows */}
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      disabled={currentIndex === 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 disabled:opacity-0"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      disabled={currentIndex === photos.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-all hover:bg-black/70 disabled:opacity-0"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selectedPhoto.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Photo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
