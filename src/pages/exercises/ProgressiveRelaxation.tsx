import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, ArrowLeft, Play, Pause, RotateCcw, SkipForward, Volume2 } from 'lucide-react';

// Define body parts and instructions for progressive relaxation
const bodyParts = [
  { name: "Feet", instruction: "Curl your toes tightly, hold, then release and feel the tension flow away." },
  { name: "Calves", instruction: "Tense the muscles in your calves, hold, then relax and notice the difference." },
  { name: "Thighs", instruction: "Squeeze your thigh muscles, hold firmly, then release and feel the relaxation." },
  { name: "Buttocks", instruction: "Tighten your buttocks, hold the tension, then release and feel the muscles soften." },
  { name: "Abdomen", instruction: "Tense your stomach muscles, hold, then release and breathe normally." },
  { name: "Chest", instruction: "Take a deep breath, hold it while tensing your chest, then exhale and relax." },
  { name: "Hands", instruction: "Make tight fists with both hands, hold, then release and feel the tension melt away." },
  { name: "Arms", instruction: "Flex your biceps, hold the tension, then release and feel your arms grow heavy." },
  { name: "Shoulders", instruction: "Raise your shoulders toward your ears, hold, then drop them down and relax." },
  { name: "Neck", instruction: "Gently press your head back, hold, then bring it forward and release the tension." },
  { name: "Jaw", instruction: "Clench your jaw tightly, hold, then release and allow your mouth to be slightly open." },
  { name: "Face", instruction: "Scrunch your facial muscles, hold, then release and feel your face soften." },
  { name: "Forehead", instruction: "Raise your eyebrows, hold the tension, then release and feel your forehead smooth." },
  { name: "Whole Body", instruction: "Take a deep breath and tense your entire body, hold, then exhale and relax completely." }
];

