import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Zap, Info, RefreshCw, X, Trophy, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom CSS styles for animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pop {
    0% { transform: scale(0.8); opacity: 0; }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .animate-pop {
    animation: pop 0.3s ease-out;
  }
  
  @keyframes missAnim {
    0% { transform: scale(0); opacity: 0; }
    60% { transform: scale(1); opacity: 0.8; }
    100% { transform: scale(1.2); opacity: 0; }
  }
  
  .miss-indicator {
    animation: missAnim 0.8s ease-out forwards;
    pointer-events: none;
  }
  
  .transition-all {
    transition: all 0.2s ease;
  }
  
  .target {
    cursor: pointer;
    user-select: none;
  }
`;

interface Target {
  id: number;
  x: number;
  y: number;
  size: number;
  timestamp: number;
}

interface Miss {
  id: number;
  x: number;
  y: number;
}

interface ReactionTime {
  time: number;
  targetNumber: number;
}

// Define difficulty type
type DifficultyType = 'easy' | 'medium' | 'hard';

// Difficulty levels
const difficulties: Record<DifficultyType, { 
  targetCount: number; 
  minDelay: number; 
  maxDelay: number;
  minSize: number;
  maxSize: number;
}> = {
  easy: { 
    targetCount: 10, 
    minDelay: 1500, 
    maxDelay: 3000,
    minSize: 60,
    maxSize: 100
  },
  medium: { 
    targetCount: 15, 
    minDelay: 1000, 
    maxDelay: 2500,
    minSize: 50,
    maxSize: 80
  },
  hard: { 
    targetCount: 20, 
    minDelay: 800, 
    maxDelay: 2000,
    minSize: 40,
    maxSize: 70
  }
};

const QuickTap = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [target, setTarget] = useState<Target | null>(null);
  const [targetsClicked, setTargetsClicked] = useState(0);
  const [missedClicks, setMissedClicks] = useState(0);
  const [missIndicators, setMissIndicators] = useState<Miss[]>([]);
  const [reactionTimes, setReactionTimes] = useState<ReactionTime[]>([]);
  const [averageReactionTime, setAverageReactionTime] = useState(0);
  const [bestReactionTime, setBestReactionTime] = useState(Infinity);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('quickTap_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Initialize new game
  const startGame = () => {
    setIsCountingDown(true);
    setCountdownValue(3);
    setTargetsClicked(0);
    setMissedClicks(0);
    setReactionTimes([]);
    setAverageReactionTime(0);
    setBestReactionTime(Infinity);
    setScore(0);
    setTarget(null);
    setGameOver(false);
  };

  // Handle countdown before game starts
  useEffect(() => {
    if (isCountingDown) {
      if (countdownValue > 0) {
        const timer = setTimeout(() => {
          setCountdownValue(countdownValue - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        setIsCountingDown(false);
        setGameStarted(true);
        spawnNewTarget();
      }
    }
  }, [isCountingDown, countdownValue]);

  // Generate random position for target
  const generateTargetPosition = () => {
    if (!gameAreaRef.current) return { x: 0, y: 0, size: 0 };
    
    const gameArea = gameAreaRef.current;
    const boundingRect = gameArea.getBoundingClientRect();
    
    const difficultySettings = difficulties[difficulty];
    const size = Math.floor(Math.random() * 
      (difficultySettings.maxSize - difficultySettings.minSize + 1)) + 
      difficultySettings.minSize;
    
    // Ensure target is fully visible within game area
    const maxX = boundingRect.width - size;
    const maxY = boundingRect.height - size;
    
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY),
      size
    };
  };

  // Spawn a new target
  const spawnNewTarget = () => {
    if (gameOver) return;
    
    const { x, y, size } = generateTargetPosition();
    const newTarget: Target = {
      id: Date.now(),
      x,
      y,
      size,
      timestamp: Date.now()
    };
    
    setTarget(newTarget);
    
    // If we've spawned all targets for this difficulty, end the game after the last one is clicked
    if (targetsClicked >= difficulties[difficulty].targetCount - 1) {
      return;
    }
    
    // Schedule next target with random delay
    const minDelay = difficulties[difficulty].minDelay;
    const maxDelay = difficulties[difficulty].maxDelay;
    const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    timerRef.current = setTimeout(() => {
      // If the target wasn't clicked, count it as missed
      if (target && target.id === newTarget.id) {
        setMissedClicks(prev => prev + 1);
        spawnNewTarget();
      }
    }, delay);
  };

  // Clean up timers
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Handle target click
  const handleTargetClick = () => {
    if (!target) return;
    
    const currentTime = Date.now();
    const reactionTime = currentTime - target.timestamp;
    
    // Add to reaction times array
    const newReactionTime = {
      time: reactionTime,
      targetNumber: targetsClicked + 1
    };
    setReactionTimes(prev => [...prev, newReactionTime]);
    
    // Update best reaction time
    if (reactionTime < bestReactionTime) {
      setBestReactionTime(reactionTime);
    }
    
    // Calculate score (faster reactions = more points)
    const basePoints = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 150 : 200;
    const speedBonus = Math.max(0, Math.floor(1000 - reactionTime) / 10);
    const newPoints = Math.floor(basePoints + speedBonus);
    
    setScore(prev => prev + newPoints);
    setTargetsClicked(prev => prev + 1);
    
    // Check if all targets have been shown
    if (targetsClicked + 1 >= difficulties[difficulty].targetCount) {
      endGame();
    } else {
      // Spawn next target
      setTarget(null);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      spawnNewTarget();
    }
  };

  // Handle background click (miss)
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only count as a miss if a target is present and it wasn't clicked
    if (!target || !gameStarted || gameOver) return;
    
    // Check if we clicked on the target div or its contents (avoid double counting)
    if (e.currentTarget === e.target) {
      // Get click coordinates relative to the game area
      const rect = gameAreaRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add miss indicator
        const newMiss: Miss = { id: Date.now(), x, y };
        setMissIndicators(prev => [...prev, newMiss]);
        
        // Remove miss indicator after animation completes
        setTimeout(() => {
          setMissIndicators(prev => prev.filter(miss => miss.id !== newMiss.id));
        }, 800);
        
        setMissedClicks(prev => prev + 1);
      }
    }
  };

  // Calculate average reaction time
  useEffect(() => {
    if (reactionTimes.length > 0) {
      const totalTime = reactionTimes.reduce((sum, time) => sum + time.time, 0);
      setAverageReactionTime(Math.floor(totalTime / reactionTimes.length));
    }
  }, [reactionTimes]);

  // End the game
  const endGame = () => {
    setGameOver(true);
    setGameStarted(false);
    
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Check if this is a new best score
    if (score > bestScore[difficulty]) {
      const newBestScore = { ...bestScore };
      newBestScore[difficulty] = score;
      setBestScore(newBestScore);
      localStorage.setItem('quickTap_bestScore', JSON.stringify(newBestScore));
      
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Format time in milliseconds to display nicely
  const formatTime = (ms: number) => {
    if (ms === Infinity) return '-';
    return `${ms} ms`;
  };

  return (
    <div className="min-h-screen bg-red-50 relative overflow-hidden">
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-red-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-red-400 rounded-full transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-red-300 rounded-full transform -translate-y-1/4"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 py-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-xl font-semibold text-red-900">Quick Tap</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/games')}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Games
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game interface */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-red-900 mb-2">Quick Tap Challenge</h1>
              <p className="text-red-600">Tap targets as quickly as they appear to test your reflexes!</p>
            </div>
            
            {!gameStarted && !gameOver ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-red-300 rounded-md bg-red-50 text-red-800"
                  >
                    <option value="easy">Easy (10 targets, larger size)</option>
                    <option value="medium">Medium (15 targets, medium size)</option>
                    <option value="hard">Hard (20 targets, smaller size)</option>
                  </select>
                  <button
                    onClick={startGame}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md"
                  >
                    Start Game
                  </button>
                </div>
                <div className="text-center sm:text-right text-red-800">
                  <p>Best Score: {bestScore[difficulty]}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">TARGETS</p>
                  <p className="text-xl font-bold text-red-800">{targetsClicked}/{difficulties[difficulty].targetCount}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">AVG REACTION</p>
                  <p className="text-xl font-bold text-red-800">{formatTime(averageReactionTime)}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg">
                  <p className="text-xs text-red-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-red-800">{score}</p>
                </div>
              </div>
            )}
          </div>

          {/* Game area */}
          <div 
            ref={gameAreaRef}
            className="w-full h-96 bg-red-50 rounded-xl relative overflow-hidden mt-6 mb-6 border-2 border-red-100"
            onClick={handleBackgroundClick}
          >
            {isCountingDown && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-100 bg-opacity-70 z-20">
                <div className="text-8xl font-bold text-red-600 animate-pulse">
                  {countdownValue}
                </div>
              </div>
            )}
            
            {/* Miss indicators */}
            {missIndicators.map(miss => (
              <div 
                key={miss.id}
                className="absolute miss-indicator"
                style={{
                  left: `${miss.x}px`,
                  top: `${miss.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="w-12 h-12 rounded-full border-2 border-red-500 flex items-center justify-center bg-red-100 bg-opacity-50">
                  <span className="text-red-500 text-sm font-bold">MISS!</span>
                </div>
              </div>
            ))}
            
            {target && (
              <div 
                className="absolute rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg animate-pop target"
                style={{
                  left: `${target.x}px`,
                  top: `${target.y}px`,
                  width: `${target.size}px`,
                  height: `${target.size}px`
                }}
                onClick={handleTargetClick}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="text-white w-1/2 h-1/2" />
                </div>
              </div>
            )}
            
            {!gameStarted && !isCountingDown && !gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap className="h-24 w-24 text-red-400 mb-6" />
                <p className="text-2xl font-bold text-red-600 mb-2">Ready to test your reflexes?</p>
                <p className="text-red-500">Click Start Game to begin!</p>
              </div>
            )}

            {/* Missed Clicks Counter */}
            {gameStarted && !gameOver && (
              <div className="absolute top-2 right-2 bg-white bg-opacity-80 px-3 py-1 rounded-full text-sm">
                <span className="text-red-600 font-medium">Misses: </span>
                <span className="font-bold">{missedClicks}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game over screen */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">
              Challenge Complete!
            </h2>
            
            <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600">Final Score</p>
                <p className="text-3xl font-bold text-red-600">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Accuracy</p>
                <p className="text-3xl font-bold text-red-600">
                  {Math.floor((targetsClicked / (targetsClicked + missedClicks)) * 100)}%
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Average Reaction</p>
                  <p className="text-xl font-bold text-red-600">{formatTime(averageReactionTime)}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg text-center">
                  <p className="text-gray-600 text-sm">Best Reaction</p>
                  <p className="text-xl font-bold text-red-600">{formatTime(bestReactionTime)}</p>
                </div>
              </div>
            </div>
            
            {score > bestScore[difficulty] && (
              <div className="bg-yellow-100 p-3 rounded-lg text-center mb-4 animate-pulse">
                <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                <p className="text-yellow-700 font-bold">New Best Score!</p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startGame}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Play Again
              </button>
              <button
                onClick={() => {
                  setGameOver(false);
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md"
              >
                Change Difficulty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-red-900">How to Play</h3>
              <button 
                onClick={() => setIsInfoOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p><span className="font-bold">Goal:</span> Tap targets as quickly as possible when they appear on screen.</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Circular targets will appear randomly on screen</li>
                <li>Tap each target as quickly as possible</li>
                <li>Your reaction time is measured for each tap</li>
                <li>Complete all targets to finish the challenge</li>
                <li>Clicking anywhere other than the target counts as a miss</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 100 base points per target + speed bonus</li>
                <li>Medium: 150 base points per target + speed bonus</li>
                <li>Hard: 200 base points per target + speed bonus</li>
                <li>Faster reactions earn more points!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve motor response time, visual tracking, and processing speed - skills that can be affected by chemobrain.
              </p>
            </div>
            
            <button
              onClick={() => setIsInfoOpen(false)}
              className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickTap; 