import { useState } from "react";
import { Wine, ArrowLeft, Shuffle, Smile, Flame, ClipboardList, Droplets, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { PremiumFeatureGate } from "./PremiumFeatureGate";
import { PREMIUM_FEATURES } from "@/lib/subscription/plans";

interface TruthOrDrinkGameProps {
  onBack: () => void;
}

type GamePhase = 'rules' | 'categories' | 'playing';
type Category = 'random' | 'playful' | 'spicy';

const challenges = {
  playful: [
    "{name}, do your best impression of your partner!",
    "{name}, sing a love song to your partner!",
    "{name}, give your partner a 30-second massage!",
    "{name}, tell your partner 3 things you love about them!",
    "{name}, do a silly dance for your partner!",
    "{name}, whisper something sweet in your partner's ear!",
    "{name}, feed your partner something by hand!",
    "{name}, recreate your first kiss pose!",
    "{name}, give your partner a compliment in a funny accent!",
    "{name}, draw a heart on your partner's hand with your finger!",
  ],
  spicy: [
    "{name}, give your partner a gentle kiss on the neck!",
    "{name}, let your partner undress you down to your underwear!",
    "{name}, let your partner write a word on your inner thigh with their finger. Guess the word!",
    "{name}, whisper your biggest fantasy to your partner!",
    "{name}, give your partner a slow, sensual back massage!",
    "{name}, kiss your partner's favorite body part!",
    "{name}, let your partner blindfold you and kiss you anywhere they want!",
    "{name}, tell your partner what you want to do to them tonight!",
    "{name}, let your partner trace their lips along your collarbone!",
    "{name}, remove one piece of your partner's clothing using only your teeth!",
    "{name}, give your partner a lap dance for 30 seconds!",
    "{name}, let your partner leave a hickey anywhere they want!",
    "{name}, describe in detail your favorite intimate moment together!",
    "{name}, kiss your partner passionately for 1 minute!",
    "{name}, let your partner choose what you wear (or don't wear) for the rest of the night!",
  ],
};

const TruthOrDrinkGame = ({ onBack }: TruthOrDrinkGameProps) => {
  return (
    <PremiumFeatureGate 
      feature={PREMIUM_FEATURES.TRUTH_OR_DRINK}
      title="🍻 Truth or Drink Game"
      description="Play fun truth or drink questions designed for couples to know each other better!"
      fallback={
        <div className="h-full flex flex-col">
          <div className="flex items-center gap-3 px-4 pt-4 pb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Wine className="w-5 h-5 text-primary" />
                Truth or Drink
              </h1>
            </div>
          </div>
          <div className="flex-1 p-4">
            <PremiumFeatureGate 
              feature={PREMIUM_FEATURES.TRUTH_OR_DRINK}
              title="🍻 Truth or Drink Game"
              description="Play fun truth or drink questions designed for couples to know each other better!"
            />
          </div>
        </div>
      }
    >
      <TruthOrDrinkGameContent onBack={onBack} />
    </PremiumFeatureGate>
  );
};

const TruthOrDrinkGameContent = ({ onBack }: TruthOrDrinkGameProps) => {
  const { data: profile } = useProfile();
  const [phase, setPhase] = useState<GamePhase>('rules');
  const [category, setCategory] = useState<Category | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null);
  const [usedChallenges, setUsedChallenges] = useState<Set<string>>(new Set());
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [sips, setSips] = useState({ player1: 0, player2: 0 });
  const [cardsLeft, setCardsLeft] = useState(0);

  const player1Name = profile?.name || "You";
  const player2Name = profile?.partner_nickname || "Partner";

  const getRandomChallenge = (cat: Category) => {
    let pool: string[] = [];
    if (cat === 'random') {
      pool = [...challenges.playful, ...challenges.spicy];
    } else {
      pool = challenges[cat];
    }
    
    const available = pool.filter(c => !usedChallenges.has(c));
    if (available.length === 0) {
      setUsedChallenges(new Set());
      const challenge = pool[Math.floor(Math.random() * pool.length)];
      const name = currentPlayer === 1 ? player1Name : player2Name;
      return challenge.replace("{name}", name);
    }
    const challenge = available[Math.floor(Math.random() * available.length)];
    setUsedChallenges(prev => new Set([...prev, challenge]));
    const name = currentPlayer === 1 ? player1Name : player2Name;
    return challenge.replace("{name}", name);
  };

  const handleCategorySelect = (cat: Category) => {
    setCategory(cat);
    const totalCards = cat === 'random' 
      ? challenges.playful.length + challenges.spicy.length 
      : challenges[cat].length;
    setCardsLeft(totalCards);
    setCurrentChallenge(getRandomChallenge(cat));
    setPhase('playing');
  };

  const handleDoIt = () => {
    if (category && cardsLeft > 0) {
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      setCardsLeft(prev => prev - 1);
      setTimeout(() => {
        setCurrentChallenge(getRandomChallenge(category));
      }, 100);
    }
  };

  const handleSip = () => {
    setSips(prev => ({
      ...prev,
      [currentPlayer === 1 ? 'player1' : 'player2']: prev[currentPlayer === 1 ? 'player1' : 'player2'] + 1
    }));
    if (category && cardsLeft > 0) {
      setCurrentPlayer(prev => prev === 1 ? 2 : 1);
      setCardsLeft(prev => prev - 1);
      setTimeout(() => {
        setCurrentChallenge(getRandomChallenge(category));
      }, 100);
    }
  };

  const handleReset = () => {
    setPhase('categories');
    setCategory(null);
    setCurrentChallenge(null);
    setUsedChallenges(new Set());
    setSips({ player1: 0, player2: 0 });
    setCurrentPlayer(1);
  };

  const categoryConfig = {
    random: { icon: Shuffle, label: "Random", desc: "Mix of everything!", color: "bg-gray-200 dark:bg-gray-700" },
    playful: { icon: Smile, label: "Playful", desc: "Light & hilarious", color: "bg-gray-100 dark:bg-gray-800" },
    spicy: { icon: Flame, label: "Spicy", desc: "Adventurous & intimate", color: "bg-gray-100 dark:bg-gray-800" },
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={phase === 'rules' ? onBack : () => setPhase(phase === 'playing' ? 'categories' : 'rules')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Wine className="w-5 h-5 text-primary" />
            Truth or Drink
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Rules Phase */}
        {phase === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 px-4 pb-4 overflow-y-auto"
          >
            {/* Game Rules */}
            <div className="bg-muted/50 rounded-2xl p-5 mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4 justify-center">
                <ClipboardList className="w-5 h-5" />
                Game Rules
              </h2>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">🎯</span>
                  Take turns drawing cards with fun challenges
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">🎯</span>
                  Choose: Do the challenge or take a sip
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">🎯</span>
                  Each card is personalized for one of you
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">🎯</span>
                  Have fun and be respectful to each other
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-500">🎯</span>
                  The game ends when all cards are used
                </p>
              </div>
            </div>

            {/* Safety First */}
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-5 mb-6 border border-amber-200/50 dark:border-amber-800/50">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-blue-500" />
                Safety First!
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Sip, don't gulp - pace yourselves</li>
                <li>• Stay hydrated with water between rounds</li>
                <li>• Stop if either of you feels uncomfortable</li>
                <li>• Remember: it's about fun, not getting drunk!</li>
              </ul>
            </div>

            <Button
              onClick={() => setPhase('categories')}
              className="w-full py-6 text-lg rounded-2xl bg-green-500 hover:bg-green-600 text-white"
            >
              Got it! 👍
            </Button>
          </motion.div>
        )}

        {/* Categories Phase */}
        {phase === 'categories' && (
          <motion.div
            key="categories"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 px-4 pb-4 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-foreground text-center mb-6 flex items-center justify-center gap-2">
              Choose Your Adventure 🎯
            </h2>
            
            <div className="space-y-3 flex-1">
              {(Object.keys(categoryConfig) as Category[]).map((cat) => {
                const config = categoryConfig[cat];
                const Icon = config.icon;
                return (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleCategorySelect(cat)}
                    className={`w-full p-5 rounded-xl ${config.color} text-center transition-all border border-border/50`}
                  >
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Icon className="w-5 h-5" />
                      <span className="text-lg font-semibold text-foreground">{config.label}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{config.desc}</p>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex justify-center mt-6">
              <Heart className="w-6 h-6 text-pink-400 fill-pink-400" />
            </div>
          </motion.div>
        )}

        {/* Playing Phase */}
        {phase === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 px-4 pb-4 flex flex-col"
          >
            {/* Player Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className={`rounded-xl p-3 text-center ${currentPlayer === 1 ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted/50'}`}>
                <p className="text-sm font-medium text-foreground truncate">{player1Name}</p>
                <p className="text-xs text-muted-foreground">Sips: {sips.player1}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-foreground">Cards Left</p>
                <p className="text-lg font-bold text-primary">{cardsLeft}</p>
              </div>
              <div className={`rounded-xl p-3 text-center ${currentPlayer === 2 ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted/50'}`}>
                <p className="text-sm font-medium text-foreground truncate">{player2Name}</p>
                <p className="text-xs text-muted-foreground">Sips: {sips.player2}</p>
              </div>
            </div>

            {/* Challenge Card */}
            <motion.div
              key={currentChallenge}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-card rounded-3xl p-6 border border-border/50 flex items-center justify-center min-h-[200px] shadow-lg"
            >
              {cardsLeft > 0 ? (
                <p className="text-lg md:text-xl font-medium text-foreground text-center leading-relaxed">
                  {currentChallenge}
                </p>
              ) : (
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground mb-2">Game Over! 🎉</p>
                  <p className="text-muted-foreground mb-4">
                    {player1Name}: {sips.player1} sips | {player2Name}: {sips.player2} sips
                  </p>
                  <Button onClick={handleReset} variant="romantic">
                    Play Again
                  </Button>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            {cardsLeft > 0 && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  onClick={handleDoIt}
                  className="py-6 text-lg rounded-2xl bg-green-500 hover:bg-green-600 text-white font-semibold"
                >
                  I'll Do It 💪
                </Button>
                <Button
                  onClick={handleSip}
                  className="py-6 text-lg rounded-2xl bg-rose-400 hover:bg-rose-500 text-white font-semibold"
                >
                  I'll Sip 🍷
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TruthOrDrinkGame;
