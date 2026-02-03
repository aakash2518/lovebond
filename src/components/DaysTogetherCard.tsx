import { useState } from "react";
import { Heart, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DaysTogetherCardProps {
  relationshipStartDate: string | null;
  createdAt: string;
}

const calculateDateDifference = (startDate: Date) => {
  const now = new Date();
  const start = new Date(startDate);
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  const totalDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  
  return { years, months, days, totalDays };
};

const DaysTogetherCard = ({ relationshipStartDate, createdAt }: DaysTogetherCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const startDate = relationshipStartDate || createdAt;
  const { years, months, days, totalDays } = calculateDateDifference(new Date(startDate));
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="glass-card rounded-2xl p-4 text-center gradient-border cursor-pointer transition-transform duration-300"
      >
        <p className="text-primary text-xs font-medium mb-2">Days Together</p>
        <p className="text-3xl font-bold text-foreground glow-text">{totalDays}</p>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xs mx-auto bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center gap-2 text-foreground">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              Our Journey Together
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Total days highlight */}
            <div className="text-center">
              <p className="text-5xl font-bold text-primary glow-text">{totalDays}</p>
              <p className="text-muted-foreground text-sm mt-1">Total Days</p>
            </div>
            
            {/* Detailed breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{years}</p>
                <p className="text-xs text-muted-foreground">Years</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{months}</p>
                <p className="text-xs text-muted-foreground">Months</p>
              </div>
              <div className="bg-primary/10 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{days}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
            </div>
            
            {/* Start date */}
            <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>Since {new Date(startDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DaysTogetherCard;
