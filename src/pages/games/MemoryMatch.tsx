import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Trophy, RefreshCw, Info, X } from 'lucide-react';
import confetti from 'canvas-confetti';

// Define card type
interface CardType {
  id?: number;
  emoji: string;
  matched: boolean;
  flipped?: boolean;
}

// Card emojis - using simple emoji characters instead of images
const cardEmojis: string[] = [
  "🐶", // Dog
  "🐱", // Cat
  "🐭", // Mouse
  "🐹", // Hamster
  "🐰", // Rabbit
  "🦊", // Fox
  "🐻", // Bear
  "🐼", // Panda
  "🦁", // Lion
  "🐯", // Tiger
  "🐨", // Koala
  "🐘", // Elephant
  "🦒", // Giraffe
  "🦓", // Zebra
  "🦍", // Gorilla
];

// Define difficulty type
type DifficultyType = 'easy' | 'medium' | 'hard';

// Difficulty levels
const difficulties: Record<DifficultyType, { pairs: number; timeLimit: number }> = {
  easy: { pairs: 6, timeLimit: 120 },
  medium: { pairs: 8, timeLimit: 90 },
  hard: { pairs: 10, timeLimit: 60 }
};

// Add custom CSS for card animation - replacing 3D flip with simple fade/scale
const cardFlipStyle = `
  .memory-card {
    height: 150px;
  }
  
  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    cursor: pointer;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 0.5rem;
    transition: transform 0.2s ease;
  }
  
  .card-inner:hover {
    transform: scale(1.03);
  }
  
  .card-front, .card-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.3s ease;
  }
  
  .card-front {
    background: linear-gradient(135deg, #3b82f6, #1e40af);
    color: white;
    opacity: 1;
  }
  
  .card-back {
    background-color: white;
    opacity: 0;
    overflow: hidden;
    font-size: 4rem;
  }
  
  /* Flipped state */
  .card-flipped .card-front {
    opacity: 0;
  }
  
  .card-flipped .card-back {
    opacity: 1;
  }
  
  .matched-overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(74, 222, 128, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .preview-pulse {
    animation: pulse 1s infinite;
  }
`;

