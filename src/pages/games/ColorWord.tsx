import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft, Info, RefreshCw, X, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

// Possible colors for the game
const COLORS = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Green', hex: '#10B981' },
  { name: 'Yellow', hex: '#F59E0B' },
  { name: 'Purple', hex: '#8B5CF6' },
  { name: 'Orange', hex: '#F97316' },
];

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  easy: {
    timeLimit: 60,
    colorCount: 4,
    pointsPerCorrect: 10,
    penaltyPerWrong: 5,
  },
  medium: {
    timeLimit: 45,
    colorCount: 5,
    pointsPerCorrect: 15,
    penaltyPerWrong: 10,
  },
  hard: {
    timeLimit: 30,
    colorCount: 6,
    pointsPerCorrect: 20,
    penaltyPerWrong: 15,
  },
};

const ColorWord: React.FC = () => {
  const navigate = useNavigate();
  // Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DIFFICULTY_SETTINGS.easy.timeLimit);
  const [highScore, setHighScore] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // Current word data
  const [currentWord, setCurrentWord] = useState({ text: '', color: '', options: [] });
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [streak, setStreak] = useState(0);
  
  // Stats
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);

  // Load high score from local storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('colorword_highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score to local storage when it changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('colorword_highscore', score.toString());
      
      // Celebrate with confetti if game is over
      if (gameOver) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  }, [score, highScore, gameOver]);

  // Timer countdown when game is active
  useEffect(() => {
    if (gameStarted && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameOver(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameStarted, gameOver]);

  // Generate a new word with mismatched color
  const generateNewWord = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const availableColors = COLORS.slice(0, settings.colorCount);
    
    // Select random text and color
    const textIndex = Math.floor(Math.random() * availableColors.length);
    let colorIndex;
    
    // Make sure text and color don't match (that's the challenge of the game)
    do {
      colorIndex = Math.floor(Math.random() * availableColors.length);
    } while (colorIndex === textIndex);
    
    const textColor = availableColors[textIndex];
    const displayColor = availableColors[colorIndex];
    
    // Create answer options (including correct answer)
    let options = [...availableColors];
    
    setCurrentWord({
      text: textColor.name,
      color: displayColor.hex,
      options: options.map(c => c.name),
    });
  }, [difficulty]);

  // Start a new game
  const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(DIFFICULTY_SETTINGS[selectedDifficulty].timeLimit);
    setCorrectAnswers(0);
    setWrongAnswers(0);
    setConsecutiveCorrect(0);
    setStreak(0);
    generateNewWord();
  };

  // Handle user's answer
  const handleAnswer = (selectedColor: string) => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    // Find the color object that matches the current word's display color
    const correctColorName = COLORS.find(c => c.hex === currentWord.color)?.name;
    
    if (selectedColor === correctColorName) {
      // Correct answer
      setFeedback('correct');
      
      // Increase consecutive correct answers count and update max streak
      const newConsecutive = consecutiveCorrect + 1;
      setConsecutiveCorrect(newConsecutive);
      if (newConsecutive > streak) {
        setStreak(newConsecutive);
      }
      
      // Calculate points (more points for streaks)
      let points = settings.pointsPerCorrect;
      if (newConsecutive >= 5) points = Math.floor(points * 1.5);
      if (newConsecutive >= 10) points = Math.floor(points * 2);
      
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
    } else {
      // Wrong answer
      setFeedback('wrong');
      setConsecutiveCorrect(0);
      setScore(prev => Math.max(0, prev - settings.penaltyPerWrong));
      setWrongAnswers(prev => prev + 1);
    }
    
    // Clear feedback after a short delay and generate new word
    setTimeout(() => {
      setFeedback(null);
      generateNewWord();
    }, 500);
  };

  // Generate new word when difficulty changes
  useEffect(() => {
    if (gameStarted && !gameOver) {
      generateNewWord();
    }
  }, [difficulty, gameStarted, gameOver, generateNewWord]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900 to-orange-800 text-white">
      {/* Navigation */}
      <div className="relative z-10 py-4 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Book className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-xl font-semibold text-red-900">Color Word</span>
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
        {/* Instructions */}
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
                <p><span className="font-bold">Goal:</span> Identify the color that words are displayed in, not what they spell!</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Words will appear in a color that <strong>doesn't match</strong> the word itself.</li>
                  <li>Choose the color that the word is <strong>displayed in</strong>, NOT what the word says.</li>
                  <li>For example, if the word "RED" appears in blue color, the correct answer is "BLUE".</li>
                  <li>Correct answers earn points. Wrong answers deduct points.</li>
                  <li>Building a streak of correct answers will multiply your points!</li>
                </ul>
                <p className="italic text-sm pt-2">
                  This exercise helps improve cognitive inhibition, processing speed, and selective attention - key skills affected by chemobrain.
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
                  onClick={() => startGame('easy')}
                  className="p-4 bg-green-600 hover:bg-green-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Easy</h3>
                  <p>60 seconds</p>
                  <p>4 colors</p>
                </button>
                
                <button
                  onClick={() => startGame('medium')}
                  className="p-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Medium</h3>
                  <p>45 seconds</p>
                  <p>5 colors</p>
                </button>
                
                <button
                  onClick={() => startGame('hard')}
                  className="p-4 bg-red-600 hover:bg-red-700 rounded-lg transition transform hover:scale-105 text-white"
                >
                  <h3 className="text-xl font-bold mb-2">Hard</h3>
                  <p>30 seconds</p>
                  <p>6 colors</p>
                </button>
              </div>
              
              <div className="mb-6">
                <h3 className="text-xl text-red-900 font-bold mb-2">High Score: {highScore}</h3>
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
                    <p className="text-3xl font-bold text-red-900">{score}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-900">Best Streak</p>
                    <p className="text-3xl font-bold text-red-900">{streak}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-green-900">Correct Answers</p>
                    <p className="text-3xl font-bold text-green-900">{correctAnswers}</p>
                  </div>
                  <div className="bg-red-200 p-4 rounded-lg">
                    <p className="text-lg font-semibold text-red-900">Wrong Answers</p>
                    <p className="text-3xl font-bold text-red-900">{wrongAnswers}</p>
                  </div>
                </div>
                {score > highScore && (
                  <div className="mt-6 p-4 bg-yellow-100 rounded-lg animate-pulse">
                    <p className="text-xl font-bold text-yellow-800">New High Score! 🎉</p>
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
                  onClick={() => setGameStarted(false)}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-md transition text-white"
                >
                  Change Difficulty
                </button>
              </div>
            </div>
          ) : (
            /* Active Game Screen */
            <div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-sm text-red-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-red-900">{score}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-lg text-center">
                  <p className="text-sm text-red-600 font-medium">TIME LEFT</p>
                  <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-red-900'}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>
              
              {consecutiveCorrect >= 3 && (
                <div className="text-center mb-6">
                  <p className={`text-xl font-bold ${consecutiveCorrect >= 10 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {consecutiveCorrect} streak! {consecutiveCorrect >= 5 ? '🔥' : ''}
                    {consecutiveCorrect >= 10 ? '🔥🔥' : ''}
                  </p>
                </div>
              )}
              
              <div className="flex flex-col items-center justify-center mb-10">
                <div 
                  className={`mb-8 p-6 rounded-xl shadow-lg transform transition-all duration-300 ${
                    feedback === 'correct' ? 'scale-110 bg-green-100' : 
                    feedback === 'wrong' ? 'scale-90 bg-red-100' : 'bg-red-50'
                  }`}
                >
                  <h2 
                    className="text-6xl font-bold uppercase tracking-wider"
                    style={{ color: currentWord.color }}
                  >
                    {currentWord.text}
                  </h2>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-red-900">What color is the text displayed in?</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-lg">
                  {currentWord.options.map((colorName) => (
                    <button
                      key={colorName}
                      onClick={() => handleAnswer(colorName)}
                      className="px-6 py-4 rounded-lg font-bold text-lg uppercase tracking-wide transition transform hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: COLORS.find(c => c.name === colorName)?.hex,
                        color: getContrastColor(COLORS.find(c => c.name === colorName)?.hex || '#000000')
                      }}
                    >
                      {colorName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Helps With Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-900 mb-4">This Game Helps With:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Selective Attention</h3>
              <p className="text-red-800">Training your brain to focus on relevant information while filtering out distractions.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Processing Speed</h3>
              <p className="text-red-800">Improving how quickly your brain can process information and make decisions.</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-2 text-red-900">Cognitive Control</h3>
              <p className="text-red-800">Strengthening your ability to override automatic responses in favor of goal-directed behavior.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine text color based on background for better contrast
function getContrastColor(hexColor: string): string {
  // Convert hex to RGB
  const r = parseInt(hexColor.substring(1, 3), 16);
  const g = parseInt(hexColor.substring(3, 5), 16);
  const b = parseInt(hexColor.substring(5, 7), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for bright colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export default ColorWord; 