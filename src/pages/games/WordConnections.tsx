import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Puzzle, ArrowLeft, Info, RefreshCw, X, Trophy, Check, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

// Word groups for the game
const WORD_GROUPS = [
  {
    category: "Animals",
    words: ["Dog", "Cat", "Lion", "Elephant", "Tiger", "Bear", "Monkey", "Giraffe", "Zebra", "Kangaroo"]
  },
  {
    category: "Fruits",
    words: ["Apple", "Banana", "Orange", "Grape", "Strawberry", "Mango", "Pineapple", "Watermelon", "Peach", "Kiwi"]
  },
  {
    category: "Transport",
    words: ["Car", "Bus", "Train", "Airplane", "Bicycle", "Motorcycle", "Ship", "Helicopter", "Truck", "Submarine"]
  },
  {
    category: "Sports",
    words: ["Soccer", "Basketball", "Tennis", "Swimming", "Golf", "Volleyball", "Cricket", "Baseball", "Rugby", "Gymnastics"]
  },
  {
    category: "Professions",
    words: ["Doctor", "Teacher", "Engineer", "Lawyer", "Chef", "Pilot", "Firefighter", "Nurse", "Architect", "Musician"]
  },
  {
    category: "Weather",
    words: ["Rain", "Snow", "Sunshine", "Wind", "Storm", "Fog", "Hail", "Lightning", "Thunder", "Breeze"]
  },
  {
    category: "Colors",
    words: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Black", "White", "Brown"]
  },
  {
    category: "Countries",
    words: ["USA", "Canada", "Japan", "Brazil", "Australia", "India", "Germany", "France", "Italy", "Spain"]
  }
];

// Custom CSS for animations
const customStyles = `
  .word-card {
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .word-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  
  .word-card.selected {
    border-width: 3px;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .word-card.correct {
    background-color: rgba(74, 222, 128, 0.2);
    border-color: #22c55e;
  }
  
  .word-card.incorrect {
    background-color: rgba(239, 68, 68, 0.2);
    border-color: #ef4444;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .pulse-animation {
    animation: pulse 1s infinite;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
`;

// Difficulty settings
type DifficultyType = 'easy' | 'medium' | 'hard';

interface DifficultySettings {
  wordCount: number;
  timeLimit: number;
  categoriesCount: number;
  pointsPerMatch: number;
}

const difficulties: Record<DifficultyType, DifficultySettings> = {
  easy: {
    wordCount: 12,
    timeLimit: 180, // 3 minutes
    categoriesCount: 2,
    pointsPerMatch: 10
  },
  medium: {
    wordCount: 18,
    timeLimit: 150, // 2.5 minutes
    categoriesCount: 3,
    pointsPerMatch: 15
  },
  hard: {
    wordCount: 24,
    timeLimit: 120, // 2 minutes
    categoriesCount: 4,
    pointsPerMatch: 20
  }
};

// Word card interface
interface WordCard {
  id: number;
  word: string;
  category: string;
  selected: boolean;
  matched: boolean;
}