const ProgressiveRelaxation: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'tense' | 'hold' | 'relax' | 'rest'>('tense');
  const [timeLeft, setTimeLeft] = useState(5);
  const [ambientSound, setAmbientSound] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isActive) {
      if (timeLeft > 0) {
        timer = setTimeout(() => {
          setTimeLeft(timeLeft - 1);
        }, 1000);
      } else {
        // Move to next phase or part
        if (phase === 'tense') {
          setPhase('hold');
          setTimeLeft(7);
        } else if (phase === 'hold') {
          setPhase('relax');
          setTimeLeft(8);
        } else if (phase === 'relax') {
          setPhase('rest');
          setTimeLeft(5);
        } else if (phase === 'rest') {
          // Move to next body part or finish
          if (currentStep < bodyParts.length - 1) {
            setCurrentStep(currentStep + 1);
            setPhase('tense');
            setTimeLeft(5);
          } else {
            // Exercise complete
            setIsActive(false);
            setCurrentStep(0);
            setPhase('tense');
          }
        }
      }
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isActive, timeLeft, phase, currentStep]);

  const startExercise = () => {
    setIsActive(true);
    setCurrentStep(0);
    setPhase('tense');
    setTimeLeft(5);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setCurrentStep(0);
    setPhase('tense');
    setTimeLeft(5);
  };

  const skipToNext = () => {
    if (currentStep < bodyParts.length - 1) {
      setCurrentStep(currentStep + 1);
      setPhase('tense');
      setTimeLeft(5);
    } else {
      setIsActive(false);
      setCurrentStep(0);
      setPhase('tense');
      setTimeLeft(5);
    }
  };

  // Helper function to get the background color based on phase
  const getPhaseColor = () => {
    switch (phase) {
      case 'tense': return 'bg-indigo-100';
      case 'hold': return 'bg-indigo-200';
      case 'relax': return 'bg-indigo-50';
      case 'rest': return 'bg-blue-50';
      default: return 'bg-gray-100';
    }
  };

  // Helper function to get the instruction based on phase
  const getPhaseInstruction = () => {
    switch (phase) {
      case 'tense': return `Tense your ${bodyParts[currentStep].name}`;
      case 'hold': return `Hold the tension`;
      case 'relax': return `Slowly release and relax`;
      case 'rest': return `Rest and notice the difference`;
      default: return 'Get ready';
    }
  };

  return (
    <div className={`min-h-screen ${getPhaseColor()} transition-colors duration-700 flex flex-col`}>
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-indigo-800 flex items-center">
            <Brain className="h-6 w-6 mr-2" />
            Progressive Muscle Relaxation
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-300 rounded-full transform translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-center text-indigo-900 mb-6">Progressive Muscle Relaxation</h2>
            
            {isActive ? (
              <>
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-indigo-700 font-medium">Progress</span>
                    <span className="text-indigo-700 font-medium">{currentStep + 1} / {bodyParts.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full transition-all" 
                      style={{ width: `${((currentStep) / bodyParts.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Current body part */}
                <div className="bg-indigo-50 rounded-lg p-6 mb-6 text-center">
                  <h3 className="text-xl font-bold text-indigo-800 mb-4">{bodyParts[currentStep].name}</h3>
                  <p className="text-indigo-700">{bodyParts[currentStep].instruction}</p>
                </div>

                {/* Phase indicator */}
                <div className="flex justify-between mb-8">
                  <div className={`text-center w-1/4 py-2 px-1 rounded ${phase === 'tense' ? 'bg-indigo-100 border-b-2 border-indigo-600' : ''}`}>
                    <p className={`text-sm ${phase === 'tense' ? 'font-bold text-indigo-800' : 'text-indigo-400'}`}>Tense</p>
                  </div>
                  <div className={`text-center w-1/4 py-2 px-1 rounded ${phase === 'hold' ? 'bg-indigo-100 border-b-2 border-indigo-600' : ''}`}>
                    <p className={`text-sm ${phase === 'hold' ? 'font-bold text-indigo-800' : 'text-indigo-400'}`}>Hold</p>
                  </div>
                  <div className={`text-center w-1/4 py-2 px-1 rounded ${phase === 'relax' ? 'bg-indigo-100 border-b-2 border-indigo-600' : ''}`}>
                    <p className={`text-sm ${phase === 'relax' ? 'font-bold text-indigo-800' : 'text-indigo-400'}`}>Relax</p>
                  </div>
                  <div className={`text-center w-1/4 py-2 px-1 rounded ${phase === 'rest' ? 'bg-indigo-100 border-b-2 border-indigo-600' : ''}`}>
                    <p className={`text-sm ${phase === 'rest' ? 'font-bold text-indigo-800' : 'text-indigo-400'}`}>Rest</p>
                  </div>
                </div>

                {/* Current instruction and timer */}
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold text-indigo-900 mb-3">{getPhaseInstruction()}</h3>
                  <div className="bg-indigo-600 text-white text-3xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                    {timeLeft}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center mb-10">
                <p className="text-indigo-800 mb-8">
                  This exercise will guide you through tensing and relaxing different muscle groups, 
                  helping to release physical tension and promote deep relaxation.
                </p>
                <div className="bg-indigo-50 p-4 rounded-lg max-w-md mx-auto">
                  <p className="text-indigo-800">Ready to start? Find a comfortable position where you can fully relax.</p>
                </div>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {!isActive ? (
                <button 
                  onClick={startExercise}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Exercise
                </button>
              ) : (
                <>
                  <button 
                    onClick={pauseExercise}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                  <button 
                    onClick={skipToNext}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
                  >
                    <SkipForward className="h-5 w-5 mr-2" />
                    Skip
                  </button>
                </>
              )}
              <button 
                onClick={resetExercise}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                Reset
              </button>
              <button 
                onClick={() => setAmbientSound(!ambientSound)}
                className={`${ambientSound ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'} text-white font-bold py-3 px-6 rounded-full shadow-md flex items-center`}
              >
                <Volume2 className="h-5 w-5 mr-2" />
                {ambientSound ? 'Sound On' : 'Sound Off'}
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl p-8 mt-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">How Progressive Relaxation Works</h3>
          <p className="text-indigo-800 mb-4">
            Progressive Muscle Relaxation (PMR) is a technique that involves tensing and then relaxing different muscle groups 
            throughout your body. This helps you recognize the difference between tension and relaxation, allowing you to release 
            physical stress more effectively.
          </p>
          
          <h4 className="font-bold text-indigo-800 mt-6 mb-2">For each muscle group:</h4>
          <ol className="list-decimal pl-5 space-y-2 text-indigo-700">
            <li><strong>Tense</strong> the muscles for 5 seconds</li>
            <li><strong>Hold</strong> the tension for 7 seconds</li>
            <li><strong>Relax</strong> the muscles for 8 seconds</li>
            <li>Take 5 seconds to <strong>rest</strong> and notice the difference</li>
          </ol>
          
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-bold text-indigo-900 mb-2">Benefits:</h4>
            <ul className="list-disc pl-5 text-indigo-800">
              <li>Reduces physical tension and muscle pain</li>
              <li>Decreases anxiety and stress</li>
              <li>Improves sleep quality</li>
              <li>Helps with symptoms of fatigue</li>
              <li>Enhances body awareness</li>
              <li>Can reduce certain side effects of chemotherapy</li>
            </ul>
          </div>
        </div>
      </main>
      
      <footer className="bg-indigo-800 text-white py-6 mt-10">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p>Practice this exercise regularly for maximum benefits. Part of the Mind Soothing Exercises collection.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProgressiveRelaxation; 