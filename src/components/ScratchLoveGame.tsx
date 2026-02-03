import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumFeatureGate } from "./PremiumFeatureGate";
import { PREMIUM_FEATURES } from "@/lib/subscription/plans";

// Import images for circles 1-50
import position1 from "@/assets/scratch/position-1.jpg";
import position2 from "@/assets/scratch/position-2.jpg";
import position3 from "@/assets/scratch/position-3.jpg";
import position4 from "@/assets/scratch/position-4.jpg";
import position5 from "@/assets/scratch/position-5.jpg";
import position6 from "@/assets/scratch/position-6.jpg";
import position7 from "@/assets/scratch/position-7.jpg";
import position8 from "@/assets/scratch/position-8.jpg";
import position9 from "@/assets/scratch/position-9.jpg";
import position10 from "@/assets/scratch/position-10.jpg";
import position11 from "@/assets/scratch/position-11.jpg";
import position12 from "@/assets/scratch/position-12.jpg";
import position13 from "@/assets/scratch/position-13.jpg";
import position14 from "@/assets/scratch/position-14.jpg";
import position15 from "@/assets/scratch/position-15.jpg";
import position16 from "@/assets/scratch/position-16.jpg";
import position17 from "@/assets/scratch/position-17.jpg";
import position18 from "@/assets/scratch/position-18.jpg";
import position19 from "@/assets/scratch/position-19.jpg";
import position20 from "@/assets/scratch/position-20.jpg";
import position21 from "@/assets/scratch/position-21.jpg";
import position22 from "@/assets/scratch/position-22.jpg";
import position23 from "@/assets/scratch/position-23.jpg";
import position24 from "@/assets/scratch/position-24.jpg";
import position25 from "@/assets/scratch/position-25.jpg";
import position26 from "@/assets/scratch/position-26.jpg";
import position27 from "@/assets/scratch/position-27.jpg";
import position28 from "@/assets/scratch/position-28.jpg";
import position29 from "@/assets/scratch/position-29.jpg";
import position30 from "@/assets/scratch/position-30.jpg";
import position31 from "@/assets/scratch/position-31.jpg";
import position32 from "@/assets/scratch/position-32.jpg";
import position33 from "@/assets/scratch/position-33.jpg";
import position34 from "@/assets/scratch/position-34.jpg";
import position35 from "@/assets/scratch/position-35.jpg";
import position36 from "@/assets/scratch/position-36.jpg";
import position37 from "@/assets/scratch/position-37.jpg";
import position38 from "@/assets/scratch/position-38.jpg";
import position39 from "@/assets/scratch/position-39.jpg";
import position40 from "@/assets/scratch/position-40.jpg";
import position41 from "@/assets/scratch/position-41.jpg";
import position42 from "@/assets/scratch/position-42.jpg";
import position43 from "@/assets/scratch/position-43.jpg";
import position44 from "@/assets/scratch/position-44.jpg";
import position45 from "@/assets/scratch/position-45.jpg";
import position46 from "@/assets/scratch/position-46.jpg";
import position47 from "@/assets/scratch/position-47.jpg";
import position48 from "@/assets/scratch/position-48.jpg";
import position49 from "@/assets/scratch/position-49.jpg";
import position50 from "@/assets/scratch/position-50.jpg";
import position51 from "@/assets/scratch/position-51.jpg";
import position52 from "@/assets/scratch/position-52.jpg";
import position53 from "@/assets/scratch/position-53.jpg";
import position54 from "@/assets/scratch/position-54.jpg";
import position55 from "@/assets/scratch/position-55.jpg";

interface ScratchLoveGameProps {
  onBack: () => void;
}

// Image mapping for circles 1-50
const positionImages: Record<number, string> = {
  1: position1,
  2: position2,
  3: position3,
  4: position4,
  5: position5,
  6: position6,
  7: position7,
  8: position8,
  9: position9,
  10: position10,
  11: position11,
  12: position12,
  13: position13,
  14: position14,
  15: position15,
  16: position16,
  17: position17,
  18: position18,
  19: position19,
  20: position20,
  21: position21,
  22: position22,
  23: position23,
  24: position24,
  25: position25,
  26: position26,
  27: position27,
  28: position28,
  29: position29,
  30: position30,
  31: position31,
  32: position32,
  33: position33,
  34: position34,
  35: position35,
  36: position36,
  37: position37,
  38: position38,
  39: position39,
  40: position40,
  41: position41,
  42: position42,
  43: position43,
  44: position44,
  45: position45,
  46: position46,
  47: position47,
  48: position48,
  49: position49,
  50: position50,
  51: position51,
  52: position52,
  53: position53,
  54: position54,
  55: position55,
};

// Placeholder paths for circles that don't have images yet
// You can add images at: src/assets/scratch/position-11.jpg, position-12.jpg, etc.
const getPositionImage = (circleNum: number): string | null => {
  return positionImages[circleNum] || null;
};

// Create shuffled mapping of 55 images to 100 circles
const createShuffledImageMapping = (): Record<number, string> => {
  const imageKeys = Object.keys(positionImages).map(Number); // [1, 2, 3, ..., 55]
  const shuffledMapping: Record<number, string> = {};
  
  // For each of the 100 circles, assign a random image from the 55 available
  for (let circleNum = 1; circleNum <= 100; circleNum++) {
    const randomImageKey = imageKeys[Math.floor(Math.random() * imageKeys.length)];
    shuffledMapping[circleNum] = positionImages[randomImageKey];
  }
  
  return shuffledMapping;
};

