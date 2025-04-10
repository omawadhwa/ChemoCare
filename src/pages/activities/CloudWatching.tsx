import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, Sun, Moon, Star, Info, Play, Pause, SkipForward } from 'lucide-react';

interface CloudPrompt {
  id: number;
  title: string;
  description: string;
  duration: number;
  icon: React.ReactNode;
}

const CloudWatching: React.FC = () => {
  const navigate = useNavigate();
  const [currentPrompt, setCurrentPrompt] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  const prompts: CloudPrompt[] = [
    {
      id: 1,
      title: "Shape Discovery",
      description: "Look at the clouds and try to identify different shapes. What do you see?",
      duration: 300,
      icon: <Cloud className="h-6 w-6 text-blue-500" />
    },
    {
      id: 2,
      title: "Color Observation",
      description: "Notice the different shades and colors in the clouds. How do they change?",
      duration: 300,
      icon: <Sun className="h-6 w-6 text-yellow-500" />
    },
    {
      id: 3,
      title: "Movement Awareness",
      description: "Watch how the clouds move and transform. What patterns do you notice?",
      duration: 300,
      icon: <Moon className="h-6 w-6 text-gray-500" />
    },
    {
      id: 4,
      title: "Mindful Breathing",
      description: "Breathe deeply as you watch the clouds. Match your breath to their gentle movement.",
      duration: 300,
      icon: <Star className="h-6 w-6 text-purple-500" />
    }
  ];

  const handlePlayPause = () => {
    if (isPlaying) {
      if (timer) clearTimeout(timer);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startTimer();
    }
  };

  const startTimer = () => {
    if (timer) clearTimeout(timer);
    const newTimer = window.setTimeout(() => {
      if (currentPrompt < prompts.length - 1) {
        setCurrentPrompt(prev => prev + 1);
        startTimer();
      } else {
        setIsPlaying(false);
      }
    }, prompts[currentPrompt].duration * 1000);
    setTimer(newTimer);
  };

  const handleNext = () => {
    if (timer) clearTimeout(timer);
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(prev => prev + 1);
      if (isPlaying) {
        startTimer();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
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
            <Cloud className="h-6 w-6 mr-2" />
            Cloud Watching
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="aspect-video bg-gradient-to-b from-blue-200 to-blue-300 rounded-lg mb-6 flex items-center justify-center">
            <div className="text-center">
              <Cloud className="h-20 w-20 text-white mx-auto mb-4" />
              <p className="text-white text-lg">Find a comfortable spot to watch the clouds</p>
            </div>
          </div>

          {/* Current Prompt */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-4">
              {prompts[currentPrompt].icon}
              <h2 className="text-xl font-bold text-blue-800 ml-2">
                {prompts[currentPrompt].title}
              </h2>
            </div>
            <p className="text-blue-700 mb-4">{prompts[currentPrompt].description}</p>
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePlayPause}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </button>
              <button
                onClick={handleNext}
                disabled={currentPrompt === prompts.length - 1}
                className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <SkipForward className="h-6 w-6" />
              </button>
              <span className="text-blue-600">
                {Math.floor(prompts[currentPrompt].duration / 60)} minutes
              </span>
            </div>
          </div>

          {/* Progress */}
          <div className="flex justify-between items-center">
            {prompts.map((prompt, index) => (
              <div
                key={prompt.id}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  index <= currentPrompt ? 'bg-blue-600' : 'bg-blue-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Benefits of Cloud Watching</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Mindfulness Practice</h3>
                <p className="text-blue-700">
                  Cloud watching helps you stay present and focused on the moment.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Stress Reduction</h3>
                <p className="text-blue-700">
                  The gentle movement of clouds can have a calming effect on the mind.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Creative Thinking</h3>
                <p className="text-blue-700">
                  Identifying shapes in clouds stimulates imagination and creativity.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Relaxation</h3>
                <p className="text-blue-700">
                  The slow, natural movement of clouds promotes a sense of peace and relaxation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-800">How to Practice Cloud Watching</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-blue-700">
              <p>
                Cloud watching is a simple yet powerful mindfulness practice. Here's how to get the most out of it:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Find a comfortable spot where you can see the sky</li>
                <li>Take a few deep breaths to center yourself</li>
                <li>Follow the guided prompts to focus your observation</li>
                <li>Notice the shapes, colors, and movements of the clouds</li>
                <li>Allow your mind to relax and wander with the clouds</li>
                <li>Practice for at least 5-10 minutes for best results</li>
              </ul>
              <p className="italic">
                Remember, there's no right or wrong way to cloud watch. The goal is simply to be present and observe.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CloudWatching; 