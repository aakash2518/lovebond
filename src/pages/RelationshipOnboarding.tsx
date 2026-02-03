import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, ArrowRight, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { motion, AnimatePresence } from "framer-motion";

const RelationshipOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useFirebaseAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    partnerNickname: "",
    relationshipStartDate: "",
  });

  if (!isLoading && profile?.relationship_start_date) {
    navigate("/couple-setup", { replace: true });
    return null;
  }

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (step === 2 && !formData.partnerNickname.trim()) {
      toast.error("Please enter a cute name for your partner");
      return;
    }
    if (step === 3 && !formData.relationshipStartDate) {
      toast.error("Please select your relationship start date");
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      await updateProfile.mutateAsync({
        name: formData.name,
        partner_nickname: formData.partnerNickname,
        relationship_start_date: formData.relationshipStartDate,
      });
      
      toast.success("Profile saved! 💕");
      navigate("/couple-setup", { replace: true });
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
    }
  };

  const steps = [
    {
      title: "What's your name?",
      subtitle: "Let us know what to call you",
      icon: User,
      field: (
        <Input
          type="text"
          placeholder="Your name..."
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="text-center text-lg h-14 bg-background/50 border-border/50"
          autoFocus
        />
      ),
    },
    {
      title: "Give your partner a cute name",
      subtitle: "A special nickname just for them 💗",
      icon: Heart,
      field: (
        <Input
          type="text"
          placeholder="Baby, Jaan, Love..."
          value={formData.partnerNickname}
          onChange={(e) => setFormData({ ...formData, partnerNickname: e.target.value })}
          className="text-center text-lg h-14 bg-background/50 border-border/50"
          autoFocus
        />
      ),
    },
    {
      title: "When did your love story begin?",
      subtitle: "Your relationship start date",
      icon: Calendar,
      field: (
        <Input
          type="date"
          value={formData.relationshipStartDate}
          onChange={(e) => setFormData({ ...formData, relationshipStartDate: e.target.value })}
          className="text-center text-lg h-14 bg-background/50 border-border/50"
          max={new Date().toISOString().split('T')[0]}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              initial={false}
              animate={{
                scale: s === step ? 1.2 : 1,
                opacity: s <= step ? 1 : 0.3,
              }}
              className={`w-3 h-3 rounded-full ${
                s === step
                  ? "bg-primary"
                  : s < step
                  ? "bg-primary/60"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon className="w-10 h-10 text-primary" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">
                {currentStep.title}
              </h2>
              <p className="text-muted-foreground">{currentStep.subtitle}</p>
            </div>

            {/* Input field */}
            <div>{currentStep.field}</div>

            {/* Continue button */}
            <Button
              onClick={handleNext}
              disabled={updateProfile.isPending}
              className="w-full h-14 text-lg bg-primary hover:bg-primary/90"
            >
              {updateProfile.isPending ? (
                "Saving..."
              ) : step === 3 ? (
                "Complete"
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RelationshipOnboarding;
