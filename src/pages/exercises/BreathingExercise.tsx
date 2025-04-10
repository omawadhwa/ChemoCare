import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wind, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';

const BreathingExercise: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(0);
  const [cycles, setCycles] = useState(0);
  const [totalCycles, setTotalCycles] = useState(3);
  const circleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive) {
      interval = setInterval(() => {
        setCount((prevCount) => {
          const newCount = prevCount + 1;
          
          // Transition between phases
          if (phase === 'inhale' && newCount > 4) {
            setPhase('hold');
            return 1;
          } else if (phase === 'hold' && newCount > 7) {
            setPhase('exhale');
            return 1;
          } else if (phase === 'exhale' && newCount > 8) {
            // If this was the last cycle, stop
            if (cycles >= totalCycles - 1) {
              setIsActive(false);
              setPhase('inhale');
              setCycles(0);
              return 0;
            }
            
            // Otherwise, move to the next cycle
            setCycles(prev => prev + 1);
            setPhase('inhale');
            return 1;
          }
          
          return newCount;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, phase, cycles, totalCycles]);

  // Set the appropriate animation class based on breathing phase
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.className = "bg-blue-500 rounded-full w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center text-white font-bold text-xl mx-auto transition-all duration-1000";
      
      if (phase === 'inhale') {
        circleRef.current.classList.add('animate-expand');
      } else if (phase === 'hold') {
        circleRef.current.classList.add('animate-hold');
      } else if (phase === 'exhale') {
        circleRef.current.classList.add('animate-contract');
      }
    }

    if (textRef.current) {
      textRef.current.textContent = phase === 'inhale' 
        ? 'Breathe In...' 
        : phase === 'hold' 
          ? 'Hold...' 
          : 'Breathe Out...';
    }
  }, [phase]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(1);
    setCycles(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);
    setCycles(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex flex-col">
      {/* Custom styles for animations */}
      <style>
        {`
          @keyframes expand {
            from { transform: scale(1); }
            to { transform: scale(1.5); }
          }
          
          @keyframes contract {
            from { transform: scale(1.5); }
            to { transform: scale(1); }
          }
          
          .animate-expand {
            animation: expand 4s ease-in-out;
            animation-fill-mode: forwards;
          }
          
          .animate-hold {
            transform: scale(1.5);
          }
          
          .animate-contract {
            animation: contract 8s ease-in-out;
            animation-fill-mode: forwards;
          }
          
          @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
          }
          
          .animate-pulse-slow {
            animation: pulse 4s infinite;
          }
        `}
      </style>

      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-blue-800 flex items-center">
            <Wind className="h-6 w-6 mr-2" />
            4-7-8 Breathing Exercise
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
            {/* Decorative waves in background */}
            <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-300 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-center text-blue-900 mb-6">Diaphragmatic Breathing</h2>
              
              <p className="text-blue-800 mb-8 text-center">
                Follow the circle's rhythm to help calm your mind and reduce stress.
              </p>

              {/* Cycle indicator */}
              <div className="flex justify-center mb-6">
                <p className="text-blue-600 font-medium">
                  Cycle: {cycles + (isActive ? 1 : 0)} / {totalCycles}
                </p>
              </div>
              
              {/* Breathing visualization */}
              <div className="h-64 flex items-center justify-center mb-8">
                <div 
                  ref={circleRef} 
                  className="bg-blue-500 rounded-full w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center text-white font-bold text-xl mx-auto"
                >
                  <div ref={textRef} className="text-center">
                    {isActive ? (phase === 'inhale' ? 'Breathe In...' : phase === 'hold' ? 'Hold...' : 'Breathe Out...') : 'Start'}
                  </div>
                </div>
              </div>

              {/* Phase indicator */}
              <div className="flex justify-between max-w-md mx-auto mb-10">
                <div className={`text-center ${phase === 'inhale' && isActive ? 'text-blue-700 font-bold' : 'text-blue-400'}`}>
                  <p className="text-sm">Inhale</p>
                  <p className="text-lg">4</p>
                </div>
                <div className={`text-center ${phase === 'hold' && isActive ? 'text-blue-700 font-bold' : 'text-blue-400'}`}>
                  <p className="text-sm">Hold</p>
                  <p className="text-lg">7</p>
                </div>
                <div className={`text-center ${phase === 'exhale' && isActive ? 'text-blue-700 font-bold' : 'text-blue-400'}`}>
                  <p className="text-sm">Exhale</p>
                  <p className="text-lg">8</p>
                </div>
              </div>

              {/* Controls and Cycles Selection in One Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                {!isActive ? (
                  <button 
                    onClick={startExercise}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start
                  </button>
                ) : (
                  <button 
                    onClick={pauseExercise}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                )}
                
                <button 
                  onClick={resetExercise}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </button>
                
                <div className="flex items-center bg-blue-50 rounded-full pl-4 pr-2 py-2 shadow-md">
                  <label className="text-blue-800 mr-2 font-medium">Cycles:</label>
                  <select 
                    value={totalCycles} 
                    onChange={(e) => setTotalCycles(Number(e.target.value))}
                    className="bg-white border border-blue-300 text-blue-800 rounded-md px-3 py-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">How to Practice</h3>
            <ol className="list-decimal pl-5 space-y-3 text-blue-800">
              <li>Sit in a comfortable position with your back straight.</li>
              <li>Place the tip of your tongue against the ridge behind your upper front teeth.</li>
              <li><strong>Inhale</strong> quietly through your nose for a count of 4.</li>
              <li><strong>Hold</strong> your breath for a count of 7.</li>
              <li><strong>Exhale</strong> completely through your mouth for a count of 8.</li>
              <li>Repeat this cycle for the selected number of times.</li>
            </ol>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-bold text-blue-900 mb-2">Benefits:</h4>
              <ul className="list-disc pl-5 text-blue-800">
                <li>Reduces anxiety and stress</li>
                <li>Helps with insomnia and sleep issues</li>
                <li>Improves focus and mental clarity</li>
                <li>Can lower blood pressure</li>
                <li>Provides a quick way to regain calm during stressful moments</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-blue-800 text-white py-6 mt-10">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p>This exercise was developed by Dr. Andrew Weil and is part of the Mind Soothing Exercises collection.</p>
        </div>
      </footer>
    </div>
  );
};

export default BreathingExercise; 