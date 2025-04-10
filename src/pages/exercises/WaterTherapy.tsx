import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Waves, AlertTriangle, CheckCircle, Clock, Heart, Thermometer } from 'lucide-react';

interface WaterActivity {
  title: string;
  description: string;
  benefits: string[];
  difficulty: 'easy' | 'moderate';
  duration: string;
  image: string;
  cautions?: string[];
  steps?: string[];
}

const WaterTherapy: React.FC = () => {
  const navigate = useNavigate();
  const [currentActivity, setCurrentActivity] = useState<number | null>(null);
  const [favoriteActivities, setFavoriteActivities] = useState<number[]>([]);

  const activities: WaterActivity[] = [
    {
      title: "Gentle Floating",
      description: "Simply floating in water provides sensory relief and takes pressure off joints and muscles.",
      benefits: [
        "Reduces pressure on joints and muscles",
        "Promotes deep relaxation through sensory deprivation",
        "Improves circulation"
      ],
      difficulty: "easy",
      duration: "5-20 minutes",
      image: "https://images.pexels.com/photos/1263349/pexels-photo-1263349.jpeg",
      steps: [
        "Find a calm, quiet body of water (pool, lake, or bathtub)",
        "Use floating aids if needed (pool noodle, floating mat)",
        "Lie back and allow your body to be supported by the water",
        "Close your eyes and focus on your breathing",
        "Let your limbs relax completely",
        "Remain floating for 5-20 minutes, as comfortable"
      ],
      cautions: [
        "Never float alone in open water",
        "Use floating aids if you're not a confident swimmer",
        "Avoid if you have ear infections or certain skin conditions"
      ]
    },
    {
      title: "Water Walking",
      description: "Walking in waist-deep water provides resistance without stress on joints.",
      benefits: [
        "Provides natural resistance for muscle strengthening",
        "Very low impact on joints",
        "Improves balance and stability"
      ],
      difficulty: "easy",
      duration: "10-15 minutes",
      image: "https://images.pexels.com/photos/1188473/pexels-photo-1188473.jpeg",
      steps: [
        "Enter water that's approximately waist-deep",
        "Stand with good posture, shoulders back",
        "Walk forward with a normal gait for 1-2 minutes",
        "Walk sideways (sidestepping) for 1-2 minutes in each direction",
        "Walk backward (carefully) for 1-2 minutes",
        "Repeat the cycle 2-3 times"
      ],
      cautions: [
        "Ensure the pool floor isn't slippery",
        "Use handrails when available",
        "Don't push to the point of fatigue"
      ]
    },
    {
      title: "Gentle Pool Stretches",
      description: "Perform basic stretches in the water to improve flexibility with less strain.",
      benefits: [
        "Water supports your body weight, making stretches easier",
        "Warm water helps relax muscles",
        "Increases range of motion with less discomfort"
      ],
      difficulty: "easy",
      duration: "15-20 minutes",
      image: "https://images.pexels.com/photos/260598/pexels-photo-260598.jpeg",
      steps: [
        "Stand in chest-deep water near the pool wall for support",
        "Arm stretches: Extend arms to sides, then front, then overhead",
        "Leg stretches: Hold onto pool edge and gently swing one leg forward and back",
        "Side stretches: Place one hand on pool wall, extend other arm over head and lean",
        "Hold each stretch for 15-30 seconds",
        "Remember to breathe deeply throughout"
      ],
      cautions: [
        "Maintain good footing to prevent slipping",
        "Stretch only to the point of mild tension, never pain",
        "Use pool wall or other support for balance"
      ]
    },
    {
      title: "Seated Water Relaxation",
      description: "Sitting comfortably in water (like in a hot tub or bath) for relaxation and pain relief.",
      benefits: [
        "Heat from warm water soothes aching muscles",
        "Water pressure can reduce swelling",
        "Promotes relaxation and stress reduction"
      ],
      difficulty: "easy",
      duration: "15-30 minutes",
      image: "https://images.pexels.com/photos/6461378/pexels-photo-6461378.jpeg",
      steps: [
        "Fill a bathtub with comfortably warm water (not too hot)",
        "Add Epsom salts if desired for additional muscle relief",
        "Ease yourself in slowly and sit comfortably",
        "Focus on deep, slow breathing",
        "Gently rotate joints if comfortable (wrists, ankles)",
        "Remain for 15-30 minutes, adding warm water as needed"
      ],
      cautions: [
        "Water should be warm, not hot (98-100°F)",
        "Exit slowly if feeling lightheaded",
        "Drink water before and after to stay hydrated",
        "Limit sessions to 30 minutes maximum"
      ]
    },
    {
      title: "Gentle Aqua Movements",
      description: "Simple movement patterns in water that gently exercise muscles without strain.",
      benefits: [
        "Engages multiple muscle groups simultaneously",
        "Water resistance strengthens muscles gently",
        "Improves coordination and body awareness"
      ],
      difficulty: "moderate",
      duration: "15-20 minutes",
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg",
      steps: [
        "Stand in waist to chest-deep water",
        "Arm circles: Make small circles with arms just under water surface",
        "Knee lifts: Slowly lift one knee toward chest, then lower",
        "Side steps: Step side to side with arms pushing water",
        "Forward/backward steps: Take 4 steps forward, then 4 steps back",
        "Do each movement for 1-2 minutes, then switch"
      ],
      cautions: [
        "Keep movements slow and controlled",
        "Rest between exercises if needed",
        "Stay hydrated even though you're in water"
      ]
    }
  ];

  const toggleFavorite = (index: number) => {
    if (favoriteActivities.includes(index)) {
      setFavoriteActivities(favoriteActivities.filter(i => i !== index));
    } else {
      setFavoriteActivities([...favoriteActivities, index]);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-cyan-600 hover:text-cyan-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-cyan-800 flex items-center">
            <Waves className="h-6 w-6 mr-2" />
            Gentle Water Therapy
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">Water Therapy for Comfort During Treatment</h2>
          <p className="text-gray-700 mb-4">
            Water therapy (aquatherapy) can be a gentle way to relieve discomfort, reduce stress, and promote relaxation during your
            chemotherapy journey. The natural buoyancy of water reduces pressure on painful joints and muscles, while
            providing a peaceful sensory experience.
          </p>
          
          <div className="bg-cyan-100 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold text-cyan-800 mb-2">Benefits of Water Therapy:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start">
                <div className="bg-white p-1 rounded-full mr-2">
                  <CheckCircle className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-cyan-900">Reduces joint pain and pressure</p>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-1 rounded-full mr-2">
                  <CheckCircle className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-cyan-900">Promotes relaxation and decreases anxiety</p>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-1 rounded-full mr-2">
                  <CheckCircle className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-cyan-900">Gentle resistance for maintaining muscle tone</p>
              </div>
              <div className="flex items-start">
                <div className="bg-white p-1 rounded-full mr-2">
                  <CheckCircle className="h-5 w-5 text-cyan-600" />
                </div>
                <p className="text-cyan-900">Improved circulation and reduced swelling</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Important Safety Note</h3>
                <p className="text-yellow-800 text-sm">
                  Always check with your healthcare provider before starting water therapy. If you have a central line, port, 
                  or PICC line, you may need to take special precautions or avoid submerging the area. Never practice water 
                  activities alone if you're experiencing weakness or fatigue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(index);
                  }}
                  className="absolute top-2 right-2 bg-white p-2 rounded-full shadow"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favoriteActivities.includes(index) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-cyan-800">{activity.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activity.difficulty === 'easy' ? 'Easy' : 'Moderate'}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                <div className="flex items-center text-cyan-600 mb-3">
                  <Clock className="h-4 w-4 mr-1" />
                  <span className="text-sm">{activity.duration}</span>
                </div>
                <button
                  onClick={() => setCurrentActivity(index)}
                  className="w-full bg-cyan-100 text-cyan-800 py-2 rounded-lg hover:bg-cyan-200 transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Best Practices Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">Best Practices for Water Therapy</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-cyan-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Thermometer className="h-6 w-6 text-cyan-600 mr-2" />
                <h3 className="text-lg font-semibold text-cyan-800">Water Temperature</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• For relaxation: Warm water (92-98°F / 33-37°C)</li>
                <li>• For exercise: Slightly cooler (83-88°F / 28-31°C)</li>
                <li>• Avoid very hot water which can cause dizziness</li>
                <li>• Exit immediately if feeling uncomfortable</li>
              </ul>
            </div>
            
            <div className="border border-cyan-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Clock className="h-6 w-6 text-cyan-600 mr-2" />
                <h3 className="text-lg font-semibold text-cyan-800">Duration & Timing</h3>
              </div>
              <ul className="space-y-2 text-gray-700">
                <li>• Start with short sessions (5-10 minutes)</li>
                <li>• Gradually increase up to 30 minutes</li>
                <li>• Wait 1-2 hours after eating</li>
                <li>• Best when you have moderate energy levels</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-cyan-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-cyan-800 mb-2">Where to Practice Water Therapy:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Home bathtub (for relaxation and gentle movements)</li>
              <li>• Community pools with warm water options</li>
              <li>• Hospital rehabilitation pools (ask your healthcare provider)</li>
              <li>• Therapeutic hot tubs (if approved by your doctor)</li>
              <li>• Gentle natural bodies of water (with proper supervision)</li>
            </ul>
          </div>
        </div>

        {/* Activity Details Modal */}
        {currentActivity !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={activities[currentActivity].image} 
                  alt={activities[currentActivity].title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white">{activities[currentActivity].title}</h3>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentActivity);
                  }}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow"
                >
                  <Heart 
                    className={`h-5 w-5 ${
                      favoriteActivities.includes(currentActivity) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`} 
                  />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-cyan-600 mr-2" />
                    <span className="text-cyan-800">{activities[currentActivity].duration}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    activities[currentActivity].difficulty === 'easy' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {activities[currentActivity].difficulty === 'easy' ? 'Easy' : 'Moderate'} Difficulty
                  </span>
                </div>
                
                <p className="text-gray-700 mb-6">{activities[currentActivity].description}</p>
                
                {activities[currentActivity].steps && (
                  <>
                    <h4 className="text-lg font-semibold text-cyan-800 mb-2">How to Do It:</h4>
                    <ol className="list-decimal pl-6 space-y-2 mb-6">
                      {activities[currentActivity].steps.map((step, i) => (
                        <li key={i} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </>
                )}
                
                <h4 className="text-lg font-semibold text-cyan-800 mb-2">Benefits:</h4>
                <ul className="list-disc pl-6 space-y-1 mb-6">
                  {activities[currentActivity].benefits.map((benefit, i) => (
                    <li key={i} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
                
                {activities[currentActivity].cautions && (
                  <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                    <h4 className="flex items-center text-lg font-semibold text-yellow-800 mb-2">
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Important Cautions:
                    </h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {activities[currentActivity].cautions.map((caution, i) => (
                        <li key={i} className="text-yellow-800">{caution}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setCurrentActivity(null)}
                    className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Resources */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-cyan-800 mb-4">Discuss With Your Care Team</h2>
          <p className="text-gray-700 mb-4">
            Always consult with your healthcare provider before starting water therapy, especially during active treatment.
            They may have specific recommendations based on your individual situation, treatment plan, and any 
            physical limitations you might be experiencing.
          </p>
          <p className="text-gray-700">
            Ask your doctor or nurse navigator if there are cancer-specific aquatherapy programs available in your area.
            Many cancer centers partner with local pools or rehabilitation centers to offer supervised water therapy sessions.
          </p>
        </div>
      </main>
    </div>
  );
};

export default WaterTherapy; 