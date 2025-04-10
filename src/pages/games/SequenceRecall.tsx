import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Bell, RefreshCw, Info, X, Check, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

// Define the sequence item type
interface SequenceItem {
  color: string;
  sound: string;
}

// Available colors for the game
const availableColors = [
  { name: 'red', bg: 'bg-red-500', hover: 'hover:bg-red-400' },
  { name: 'blue', bg: 'bg-blue-500', hover: 'hover:bg-blue-400' },
  { name: 'green', bg: 'bg-green-500', hover: 'hover:bg-green-400' },
  { name: 'yellow', bg: 'bg-yellow-500', hover: 'hover:bg-yellow-400' },
  { name: 'purple', bg: 'bg-purple-500', hover: 'hover:bg-purple-400' },
  { name: 'pink', bg: 'bg-pink-500', hover: 'hover:bg-pink-400' },
];

// Available sounds for the game
const availableSounds: Record<string, number> = {
  'C4': 261.63,
  'D4': 293.66,
  'E4': 329.63,
  'F4': 349.23,
  'G4': 392.00,
  'A4': 440.00,
};

// Difficulty levels
type DifficultyType = 'easy' | 'medium' | 'hard';

const difficulties: Record<DifficultyType, { initialSequenceLength: number, maxSequenceLength: number, playbackSpeed: number }> = {
  easy: { initialSequenceLength: 3, maxSequenceLength: 7, playbackSpeed: 1000 },
  medium: { initialSequenceLength: 4, maxSequenceLength: 10, playbackSpeed: 800 },
  hard: { initialSequenceLength: 5, maxSequenceLength: 14, playbackSpeed: 600 }
};

