import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, HeartPulse, Feather, Waves, Sunrise, Leaf, Menu, X, ArrowLeft, LucideIcon, Wind, Droplets, Music, Flower, Coffee, PenTool, Cloud } from 'lucide-react';

function MindSoothingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  interface ExerciseType {
    icon: React.ReactNode;
    title: string;
    description: string;
    benefits: string;
    color: string;
  }

  const relaxingExercises: ExerciseType[] = [
    {
      icon: <Wind className="h-6 w-6 text-blue-600" />,
      title: "Deep breathing exercises",
      description: "4-7-8 breathing or diaphragmatic breathing",
      benefits: "Stress reduction, improved focus",
      color: "blue"
    },
    {
      icon: <Feather className="h-6 w-6 text-pink-600" />,
      title: "Light stretching",
      description: "Gentle movements to release tension",
      benefits: "Muscle relaxation, improved circulation",
      color: "pink"
    },
    {
      icon: <HeartPulse className="h-6 w-6 text-red-600" />,
      title: "Hand massage",
      description: "Self-massage or from a caregiver",
      benefits: "Pain reduction, relaxation",
      color: "red"
    },
    {
      icon: <Waves className="h-6 w-6 text-cyan-600" />,
      title: "Gentle water therapy",
      description: "Swimming or just floating in water",
      benefits: "Sensory calming, joint relief",
      color: "cyan"
    },
    {
      icon: <Sunrise className="h-6 w-6 text-amber-600" />,
      title: "Sunlight exposure",
      description: "Sitting quietly in morning sunlight",
      benefits: "Vitamin D, improved mood",
      color: "amber"
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: "Progressive relaxation",
      description: "Systematically relaxing body parts",
      benefits: "Reduced muscle tension, better sleep",
      color: "indigo"
    },
    {
      icon: <Wind className="h-6 w-6 text-teal-600" />,
      title: "Gentle swinging",
      description: "Porch swing or hammock rocking motion",
      benefits: "Vestibular stimulation, relaxation",
      color: "teal"
    },
  ];

  const relaxingActivities: ExerciseType[] = [
    {
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      title: "Gentle nature walks",
      description: "Short walks in quiet, natural settings",
      benefits: "Mood improvement, gentle exercise",
      color: "green"
    },
    {
      icon: <Droplets className="h-6 w-6 text-blue-600" />,
      title: "Warm baths",
      description: "With optional essential oils like lavender",
      benefits: "Muscle relaxation, calm nervous system",
      color: "blue"
    },
    {
      icon: <Music className="h-6 w-6 text-purple-600" />,
      title: "Listening to calming music",
      description: "Instrumental or nature sounds",
      benefits: "Reduced anxiety, improved focus",
      color: "purple"
    },
    {
      icon: <Flower className="h-6 w-6 text-pink-600" />,
      title: "Aromatherapy",
      description: "Lavender, chamomile, or sandalwood scents",
      benefits: "Stress reduction, improved mood",
      color: "pink"
    },
    {
      icon: <Coffee className="h-6 w-6 text-amber-600" />,
      title: "Warm beverage ritual",
      description: "Mindfully enjoying tea or warm milk",
      benefits: "Mindfulness practice, comforting routine",
      color: "amber"
    },
    {
      icon: <PenTool className="h-6 w-6 text-indigo-600" />,
      title: "Coloring books",
      description: "Simple adult coloring activities",
      benefits: "Focus, creative expression, relaxation",
      color: "indigo"
    },
    {
      icon: <Cloud className="h-6 w-6 text-sky-600" />,
      title: "Cloud watching",
      description: "Lying quietly observing the sky",
      benefits: "Mindful presence, imagination stimulation",
      color: "sky"
    },
  ];

  const renderCard = (item: ExerciseType) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 border-blue-200",
      pink: "bg-pink-50 border-pink-200",
      red: "bg-red-50 border-red-200",
      cyan: "bg-cyan-50 border-cyan-200",
      amber: "bg-amber-50 border-amber-200",
      indigo: "bg-indigo-50 border-indigo-200",
      teal: "bg-teal-50 border-teal-200",
      green: "bg-green-50 border-green-200",
      purple: "bg-purple-50 border-purple-200",
      sky: "bg-sky-50 border-sky-200"
    };

    const textColorMap: Record<string, string> = {
      blue: "text-blue-800",
      pink: "text-pink-800",
      red: "text-red-800",
      cyan: "text-cyan-800",
      amber: "text-amber-800",
      indigo: "text-indigo-800",
      teal: "text-teal-800",
      green: "text-green-800",
      purple: "text-purple-800", 
      sky: "text-sky-800"
    };

    // Determine if this card is implemented and has a dedicated page
    const implementedExercises = [
      "Deep breathing exercises", 
      "Progressive relaxation", 
      "Warm baths", 
      "Gentle swinging", 
      "Light stretching", 
      "Hand massage", 
      "Gentle water therapy", 
      "Sunlight exposure",
      "Gentle nature walks",
      "Listening to calming music",
      "Aromatherapy",
      "Warm beverage ritual",
      "Coloring books",
      "Cloud watching"
    ];
    const isImplemented = implementedExercises.includes(item.title);
    
    // Get the route for implemented exercises
    const getExerciseRoute = () => {
      switch(item.title) {
        case "Deep breathing exercises": 
          return "/mind-soothing/breathing";
        case "Progressive relaxation": 
          return "/mind-soothing/progressive-relaxation";
        case "Warm baths": 
          return "/mind-soothing/warm-bath";
        case "Gentle swinging":
          return "/mind-soothing/gentle-swinging";
        case "Light stretching":
          return "/mind-soothing/light-stretching";
        case "Hand massage":
          return "/mind-soothing/hand-massage";
        case "Gentle water therapy":
          return "/mind-soothing/water-therapy";
        case "Sunlight exposure":
          return "/mind-soothing/sunlight-exposure";
        case "Gentle nature walks":
          return "/mind-soothing/nature-walks";
        case "Listening to calming music":
          return "/mind-soothing/calming-music";
        case "Aromatherapy":
          return "/mind-soothing/aromatherapy";
        case "Warm beverage ritual":
          return "/mind-soothing/warm-beverage";
        case "Coloring books":
          return "/mind-soothing/coloring";
        case "Cloud watching":
          return "/mind-soothing/cloud-watching";
        default: 
          return "";
      }
    };

    const handleCardClick = () => {
      if (isImplemented) {
        navigate(getExerciseRoute());
      }
    };

    return (
      <div 
        onClick={handleCardClick}
        className={`p-6 rounded-lg shadow-md ${colorMap[item.color]} border-2 transition-all hover:shadow-lg hover:-translate-y-1 ${isImplemented ? 'cursor-pointer' : ''}`}
      >
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-full bg-white`}>
            {item.icon}
          </div>
          <h3 className={`ml-3 text-lg font-semibold ${textColorMap[item.color]}`}>
            {item.title}
          </h3>
        </div>
        <p className={`text-sm leading-relaxed mb-4 ${textColorMap[item.color]} opacity-80`}>{item.description}</p>
        <div className="mt-auto">
          <div className="bg-black p-3 rounded-md border border-gray-700">
            <p className="text-xs text-white font-medium flex items-center">
              💡 <span className="ml-1">Helps with:</span>
            </p>
            <p className="text-xs text-white mt-1">{item.benefits}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sage-600" />
              <span className="ml-2 text-xl font-semibold text-sage-900">ChemoCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#exercises" className="text-sage-600 hover:text-sage-800">Soothing Exercises</a>
              <a href="#activities" className="text-sage-600 hover:text-sage-800">Soothing Activities</a>
              <button onClick={() => navigate('/')} className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700">
                Back Home
              </button>
            </div>
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? (
                  <X className="h-6 w-6 text-sage-600" />
                ) : (
                  <Menu className="h-6 w-6 text-sage-600" />
                )}
              </button>
            </div>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#exercises" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Soothing Exercises</a>
              <a href="#activities" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Soothing Activities</a>
              <button onClick={() => navigate('/')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-sage-600 hover:bg-sage-700">
                Back Home
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
        <div className="mt-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl">
              <span className="block">Mind Soothing</span>
              <span className="block text-sage-600">Exercises & Activities</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Gentle practices designed to calm the mind, reduce stress, and enhance overall wellbeing during your chemotherapy journey.
            </p>
          </div>
        </div>
      </div>

      {/* Exercises Section */}
      <div className="py-12 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 id="exercises" className="text-3xl font-bold text-sage-900 mb-6">Relaxing Mind-Soothing Exercises</h2>
            <p className="text-lg text-warm-600 mb-8">Simple exercises that can be done almost anywhere to help calm your mind and body.</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relaxingExercises.map((exercise, index) => (
                <div key={index}>
                  {renderCard(exercise)}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 id="activities" className="text-3xl font-bold text-sage-900 mb-6">Relaxing Mind-Soothing Activities</h2>
            <p className="text-lg text-warm-600 mb-8">Enjoyable activities that can help reduce stress and promote mental wellbeing.</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relaxingActivities.map((activity, index) => (
                <div key={index}>
                  {renderCard(activity)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-sage-900 mb-6">Benefits of Mind-Soothing Practices</h2>
            <p className="text-lg text-warm-600 max-w-3xl mx-auto">
              Regular practice of these gentle exercises and activities can provide significant benefits during your treatment journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-sage-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-sage-900 mb-3">Physical Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-sage-700">
                <li>Reduced muscle tension</li>
                <li>Lower blood pressure</li>
                <li>Improved sleep quality</li>
                <li>Decreased physical pain</li>
                <li>Better nervous system regulation</li>
              </ul>
            </div>

            <div className="bg-sage-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-sage-900 mb-3">Mental Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-sage-700">
                <li>Decreased anxiety</li>
                <li>Improved mood</li>
                <li>Greater mental clarity</li>
                <li>Enhanced cognitive function</li>
                <li>Reduced "chemo brain" symptoms</li>
              </ul>
            </div>

            <div className="bg-sage-50 p-6 rounded-lg shadow">
              <h3 className="text-xl font-bold text-sage-900 mb-3">Emotional Benefits</h3>
              <ul className="list-disc pl-5 space-y-2 text-sage-700">
                <li>Increased sense of calm</li>
                <li>Greater emotional resilience</li>
                <li>Improved ability to cope with stress</li>
                <li>Enhanced overall wellbeing</li>
                <li>Better quality of life during treatment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sage-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to try these exercises?</span>
            <span className="block text-sage-200">Start with just a few minutes each day.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button 
                onClick={() => navigate('/')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MindSoothingPage; 