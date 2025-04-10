import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Info, RefreshCw, X, Trophy, Check, AlertTriangle, HelpCircle, Anchor, Waves, Navigation, Skull } from 'lucide-react';
import { Icon } from '@iconify/react';
import confetti from 'canvas-confetti';

// Custom CSS for animations and game elements
const customStyles = `
  .island {
    transition: all 0.3s ease;
    border-radius: 0.5rem;
  }
  
  .island:hover:not(.disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
  
  .island.selected {
    border-width: 3px;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  
  .island.revealed {
    animation: reveal 0.5s ease;
  }
  
  @keyframes reveal {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  .path {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: dash 1s linear forwards;
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .fade-in {
    animation: fadeIn 0.5s ease-out;
  }
  
  .perception-indicator {
    position: absolute;
    font-size: 12px;
    pointer-events: none;
  }
  
  .perception-indicator.top-left { top: 5px; left: 5px; }
  .perception-indicator.top-right { top: 5px; right: 5px; }
  .perception-indicator.bottom-left { bottom: 5px; left: 5px; }
  .perception-indicator.bottom-right { bottom: 5px; right: 5px; }
`;

// Difficulty types
type DifficultyType = 'easy' | 'medium' | 'hard';

// Difficulty settings
interface DifficultySettings {
  gridSize: number;
  timeLimit: number;
  maxMoves: number;
  pointsPerIsland: number;
  numSharks: number;
  numQuicksands: number;
}

const difficulties: Record<DifficultyType, DifficultySettings> = {
  easy: {
    gridSize: 4, // 4x4 grid
    timeLimit: 240, // 4 minutes
    maxMoves: 20,
    pointsPerIsland: 10,
    numSharks: 1,
    numQuicksands: 2
  },
  medium: {
    gridSize: 5, // 5x5 grid
    timeLimit: 300, // 5 minutes
    maxMoves: 25,
    pointsPerIsland: 15,
    numSharks: 2,
    numQuicksands: 3
  },
  hard: {
    gridSize: 6, // 6x6 grid
    timeLimit: 360, // 6 minutes
    maxMoves: 30,
    pointsPerIsland: 20,
    numSharks: 3,
    numQuicksands: 5
  }
};

// Island types
type IslandType = 'start' | 'treasure' | 'empty' | 'quicksand' | 'shark' | 'visited';

// Perception types
type PerceptionType = 'blood' | 'breeze' | 'glitter' | 'none';

// Island interface
interface Island {
  id: number;
  type: IslandType;
  row: number;
  col: number;
  revealed: boolean;
  visited: boolean;
  perceptions: PerceptionType[];
}

// Game state interface
interface GameState {
  islands: Island[];
  score: number;
  movesLeft: number;
  currentPosition: number | null;
  foundTreasure: boolean;
  gameEnded: boolean;
  feedback: string | null;
  feedbackType: 'success' | 'error' | 'warning' | null;
}