const WordConnections: React.FC = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [timeLeft, setTimeLeft] = useState(difficulties.medium.timeLimit);
  const [score, setScore] = useState(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [words, setWords] = useState<WordCard[]>([]);
  const [selectedWords, setSelectedWords] = useState<WordCard[]>([]);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error' | null>(null);
  
  // High scores
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('wordConnections_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Initialize the game with words from different categories
  const initializeGame = useCallback(() => {
    const settings = difficulties[difficulty];
    
    // Randomly select categories for this game
    const shuffledCategories = [...WORD_GROUPS].sort(() => Math.random() - 0.5);
    const selectedCategories = shuffledCategories.slice(0, settings.categoriesCount);
    setCurrentCategories(selectedCategories.map(cat => cat.category));
    
    // Calculate words per category to ensure even distribution
    const wordsPerCategory = Math.floor(settings.wordCount / settings.categoriesCount);
    
    // Create a list of words from the selected categories
    let wordCards: WordCard[] = [];
    let id = 0;
    
    selectedCategories.forEach(categoryGroup => {
      // Shuffle the words within the category
      const shuffledWords = [...categoryGroup.words].sort(() => Math.random() - 0.5);
      
      // Take exactly the same number of words from each category
      const selectedWords = shuffledWords.slice(0, wordsPerCategory);
      
      // Add words to the main array
      selectedWords.forEach(word => {
        wordCards.push({
          id: id++,
          word,
          category: categoryGroup.category,
          selected: false,
          matched: false
        });
      });
    });
    
    // Shuffle all the words
    wordCards = wordCards.sort(() => Math.random() - 0.5);
    
    setWords(wordCards);
    setSelectedWords([]);
    setScore(0);
    setTimeLeft(settings.timeLimit);
    setGameOver(false);
    setFeedbackMessage(null);
    setFeedbackType(null);
  }, [difficulty]);

  // Start a new game
  const startGame = (difficultyLevel: DifficultyType) => {
    setDifficulty(difficultyLevel);
    setGameStarted(true);
    initializeGame();
  };

  // Check if all words are matched
  const checkAllMatched = useCallback(() => {
    const allMatched = words.every(word => word.matched);
    if (allMatched && words.length > 0) {
      endGame(true);
    }
  }, [words]);

  // Handle word card selection
  const handleWordSelect = (selectedWord: WordCard) => {
    if (gameOver || selectedWord.matched) return;
    
    // Toggle selection for this word
    const updatedWords = words.map(word => 
      word.id === selectedWord.id ? { ...word, selected: !word.selected } : word
    );
    
    // Update selected words list
    let newSelectedWords = updatedWords.filter(word => word.selected && !word.matched);
    
    setWords(updatedWords);
    setSelectedWords(newSelectedWords);
    
    // Check if multiple words are selected
    if (newSelectedWords.length >= 2) {
      // Check if all selected words are from the same category
      const category = newSelectedWords[0].category;
      const allSameCategory = newSelectedWords.every(word => word.category === category);
      
      if (allSameCategory) {
        // Found a valid group!
        const settings = difficulties[difficulty];
        const pointsEarned = settings.pointsPerMatch * newSelectedWords.length;
        
        // Update score
        setScore(prevScore => prevScore + pointsEarned);
        
        // Mark words as matched
        const matchedWords = updatedWords.map(word => 
          newSelectedWords.some(selected => selected.id === word.id) 
            ? { ...word, matched: true, selected: false } 
            : word
        );
        
        setWords(matchedWords);
        setSelectedWords([]);
        
        // Show feedback
        setFeedbackMessage(`+${pointsEarned} points! Found ${newSelectedWords.length} ${category} words!`);
        setFeedbackType('success');
        
        // Clear feedback after 2 seconds
        setTimeout(() => {
          setFeedbackMessage(null);
          setFeedbackType(null);
          
          // Check if all words are matched
          if (matchedWords.every(word => word.matched)) {
            endGame(true);
          }
        }, 2000);
      } else {
        // Not a valid group - deselect all words after a short delay
        setTimeout(() => {
          const resetWords = updatedWords.map(word => 
            word.selected && !word.matched ? { ...word, selected: false } : word
          );
          
          setWords(resetWords);
          setSelectedWords([]);
          
          // Show feedback
          setFeedbackMessage('Those words don\'t form a group! Try again.');
          setFeedbackType('error');
          
          // Clear feedback after 2 seconds
          setTimeout(() => {
            setFeedbackMessage(null);
            setFeedbackType(null);
          }, 2000);
        }, 1000);
      }
    }
  };

  // End the game
  const endGame = (won: boolean = false) => {
    setGameOver(true);
    
    // Update best score if this score is higher
    if (score > bestScore[difficulty]) {
      const newBestScore = { ...bestScore };
      newBestScore[difficulty] = score;
      setBestScore(newBestScore);
      localStorage.setItem('wordConnections_bestScore', JSON.stringify(newBestScore));
      
      // Show confetti for new high score
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    
    // Show different messages based on win/loss
    if (won) {
      setFeedbackMessage('Congratulations! You matched all words!');
      setFeedbackType('success');
      
      // Extra confetti for winning
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    } else {
      setFeedbackMessage('Time\'s up!');
      setFeedbackType('error');
    }
  };

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (gameStarted && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer!);
            endGame(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver]);

  // Check for win condition on each words update
  useEffect(() => {
    if (gameStarted && !gameOver && words.length > 0) {
      checkAllMatched();
    }
  }, [words, gameStarted, gameOver, checkAllMatched]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Calculate progress
  const calculateProgress = () => {
    if (words.length === 0) return 0;
    return Math.floor((words.filter(w => w.matched).length / words.length) * 100);
  };

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
            <Puzzle className="h-8 w-8 text-green-600" />
            <span className="ml-2 text-xl font-semibold text-green-900">Word Connections</span>
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
              <h1 className="text-2xl font-bold text-green-900 mb-2">Word Connections Challenge</h1>
              <p className="text-green-600">Find pair of words that belong to the same category!</p>
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-green-300 rounded-md bg-green-50 text-green-800"
                  >
                    <option value="easy">Easy (2 categories)</option>
                    <option value="medium">Medium (3 categories)</option>
                    <option value="hard">Hard (4 categories)</option>
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
                  <p className="text-xl font-bold text-green-800">{score}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">PROGRESS</p>
                  <p className="text-xl font-bold text-green-800">{calculateProgress()}%</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Feedback message */}
          {feedbackMessage && (
            <div className={`mb-4 p-3 rounded-lg text-center ${
              feedbackType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <p className="font-bold flex items-center justify-center">
                {feedbackType === 'success' ? (
                  <Check className="h-5 w-5 mr-2" />
                ) : (
                  <AlertTriangle className="h-5 w-5 mr-2" />
                )}
                {feedbackMessage}
              </p>
            </div>
          )}

          {/* Game board */}
          {gameStarted && (
            <div>
              {/* Category hints */}
              <div className="mb-6">
                <h2 className="text-green-900 font-bold mb-2">Find pair of words related to:</h2>
                <div className="flex flex-wrap gap-2">
                  {currentCategories.map(category => (
                    <span key={category} className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Word grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {words.map(word => (
                  <div
                    key={word.id}
                    onClick={() => !word.matched && handleWordSelect(word)}
                    className={`word-card p-4 rounded-lg text-center cursor-pointer border-2 ${
                      word.matched 
                        ? 'border-green-500 bg-green-50 opacity-50' 
                        : word.selected
                          ? 'border-green-600 selected bg-green-50'
                          : 'border-gray-200 hover:border-green-300 bg-white'
                    }`}
                  >
                    <p className="text-lg font-medium">{word.word}</p>
                    {word.matched && (
                      <p className="text-sm text-green-600 mt-1">{word.category}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                  {words.every(word => word.matched) ? '🎉 Victory! 🎉' : '⏱️ Time\'s Up! ⏱️'}
                </h2>
                
                <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600">Final Score</p>
                    <p className="text-3xl font-bold text-green-600">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Words Matched</p>
                    <p className="text-3xl font-bold text-green-600">
                      {words.filter(w => w.matched).length}/{words.length}
                    </p>
                  </div>
                </div>
                
                {words.every(word => word.matched) && (
                  <div className="bg-green-100 p-3 rounded-lg text-center mb-4">
                    <Check className="h-6 w-6 text-green-600 mx-auto mb-1" />
                    <p className="text-green-800 font-bold">You matched all words!</p>
                  </div>
                )}
                
                {score > bestScore[difficulty] && (
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
              <h3 className="text-lg font-bold mb-2 text-green-900">Verbal Processing</h3>
              <p className="text-green-800">Enhancing your ability to process and organize words based on their meanings and relationships.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-green-900">Cognitive Flexibility</h3>
              <p className="text-green-800">Improving your mental agility by forming connections between related concepts and adapting to different categories.</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-green-900">Pattern Recognition</h3>
              <p className="text-green-800">Developing your ability to identify patterns and relationships between concepts, which is vital for problem-solving.</p>
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
              <p><span className="font-bold">Goal:</span> Find pair of words that belong to the same category!</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on words to select them</li>
                <li>Try to find pair of words that belong to the same category</li>
                <li>When you've selected multiple words from the same category, they'll be marked as matched</li>
                <li>Match all words before time runs out!</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 10 points per matched word</li>
                <li>Medium: 15 points per matched word</li>
                <li>Hard: 20 points per matched word</li>
                <li>The more words you match at once, the more points you'll earn!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve verbal processing, cognitive flexibility, and pattern recognition - cognitive skills that can be affected by chemotherapy.
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
};

export default WordConnections; 