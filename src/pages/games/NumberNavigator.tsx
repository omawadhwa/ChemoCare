import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart4, ArrowLeft, Trophy, RefreshCw, Info, X, Check, AlertTriangle, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom CSS for animations
const customStyles = `
  .number-card {
    transition: all 0.2s ease;
  }
  
  .number-card:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  .number-card.correct {
    background-color: rgba(74, 222, 128, 0.2);
    border-color: #22c55e;
    animation: correctPulse 0.5s ease;
  }
  
  .number-card.incorrect {
    background-color: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
    animation: incorrectShake 0.5s ease;
  }
  
  @keyframes correctPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @keyframes incorrectShake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  
  .sequence-item {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

// Difficulty types
type DifficultyType = 'easy' | 'medium' | 'hard';

// Sequence types
type SequenceType = 'arithmetic' | 'geometric' | 'fibonacci' | 'prime' | 'square' | 'cube';

// Game settings for each difficulty
interface DifficultySettings {
  sequenceLength: number;
  timeLimit: number;
  maxHiddenTerms: number;
  availableTypes: SequenceType[];
  pointsPerCorrect: number;
}

const difficulties: Record<DifficultyType, DifficultySettings> = {
  easy: {
    sequenceLength: 6,
    timeLimit: 120, // 2 minutes
    maxHiddenTerms: 1,
    availableTypes: ['arithmetic', 'geometric'],
    pointsPerCorrect: 10
  },
  medium: {
    sequenceLength: 8,
    timeLimit: 150, // 2.5 minutes
    maxHiddenTerms: 2,
    availableTypes: ['arithmetic', 'geometric', 'fibonacci', 'square'],
    pointsPerCorrect: 15
  },
  hard: {
    sequenceLength: 10,
    timeLimit: 180, // 3 minutes
    maxHiddenTerms: 3,
    availableTypes: ['arithmetic', 'geometric', 'fibonacci', 'prime', 'square', 'cube'],
    pointsPerCorrect: 20
  }
};

interface Sequence {
  type: SequenceType;
  terms: number[];
  hiddenIndices: number[];
  description: string;
}

interface GameState {
  currentSequence: Sequence | null;
  round: number;
  score: number;
  answers: (number | null)[];
  feedback: string | null;
  feedbackType: 'success' | 'error' | null;
  sequences: Sequence[];
  totalRounds: number;
}

const NumberNavigator: React.FC = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [timeLeft, setTimeLeft] = useState(difficulties.medium.timeLimit);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [userInput, setUserInput] = useState<string[]>([]);
  
  // Game progress state
  const [gameState, setGameState] = useState<GameState>({
    currentSequence: null,
    round: 0,
    score: 0,
    answers: [],
    feedback: null,
    feedbackType: null,
    sequences: [],
    totalRounds: 10
  });
  
  // High scores
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('numberNavigator_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Generate sequences for the game
  const generateSequences = useCallback((difficultyLevel: DifficultyType): Sequence[] => {
    const settings = difficulties[difficultyLevel];
    const sequences: Sequence[] = [];
    
    for (let i = 0; i < 10; i++) { // Generate 10 sequences for the game
      // Pick a random sequence type from available types for this difficulty
      const type = settings.availableTypes[Math.floor(Math.random() * settings.availableTypes.length)];
      
      // Generate sequence terms based on the type
      const terms = generateSequenceTerms(type, settings.sequenceLength);
      
      // Choose random indices to hide
      const hiddenCount = Math.min(
        1 + Math.floor(Math.random() * settings.maxHiddenTerms),
        settings.sequenceLength - 2 // Ensure at least 2 terms are visible
      );
      
      const hiddenIndices: number[] = [];
      while (hiddenIndices.length < hiddenCount) {
        const idx = 1 + Math.floor(Math.random() * (settings.sequenceLength - 2)); // Don't hide first or last
        if (!hiddenIndices.includes(idx)) {
          hiddenIndices.push(idx);
        }
      }
      
      // Generate description
      const description = generateSequenceDescription(type);
      
      sequences.push({
        type,
        terms,
        hiddenIndices,
        description
      });
    }
    
    return sequences;
  }, []);

  // Generate terms for a specific sequence type
  const generateSequenceTerms = (type: SequenceType, length: number): number[] => {
    switch (type) {
      case 'arithmetic': {
        // Common difference between 1 and 10
        const commonDiff = 1 + Math.floor(Math.random() * 10);
        
        // First term between 1 and 20
        const firstTerm = 1 + Math.floor(Math.random() * 20);
        
        return Array.from({ length }, (_, i) => firstTerm + commonDiff * i);
      }
      case 'geometric': {
        // Common ratio between 2 and 3
        const commonRatio = 2 + Math.floor(Math.random() * 2);
        
        // First term between 1 and 5
        const firstTerm = 1 + Math.floor(Math.random() * 5);
        
        return Array.from({ length }, (_, i) => firstTerm * Math.pow(commonRatio, i));
      }
      case 'fibonacci': {
        // Start with standard Fibonacci, shift it by a small random amount
        const shift = Math.floor(Math.random() * 10);
        const result = [1 + shift, 1 + shift];
        
        for (let i = 2; i < length; i++) {
          result.push(result[i-1] + result[i-2]);
        }
        
        return result;
      }
      case 'prime': {
        // Use pre-computed list of primes
        const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        
        // Start from a random position in the list
        const startIdx = Math.min(Math.floor(Math.random() * (primes.length - length)), primes.length - length);
        
        return primes.slice(startIdx, startIdx + length);
      }
      case 'square': {
        // Start with a random number between 1 and 7
        const start = 1 + Math.floor(Math.random() * 7);
        
        return Array.from({ length }, (_, i) => Math.pow(start + i, 2));
      }
      case 'cube': {
        // Start with a random number between 1 and 5
        const start = 1 + Math.floor(Math.random() * 5);
        
        return Array.from({ length }, (_, i) => Math.pow(start + i, 3));
      }
      default:
        return [1, 2, 3, 4, 5]; // Fallback
    }
  };

  // Generate description for sequence type
  const generateSequenceDescription = (type: SequenceType): string => {
    switch (type) {
      case 'arithmetic':
        return "Arithmetic sequence (add or subtract a constant value)";
      case 'geometric':
        return "Geometric sequence (multiply or divide by a constant value)";
      case 'fibonacci':
        return "Fibonacci-like sequence (each term is the sum of the two preceding terms)";
      case 'prime':
        return "Prime number sequence";
      case 'square':
        return "Square number sequence";
      case 'cube':
        return "Cube number sequence";
      default:
        return "Number sequence";
    }
  };

  // Get detailed hint for a sequence type
  const getPatternHint = (type: SequenceType): string => {
    switch (type) {
      case 'arithmetic':
        return "Look for a constant difference between consecutive terms. For example: 2, 5, 8, 11, 14... (adding 3 each time)";
      case 'geometric':
        return "Look for a constant ratio between consecutive terms. For example: 2, 6, 18, 54... (multiplying by 3 each time)";
      case 'fibonacci':
        return "Each number is the sum of the two preceding ones. For example: 1, 1, 2, 3, 5, 8... (1+1=2, 1+2=3, 2+3=5, etc.)";
      case 'prime':
        return "These are numbers that are only divisible by 1 and themselves. For example: 2, 3, 5, 7, 11, 13...";
      case 'square':
        return "These are perfect square numbers. For example: 1, 4, 9, 16, 25... (1², 2², 3², 4², 5²)";
      case 'cube':
        return "These are perfect cube numbers. For example: 1, 8, 27, 64... (1³, 2³, 3³, 4³)";
      default:
        return "Look for a pattern in how the numbers change from one to the next.";
    }
  };

  // Initialize a new game
  const initializeGame = useCallback(() => {
    const settings = difficulties[difficulty];
    const sequences = generateSequences(difficulty);
    
    setGameState({
      currentSequence: sequences[0],
      round: 1,
      score: 0,
      answers: Array(settings.maxHiddenTerms).fill(null),
      feedback: null,
      feedbackType: null,
      sequences,
      totalRounds: 10
    });
    
    setTimeLeft(settings.timeLimit);
    setGameOver(false);
    setUserInput(Array(settings.maxHiddenTerms).fill(''));
  }, [difficulty, generateSequences]);

  // Start a new game
  const startGame = (difficultyLevel: DifficultyType) => {
    setDifficulty(difficultyLevel);
    setGameStarted(true);
    initializeGame();
  };

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            endGame(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      clearInterval(timer);
    };
  }, [gameStarted, gameOver, endGame]);

  // Format time for display
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  // State for hint dropdown
  const [showHint, setShowHint] = useState(false);

  return (
    <div className="min-h-screen bg-green-50 relative overflow-hidden">
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-green-400 rounded-full transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-green-300 rounded-full transform -translate-y-1/4"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 py-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <BarChart4 className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-green-900">Number Navigator</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/games')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
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
              <h1 className="text-2xl font-bold text-green-900 mb-2">Number Navigator Challenge</h1>
              <p className="text-green-600">Identify patterns in number sequences to boost mathematical thinking.</p>
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-green-300 rounded-md bg-green-50 text-green-800"
                  >
                    <option value="easy">Easy (Simple Patterns)</option>
                    <option value="medium">Medium (More Complex)</option>
                    <option value="hard">Hard (Advanced)</option>
                  </select>
                  <button
                    onClick={() => startGame(difficulty)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md"
                  >
                    Start Game
                  </button>
                </div>
                <div className="text-center sm:text-right text-green-800">
                  <p>Best Score: {bestScore[difficulty]}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">TIME LEFT</p>
                  <p className={`text-xl font-bold ${timeLeft < 30 ? 'text-red-600 animate-pulse' : 'text-green-800'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-green-800">{gameState.score}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">ROUND</p>
                  <p className="text-xl font-bold text-green-800">{gameState.round}/{gameState.totalRounds}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Feedback message */}
          {gameState.feedback && (
            <div className={`mb-6 p-3 rounded-lg text-center ${
              gameState.feedbackType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-bold flex items-center justify-center">
                {gameState.feedbackType === 'success' ? (
                  <Check className="h-5 w-5 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                {gameState.feedback}
              </p>
            </div>
          )}

          {/* Game board */}
          {gameStarted && gameState.currentSequence && (
            <div className="fade-in">
              <div className="mb-6 relative">
                <div 
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg cursor-pointer transition-colors"
                  onClick={() => setShowHint(!showHint)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Hint</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${showHint ? 'transform rotate-180' : ''}`} />
                  </div>
                  
                  {showHint && (
                    <div className="mt-2 pt-2 border-t border-green-200">
                      <p className="text-green-800">
                        {gameState.currentSequence.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-green-800 font-medium mb-4">Fill in the missing numbers in the sequence:</h3>
                
                <div className="flex flex-wrap justify-center gap-3 mb-6">
                  {gameState.currentSequence.terms.map((term, index) => {
                    const isHidden = gameState.currentSequence?.hiddenIndices.includes(index);
                    const inputIndex = gameState.currentSequence?.hiddenIndices.indexOf(index) || 0;
                    
                    return (
                      <div 
                        key={index}
                        className="sequence-item"
                      >
                        {isHidden ? (
                          <div className="w-16 h-16 rounded-lg border-2 border-dashed border-green-400 flex items-center justify-center bg-white">
                            <input
                              type="text"
                              value={userInput[inputIndex] || ''}
                              onChange={(e) => {
                                const newInput = [...userInput];
                                newInput[inputIndex] = e.target.value.replace(/[^0-9-]/g, '');
                                setUserInput(newInput);
                              }}
                              className="w-full h-full text-center text-lg font-bold text-green-600 bg-transparent focus:outline-none"
                              placeholder="?"
                              maxLength={4}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-green-600 text-white flex items-center justify-center">
                            <span className="text-lg font-bold">{term}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-center gap-4">
                  <button
                    onClick={checkAnswer}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors shadow"
                  >
                    Check Answer
                  </button>
                  <button
                    onClick={skipRound}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors shadow"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                  {gameState.round > gameState.totalRounds ? '🎉 All Rounds Complete! 🎉' : '⏱️ Time\'s Up! ⏱️'}
                </h2>
                
                <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600">Final Score</p>
                    <p className="text-3xl font-bold text-green-600">{gameState.score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Rounds Completed</p>
                    <p className="text-3xl font-bold text-green-600">
                      {Math.min(gameState.round - 1, gameState.totalRounds)}/{gameState.totalRounds}
                    </p>
                  </div>
                </div>
                
                {gameState.score > bestScore[difficulty] && (
                  <div className="bg-yellow-100 p-3 rounded-lg text-center mb-4 animate-pulse">
                    <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                    <p className="text-yellow-700 font-bold">New Best Score!</p>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      initializeGame();
                      setGameOver(false);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Play Again
                  </button>
                  <button
                    onClick={() => {
                      setGameStarted(false);
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
        </div>
        
        {/* Helps With Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-900 mb-4">This Game Helps With:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-green-900">Pattern Recognition</h3>
              <p className="text-green-800">Enhances your ability to identify logical patterns and relationships between numbers.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-green-900">Mathematical Thinking</h3>
              <p className="text-green-800">Improves logical reasoning and mathematical problem-solving skills.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-green-900">Working Memory</h3>
              <p className="text-green-800">Exercises your ability to hold and manipulate information mentally while solving problems.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-green-900">How to Play</h3>
              <button 
                onClick={() => setIsInfoOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p><span className="font-bold">Goal:</span> Identify the missing numbers in mathematical sequences.</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You'll be shown a sequence of numbers with some values missing</li>
                <li>Each sequence follows a specific pattern (arithmetic, geometric, etc.)</li>
                <li>Fill in the missing values based on the pattern</li>
                <li>Use the hint button if you need help understanding the pattern</li>
                <li>Complete as many sequences as you can before time runs out</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 10 points per correct answer</li>
                <li>Medium: 15 points per correct answer</li>
                <li>Hard: 20 points per correct answer</li>
                <li>Complete all 10 rounds to maximize your score!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve pattern recognition, mathematical thinking, and working memory - cognitive skills that can be affected by chemotherapy.
              </p>
            </div>
            
            <button
              onClick={() => setIsInfoOpen(false)}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  // Check the user's answers
  function checkAnswer() {
    if (!gameState.currentSequence) return;
    
    const { currentSequence } = gameState;
    const correctAnswers = currentSequence.hiddenIndices.map(index => currentSequence.terms[index]);
    const userAnswers = userInput.map(input => parseInt(input) || 0);
    
    const allCorrect = correctAnswers.every((answer, idx) => answer === userAnswers[idx]);
    
    if (allCorrect) {
      // Calculate points
      const settings = difficulties[difficulty];
      const pointsEarned = settings.pointsPerCorrect * correctAnswers.length;
      
      // Show success feedback
      setGameState(prev => ({
        ...prev,
        score: prev.score + pointsEarned,
        feedback: `+${pointsEarned} points! Correct!`,
        feedbackType: 'success'
      }));
      
      // Show confetti for correct answer
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Close hint if open
      setShowHint(false);
      
      // Move to next round after a delay
      setTimeout(() => {
        moveToNextRound();
      }, 1500);
    } else {
      // Show error feedback
      setGameState(prev => ({
        ...prev,
        feedback: `Not quite! Try again or use the hint for help.`,
        feedbackType: 'error'
      }));
    }
  }
  
  // Move to the next round
  function moveToNextRound() {
    if (gameState.round >= gameState.totalRounds) {
      // Game over - all rounds complete
      endGame(true);
      return;
    }
    
    const nextRound = gameState.round + 1;
    const nextSequence = gameState.sequences[nextRound - 1];
    
    // Reset user input for the new sequence
    setUserInput(Array(nextSequence.hiddenIndices.length).fill(''));
    
    // Close hint if open
    setShowHint(false);
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      currentSequence: nextSequence,
      round: nextRound,
      feedback: null,
      feedbackType: null
    }));
  }
  
  // Skip the current round
  function skipRound() {
    moveToNextRound();
  }
  
  // End the game
  function endGame(completed: boolean = false) {
    setGameOver(true);
    
    // Update best score if this score is higher
    if (gameState.score > bestScore[difficulty]) {
      const newBestScore = { ...bestScore };
      newBestScore[difficulty] = gameState.score;
      setBestScore(newBestScore);
      localStorage.setItem('numberNavigator_bestScore', JSON.stringify(newBestScore));
      
      // Show confetti for new high score
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Extra confetti if all rounds completed
    if (completed) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  }
};

export default NumberNavigator; 