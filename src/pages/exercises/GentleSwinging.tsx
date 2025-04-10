import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Check, AlertTriangle, Clock } from 'lucide-react';

const GentleSwinging: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<boolean[]>(Array(6).fill(false));

  const toggleStepCompletion = (index: number) => {
    const newCompletedSteps = [...completedSteps];
    newCompletedSteps[index] = !newCompletedSteps[index];
    setCompletedSteps(newCompletedSteps);
  };

  const swingingSteps = [
    {
      title: "Find a Suitable Space",
      instructions: "Choose a comfortable, quiet place where you can sit securely and have enough space to gently swing your body.",
      details: "Make sure the area is free from obstacles and that your chair or seating is stable. If possible, choose a place near natural light or with a view of nature.",
      image: "/images/swinging/comfortable-space.jpg"
    },
    {
      title: "Seated Position",
      instructions: "Sit upright on a chair or cushion with your feet flat on the floor, hip-width apart.",
      details: "Your posture is important - keep your spine naturally aligned but not rigidly straight. Your shoulders should be relaxed and hands can rest in your lap or on your thighs.",
      image: "/images/swinging/seated-position.jpg"
    },
    {
      title: "Connect with Breath",
      instructions: "Take 3-5 deep breaths, inhaling through your nose and exhaling through your mouth.",
      details: "As you breathe, feel your body releasing tension. Your breath will become an anchor throughout this practice, helping you maintain presence and gentleness.",
      image: "/images/swinging/deep-breathing.jpg"
    },
    {
      title: "Begin Gentle Swinging",
      instructions: "Start a gentle side-to-side swinging motion with your upper body, moving like a pendulum.",
      details: "The movement should be slow and controlled. Imagine your spine as a flexible tree trunk, able to sway gently in a breeze. Keep your movements small at first, especially if you're experiencing pain or have limited mobility.",
      image: "/images/swinging/side-swinging.jpg"
    },
    {
      title: "Explore Different Movements",
      instructions: "Try small circular movements, forward-backward motions, or gentle figure-eights.",
      details: "Explore each movement slowly, noticing which ones feel most soothing. Adjust based on your comfort level. If any movement causes discomfort, return to the ones that feel pleasant.",
      image: "/images/swinging/circular-motion.jpg"
    },
    {
      title: "Mindful Conclusion",
      instructions: "Gradually slow your movements until you come to stillness. Sit quietly for a moment and notice how your body feels.",
      details: "Pay attention to any changes in your body - areas that feel more relaxed, any shift in your mood, or a sense of greater presence. Take a deep breath before moving on with your day.",
      image: "/images/swinging/stillness.jpg"
    }
  ];

  const benefitsInfo = [
    {
      title: "Relieves Physical Tension",
      description: "Gentle rhythmic movement can help release muscle tension, particularly in the back, neck, and shoulders - areas often affected by stress and treatment."
    },
    {
      title: "Calms the Nervous System",
      description: "The rocking motion has been shown to activate the parasympathetic nervous system, which controls rest and relaxation responses."
    },
    {
      title: "Improves Circulation",
      description: "The subtle movements stimulate blood flow through muscle groups, which can be beneficial during treatment when activity levels might be reduced."
    },
    {
      title: "Strengthens Mind-Body Connection",
      description: "This practice encourages awareness of subtle bodily sensations and movements, helping reconnect with your body during treatment."
    },
    {
      title: "Accessible Movement Option",
      description: "When energy is limited, this gentle movement provides a way to engage in physical activity that isn't taxing or depleting."
    }
  ];

  const practiceVariations = [
    {
      title: "Seated Variation",
      description: "The standard practice done while sitting on a chair or cushion. Best for those with good balance and moderate energy.",
      suitability: "Most accessible version, suitable for nearly everyone."
    },
    {
      title: "Lying Down Variation",
      description: "Performed while lying on your back, gently rocking your knees from side to side or making small pelvic tilts.",
      suitability: "Ideal for low-energy days or when sitting is uncomfortable."
    },
    {
      title: "Supported Standing Variation",
      description: "Standing with support (like holding a chair or counter), gently shifting weight from foot to foot or swaying side to side.",
      suitability: "Good for those who want to engage their lower body but still need support."
    },
    {
      title: "Water-Based Variation",
      description: "Performing gentle swaying movements while seated in a warm bath or pool (if approved by your healthcare team).",
      suitability: "The buoyancy of water provides added support and may ease joint discomfort."
    }
  ];

  // Navigation helper functions
  const nextStep = () => {
    if (currentStep < swingingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-green-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-green-600 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-green-800">Gentle Swinging Movement</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Gentle Swinging Movement Practice</h2>
          <p className="text-gray-700 mb-6">
            This practice uses gentle, rhythmic swinging movements to soothe your nervous system, 
            release tension, and create a sense of calm. During chemotherapy, these movements can help 
            you reconnect with your body in a gentle, nurturing way while providing stress relief without exertion.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Important Note</h3>
                <p className="text-yellow-800 text-sm">
                  If you experience dizziness, pain, or discomfort while practicing these movements, stop immediately. 
                  Movement should always be gentle and within your comfort range. If you have balance issues, always 
                  practice near something stable you can hold onto.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section - Expandable */}
          <div className="mb-6">
            <button 
              className="flex items-center justify-between w-full bg-green-100 hover:bg-green-200 rounded-lg p-4 transition-colors"
              onClick={() => setShowInfoBox(!showInfoBox)}
            >
              <span className="font-semibold text-lg text-green-800">Benefits of Gentle Swinging Movements</span>
              <span className="text-green-700">{showInfoBox ? '−' : '+'}</span>
            </button>
            
            {showInfoBox && (
              <div className="bg-white border border-green-200 rounded-b-lg p-4 mt-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benefitsInfo.map((benefit, index) => (
                    <div key={index} className="flex items-start border-l-2 border-green-300 pl-3 py-2">
                      <div>
                        <h3 className="font-medium text-green-800">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step-by-Step Guide */}
          <div>
            <h3 className="text-xl font-bold text-green-800 mb-4">Step-by-Step Practice</h3>
            
            <div className="bg-white border border-green-200 rounded-lg shadow-sm">
              {/* Progress indicator */}
              <div className="px-4 py-3 border-b border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Step {currentStep + 1} of {swingingSteps.length}</span>
                  <div className="flex space-x-1">
                    {swingingSteps.map((_, index) => (
                      <div 
                        key={index} 
                        className={`h-2 w-8 rounded-full ${
                          index === currentStep 
                            ? 'bg-green-500' 
                            : index < currentStep 
                              ? 'bg-green-300' 
                              : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Current step content */}
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="md:w-1/3 bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                    {/* Placeholder for image */}
                    <span className="text-gray-500 text-sm">Image: {swingingSteps[currentStep].title}</span>
                  </div>
                  
                  <div className="md:w-2/3">
                    <h4 className="text-lg font-bold text-green-800 mb-2 flex items-center">
                      {swingingSteps[currentStep].title}
                      <button 
                        className={`ml-2 w-6 h-6 rounded-full flex items-center justify-center ${
                          completedSteps[currentStep] 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                        }`}
                        onClick={() => toggleStepCompletion(currentStep)}
                        aria-label={completedSteps[currentStep] ? "Mark as incomplete" : "Mark as complete"}
                      >
                        {completedSteps[currentStep] && <Check className="h-4 w-4" />}
                      </button>
                    </h4>
                    
                    <p className="text-gray-700 mb-4">{swingingSteps[currentStep].instructions}</p>
                    
                    <div className="bg-green-50 p-3 rounded-md text-sm">
                      <p className="text-gray-700">{swingingSteps[currentStep].details}</p>
                    </div>
                    
                    {currentStep === 3 && (
                      <div className="mt-4 bg-blue-50 p-3 rounded-md border-l-4 border-blue-300">
                        <div className="flex items-start">
                          <Clock className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                          <p className="text-sm text-blue-800">
                            <span className="font-medium">Timing Tip:</span> Start with just 1-2 minutes of gentle swinging. 
                            You can gradually increase to 3-5 minutes as it feels comfortable. Quality of movement is more 
                            important than duration.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Navigation buttons */}
              <div className="px-6 py-4 border-t border-green-200 flex justify-between">
                <button 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`flex items-center ${
                    currentStep === 0
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Previous
                </button>
                
                <button 
                  onClick={nextStep}
                  disabled={currentStep === swingingSteps.length - 1}
                  className={`flex items-center ${
                    currentStep === swingingSteps.length - 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  Next
                  <ChevronRight className="h-5 w-5 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Practice Variations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Practice Variations</h2>
          <p className="text-gray-700 mb-6">
            Depending on your energy level, physical condition, and personal preference, you can adapt this 
            practice in several ways:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practiceVariations.map((variation, index) => (
              <div key={index} className="bg-white border border-green-200 rounded-lg p-4 shadow-sm">
                <h3 className="font-bold text-green-800 mb-2">{variation.title}</h3>
                <p className="text-gray-700 text-sm mb-3">{variation.description}</p>
                <div className="bg-green-50 p-2 rounded-md">
                  <p className="text-xs text-green-800">
                    <span className="font-medium">Suitability:</span> {variation.suitability}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tips and Guidelines */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Tips for Effective Practice</h2>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 text-green-600 mr-3 flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Movement Quality</h3>
                <p className="text-sm text-gray-700">Focus on slow, gentle, fluid movements rather than quick or jerky motions. Quality is more important than quantity.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 text-green-600 mr-3 flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Breathe Naturally</h3>
                <p className="text-sm text-gray-700">Allow your breath to flow naturally with the movements. There's no need to coordinate breath and movement specifically.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 text-green-600 mr-3 flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Consistent Practice</h3>
                <p className="text-sm text-gray-700">Even a minute or two of gentle swinging daily can provide cumulative benefits. Consider incorporating it into your regular routine.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 text-green-600 mr-3 flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Pain Awareness</h3>
                <p className="text-sm text-gray-700">If any movement causes pain, modify or stop. Gentle swinging should feel soothing, not straining.</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="bg-green-100 rounded-full p-1 text-green-600 mr-3 flex-shrink-0 mt-0.5">
                <Check className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Combine with Other Practices</h3>
                <p className="text-sm text-gray-700">Gentle swinging pairs well with breathing practices or visualization. Try incorporating calming imagery as you move.</p>
              </div>
            </li>
          </ul>
          
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-800 mb-2">When to Practice</h3>
            <p className="text-sm text-gray-700 mb-3">
              This gentle practice can be beneficial at various times during your treatment journey:
            </p>
            
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <p className="text-sm text-gray-700"><span className="font-medium">Before appointments</span> to calm anxiety and center yourself</p>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <p className="text-sm text-gray-700"><span className="font-medium">During long waiting periods</span> (if space allows) to relieve restlessness</p>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <p className="text-sm text-gray-700"><span className="font-medium">When experiencing mild discomfort</span> to shift focus and release tension</p>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <p className="text-sm text-gray-700"><span className="font-medium">Before sleep</span> to release the day's accumulated tension</p>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <p className="text-sm text-gray-700"><span className="font-medium">When feeling disconnected from your body</span> to gently reestablish the mind-body connection</p>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GentleSwinging; 