const MemoryMatch = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardType[]>([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState<CardType | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<CardType | null>(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(difficulties[difficulty].timeLimit);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewTimeLeft, setPreviewTimeLeft] = useState(20);
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('memoryMatch_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Shuffle cards - completely rewritten to use emojis
  const shuffleCards = () => {
    const pairsToUse = difficulties[difficulty].pairs;
    
    // Shuffle the emojis and take the ones we need for this difficulty
    const shuffledEmojis = [...cardEmojis].sort(() => Math.random() - 0.5).slice(0, pairsToUse);
    
    // Create pairs from the selected emojis
    const cardPairs: CardType[] = [];
    shuffledEmojis.forEach(emoji => {
      // Add exactly two of each emoji to ensure pairs
      cardPairs.push({ emoji, matched: false, flipped: true });
      cardPairs.push({ emoji, matched: false, flipped: true });
    });
    
    // Shuffle the pairs and assign unique IDs
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: index }));
    
    setCards(shuffledCards);
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(0);
    setScore(0);
    setGameOver(false);
    setTimeLeft(difficulties[difficulty].timeLimit);
    setIsPreviewMode(true);
    setPreviewTimeLeft(20);
  };

  // Start preview mode
  useEffect(() => {
    let previewTimer: ReturnType<typeof setTimeout>;
    if (isPreviewMode && previewTimeLeft > 0) {
      previewTimer = setTimeout(() => {
        setPreviewTimeLeft(previewTimeLeft - 1);
      }, 1000);
    } else if (isPreviewMode && previewTimeLeft <= 0) {
      // End preview mode and flip all cards back
      setIsPreviewMode(false);
      setCards(prevCards => 
        prevCards.map(card => ({ ...card, flipped: false }))
      );
    }

    return () => clearTimeout(previewTimer);
  }, [isPreviewMode, previewTimeLeft]);

  // Start new game
  const startGame = () => {
    shuffleCards();
    setGameStarted(true);
  };

  // Handle card click
  const handleChoice = (card: CardType) => {
    // Don't allow clicks during preview mode
    if (isPreviewMode) return;
    
    // Prevent clicking on already matched or flipped cards
    if (card.matched || card.flipped) return;
    
    // Flip the card immediately on click for visual feedback
    setCards(prevCards => {
      return prevCards.map(c => {
        if (c.id === card.id) {
          return { ...c, flipped: true };
        }
        return c;
      });
    });
    
    if (!choiceOne) {
      setChoiceOne(card);
    } else if (!choiceTwo) {
      setChoiceTwo(card);
    }
  };

  // Timer effect - only start counting when preview mode is over
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameStarted && !gameOver && timeLeft > 0 && !isPreviewMode) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver && !isPreviewMode) {
      setGameOver(true);
    }

    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, gameOver, isPreviewMode]);

  // Reset choices & increase turn
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };

  // Check if game is completed
  useEffect(() => {
    if (gameStarted && cards.length > 0 && cards.every(card => card.matched) && !isPreviewMode) {
      setGameOver(true);
      // Update best score
      const newBestScore = { ...bestScore };
      if (score > bestScore[difficulty]) {
        newBestScore[difficulty] = score;
        setBestScore(newBestScore);
        localStorage.setItem('memoryMatch_bestScore', JSON.stringify(newBestScore));
        
        // Trigger confetti effect for new best score
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [cards, gameStarted, score, bestScore, difficulty, isPreviewMode]);

  // Compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      
      if (choiceOne.emoji === choiceTwo.emoji && choiceOne.id !== choiceTwo.id) {
        // It's a match!
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.id === choiceOne.id || card.id === choiceTwo.id) {
              return { ...card, matched: true };
            }
            return card;
          });
        });
        
        // Calculate score based on speed and difficulty
        const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        const timeBonus = Math.floor(timeLeft / 10);
        const newPoints = basePoints + timeBonus;
        
        setScore(prevScore => prevScore + newPoints);
        
        resetTurn();
      } else {
        // Not a match - flip cards back after delay
        setTimeout(() => {
          setCards(prevCards => {
            return prevCards.map(card => {
              if (card.id === choiceOne.id || card.id === choiceTwo.id) {
                return { ...card, flipped: false };
              }
              return card;
            });
          });
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo, difficulty, timeLeft]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Inject custom CSS styles */}
      <style>{cardFlipStyle}</style>
      
      {/* Background pattern */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-400 rounded-full transform translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-300 rounded-full transform -translate-y-1/4"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 py-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-blue-900">Memory Match</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsInfoOpen(true)}
              className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
            >
              <Info className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/games')}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
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
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Memory Match Challenge</h1>
              <p className="text-blue-600">Find matching pairs before time runs out!</p>
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-blue-300 rounded-md bg-blue-50 text-blue-800"
                  >
                    <option value="easy">Easy (6 pairs)</option>
                    <option value="medium">Medium (8 pairs)</option>
                    <option value="hard">Hard (10 pairs)</option>
                  </select>
                  <button
                    onClick={startGame}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors shadow-md"
                  >
                    Start Game
                  </button>
                </div>
                <div className="text-center sm:text-right text-blue-800">
                  <p>Best Score: {bestScore[difficulty]}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                {isPreviewMode ? (
                  <div className="bg-yellow-100 p-3 rounded-lg col-span-3 animate-pulse">
                    <p className="text-yellow-800 font-bold">Memorize the cards! {previewTimeLeft}s</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">TIME LEFT</p>
                      <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-blue-800'}`}>
                        {formatTime(timeLeft)}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">SCORE</p>
                      <p className="text-xl font-bold text-blue-800">{score}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium">TURNS</p>
                      <p className="text-xl font-bold text-blue-800">{turns}</p>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Game board */}
          {gameStarted && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4 mb-6">
              {cards.map((card) => (
                <div key={card.id} className={`memory-card ${isPreviewMode ? 'preview-pulse' : ''}`}>
                  <div 
                    className={`card-inner ${card.flipped || card.matched ? 'card-flipped' : ''}`}
                    onClick={() => !disabled && !gameOver && handleChoice(card)}
                  >
                    {/* Card front (Brain icon - initially visible) */}
                    <div className="card-front">
                      <Brain className="h-10 w-10" />
                    </div>
                    
                    {/* Card back (Emoji - visible when flipped) */}
                    <div className="card-back">
                      {card.emoji}
                      {card.matched && (
                        <div className="matched-overlay">
                          <div className="bg-white bg-opacity-70 rounded-full p-1">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                  {cards.every(card => card.matched) ? '🎉 Victory! 🎉' : '⏰ Time\'s Up! ⏰'}
                </h2>
                
                <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600">Final Score</p>
                    <p className="text-3xl font-bold text-blue-600">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Turns Taken</p>
                    <p className="text-3xl font-bold text-blue-600">{turns}</p>
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
                    onClick={() => {
                      startGame();
                      setGameOver(false);
                    }}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
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
      </div>

      {/* Info Modal */}
      {isInfoOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-blue-900">How to Play</h3>
              <button 
                onClick={() => setIsInfoOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-3 text-gray-700">
              <p><span className="font-bold">Goal:</span> Find all matching pairs before time runs out!</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>All cards will be shown for 20 seconds - memorize them!</li>
                <li>After 20 seconds, cards flip back face down</li>
                <li>Click on cards to flip them over</li>
                <li>Find all matching pairs to win the game</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 10 points per match + time bonus</li>
                <li>Medium: 20 points per match + time bonus</li>
                <li>Hard: 30 points per match + time bonus</li>
                <li>The faster you match, the higher your score!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve visual memory, concentration, and cognitive function.
              </p>
            </div>
            
            <button
              onClick={() => setIsInfoOpen(false)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryMatch; 