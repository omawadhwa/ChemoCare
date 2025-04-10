import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HeartPulse, Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface MassageTechnique {
  title: string;
  description: string;
  steps: string[];
  duration: string;
  benefits: string[];
  videoUrl?: string;
  image: string;
}

const HandMassage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTechnique, setCurrentTechnique] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30); // 30 seconds default
  
  const techniques: MassageTechnique[] = [
    {
      title: "Palm Circles",
      description: "A gentle circular massage for the palm to release tension and improve circulation.",
      steps: [
        "Apply a small amount of lotion to your hands if desired",
        "Place your right thumb in the center of your left palm",
        "Make firm, slow circles with your thumb, moving outward spirally",
        "Continue for 30 seconds, paying attention to areas that feel tense",
        "Switch hands and repeat on the right palm"
      ],
      duration: "1-2 minutes",
      benefits: [
        "Stimulates nerve endings in the hands",
        "Releases tension in the palm",
        "Improves blood circulation"
      ],
      image: "https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg"
    },
    {
      title: "Finger Pulls",
      description: "Gentle pulling technique to relieve tension and stiffness in the fingers.",
      steps: [
        "Hold your left hand palm facing up",
        "With your right hand, gently grasp your left thumb",
        "Slowly and gently pull the thumb, applying slight pressure",
        "Release and move to your index finger",
        "Continue with each finger, then switch hands"
      ],
      duration: "2 minutes",
      benefits: [
        "Relieves stiffness in finger joints",
        "Extends the range of motion",
        "Can help reduce pain from arthritis or joint discomfort"
      ],
      image: "https://images.pexels.com/photos/5699516/pexels-photo-5699516.jpeg"
    },
    {
      title: "Wrist Rotation",
      description: "Gentle rotation and massage to relieve tension in the wrists.",
      steps: [
        "Hold your left hand with your right hand, grasping around the wrist",
        "Apply gentle pressure with your thumbs on the underside of the wrist",
        "Make small circular motions with your thumbs",
        "Rotate your left wrist slowly in clockwise circles, then counterclockwise",
        "Switch hands and repeat"
      ],
      duration: "1-2 minutes",
      benefits: [
        "Relieves wrist pain and tension",
        "Improves mobility in the wrist joint",
        "Can help with carpal tunnel discomfort"
      ],
      image: "https://images.pexels.com/photos/7339117/pexels-photo-7339117.jpeg"
    },
    {
      title: "Knuckle Massage",
      description: "Focus on the knuckles to improve joint mobility and comfort.",
      steps: [
        "Make a loose fist with your left hand",
        "Use your right thumb and index finger to gently squeeze each knuckle",
        "Apply gentle pressure and small circular motions",
        "Move from the base of your fingers to the fingertips",
        "Switch hands and repeat"
      ],
      duration: "1-2 minutes",
      benefits: [
        "Reduces stiffness in finger joints",
        "Relieves pain from arthritis",
        "Improves flexibility in the hands"
      ],
      image: "https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg"
    },
    {
      title: "Full Hand Stretch",
      description: "A gentle stretch to complete your hand massage routine.",
      steps: [
        "Extend your left hand, palm facing up",
        "Use your right hand to gently press down on your left palm",
        "Keep your fingers straight and feel the stretch along your wrist and palm",
        "Hold for 15 seconds, then relax",
        "Next, extend your fingers upward and gently pull back",
        "Hold for 15 seconds, then switch hands"
      ],
      duration: "1 minute",
      benefits: [
        "Improves flexibility in the hand and fingers",
        "Helps prevent cramping",
        "Increases blood flow to the extremities"
      ],
      image: "https://images.pexels.com/photos/4699154/pexels-photo-4699154.jpeg"
    }
  ];

  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (timerActive && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setTimerActive(false);
      setTimeRemaining(30); // Reset timer to 30 seconds
    }
    
    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const pauseTimer = () => {
    setTimerActive(false);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeRemaining(30);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const nextTechnique = () => {
    if (currentTechnique === null) return;
    
    const nextIndex = (currentTechnique + 1) % techniques.length;
    setCurrentTechnique(nextIndex);
    resetTimer();
  };

  const prevTechnique = () => {
    if (currentTechnique === null) return;
    
    const prevIndex = (currentTechnique - 1 + techniques.length) % techniques.length;
    setCurrentTechnique(prevIndex);
    resetTimer();
  };

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-red-600 hover:text-red-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-red-800 flex items-center">
            <HeartPulse className="h-6 w-6 mr-2" />
            Hand Massage Techniques
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Benefits of Hand Massage</h2>
          <p className="text-gray-700 mb-4">
            Hand massage can be a simple yet effective way to relieve pain, reduce stress, and improve 
            circulation during your chemotherapy journey. These techniques can be performed by yourself or 
            with the help of a caregiver.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Pain Relief</h3>
              <p className="text-red-900 text-sm">
                Hand massage can help reduce pain and discomfort in the hands, wrists, and fingers that might result from treatments.
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Stress Reduction</h3>
              <p className="text-red-900 text-sm">
                The hands contain many nerve endings that connect to the rest of the body. Massaging them can trigger relaxation throughout your system.
              </p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Improved Circulation</h3>
              <p className="text-red-900 text-sm">
                Gentle massage increases blood flow to the extremities, which may be particularly beneficial during chemotherapy.
              </p>
            </div>
          </div>
        </div>

        {/* Technique Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {techniques.map((technique, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-transform hover:-translate-y-1"
              onClick={() => setCurrentTechnique(index)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={technique.image} 
                  alt={technique.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-red-800 mb-1">{technique.title}</h3>
                <p className="text-gray-600 text-sm">{technique.description}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-red-600 text-sm">{technique.duration}</span>
                  <button 
                    className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm hover:bg-red-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentTechnique(index);
                    }}
                  >
                    View Steps
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Materials Needed */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Materials (Optional)</h2>
          <ul className="space-y-3">
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
              <span className="text-gray-700">Hand lotion or oil (unscented if you're sensitive to fragrances)</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
              <span className="text-gray-700">A comfortable chair to sit in</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
              <span className="text-gray-700">Small towel for wiping excess lotion</span>
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-red-600 mr-2"></div>
              <span className="text-gray-700">A quiet, comfortable space to relax</span>
            </li>
          </ul>
        </div>

        {/* Detailed Technique Modal */}
        {currentTechnique !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={techniques[currentTechnique].image} 
                  alt={techniques[currentTechnique].title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">{techniques[currentTechnique].title}</h3>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">{techniques[currentTechnique].description}</p>
                
                <h4 className="text-lg font-semibold text-red-800 mb-2">Steps:</h4>
                <ol className="list-decimal pl-6 space-y-2 mb-6">
                  {techniques[currentTechnique].steps.map((step, i) => (
                    <li key={i} className="text-gray-700">{step}</li>
                  ))}
                </ol>
                
                <h4 className="text-lg font-semibold text-red-800 mb-2">Benefits:</h4>
                <ul className="list-disc pl-6 space-y-1 mb-6">
                  {techniques[currentTechnique].benefits.map((benefit, i) => (
                    <li key={i} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
                
                {/* Timer Section */}
                <div className="bg-red-50 p-4 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-2">Timer</h4>
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-red-800 mb-3">
                      {formatTime(timeRemaining)}
                    </div>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => resetTimer()}
                        className="bg-red-100 p-2 rounded-full hover:bg-red-200"
                      >
                        <SkipBack className="h-6 w-6 text-red-600" />
                      </button>
                      {timerActive ? (
                        <button
                          onClick={() => pauseTimer()}
                          className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                        >
                          <Pause className="h-6 w-6 text-white" />
                        </button>
                      ) : (
                        <button
                          onClick={() => startTimer()}
                          className="bg-red-600 p-2 rounded-full hover:bg-red-700"
                        >
                          <Play className="h-6 w-6 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={prevTechnique}
                    className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    <SkipBack className="h-4 w-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentTechnique(null)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={nextTechnique}
                    className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
                  >
                    Next
                    <SkipForward className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Important Tips</h2>
          <ul className="space-y-4">
            <li className="border-l-4 border-red-500 pl-4 py-1">
              <h3 className="font-semibold text-red-800">Gentle Pressure Only</h3>
              <p className="text-gray-700">Always use gentle to moderate pressure. Never press to the point of pain.</p>
            </li>
            <li className="border-l-4 border-red-500 pl-4 py-1">
              <h3 className="font-semibold text-red-800">Skip If There's Pain</h3>
              <p className="text-gray-700">If your hands are particularly painful or sensitive, wait until you're feeling better.</p>
            </li>
            <li className="border-l-4 border-red-500 pl-4 py-1">
              <h3 className="font-semibold text-red-800">Avoid Areas with IV Ports</h3>
              <p className="text-gray-700">If you have an IV port in your hand, avoid that area completely. Focus on the other hand.</p>
            </li>
            <li className="border-l-4 border-red-500 pl-4 py-1">
              <h3 className="font-semibold text-red-800">Stay Hydrated</h3>
              <p className="text-gray-700">Drink water before and after your hand massage to help flush toxins.</p>
            </li>
            <li className="border-l-4 border-red-500 pl-4 py-1">
              <h3 className="font-semibold text-red-800">Consult Your Healthcare Team</h3>
              <p className="text-gray-700">If you have concerns about using hand massage during your treatment, discuss it with your healthcare provider.</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HandMassage; 