// Generate shuffled mapping once when component loads
const shuffledImageMapping = createShuffledImageMapping();

const getShuffledPositionImage = (circleNum: number): string => {
  return shuffledImageMapping[circleNum];
};

// Fallback text activities for circles without images
const fallbackActivities = Array.from({ length: 100 }, (_, i) => `Love Position ${i + 1} 💕`);

const ScratchLoveGame = ({ onBack }: ScratchLoveGameProps) => {
  return (
    <PremiumFeatureGate 
      feature={PREMIUM_FEATURES.SCRATCH_LOVE_GAME}
      title="🎮 Scratch Love Game"
      description="Discover intimate positions and spice up your relationship with our exclusive scratch game!"
      fallback={
        <div className="min-h-screen bg-background">
          <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="flex items-center gap-3 p-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold text-foreground">Scratch Love Game</h1>
              </div>
            </div>
          </div>
          <div className="p-4">
            <PremiumFeatureGate 
              feature={PREMIUM_FEATURES.SCRATCH_LOVE_GAME}
              title="🎮 Scratch Love Game"
              description="Discover intimate positions and spice up your relationship with our exclusive scratch game!"
            />
          </div>
        </div>
      }
    >
      <ScratchLoveGameContent onBack={onBack} />
    </PremiumFeatureGate>
  );
};

const ScratchLoveGameContent = ({ onBack }: ScratchLoveGameProps) => {
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null);
  const [revealedCircles, setRevealedCircles] = useState<Set<number>>(new Set());
  const [isScratching, setIsScratching] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate 100 circles
  const circles = Array.from({ length: 100 }, (_, i) => i + 1);

  // Reset scratch canvas when circle is selected
  useEffect(() => {
    if (selectedCircle !== null && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Fill with scratch layer
        ctx.fillStyle = "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)";
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "#ec4899");
        gradient.addColorStop(1, "#8b5cf6");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add sparkle pattern
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.beginPath();
          ctx.arc(x, y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Add text
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Scratch Me! ✨", canvas.width / 2, canvas.height / 2);
      }
      setScratchProgress(0);
    }
  }, [selectedCircle]);

  const handleScratch = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || selectedCircle === null) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    // Calculate scratch progress
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const progress = (transparent / (imageData.data.length / 4)) * 100;
    setScratchProgress(progress);

    // Auto-reveal when 50% scratched
    if (progress > 50 && !revealedCircles.has(selectedCircle)) {
      setRevealedCircles(prev => new Set([...prev, selectedCircle]));
    }
  };

  const handleCircleClick = (circleNum: number) => {
    if (revealedCircles.has(circleNum)) {
      // Show already revealed content
      setSelectedCircle(circleNum);
    } else {
      setSelectedCircle(circleNum);
    }
  };

  const closeModal = () => {
    setSelectedCircle(null);
    setScratchProgress(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="flex items-center gap-3 p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Scratch Love Game</h1>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="px-4 py-3 text-center">
        <p className="text-muted-foreground text-sm">
          Tap a circle and scratch to reveal your love activity! 💕
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Revealed: {revealedCircles.size} / 100
        </p>
      </div>

      {/* Circles Grid - 3 columns like reference */}
      <div className="px-4 pb-24">
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {circles.map((num) => (
            <motion.button
              key={num}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCircleClick(num)}
              className={`
                aspect-square rounded-full flex items-center justify-center
                text-2xl font-bold transition-all duration-300 relative overflow-hidden
                ${revealedCircles.has(num) 
                  ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/30" 
                  : "bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow-lg shadow-pink-500/40"
                }
              `}
            >
              {revealedCircles.has(num) ? (
                <Heart className="w-4 h-4 fill-current" />
              ) : (
                num
              )}
              
              {/* Shimmer effect for unrevealed */}
              {!revealedCircles.has(num) && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Scratch Modal */}
      <AnimatePresence>
        {selectedCircle !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            {/* Instruction text above circle */}
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-lg font-medium mb-6 text-center"
            >
              Scratch the circle with your finger ✨
            </motion.p>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-64 h-64 rounded-full overflow-hidden shadow-2xl shadow-pink-500/30"
              ref={containerRef}
            >
              {/* Background with activity - show shuffled image */}
              <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
                <img 
                  src={getShuffledPositionImage(selectedCircle)} 
                  alt={`Love Position ${selectedCircle}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Scratch layer */}
              {!revealedCircles.has(selectedCircle) && (
                <canvas
                  ref={canvasRef}
                  width={256}
                  height={256}
                  className="absolute inset-0 cursor-pointer touch-none rounded-full"
                  onMouseMove={(e) => isScratching && handleScratch(e)}
                  onMouseDown={() => setIsScratching(true)}
                  onMouseUp={() => setIsScratching(false)}
                  onMouseLeave={() => setIsScratching(false)}
                  onTouchMove={handleScratch}
                  onTouchStart={() => setIsScratching(true)}
                  onTouchEnd={() => setIsScratching(false)}
                />
              )}

              {/* Progress indicator */}
              {!revealedCircles.has(selectedCircle) && scratchProgress > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-white text-xs">
                    {Math.round(scratchProgress)}%
                  </span>
                </div>
              )}
            </motion.div>

            {/* Door number and us💗 below circle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <p className="text-white/80 text-lg font-medium">
                Door {selectedCircle}
              </p>
              <p className="text-pink-400 text-3xl font-bold mt-2">
                us 💗
              </p>
            </motion.div>

            {/* Close hint */}
            <div className="absolute bottom-6 text-white/50 text-sm">
              Tap outside to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ScratchLoveGame;