const StrategicIslands: React.FC = () => {
  const navigate = useNavigate();
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyType>('medium');
  const [timeLeft, setTimeLeft] = useState(difficulties.medium.timeLimit);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  
  // Game progress state
  const [gameState, setGameState] = useState<GameState>({
    islands: [],
    score: 0,
    movesLeft: difficulties.medium.maxMoves,
    currentPosition: null,
    foundTreasure: false,
    gameEnded: false,
    feedback: null,
    feedbackType: null
  });
  
  // High scores
  const [bestScore, setBestScore] = useState<Record<DifficultyType, number>>(() => {
    const saved = localStorage.getItem('strategicIslands_bestScore');
    return saved ? JSON.parse(saved) : { easy: 0, medium: 0, hard: 0 };
  });

  // Initialize game board
  const initializeGame = useCallback(() => {
    const settings = difficulties[difficulty];
    const gridSize = settings.gridSize;
    const totalCells = gridSize * gridSize;
    
    // Create empty grid
    let islands: Island[] = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col;
        islands.push({
          id,
          type: 'empty',
          row,
          col,
          revealed: false,
          visited: false,
          perceptions: []
        });
      }
    }
    
    // Place start island (always in the top-left corner for wumpus-like game)
    const startId = 0;
    islands[startId].type = 'start';
    islands[startId].revealed = true;
    islands[startId].visited = true;
    
    // Place treasure island (randomly but not at start)
    let treasureId;
    do {
      treasureId = Math.floor(Math.random() * totalCells);
    } while (treasureId === startId);
    
    islands[treasureId].type = 'treasure';
    
    // Place quicksands (random but not at start or treasure)
    let quicksandsPlaced = 0;
    while (quicksandsPlaced < settings.numQuicksands) {
      const randomId = Math.floor(Math.random() * totalCells);
      if (randomId !== startId && randomId !== treasureId && islands[randomId].type === 'empty') {
        islands[randomId].type = 'quicksand';
        quicksandsPlaced++;
        
        // Add breeze perception to adjacent islands
        getAdjacentIslands(randomId, islands, gridSize).forEach(adjId => {
          if (!islands[adjId].perceptions.includes('breeze')) {
            islands[adjId].perceptions.push('breeze');
          }
        });
      }
    }
    
    // Place sharks (random but not at start, treasure, or quicksand)
    let sharksPlaced = 0;
    while (sharksPlaced < settings.numSharks) {
      const randomId = Math.floor(Math.random() * totalCells);
      if (randomId !== startId && 
          randomId !== treasureId && 
          islands[randomId].type === 'empty') {
        islands[randomId].type = 'shark';
        sharksPlaced++;
        
        // Add blood smell perception to adjacent islands
        getAdjacentIslands(randomId, islands, gridSize).forEach(adjId => {
          if (!islands[adjId].perceptions.includes('blood')) {
            islands[adjId].perceptions.push('blood');
          }
        });
      }
    }
    
    // Add glitter perception to islands adjacent to treasure
    getAdjacentIslands(treasureId, islands, gridSize).forEach(adjId => {
      if (!islands[adjId].perceptions.includes('glitter')) {
        islands[adjId].perceptions.push('glitter');
      }
    });
    
    // Reset game state
    setGameState({
      islands,
      score: 0,
      movesLeft: settings.maxMoves,
      currentPosition: startId,
      foundTreasure: false,
      gameEnded: false,
      feedback: null,
      feedbackType: null
    });
    
    setTimeLeft(settings.timeLimit);
    setGameOver(false);
  }, [difficulty]);

  // Get adjacent island IDs (orthogonal only for Wumpus-like game - no diagonals)
  const getAdjacentIslands = (id: number, islands: Island[], gridSize: number): number[] => {
    const row = Math.floor(id / gridSize);
    const col = id % gridSize;
    const adjacentPositions = [];
    
    // Check top
    if (row > 0) adjacentPositions.push(id - gridSize);
    // Check right
    if (col < gridSize - 1) adjacentPositions.push(id + 1);
    // Check bottom
    if (row < gridSize - 1) adjacentPositions.push(id + gridSize);
    // Check left
    if (col > 0) adjacentPositions.push(id - 1);
    
    return adjacentPositions;
  };

  // Start a new game
  const startGame = (difficultyLevel: DifficultyType) => {
    setDifficulty(difficultyLevel);
    setGameStarted(true);
    initializeGame();
  };

  // Check if islands are adjacent (orthogonal only - no diagonals for Wumpus-like game)
  const isAdjacent = (currentId: number, targetId: number): boolean => {
    if (currentId === null) return false;
    
    const gridSize = difficulties[difficulty].gridSize;
    const currentRow = Math.floor(currentId / gridSize);
    const currentCol = currentId % gridSize;
    const targetRow = Math.floor(targetId / gridSize);
    const targetCol = targetId % gridSize;
    
    // Orthogonal adjacency (up, down, left, right)
    return (
      (Math.abs(currentRow - targetRow) === 1 && currentCol === targetCol) ||
      (Math.abs(currentCol - targetCol) === 1 && currentRow === targetRow)
    );
  };

  // Handle island selection
  const handleIslandSelect = (island: Island) => {
    if (gameOver || island.visited) return;
    
    const { currentPosition, movesLeft, islands } = gameState;
    
    // Can only select adjacent islands
    if (currentPosition === null || !isAdjacent(currentPosition, island.id)) {
      setGameState(prev => ({
        ...prev,
        feedback: "You can only move to adjacent islands!",
        feedbackType: "error"
      }));
      return;
    }
    
    // If no moves left, end game
    if (movesLeft <= 0) {
      endGame(false, "Ran out of moves");
      return;
    }
    
    // Update island to revealed
    const updatedIslands = islands.map(i => 
      i.id === island.id ? { ...i, revealed: true, visited: true } : i
    );
    
    // Check what happens based on island type
    switch (island.type) {
      case 'treasure':
        // Found the treasure - win!
        setGameState(prev => {
          const settings = difficulties[difficulty];
          const bonusPoints = prev.movesLeft * 10;
          const newScore = prev.score + settings.pointsPerIsland * 5 + bonusPoints;
          
          return {
            ...prev,
            islands: updatedIslands,
            score: newScore,
            movesLeft: prev.movesLeft - 1,
            currentPosition: island.id,
            foundTreasure: true,
            feedback: `Found the treasure! +${settings.pointsPerIsland * 5 + bonusPoints} points!`,
            feedbackType: "success"
          };
        });
        
        // Show confetti for winning
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        
        // End the game with a win after a short delay
        setTimeout(() => {
          endGame(true, "Found the treasure!");
        }, 1500);
        break;
      
      case 'shark':
        // Eaten by shark - game over
        setGameState(prev => ({
          ...prev,
          islands: updatedIslands,
          movesLeft: prev.movesLeft - 1,
          currentPosition: island.id,
          gameEnded: true,
          feedback: "Oh no! You've been eaten by a shark!",
          feedbackType: "error"
        }));
        
        // End game with loss
        setTimeout(() => {
          endGame(false, "Eaten by shark");
        }, 1000);
        break;
      
      case 'quicksand':
        // Fell into quicksand - game over
        setGameState(prev => ({
          ...prev,
          islands: updatedIslands,
          movesLeft: prev.movesLeft - 1,
          currentPosition: island.id,
          gameEnded: true,
          feedback: "You've fallen into quicksand!",
          feedbackType: "error"
        }));
        
        // End game with loss
        setTimeout(() => {
          endGame(false, "Fell into quicksand");
        }, 1000);
        break;
      
      default:
        // Empty island - continue exploring
        setGameState(prev => {
          const settings = difficulties[difficulty];
          
          return {
            ...prev,
            islands: updatedIslands,
            score: prev.score + settings.pointsPerIsland,
            movesLeft: prev.movesLeft - 1,
            currentPosition: island.id,
            feedback: island.perceptions.length > 0 
              ? getPerceptionFeedback(island.perceptions) 
              : `Safe island! +${settings.pointsPerIsland} points.`,
            feedbackType: island.perceptions.length > 0 ? "warning" : "success"
          };
        });
        break;
    }
  };

  // Get feedback message based on island perceptions
  const getPerceptionFeedback = (perceptions: PerceptionType[]): string => {
    const messages = [];
    
    if (perceptions.includes('blood')) messages.push("You smell blood nearby!");
    if (perceptions.includes('breeze')) messages.push("You feel a breeze!");
    if (perceptions.includes('glitter')) messages.push("You see a glitter!");
    
    return messages.join(" ");
  };

  // End the game
  const endGame = (won: boolean = false, reason: string = "") => {
    setGameOver(true);
    
    // Update best score if this score is higher
    if (gameState.score > bestScore[difficulty]) {
      const newBestScore = { ...bestScore };
      newBestScore[difficulty] = gameState.score;
      setBestScore(newBestScore);
      localStorage.setItem('strategicIslands_bestScore', JSON.stringify(newBestScore));
      
      // Show confetti for new high score
      if (won) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
    
    // Reveal all islands at game end
    setGameState(prev => {
      const updatedIslands = prev.islands.map(island => ({
        ...island,
        revealed: true
      }));
      
      return {
        ...prev,
        islands: updatedIslands,
        gameEnded: true,
      };
    });
  };

  // Timer effect
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (gameStarted && !gameOver && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearTimeout(timer!);
            endGame(false, "Time's up!");
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameStarted, gameOver, timeLeft]);

  // Format time for display
  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  // Calculate progress percentage
  const calculateProgress = (): number => {
    const settings = difficulties[difficulty];
    return (timeLeft / settings.timeLimit) * 100;
  };

  // Get island className based on its state and type
  const getIslandClassName = (island: Island): string => {
    const baseClass = "island relative flex items-center justify-center p-2 w-full h-full";
    
    // Selected/current position
    if (island.id === gameState.currentPosition) {
      return `${baseClass} selected border-4 border-yellow-400`;
    }
    
    // If not revealed yet
    if (!island.revealed) {
      return `${baseClass} cursor-pointer bg-green-100 border-2 border-green-300 hover:bg-green-200`;
    }
    
    // Revealed islands
    switch (island.type) {
      case 'start':
        return `${baseClass} bg-blue-200 border-2 border-blue-400`;
      case 'treasure':
        return `${baseClass} bg-yellow-200 border-2 border-yellow-400`;
      case 'quicksand':
        return `${baseClass} bg-amber-700 border-2 border-amber-900`;
      case 'shark':
        return `${baseClass} bg-red-500 border-2 border-red-700`;
      case 'visited':
      case 'empty':
        return `${baseClass} bg-green-200 border-2 border-green-400`;
      default:
        return `${baseClass} bg-gray-100 border-2 border-gray-300`;
    }
  };

  // Get icon for island based on its type
  const getIslandIcon = (island: Island) => {
    // If not revealed and not current position
    if (!island.revealed && island.id !== gameState.currentPosition) {
      return <HelpCircle className="h-8 w-8 text-green-700" />;
    }
    
    switch (island.type) {
      case 'start':
        return <Anchor className="h-8 w-8 text-blue-700" />;
      case 'treasure':
        return <Icon icon="mdi:treasure-chest" className="h-8 w-8 text-yellow-700" />;
      case 'quicksand':
        return <Waves className="h-8 w-8 text-amber-100" />;
      case 'shark':
        return <Skull className="h-8 w-8 text-red-100" />; // Using Skull as a shark icon
      case 'empty':
      case 'visited':
        // Show perceptions on visited islands
        if (island.id === gameState.currentPosition) {
          return <Navigation className="h-8 w-8 text-green-700" />;
        }
        return island.perceptions.length > 0 
          ? <AlertTriangle className="h-8 w-8 text-orange-500" />
          : <Check className="h-8 w-8 text-green-700" />;
      default:
        return null;
    }
  };

  // Render perception indicators on revealed islands
  const renderPerceptionIndicators = (island: Island) => {
    if (!island.revealed || !(island.type === 'empty' || island.type === 'visited')) return null;
    
    return (
      <>
        {island.perceptions.includes('blood') && (
          <div className="perception-indicator top-left text-red-600">
            🩸
          </div>
        )}
        {island.perceptions.includes('breeze') && (
          <div className="perception-indicator top-right text-blue-600">
            💨
          </div>
        )}
        {island.perceptions.includes('glitter') && (
          <div className="perception-indicator bottom-left text-yellow-600">
            ✨
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Inject custom CSS styles */}
      <style>{customStyles}</style>
      
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-green-900">Strategic Islands</span>
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
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Game interface */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-green-900 mb-2">Strategic Islands Explorer</h1>
              <p className="text-green-600">Navigate the islands to find the treasure while avoiding dangers!</p>
            </div>
            
            {!gameStarted ? (
              <div className="w-full lg:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyType)}
                    className="p-2 border border-green-300 rounded-md bg-green-50 text-green-800"
                  >
                    <option value="easy">Easy (4x4 Grid)</option>
                    <option value="medium">Medium (5x5 Grid)</option>
                    <option value="hard">Hard (6x6 Grid)</option>
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
                  <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-600 animate-pulse' : 'text-green-800'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">SCORE</p>
                  <p className="text-xl font-bold text-green-800">{gameState.score}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">MOVES LEFT</p>
                  <p className="text-xl font-bold text-green-800">{gameState.movesLeft}</p>
                </div>
              </div>
            )}
          </div>

          {/* Game board */}
          {gameStarted && (
            <div className="mb-6">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              
              {/* Feedback message */}
              {gameState.feedback && (
                <div 
                  className={`p-3 mb-4 rounded-lg text-center font-medium ${
                    gameState.feedbackType === 'success' ? 'bg-green-100 text-green-800' : 
                    gameState.feedbackType === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {gameState.feedback}
                </div>
              )}
              
              {/* Game grid */}
              <div 
                className="grid gap-2 w-full mx-auto" 
                style={{ 
                  gridTemplateColumns: `repeat(${difficulties[difficulty].gridSize}, minmax(0, 1fr))`,
                  maxWidth: `${difficulties[difficulty].gridSize * 80}px` 
                }}
              >
                {gameState.islands.map((island) => (
                  <div 
                    key={island.id}
                    onClick={() => handleIslandSelect(island)}
                    className={getIslandClassName(island)}
                    style={{ aspectRatio: "1/1" }}
                  >
                    {getIslandIcon(island)}
                    {renderPerceptionIndicators(island)}
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-blue-200 border border-blue-400 mr-1"></div>
                  <span>Start Island</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-yellow-200 border border-yellow-400 mr-1"></div>
                  <span>Treasure</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-amber-700 border border-amber-900 mr-1"></div>
                  <span>Quicksand</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-red-500 border border-red-700 mr-1"></div>
                  <span>Shark</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">🩸</span>
                  <span>Blood (Shark nearby)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">💨</span>
                  <span>Breeze (Quicksand nearby)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-1">✨</span>
                  <span>Glitter (Treasure nearby)</span>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-4 bg-green-200 border border-green-400 mr-1"></div>
                  <span>Safe Island</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game over modal */}
      {gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-center mb-4">
              {gameState.foundTreasure ? '🎉 Victory! 🎉' : '☠️ Game Over ☠️'}
            </h2>
            
            <div className="border-t border-b border-gray-200 py-4 my-4 grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-gray-600">Final Score</p>
                <p className="text-3xl font-bold text-green-600">{gameState.score}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-600">Moves Used</p>
                <p className="text-3xl font-bold text-green-600">
                  {difficulties[difficulty].maxMoves - gameState.movesLeft}
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
                  startGame(difficulty);
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
              <p><span className="font-bold">Goal:</span> Find the treasure island without getting eaten by sharks or falling into quicksand!</p>
              
              <p><span className="font-bold">How to play:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You start at the blue island (top-left corner)</li>
                <li>Move to adjacent islands (up, down, left, right only)</li>
                <li>Use environmental clues to identify dangers</li>
                <li>Find the treasure before time or moves run out</li>
              </ul>
              
              <p><span className="font-bold">Dangers:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Sharks:</strong> If you enter an island with a shark, you'll be eaten! Game over.</li>
                <li><strong>Quicksand:</strong> If you step into quicksand, you'll sink! Game over.</li>
              </ul>
              
              <p><span className="font-bold">Perceptions:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Blood (🩸):</strong> You can smell blood when a shark is in an adjacent island</li>
                <li><strong>Breeze (💨):</strong> You feel a breeze when quicksand is in an adjacent island</li>
                <li><strong>Glitter (✨):</strong> You see a glitter when the treasure is in an adjacent island</li>
              </ul>
              
              <p><span className="font-bold">Scoring:</span></p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Points for each safe island you explore</li>
                <li>Bonus points for finding the treasure</li>
                <li>Additional bonus based on remaining moves</li>
              </ul>
              
              <p className="italic text-sm pt-2">
                This strategic game helps improve planning, logical reasoning, and risk assessment skills.
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

export default StrategicIslands; 