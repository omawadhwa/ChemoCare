import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets, ArrowLeft, ThumbsUp, Volume2, ThermometerSun, Clock, Droplet, VolumeX, Volume1, Play, Pause } from 'lucide-react';

// Define essential oils and their properties
const essentialOils = [
  {
    name: "Lavender",
    benefits: "Calming, helps with anxiety and sleep",
    color: "purple",
    recommended: true
  },
  {
    name: "Chamomile",
    benefits: "Soothing, relieves stress and promotes sleep",
    color: "yellow",
    recommended: true
  },
  {
    name: "Eucalyptus",
    benefits: "Refreshing, helps clear sinuses and respiratory support",
    color: "teal",
    recommended: false
  },
  {
    name: "Peppermint",
    benefits: "Energizing, helps with headaches and nausea",
    color: "green",
    recommended: false
  },
  {
    name: "Rose",
    benefits: "Uplifting, helps with anxiety and emotional balance",
    color: "pink",
    recommended: true
  },
  {
    name: "Sandalwood",
    benefits: "Grounding, promotes mental clarity and relaxation",
    color: "amber",
    recommended: true
  },
  {
    name: "Ylang Ylang",
    benefits: "Soothing, reduces anxiety and balances mood",
    color: "yellow",
    recommended: true
  }
];

const soundOptions = [
  { 
    name: "Gentle Rain", 
    icon: "🌧️", 
    src: "/sounds/rain.mp3"
  },
  { 
    name: "Ocean Waves", 
    icon: "🌊", 
    src: "/sounds/ocean.mp3"
  },
  { 
    name: "Forest Sounds", 
    icon: "🌲", 
    src: "/sounds/forest.mp3"
  },
  { 
    name: "Soft Piano", 
    icon: "🎹", 
    src: "/sounds/piano.mp3"
  },
  { 
    name: "Meditation Bowls", 
    icon: "🔔", 
    src: "/sounds/meditation.mp3"
  }
];

