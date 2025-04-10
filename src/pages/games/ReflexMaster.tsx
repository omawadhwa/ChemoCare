import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, Info, RefreshCw, X, Trophy, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom CSS for animations
const customStyles = `
  .target {
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .target:hover {
    transform: scale(1.05);
  }
  
  .target.active {
    animation: pulse 0.5s ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  .countdown-animation {
    animation: countdownPulse 1s infinite;
  }
  
  @keyframes countdownPulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .result-indicator {
    position: absolute;
    font-weight: bold;
    animation: fadeOut 1s forwards;
    pointer-events: none;
  }
  
  @keyframes fadeOut {
    0% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;

// Difficulty settings
type DifficultyType = 'easy' | 'medium' | 'hard';

interface DifficultySettings {
  targetCount: number;
  minInterval: number;
  maxInterval: number;
  timeLimit: number;
  prematureClickPenalty: number;
}

const difficulties: Record<DifficultyType, DifficultySettings> = {
  easy: {
    targetCount: 10,
    minInterval: 1000,
    maxInterval: 3000,
    timeLimit: 60,
    prematureClickPenalty: 500
  },
  medium: {
    targetCount: 15,
    minInterval: 800,
    maxInterval: 2500,
    timeLimit: 45,
    prematureClickPenalty: 700
  },
  hard: {
    targetCount: 20, 
    minInterval: 600,
    maxInterval: 2000,
    timeLimit: 30,
    prematureClickPenalty: 1000
  }
};

// Result indicator to show times
interface ResultIndicator {
  id: number;
  x: number;
  y: number;
  time: number;
  isGood: boolean;
}

const ReflexMaster: React.FC = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Target state
  const [isTargetActive, setIsTargetActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [targetSize, setTargetSize] = useState(80);
  
  // Game stats
  const [targetsClicked, setTargetsClicked] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);
  const [averageReactionTime, setAverageReactionTime] = useState(0);
  const [bestReactionTime, setBestReactionTime] = useState(Number.MAX_SAFE_INTEGER);
  const [prematureClicks, setPrematureClicks] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [timeLeft, setTimeLeft] = useState(difficulties.medium.timeLimit);
  const [resultIndicators, setResultIndicators] = useState<ResultIndicator[]>([]);
  
  // High scores
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('reflexMaster_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });
  
  // Refs
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const targetActiveTime = useRef<number>(0);
  const targetTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextTargetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate score
  const calculateScore = () => {
    if (targetsClicked === 0) return 0;
    
    // Base score based on targets clicked
    const baseScore = targetsClicked * 100;
    
    // Reaction time bonus (faster = better)
    let reactionTimeBonus = 0;
    if (averageReactionTime > 0) {
      // Lower reaction time gives higher bonus (max 500 points)
      reactionTimeBonus = Math.floor(1000 / averageReactionTime) * 50;
    }
    
    // Penalty for premature clicks
    const prematureClickPenalty = prematureClicks * difficulties[difficulty].prematureClickPenalty;
    
    // Penalty for missed targets
    const missedTargetPenalty = missedTargets * 50;
    
    return Math.max(0, baseScore + reactionTimeBonus - prematureClickPenalty - missedTargetPenalty);
  };

  // Generate a random position for the target
  const generateTargetPosition = useCallback(() => {
    if (!gameAreaRef.current) return { x: 0, y: 0 };
    
    const gameArea = gameAreaRef.current;
    const rect = gameArea.getBoundingClientRect();
    
    // Calculate a random position within the game area (accounting for target size)
    const maxX = rect.width - targetSize;
    const maxY = rect.height - targetSize;
    
    return {
      x: Math.floor(Math.random() * maxX),
      y: Math.floor(Math.random() * maxY)
    };
  }, [targetSize]);

  // Show a target at a random position
  const showTarget = useCallback(() => {
    console.log('Showing target, gameOver:', gameOver);
    if (gameOver) return;
    
    setIsTargetActive(true);
    setTargetPosition(generateTargetPosition());
    targetActiveTime.current = Date.now();
    
    // If target is not clicked within 2 seconds, consider it missed
    targetTimeoutRef.current = setTimeout(() => {
      console.log('Target timed out');
      setIsTargetActive(false);
      setMissedTargets(prev => prev + 1);
      
      // Schedule next target
      const nextDelay = Math.floor(
        Math.random() * 
        (difficulties[difficulty].maxInterval - difficulties[difficulty].minInterval) + 
        difficulties[difficulty].minInterval
      );
      
      console.log('Scheduling next target in', nextDelay, 'ms');
      nextTargetTimeoutRef.current = setTimeout(showTarget, nextDelay);
    }, 2000);
  }, [difficulty, gameOver, generateTargetPosition]);

  // Handle target click
  const handleTargetClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling to game area
    console.log('Target clicked');
    
    if (!isTargetActive || gameOver) return;
    
    // Calculate reaction time
    const now = Date.now();
    const reactionTime = now - targetActiveTime.current;
    console.log('Reaction time:', reactionTime, 'ms');
    
    // Add a visual indicator
    const newIndicator: ResultIndicator = {
      id: Date.now(),
      x: targetPosition.x + targetSize / 2,
      y: targetPosition.y,
      time: reactionTime,
      isGood: reactionTime < 1000 // less than 1 second is considered good
    };
    setResultIndicators(prev => [...prev, newIndicator]);
    
    // Remove indicator after animation
    setTimeout(() => {
      setResultIndicators(prev => prev.filter(indicator => indicator.id !== newIndicator.id));
    }, 1000);
    
    // Update stats
    setTargetsClicked(prev => prev + 1);
    setTotalReactionTime(prev => prev + reactionTime);
    setAverageReactionTime(Math.floor((totalReactionTime + reactionTime) / (targetsClicked + 1)));
    setBestReactionTime(prev => Math.min(prev, reactionTime));
    
    // Clear target
    setIsTargetActive(false);
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current);
      targetTimeoutRef.current = null;
    }
    
    // Check if game should end
    if (targetsClicked + 1 >= difficulties[difficulty].targetCount) {
      console.log('Game completed - all targets clicked');
      endGame();
      return;
    }
    
    // Schedule next target
    const nextDelay = Math.floor(
      Math.random() * 
      (difficulties[difficulty].maxInterval - difficulties[difficulty].minInterval) + 
      difficulties[difficulty].minInterval
    );
    
    console.log('Next target in', nextDelay, 'ms');
    nextTargetTimeoutRef.current = setTimeout(showTarget, nextDelay);
  };

  // Handle game area click (when no target is active)
  const handleGameAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Game area clicked, isTargetActive:', isTargetActive);
    
    if (isTargetActive || !gameStarted || gameOver || isCountingDown) return;
    
    // Count as premature click
    setPrematureClicks(prev => prev + 1);
    console.log('Premature click recorded');
    
    // Create a visual indicator at click position
    const rect = gameAreaRef.current?.getBoundingClientRect();
    if (rect) {
      const newIndicator: ResultIndicator = {
        id: Date.now(),
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        time: 0,
        isGood: false
      };
      setResultIndicators(prev => [...prev, newIndicator]);
      
      // Remove indicator after animation
      setTimeout(() => {
        setResultIndicators(prev => prev.filter(indicator => indicator.id !== newIndicator.id));
      }, 1000);
    }
  };

  // Start a new game
  const startGame = (difficulty: DifficultyType) => {
    console.log(`Starting game with difficulty: ${difficulty}`);
    setDifficulty(difficulty);
    setGameStarted(true);
    setGameOver(false);
    setIsCountingDown(true);
    setCountdownValue(3);
    setTimeLeft(difficulties[difficulty].timeLimit);
    
    // Reset game state
    setTargetsClicked(0);
    setTotalReactionTime(0);
    setAverageReactionTime(0);
    setBestReactionTime(Number.MAX_SAFE_INTEGER);
    setPrematureClicks(0);
    setMissedTargets(0);
    setIsTargetActive(false);
    setResultIndicators([]);
    
    // Clear any existing timeouts
    if (targetTimeoutRef.current) {
      clearTimeout(targetTimeoutRef.current);
    }
    
    // Start countdown
    setCountdownValue(3);
    const countdownInterval = setInterval(() => {
      setCountdownValue((prev) => {
        console.log(`Countdown: ${prev - 1}`);
        if (prev <= 1) {
          clearInterval(countdownInterval);
          console.log("Countdown complete, showing first target");
          // Show the first target after countdown
          showTarget();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    setIsTargetActive(false);
    
    // Clear timeouts
    if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
    if (nextTargetTimeoutRef.current) clearTimeout(nextTargetTimeoutRef.current);
    
    // Calculate final score
    const finalScore = calculateScore();
    
    // Update best score if needed
    if (finalScore > bestScore[difficulty]) {
      const newBestScore = { ...bestScore };
      newBestScore[difficulty] = finalScore;
      setBestScore(newBestScore);
      localStorage.setItem('reflexMaster_bestScore', JSON.stringify(newBestScore));
      
      // Celebrate with confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  // Countdown effect
  useEffect(() => {
    if (isCountingDown) {
      console.log('Countdown:', countdownValue);
      if (countdownValue > 0) {
        const timer = setTimeout(() => {
          setCountdownValue(countdownValue - 1);
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        console.log('Countdown complete, starting game');
        setIsCountingDown(false);
        setGameStarted(true);
        setGameOver(false);
        
        // Start first target after a short delay
        const initialDelay = Math.floor(
          Math.random() * 
          (difficulties[difficulty].maxInterval - difficulties[difficulty].minInterval) + 
          difficulties[difficulty].minInterval
        );
        console.log('Showing first target in', initialDelay, 'ms');
        setTimeout(() => {
          showTarget();
        }, initialDelay);
      }
    }
  }, [isCountingDown, countdownValue, difficulty, showTarget]);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver && !isCountingDown) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer!);
            endGame();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver, isCountingDown]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (targetTimeoutRef.current) clearTimeout(targetTimeoutRef.current);
      if (nextTargetTimeoutRef.current) clearTimeout(nextTargetTimeoutRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-orange-800">
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
      {/* Navigation */}
      <div className="relative z-10 py-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-xl font-semibold text-red-900">Reflex Master</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowInstructions(true)}
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

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions Modal */}
        {showInstructions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl text-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-red-900">How to Play</h3>
                <button 
                  onClick={() => setShowInstructions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-3">
                <p><span className="font-bold">Goal:</span> Click on targets as quickly as possible when they appear!</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Circular targets will appear randomly on the screen</li>
                  <li>Click on them as fast as you can</li>
                  <li>Your reaction time is measured for each click</li>
                  <li>Be careful! Clicking when no target is visible counts as a premature click and reduces your score</li>
                  <li>If you don't click a target within 2 seconds, it will disappear and count as missed</li>
                </ul>
                <p><span className="font-bold">Scoring:</span></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Base score: 100 points per target clicked</li>
                  <li>Reaction time bonus: faster reactions earn more points</li>
                  <li>Premature clicks and missed targets reduce your score</li>
                </ul>
                <p className="italic text-sm pt-2">
                  This exercise helps improve response time, visual vigilance, and hand-eye coordination - cognitive skills that can be affected by chemotherapy.
                </p>
              </div>
              
              <button
                onClick={() => setShowInstructions(false)}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
        
        {/* Game Content */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          {!gameStarted ? (
            /* Start Screen */
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-900 mb-6">Select Difficulty Level</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <button
                  onClick={() => {
                    console.log('Easy button clicked');
                    startGame('easy');
                  }}
                  className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Easy</h3>
                  <p>{difficulties.easy.targetCount} targets</p>
                  <p>Slower pace</p>
                </button>
                
                <button
                  onClick={() => {
                    console.log('Medium button clicked');
                    startGame('medium');
                  }}
                  className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Medium</h3>
                  <p>{difficulties.medium.targetCount} targets</p>
                  <p>Medium pace</p>
                </button>
                
                <button
                  onClick={() => {
                    console.log('Hard button clicked');
                    startGame('hard');
                  }}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Hard</h3>
                  <p>{difficulties.hard.targetCount} targets</p>
                  <p>Fast pace</p>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-red-900 font-bold mb-2">Best Score: {bestScore[difficulty]}</h3>
              </div>
              
              <button
                onClick={() => setShowInstructions(true)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition text-white"
              >
                How to Play
              </button>
            </div>
          ) : gameOver ? (
            /* Game Over Screen */
            <div className="text-center">
              <h2 className="text-3xl font-bold text-red-900 mb-6">Game Over!</h2>
              
              <div className="bg-red-50 rounded-lg p-6 mb-8">
                <h3 className="text-2xl font-bold text-red-900 mb-4">Your Results</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-900">Final Score</p>
                    <p className="text-3xl font-bold text-red-900">{calculateScore()}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-900">Average Reaction</p>
                    <p className="text-3xl font-bold text-red-900">
                      {averageReactionTime ? `${averageReactionTime}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-green-900">Targets Hit</p>
                    <p className="text-2xl font-bold text-green-900">
                      {targetsClicked}/{difficulties[difficulty].targetCount}
                    </p>
                  </div>
                  <div className="bg-red-200 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-red-900">Premature</p>
                    <p className="text-2xl font-bold text-red-900">{prematureClicks}</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <p className="text-sm font-semibold text-yellow-800">Best Time</p>
                    <p className="text-2xl font-bold text-yellow-800">
                      {bestReactionTime !== Number.MAX_SAFE_INTEGER ? `${bestReactionTime}ms` : 'N/A'}
                    </p>
                  </div>
                </div>
                
                {calculateScore() > bestScore[difficulty] && (
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg animate-pulse">
                    <p className="text-xl font-bold text-yellow-800">New Best Score! 🎉</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => startGame(difficulty)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md transition text-white"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    setGameStarted(false);
                    setGameOver(false);
                  }}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition text-white"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          ) : (
            /* Active Game Screen */
            <div>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-red-600 font-medium">TARGETS</p>
                  <p className="text-xl font-bold text-red-900">
                    {targetsClicked}/{difficulties[difficulty].targetCount}
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-red-600 font-medium">TIME LEFT</p>
                  <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-red-900'}`}>
                    {timeLeft}s
                  </p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-red-600 font-medium">AVG REACTION</p>
                  <p className="text-xl font-bold text-red-900">
                    {averageReactionTime ? `${averageReactionTime}ms` : '-'}
                  </p>
                </div>
              </div>
              
              {isCountingDown ? (
                <div className="flex items-center justify-center h-80">
                  <div className="text-6xl font-bold text-red-600 countdown-animation">
                    {countdownValue}
                  </div>
                </div>
              ) : (
                <div 
                  ref={gameAreaRef}
                  className="relative bg-neutral-100 h-80 w-full rounded-lg overflow-hidden cursor-pointer"
                  onClick={handleGameAreaClick}
                >
                  {isTargetActive && (
                    <div
                      className="absolute target bg-red-600 rounded-full flex items-center justify-center"
                      style={{
                        width: `${targetSize}px`,
                        height: `${targetSize}px`,
                        left: `${targetPosition.x}px`,
                        top: `${targetPosition.y}px`,
                        boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                      }}
                      onClick={(e) => handleTargetClick(e)}
                    >
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                  )}
                  
                  {/* Result indicators */}
                  {resultIndicators.map(indicator => (
                    <div
                      key={indicator.id}
                      className="result-indicator"
                      style={{
                        left: `${indicator.x}px`,
                        top: `${indicator.y}px`,
                        color: indicator.isGood ? '#10B981' : '#EF4444'
                      }}
                    >
                      {indicator.isGood ? (
                        `${indicator.time}ms`
                      ) : (
                        <AlertTriangle className="h-5 w-5" />
                      )}
                    </div>
                  ))}
                  
                  {/* Overlay instructions */}
                  {!isTargetActive && targetsClicked === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-700 text-lg font-semibold bg-transparent p-4 text-center">
                      Wait for the target to appear, then click it as fast as you can!
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 text-center text-red-900 text-sm">
                <p className="flex justify-center items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  Clicking when no target is visible will reduce your score
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Helps With Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">This Game Helps With:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Reaction Time</h3>
              <p className="text-red-800">Improving how quickly your brain processes visual information and initiates a motor response.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Visual Attention</h3>
              <p className="text-red-800">Enhancing your ability to sustain focus and quickly detect visual changes in your environment.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Motor Control</h3>
              <p className="text-red-800">Strengthening the coordination between what you see and how quickly your hands can respond.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflexMaster; 