// Add custom CSS for animations
const customStyles = `
  .sequence-button {
    transition: all 0.2s ease;
  }
  
  .sequence-button.active {
    transform: scale(0.95);
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.7);
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .pulse {
    animation: pulse 1s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .spin-once {
    animation: spin 0.5s ease-in-out;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const SequenceRecall = () => {
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<SequenceItem[]>([]);
  const [userSequence, setUserSequence] = useState<SequenceItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserTurn, setIsUserTurn] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('sequenceRecall_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Create audio context on demand
  const getAudioContext = () => {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  };

  // Play sound for a button
  const playSound = useCallback((note: string) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(availableSounds[note], audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, []);

  // Generate a new random sequence
  const generateSequence = useCallback((length: number) => {
    const newSequence: SequenceItem[] = [];
    
    for (let i = 0; i < length; i++) {
      const randomColorIndex = Math.floor(Math.random() * availableColors.length);
      const color = availableColors[randomColorIndex].name;
      
      const soundKeys = Object.keys(availableSounds);
      const randomSoundIndex = Math.floor(Math.random() * soundKeys.length);
      const sound = soundKeys[randomSoundIndex];
      
      newSequence.push({ color, sound });
    }
    
    return newSequence;
  }, []);

  // Play the current sequence
  const playSequence = useCallback(async () => {
    setIsPlaying(true);
    setIsUserTurn(false);
    
    console.log('Playing sequence:', sequence.map(item => item.color).join(', '));
    
    for (let i = 0; i < sequence.length; i++) {
      const item = sequence[i];
      
      // Wait for the previous button animation to complete
      await new Promise(resolve => setTimeout(resolve, difficulties[difficulty].playbackSpeed));
      
      // Activate the button
      setActiveButton(item.color);
      playSound(item.sound);
      
      // Deactivate after a short delay
      await new Promise(resolve => setTimeout(resolve, 300));
      setActiveButton(null);
    }
    
    setIsPlaying(false);
    setIsUserTurn(true);
  }, [sequence, difficulty, playSound]);

  // Start a new game
  const startGame = () => {
    const sequenceLength = difficulties[difficulty].initialSequenceLength;
    const initialSequence = generateSequence(sequenceLength);
    
    console.log('Starting new game with difficulty:', difficulty);
    console.log('Initial sequence length:', sequenceLength);
    console.log('Initial sequence:', initialSequence.map(item => item.color).join(', '));
    
    setSequence(initialSequence);
    setUserSequence([]);
    setScore(0);
    setLevel(1);
    setGameStarted(true);
    setGameOver(false);
    setIsPlaying(true);
    setIsUserTurn(false);
    
    // Play the initial sequence after a short delay
    setTimeout(() => {
      playSequence();
    }, 1000);
  };

  // Handle replay sequence button
  const handleReplay = () => {
    if (!isPlaying && gameStarted && !gameOver) {
      playSequence();
    }
  };

  // Handle user clicking a button
  const handleButtonClick = (color: string, sound: string) => {
    if (!isUserTurn || isPlaying) return;
    
    // Play sound and show animation
    playSound(sound);
    setActiveButton(color);
    setTimeout(() => setActiveButton(null), 300);
    
    const newUserSequence = [...userSequence, { color, sound }];
    setUserSequence(newUserSequence);
    
    // Get the current step index
    const currentIndex = newUserSequence.length - 1;
    
    console.log(`User pressed: ${color}, Expected: ${sequence[currentIndex].color}, Index: ${currentIndex}`);
    
    // Check if just this step is correct (instead of checking the entire sequence each time)
    const isCurrentStepCorrect = 
      newUserSequence[currentIndex].color === sequence[currentIndex].color;
    
    if (!isCurrentStepCorrect) {
      // User made a mistake
      console.log('Wrong move!', {
        userSequence: newUserSequence.map(item => item.color),
        correctSequence: sequence.map(item => item.color),
        currentIndex,
        clicked: color,
        expected: sequence[currentIndex].color
      });
      
      // Visual feedback for wrong move
      setTimeout(() => {
        setGameOver(true);
        
        // Update best score
        if (score > bestScore[difficulty]) {
          const newBestScore = { ...bestScore };
          newBestScore[difficulty] = score;
          setBestScore(newBestScore);
          localStorage.setItem('sequenceRecall_bestScore', JSON.stringify(newBestScore));
          
          // Trigger confetti effect for new best score
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        }
      }, 500);
      
      return;
    }
    
    // Check if the user completed the current sequence
    if (newUserSequence.length === sequence.length) {
      // Calculate points: base points + speed bonus
      const basePoints = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 10 : 15;
      const levelBonus = level * 2;
      const newPoints = basePoints + levelBonus;
      
      console.log('Sequence complete! Moving to next level');
      console.log('Current sequence:', sequence.map(item => item.color).join(', '));
      console.log('User sequence:', newUserSequence.map(item => item.color).join(', '));
      
      setScore(prev => prev + newPoints);
      
      // Prepare for the next level
      setUserSequence([]);
      setIsUserTurn(false);
      
      // Check if we've reached max sequence length
      if (sequence.length >= difficulties[difficulty].maxSequenceLength) {
        // User won the game!
        setGameOver(true);
        console.log('Game won! Reached max sequence length for difficulty:', difficulty);
        
        // Update best score
        if (score + newPoints > bestScore[difficulty]) {
          const newBestScore = { ...bestScore };
          newBestScore[difficulty] = score + newPoints;
          setBestScore(newBestScore);
          localStorage.setItem('sequenceRecall_bestScore', JSON.stringify(newBestScore));
          
          // Trigger confetti for winning
          confetti({
            particleCount: 200,
            spread: 100,
            origin: { y: 0.6 }
          });
        }
      } else {
        // Continue to the next level
        setLevel(prev => prev + 1);
        
        // Add one more item to the sequence
        const newItems = generateSequence(1);
        const newSequence = [...sequence, ...newItems];
        console.log('New sequence item:', newItems[0].color);
        console.log('New sequence:', newSequence.map(item => item.color).join(', '));
        
        setSequence(newSequence);
        
        // Play the new sequence after a short delay
        setTimeout(() => {
          playSequence();
        }, 1000);
      }
    }
  };

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
            <Bell className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-semibold text-blue-900">Sequence Recall</span>
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
              <h1 className="text-2xl font-bold text-blue-900 mb-2">Sequence Recall Challenge</h1>
              <p className="text-blue-600">Remember and repeat the sequence of colors and sounds!</p>
              {!gameStarted && (
                <div className="mt-2 text-xs text-gray-600">
                  <span className="font-medium">Selected difficulty:</span> {difficulty} - 
                  Initial sequence: {difficulties[difficulty].initialSequenceLength} steps, 
                  Win at: {difficulties[difficulty].maxSequenceLength} steps
                </div>
              )}
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-blue-300 rounded-md bg-blue-50 text-blue-800"
                  >
                    <option value="easy">Easy (3-7 steps, slower pace)</option>
                    <option value="medium">Medium (4-10 steps, medium pace)</option>
                    <option value="hard">Hard (5-14 steps, fast pace)</option>
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
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">LEVEL</p>
                  <p className="text-xl font-bold text-blue-800">{level}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-blue-800">{score}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">SEQUENCE</p>
                  <p className="text-xl font-bold text-blue-800">{sequence.length}</p>
                </div>
              </div>
            )}
          </div>

          {/* Game board */}
          {gameStarted && (
            <div className="flex flex-col items-center mb-6">
              {/* Status message */}
              <div className={`mb-6 text-center ${isPlaying ? 'text-yellow-600' : isUserTurn ? 'text-green-600' : 'text-blue-600'}`}>
                <p className="text-lg font-bold">
                  {isPlaying ? (
                    <span className="flex items-center justify-center">
                      <Bell className="h-5 w-5 mr-2 spin-once" /> Watch and listen...
                    </span>
                  ) : isUserTurn ? (
                    <span className="flex items-center justify-center">
                      <Check className="h-5 w-5 mr-2" /> Your turn! Repeat the sequence.
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Timer className="h-5 w-5 mr-2" /> Get ready...
                    </span>
                  )}
                </p>
              </div>

              {/* Replay button */}
              {isUserTurn && !isPlaying && (
                <button
                  onClick={handleReplay}
                  className="mb-4 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-md flex items-center justify-center transition-colors"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Replay Sequence
                </button>
              )}

              {/* Sequence progress */}
              <div className="flex justify-center mb-6">
                {sequence.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-3 h-3 rounded-full mx-1 ${
                      index < userSequence.length 
                        ? 'bg-green-500' 
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              {/* Colorful buttons */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 max-w-lg mx-auto">
                {availableColors.map((color, index) => {
                  const soundKeys = Object.keys(availableSounds);
                  const sound = soundKeys[index % soundKeys.length];
                  
                  return (
                    <button
                      key={color.name}
                      className={`sequence-button ${color.bg} ${color.hover} rounded-lg w-24 h-24 sm:w-32 sm:h-32 shadow-lg ${activeButton === color.name ? 'active' : ''}`}
                      onClick={() => handleButtonClick(color.name, sound)}
                      disabled={!isUserTurn || isPlaying}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Game over screen */}
          {gameOver && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
                <h2 className="text-2xl font-bold text-center mb-4">
                  {sequence.length >= difficulties[difficulty].maxSequenceLength 
                    ? '🎉 Victory! 🎉' 
                    : '🔊 Game Over! 🔊'}
                </h2>
                
                <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-gray-600">Final Score</p>
                    <p className="text-3xl font-bold text-blue-600">{score}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Sequence Length</p>
                    <p className="text-3xl font-bold text-blue-600">{sequence.length}</p>
                  </div>
                </div>
                
                {score > bestScore[difficulty] && (
                  <div className="bg-yellow-100 p-3 rounded-lg text-center mb-4 animate-pulse">
                    <Bell className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
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
              <p><span className="font-bold">Goal:</span> Remember and repeat increasingly longer sequences of colors and sounds.</p>
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Watch and listen as the game plays a sequence of colored buttons</li>
                <li>Once the sequence ends, repeat it by clicking the buttons in the same order</li>
                <li>Each correct sequence advances you to the next level, adding one more step</li>
                <li>Make a mistake, and the game ends</li>
              </ul>
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Easy: 5 points per successful sequence + level bonus</li>
                <li>Medium: 10 points per successful sequence + level bonus</li>
                <li>Hard: 15 points per successful sequence + level bonus</li>
                <li>The longer the sequence you can recall, the higher your score!</li>
              </ul>
              <p className="italic text-sm pt-2">
                This exercise helps improve working memory, attention span, and auditory-visual processing.
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

export default SequenceRecall; 