const WarmBath: React.FC = () => {
  const navigate = useNavigate();
  const [selectedOils, setSelectedOils] = useState<string[]>([]);
  const [bathTemperature, setBathTemperature] = useState(38); // Celsius
  const [bathDuration, setBathDuration] = useState(20); // Minutes
  const [ambientSound, setAmbientSound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5); // 0 to 1
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'error' | 'playing'>('idle');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [dimLights, setDimLights] = useState(true);
  const [showRecommended, setShowRecommended] = useState(false);

  // Handle sound selection
  const handleSoundSelect = (soundName: string) => {
    // If same sound clicked, toggle it off
    if (ambientSound === soundName) {
      setAmbientSound(null);
      setIsPlaying(false);
      setAudioStatus('idle');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setAmbientSound(soundName);
      setAudioStatus('loading');
      
      // Find the sound URL
      const sound = soundOptions.find(s => s.name === soundName);
      if (sound && audioRef.current) {
        try {
          audioRef.current.src = sound.src;
          audioRef.current.volume = volume;
          audioRef.current.loop = true;
          
          // Play the audio with a visual feedback if it fails
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                setAudioStatus('playing');
                console.log(`Playing ${soundName} sound`);
              })
              .catch(err => {
                console.error("Error playing audio:", err);
                setAudioStatus('error');
              });
          }
        } catch (error) {
          console.error("Error setting up audio:", error);
          setAudioStatus('error');
        }
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const toggleOilSelection = (oilName: string) => {
    if (selectedOils.includes(oilName)) {
      setSelectedOils(selectedOils.filter(name => name !== oilName));
    } else {
      setSelectedOils([...selectedOils, oilName]);
    }
  };

  // Get appropriate temperature class for temperature display
  const getTemperatureClass = () => {
    if (bathTemperature < 36) return 'text-blue-500';
    if (bathTemperature > 40) return 'text-red-500';
    return 'text-green-500';
  };

  // Select recommended oils only
  const selectRecommendedOils = () => {
    const recommended = essentialOils
      .filter(oil => oil.recommended)
      .map(oil => oil.name);
    setSelectedOils(recommended);
  };

  // Add audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      const handleCanPlay = () => {
        if (audioStatus === 'loading') {
          setAudioStatus('playing');
        }
      };
      
      const handleError = () => {
        console.error('Audio error occurred');
        setAudioStatus('error');
      };
      
      const handleEnded = () => {
        // This shouldn't happen with loop=true, but just in case
        setIsPlaying(false);
      };
      
      // Add event listeners
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.addEventListener('ended', handleEnded);
      
      // Clean up event listeners
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioStatus]);

  return (
    <div className={`min-h-screen transition-colors duration-700 flex flex-col ${dimLights ? 'bg-blue-900' : 'bg-blue-100'}`}>
      {/* Hidden audio element with preload attribute */}
      <audio ref={audioRef} preload="auto" />

      {/* Global styles for animations */}
      <style>{`
        @keyframes audioVisualizerAnimation {
          0%, 100% { height: 8px; }
          50% { height: 24px; }
        }
        
        .audio-bar {
          animation-duration: var(--duration);
          animation-name: audioVisualizerAnimation;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
        
        .ripple {
          animation: ripple 2s linear infinite;
        }
        
        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3),
                        0 0 0 1px rgba(59, 130, 246, 0.3),
                        0 0 0 3px rgba(59, 130, 246, 0.3),
                        0 0 0 5px rgba(59, 130, 246, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.3),
                        0 0 0 6px rgba(59, 130, 246, 0.3),
                        0 0 0 12px rgba(59, 130, 246, 0.3),
                        0 0 0 18px rgba(59, 130, 246, 0)
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white bg-opacity-10 shadow-md p-4 backdrop-blur-lg">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-blue-300 hover:text-blue-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <h1 className="font-bold text-xl text-blue-100 flex items-center">
            <Droplets className="h-6 w-6 mr-2" />
            <span>Warm Bath Therapy</span>
          </h1>
          <button
            onClick={() => setDimLights(!dimLights)}
            className={`px-2 py-1 rounded-md ${dimLights ? 'bg-blue-700 text-blue-200' : 'bg-blue-200 text-blue-800'} text-sm font-medium transition-colors`}
          >
            {dimLights ? 'Brighten' : 'Dim Lights'}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column - Bath Settings */}
          <div className="md:col-span-7 space-y-8">
            {/* Water temperature */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <div className="flex items-center mb-4">
                <ThermometerSun className="h-6 w-6 text-yellow-300 mr-2" />
                <h2 className="text-xl font-bold text-blue-100">Water Temperature</h2>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <span className={`text-5xl font-bold mb-2 ${getTemperatureClass()}`}>
                  {bathTemperature}°C
                </span>
                <p className="text-blue-200 text-center max-w-md">
                  {bathTemperature < 36 
                    ? "Too cold for therapeutic benefits. Increase temperature." 
                    : bathTemperature > 40 
                      ? "Too hot and may cause discomfort. Decrease temperature." 
                      : "Ideal temperature for relaxation."
                  }
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <button 
                  onClick={() => setBathTemperature(Math.max(32, bathTemperature - 1))}
                  className="px-4 py-2 bg-blue-700 text-blue-100 rounded-l-lg hover:bg-blue-600 transition-colors"
                >
                  -
                </button>
                <input
                  type="range"
                  min="32"
                  max="43"
                  value={bathTemperature}
                  onChange={(e) => setBathTemperature(parseInt(e.target.value))}
                  className="w-full mx-1"
                />
                <button 
                  onClick={() => setBathTemperature(Math.min(43, bathTemperature + 1))}
                  className="px-4 py-2 bg-blue-700 text-blue-100 rounded-r-lg hover:bg-blue-600 transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="flex justify-between mt-2 px-1 text-xs text-blue-300">
                <span>32°C</span>
                <span>38°C (Ideal)</span>
                <span>43°C</span>
              </div>
            </div>
            
            {/* Duration setting */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-blue-300 mr-2" />
                <h2 className="text-xl font-bold text-blue-100">Bath Duration</h2>
              </div>
              
              <div className="flex flex-col items-center mb-6">
                <span className="text-4xl font-bold mb-2 text-blue-200">
                  {bathDuration} minutes
                </span>
                <p className="text-blue-300 text-center max-w-md">
                  {bathDuration < 15 
                    ? "Consider a longer bath for maximum relaxation benefits." 
                    : bathDuration > 30 
                      ? "Extended baths may cause fatigue or dehydration." 
                      : "Perfect duration for therapeutic benefits."
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-4 gap-3 mt-4">
                {[10, 15, 20, 30].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setBathDuration(duration)}
                    className={`py-2 rounded-lg transition-colors ${
                      bathDuration === duration 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-800 bg-opacity-50 text-blue-200 hover:bg-blue-700'
                    }`}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>
            
            {/* Essential oils selection */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Droplet className="h-6 w-6 text-pink-300 mr-2" />
                  <h2 className="text-xl font-bold text-blue-100">Essential Oils</h2>
                </div>
                <button
                  onClick={() => setShowRecommended(!showRecommended)}
                  className={`text-sm px-3 py-1 rounded-full ${
                    showRecommended ? 'bg-green-700 text-green-100' : 'bg-blue-700 text-blue-200'
                  }`}
                >
                  {showRecommended ? 'Show All' : 'Show Recommended'}
                </button>
              </div>
              
              <p className="text-blue-300 mb-4">
                Select essential oils to add to your bath for enhanced therapeutic benefits.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {essentialOils
                  .filter(oil => !showRecommended || oil.recommended)
                  .map((oil) => {
                    // Define color classes for each oil
                    const bgColorClass = selectedOils.includes(oil.name) 
                      ? `bg-${oil.color}-600 bg-opacity-60` 
                      : `bg-${oil.color}-900 bg-opacity-20 hover:bg-${oil.color}-800 hover:bg-opacity-30`;
                    
                    const textColorClass = selectedOils.includes(oil.name)
                      ? `text-${oil.color}-100` 
                      : `text-${oil.color}-300`;
                    
                    return (
                      <button
                        key={oil.name}
                        onClick={() => toggleOilSelection(oil.name)}
                        className={`p-3 rounded-lg transition-all flex flex-col items-center ${bgColorClass} backdrop-blur-sm relative overflow-hidden`}
                      >
                        {oil.recommended && (
                          <span className="absolute top-0 right-0 bg-green-600 text-xs text-white px-1">
                            ✓
                          </span>
                        )}
                        <span className={`font-medium ${textColorClass}`}>{oil.name}</span>
                      </button>
                    );
                  })}
              </div>
              
              <button
                onClick={selectRecommendedOils}
                className="w-full py-2 bg-green-600 bg-opacity-70 hover:bg-opacity-90 text-green-100 rounded-lg flex items-center justify-center transition-colors"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                Select Recommended Oils Only
              </button>
            </div>
          </div>
          
          {/* Right Column - Ambiance & Instructions */}
          <div className="md:col-span-5 space-y-8">
            {/* Ambient sounds selector */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <div className="flex items-center mb-4">
                <Volume2 className="h-6 w-6 text-blue-300 mr-2" />
                <h2 className="text-xl font-bold text-blue-100">Ambient Sounds</h2>
              </div>
              
              <p className="text-blue-300 mb-4">
                Choose calming sounds to enhance your bath experience.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {soundOptions.map((sound) => (
                  <button
                    key={sound.name}
                    onClick={() => handleSoundSelect(sound.name)}
                    className={`p-3 rounded-lg transition-all flex flex-col items-center ${
                      ambientSound === sound.name
                        ? 'bg-blue-600 bg-opacity-60 shadow-inner text-blue-100' 
                        : 'bg-blue-800 bg-opacity-30 hover:bg-blue-700 hover:bg-opacity-40 text-blue-300'
                    }`}
                  >
                    <span className="text-2xl mb-1">{sound.icon}</span>
                    <span className="text-sm">{sound.name}</span>
                  </button>
                ))}
              </div>
              
              {/* Audio controls - only show if a sound is selected */}
              {ambientSound && (
                <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <button onClick={togglePlay} className="mr-3">
                        {isPlaying 
                          ? <Pause className="h-5 w-5 text-blue-300" /> 
                          : <Play className="h-5 w-5 text-blue-300" />
                        }
                      </button>
                      <span className="text-blue-200">{ambientSound}</span>
                    </div>
                    
                    <button onClick={toggleMute}>
                      {isMuted 
                        ? <VolumeX className="h-5 w-5 text-blue-300" /> 
                        : <Volume1 className="h-5 w-5 text-blue-300" />
                      }
                    </button>
                  </div>
                  
                  {/* Volume slider */}
                  <div className="flex items-center">
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume}
                      onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  {/* Audio visualizer - purely decorative */}
                  {isPlaying && audioStatus === 'playing' && (
                    <div className="h-6 flex items-end justify-center space-x-1 mt-2">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div 
                          key={i}
                          className="w-1 bg-blue-400 rounded-t audio-bar"
                          style={{ 
                            '--duration': `${0.8 + Math.random() * 0.6}s`,
                            height: `${8 + Math.random() * 16}px`
                          } as React.CSSProperties}
                        />
                      ))}
                    </div>
                  )}
                  
                  {/* Audio status indicator */}
                  {audioStatus === 'loading' && (
                    <p className="text-xs text-blue-300 text-center mt-2">Loading audio...</p>
                  )}
                  {audioStatus === 'error' && (
                    <p className="text-xs text-red-300 text-center mt-2">Error playing audio</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Bath Instructions */}
            <div className="bg-white bg-opacity-5 backdrop-blur-sm p-6 rounded-xl shadow-xl">
              <h2 className="text-xl font-bold text-blue-100 mb-4">Therapeutic Bath Instructions</h2>
              
              <div className="space-y-4 text-blue-300">
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                  <h3 className="font-medium text-blue-200 mb-1">Preparation</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Set aside 30-40 minutes of uninterrupted time</li>
                    <li>Fill the tub with water at {bathTemperature}°C</li>
                    <li>Add your selected essential oils to the water</li>
                    <li>Dim the lights and prepare a towel nearby</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                  <h3 className="font-medium text-blue-200 mb-1">During Your Bath</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Enter slowly and take deep breaths</li>
                    <li>Remain in the bath for {bathDuration} minutes</li>
                    <li>Focus on your breathing and relaxation</li>
                    <li>Drink water before and after to stay hydrated</li>
                  </ul>
                </div>
                
                <div className="bg-blue-900 bg-opacity-30 p-3 rounded-lg">
                  <h3 className="font-medium text-blue-200 mb-1">Benefits for Chemotherapy Patients</h3>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Muscular tension release</li>
                    <li>Stress and anxiety reduction</li>
                    <li>Improved sleep quality</li>
                    <li>Temporary pain relief</li>
                    <li>Enhanced mindfulness and presence</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Safety Notes */}
            <div className="bg-red-900 bg-opacity-20 backdrop-blur-sm p-4 rounded-xl shadow-xl text-sm">
              <h3 className="font-bold text-red-200 mb-2">Important Safety Notes</h3>
              <ul className="list-disc list-inside space-y-1 text-red-200">
                <li>Consult with your care team before starting bath therapy</li>
                <li>Avoid if you have open wounds or active skin infections</li>
                <li>Use a bath mat and grab rail for safety</li>
                <li>Have someone nearby in case you need assistance</li>
                <li>Exit the bath immediately if you feel dizzy or unwell</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WarmBath; 