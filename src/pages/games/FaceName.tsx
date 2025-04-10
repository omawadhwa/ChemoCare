import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Users, RefreshCw, Info, X, Check, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom CSS styles for animations
const customStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
  
  .face-image {
    width: auto !important;
    height: auto !important;
    max-width: 100% !important;
    max-height: 100% !important;
    transform: scale(1);
  }
`;

// Define face-name pair type
interface FaceNamePair {
  id: number;
  name: string;
  occupation: string;
  imageUrl: string;
  isMatched?: boolean;
}

// Define difficulty type
type DifficultyType = 'easy' | 'medium' | 'hard';

// Difficulty levels
const difficulties: Record<DifficultyType, { pairs: number; timeLimit: number }> = {
  easy: { pairs: 4, timeLimit: 120 },
  medium: { pairs: 6, timeLimit: 90 },
  hard: { pairs: 8, timeLimit: 60 }
};

// Demo faces (in a real app, these would come from an API or larger dataset)
const faceData: FaceNamePair[] = [
  {
    id: 1,
    name: "Emma Johnson",
    occupation: "Teacher",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 2,
    name: "Michael Chen",
    occupation: "Software Engineer",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 3,
    name: "Sophia Rodriguez",
    occupation: "Doctor",
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 4,
    name: "David Kim",
    occupation: "Architect",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 5,
    name: "Olivia Wilson",
    occupation: "Lawyer",
    imageUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 6,
    name: "James Taylor",
    occupation: "Chef",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 7,
    name: "Ava Martinez",
    occupation: "Nurse",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 8,
    name: "Noah Thompson",
    occupation: "Photographer",
    imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 9,
    name: "Isabella Brown",
    occupation: "Artist",
    imageUrl: "https://images.unsplash.com/photo-1564923630403-2284b87c0041?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 10,
    name: "Ethan Davis",
    occupation: "Musician",
    imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 11,
    name: "Mia Garcia",
    occupation: "Scientist",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400",
  },
  {
    id: 12,
    name: "Liam Anderson",
    occupation: "Pilot",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=400&h=400",
  },
];

const FaceName = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isLearningPhase, setIsLearningPhase] = useState(true);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [faces, setFaces] = useState<FaceNamePair[]>([]);
  const [namesForQuiz, setNamesForQuiz] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [learningTimeLeft, setLearningTimeLeft] = useState(5);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('faceName_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Initialize new game
  const startGame = () => {
    const numPairs = difficulties[difficulty].pairs;
    const shuffledFaces = [...faceData]
      .sort(() => Math.random() - 0.5)
      .slice(0, numPairs)
      .map(face => ({ ...face, isMatched: false }));
    
    setFaces(shuffledFaces);
    
    // All names (including the correct ones) for the quiz phase
    const allNames = shuffledFaces.map(face => face.name);
    setNamesForQuiz(allNames);
    
    setScore(0);
    setTimeLeft(difficulties[difficulty].timeLimit);
    setCurrentFaceIndex(0);
    setIsLearningPhase(true);
    setLearningTimeLeft(5);
    setGameStarted(true);
    setGameOver(false);
    setSelectedName(null);
    setIsCorrect(null);
    setShowFeedback(false);
    
    // Initialize with empty array since we're in learning phase
    setCurrentShuffledNames([]);
  };

  // Handle learning phase countdown
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameStarted && isLearningPhase && learningTimeLeft > 0) {
      timer = setTimeout(() => {
        setLearningTimeLeft(learningTimeLeft - 1);
      }, 1000);
    } else if (gameStarted && isLearningPhase && learningTimeLeft <= 0) {
      // Move to the next face or end the learning phase
      if (currentFaceIndex < faces.length - 1) {
        setCurrentFaceIndex(currentFaceIndex + 1);
        setLearningTimeLeft(5);
      } else {
        // End learning phase, start quiz
        setIsLearningPhase(false);
        setCurrentFaceIndex(0);
      }
    }

    return () => clearTimeout(timer);
  }, [gameStarted, isLearningPhase, learningTimeLeft, currentFaceIndex, faces.length]);

  // Game timer for quiz phase
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (gameStarted && !isLearningPhase && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !gameOver && !isLearningPhase) {
      setGameOver(true);
    }

    return () => clearTimeout(timer);
  }, [gameStarted, isLearningPhase, gameOver, timeLeft]);

  // Handle name selection during quiz
  const handleNameSelect = (name: string) => {
    if (gameOver || showFeedback) return;
    
    setSelectedName(name);
    const currentFace = faces[currentFaceIndex];
    const isAnswerCorrect = name === currentFace.name;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Update score if correct
    if (isAnswerCorrect) {
      // Base points + time bonus
      const basePoints = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20;
      const timeBonus = Math.floor(timeLeft / 10);
      const newPoints = basePoints + timeBonus;
      setScore(prevScore => prevScore + newPoints);
      
      // Mark the face as matched
      setFaces(prevFaces => {
        return prevFaces.map((face, idx) => {
          if (idx === currentFaceIndex) {
            return { ...face, isMatched: true };
          }
          return face;
        });
      });
    }
    
    // Show feedback for a moment before proceeding
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedName(null);
      setIsCorrect(null);
      
      // Move to next face or end game
      if (currentFaceIndex < faces.length - 1) {
        // Prepare shuffled names for the next face in advance
        const nextIndex = currentFaceIndex + 1;
        setCurrentFaceIndex(nextIndex);
        // We'll let the useEffect handle shuffling names for the new face
      } else {
        // Game complete
        setGameOver(true);
        
        // Check for new best score
        if (score > bestScore[difficulty]) {
          const newBestScore = { ...bestScore };
          newBestScore[difficulty] = score;
          setBestScore(newBestScore);
          localStorage.setItem('faceName_bestScore', JSON.stringify(newBestScore));
          
          // Celebrate with confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }
    }, 1500);
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  // Shuffle names when in quiz mode to avoid position-based memorization
  const getShuffledNameOptions = useCallback(() => {
    return [...namesForQuiz].sort(() => Math.random() - 0.5);
  }, [namesForQuiz]);

  // Memoize the shuffled names for the current face
  const [currentShuffledNames, setCurrentShuffledNames] = useState<string[]>([]);

  // Update shuffled names when moving to a new face
  useEffect(() => {
    if (!isLearningPhase && !showFeedback) {
      setCurrentShuffledNames(getShuffledNameOptions());
    }
  }, [isLearningPhase, currentFaceIndex, getShuffledNameOptions, showFeedback]);

  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
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
            <Users className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-blue-900">Face & Name</span>
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
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Face & Name Challenge</h1>
              <p className="text-blue-600">Remember people's names and occupations!</p>
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-blue-300 rounded-md bg-blue-50 text-blue-800"
                  >
                    <option value="easy">Easy (4 people)</option>
                    <option value="medium">Medium (6 people)</option>
                    <option value="hard">Hard (8 people)</option>
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
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">
                    {isLearningPhase ? 'LEARNING PHASE' : 'TIME LEFT'}
                  </p>
                  <p className={`text-xl font-bold ${timeLeft < 10 && !isLearningPhase ? 'text-red-600 animate-pulse' : 'text-blue-800'}`}>
                    {isLearningPhase 
                      ? `${learningTimeLeft}s` 
                      : formatTime(timeLeft)}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-blue-800">{score}</p>
                </div>
              </div>
            )}
          </div>

          {/* Game board */}
          {gameStarted && (
            <div className="max-w-2xl mx-auto">
              {isLearningPhase ? (
                // Learning phase - show faces with names
                <div className="flex flex-col items-center text-center animate-fadeIn">
                  <div className="text-lg text-blue-800 font-semibold mb-4">
                    Memorize this person ({currentFaceIndex + 1} of {faces.length})
                  </div>
                  <div className="p-2 bg-blue-100 rounded-xl w-full max-w-md mb-6">
                    <div className="bg-gray-100 rounded-lg w-full h-80 flex items-center justify-center mb-4">
                      <img 
                        src={faces[currentFaceIndex].imageUrl} 
                        alt="Person to remember" 
                        className="face-image"
                      />
                    </div>
                    <div className="font-bold text-xl">{faces[currentFaceIndex].name}</div>
                    <div className="text-gray-600">{faces[currentFaceIndex].occupation}</div>
                  </div>
                  <div className="bg-yellow-100 px-4 py-2 rounded-md animate-pulse text-yellow-800">
                    Next person in {learningTimeLeft} seconds...
                  </div>
                </div>
              ) : (
                // Quiz phase - show faces, ask for names
                <div className="flex flex-col items-center text-center">
                  <div className="text-lg text-blue-800 font-semibold mb-4">
                    What's this person's name? ({currentFaceIndex + 1} of {faces.length})
                  </div>
                  
                  <div className="relative w-full max-w-md mb-6">
                    <div className={`bg-gray-100 rounded-lg w-full h-80 flex items-center justify-center ${showFeedback ? (isCorrect ? 'border-4 border-green-500' : 'border-4 border-red-500') : ''}`}>
                      <img 
                        src={faces[currentFaceIndex].imageUrl} 
                        alt="Person to identify" 
                        className="face-image"
                      />
                    </div>
                    
                    {/* Feedback overlay */}
                    {showFeedback && (
                      <div className={`absolute inset-0 flex items-center justify-center rounded-lg ${isCorrect ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'}`}>
                        <div className={`text-white bg-opacity-90 p-3 rounded-lg ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`}>
                          <div className="font-bold text-xl mb-1">
                            {isCorrect ? 'Correct!' : 'Incorrect!'}
                          </div>
                          <div>
                            This is {faces[currentFaceIndex].name}
                          </div>
                          <div className="text-sm">
                            {faces[currentFaceIndex].occupation}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Name options */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                    {currentShuffledNames.map((name, index) => (
                      <button
                        key={index}
                        onClick={() => handleNameSelect(name)}
                        disabled={showFeedback}
                        className={`py-3 px-4 rounded-md text-center transition-all ${
                          showFeedback && name === faces[currentFaceIndex].name
                            ? 'bg-green-500 text-white'
                            : showFeedback && name === selectedName && !isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Game over screen */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">
              Game Complete!
            </h2>
            
            <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600">Final Score</p>
                <p className="text-3xl font-bold text-blue-600">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Correct Names</p>
                <p className="text-3xl font-bold text-blue-600">
                  {faces.filter(face => face.isMatched).length}/{faces.length}
                </p>
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
              <p><span className="font-bold">Goal:</span> Remember people's names and associate them with their faces.</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>In the learning phase, you'll be shown several people with their names and occupations</li>
                <li>Each person will be shown for 5 seconds - try to remember them!</li>
                <li>In the quiz phase, you'll see the faces again and need to select the correct name</li>
                <li>Answer correctly to score points</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 10 points per correct match + time bonus</li>
                <li>Medium: 15 points per correct match + time bonus</li>
                <li>Hard: 20 points per correct match + time bonus</li>
                <li>The faster you match, the higher your score!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve associative memory, facial recognition, and social recall - skills that are often affected by chemobrain.
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

export default FaceName; 