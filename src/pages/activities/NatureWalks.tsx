import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Leaf, AlertTriangle, MapPin, Cloud, Sun, Check, Info } from 'lucide-react';

interface Location {
  name: string;
  description: string;
  benefits: string[];
  bestTime: string;
  accessibility: string;
  tips: string[];
  imageUrl: string;
}

const NatureWalks: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'locations' | 'benefits' | 'tips'>('locations');
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  const locations: Location[] = [
    {
      name: "Local Park",
      description: "A gentle stroll through a nearby park can provide a perfect balance of nature exposure with convenience and accessibility.",
      benefits: [
        "Easily accessible in most areas",
        "Usually has paved paths for stability",
        "Often has benches for rest stops",
        "Safe environment with other people around"
      ],
      bestTime: "Early morning or late afternoon to avoid peak sun exposure",
      accessibility: "Usually high, with paved paths and benches",
      tips: [
        "Start with a 10-minute walk and gradually increase time",
        "Bring water and wear a hat for sun protection",
        "Consider using walking poles for added stability",
        "Look for parks with shaded areas for sun-sensitive skin"
      ],
      imageUrl: "https://images.pexels.com/photos/226722/pexels-photo-226722.jpeg"
    },
    {
      name: "Garden Walk",
      description: "Botanical gardens or community gardens offer beautiful, curated natural environments with plenty of seating and usually smooth walkways.",
      benefits: [
        "Beautiful, cultivated plant collections",
        "Usually well-maintained, level paths",
        "Multiple seating areas",
        "Sensory-rich environment (colors, scents)"
      ],
      bestTime: "Mid-morning when gardens are less crowded",
      accessibility: "Usually high, with designed pathways and frequent rest spots",
      tips: [
        "Many gardens offer wheelchairs or mobility scooters",
        "Check their website for 'quiet hours' or less busy times",
        "Look for seasonal blooms that might boost your mood",
        "Bring a small notebook to jot down plants you enjoy"
      ],
      imageUrl: "https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg"
    },
    {
      name: "Waterfront Walk",
      description: "Walking along a lake, river, or ocean shore can be especially calming, as water elements add extra sensory benefits.",
      benefits: [
        "Negative ions from water may improve mood",
        "The sound of water creates natural white noise",
        "Often provides cooler temperatures",
        "Waterfront paths are typically flat and accessible"
      ],
      bestTime: "Early evening around sunset for beautiful views and gentle temperatures",
      accessibility: "Varies by location, but many waterfront areas have developed walkways",
      tips: [
        "Waterfront areas can be windier, so bring a light jacket",
        "The sound of water can mask city noises, creating a more peaceful experience",
        "Beaches with hard-packed sand can be easier to walk on than loose sand",
        "Look for waterfront paths that offer frequent seating"
      ],
      imageUrl: "https://images.pexels.com/photos/1268865/pexels-photo-1268865.jpeg"
    },
    {
      name: "Forest Bath",
      description: "Inspired by the Japanese practice of 'shinrin-yoku' or forest bathing, this involves a slow, mindful walk in a wooded area.",
      benefits: [
        "Exposure to phytoncides (compounds released by trees) may boost immune function",
        "Reduced stress hormone levels",
        "Lower blood pressure and heart rate",
        "Enhanced mood and sense of calm"
      ],
      bestTime: "Mid-morning when natural light filters through the trees",
      accessibility: "Moderate - may have uneven terrain, choose a well-maintained trail",
      tips: [
        "Focus on engaging all senses - notice sounds, smells, textures",
        "Move slowly and pause frequently",
        "If available, choose wider, flatter forest trails",
        "Consider bringing a fold-up stool for rest breaks"
      ],
      imageUrl: "https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg"
    },
    {
      name: "Indoor Nature Walk",
      description: "For days when outdoor walking isn't possible, indoor options with natural elements can still provide benefits.",
      benefits: [
        "Climate-controlled environment",
        "No weather concerns",
        "Reliable restroom access",
        "No UV exposure"
      ],
      bestTime: "Anytime, but particularly useful during extreme weather",
      accessibility: "High - smooth floors, elevators, and readily available seating",
      tips: [
        "Indoor arboretums or large conservatories offer plant exposure",
        "Large aquariums provide water elements and calming blue light",
        "Shopping malls with indoor plants and water features",
        "University campus buildings often have indoor gardens or atriums"
      ],
      imageUrl: "https://images.pexels.com/photos/1108341/pexels-photo-1108341.jpeg"
    }
  ];

  const generalBenefits = [
    {
      title: "Physical Benefits",
      items: [
        "Gentle physical activity that's adjustable to energy levels",
        "Improved circulation without high-impact stress",
        "Vitamin D exposure (when outdoors in daylight)",
        "Improved balance and coordination",
        "Maintenance of muscle tone and joint mobility"
      ]
    },
    {
      title: "Mental Benefits",
      items: [
        "Reduced anxiety and stress hormones",
        "Improved attention and focus",
        "Better mood through serotonin release",
        "Mental refreshment through changing scenery",
        "'Soft fascination' of nature reduces mental fatigue"
      ]
    },
    {
      title: "Emotional Benefits",
      items: [
        "Sense of connection to the larger world beyond illness",
        "Opportunities for mindfulness and present-moment awareness",
        "Subtle mood elevation through nature exposure",
        "Gentle distraction from health concerns",
        "Sense of normalcy and everyday pleasure"
      ]
    }
  ];

  const walkingTips = [
    {
      title: "Before Your Walk",
      items: [
        "Check with your healthcare provider about appropriate activity levels",
        "Plan your route to include rest spots and restrooms",
        "Choose appropriate footwear with good support",
        "Dress in layers that can be adjusted for comfort",
        "Consider timing walks for when your energy is highest"
      ]
    },
    {
      title: "During Your Walk",
      items: [
        "Start with shorter walks (5-15 minutes) and gradually increase",
        "Listen to your body and take breaks as needed",
        "Stay hydrated by bringing water",
        "Use sunscreen, hats, and protective clothing",
        "Consider walking with a companion for safety and enjoyment"
      ]
    },
    {
      title: "Making It Meaningful",
      items: [
        "Practice mindful walking by fully experiencing your surroundings",
        "Engage your senses: notice sounds, smells, textures",
        "Consider a gentle photography practice as you walk",
        "Keep a nature journal to note observations and feelings",
        "Set modest, achievable goals to build consistency"
      ]
    }
  ];

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
          <h1 className="font-bold text-xl text-green-800 flex items-center">
            <Leaf className="h-6 w-6 mr-2" />
            Gentle Nature Walks
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Nature's Gentle Healing Touch</h2>
          <p className="text-gray-700 mb-6">
            Gentle nature walks offer a soothing way to connect with the natural world while providing 
            physical activity suited to your energy level during chemotherapy. Research shows that even 
            brief exposure to natural environments can reduce stress, improve mood, and provide a sense 
            of peace and perspective.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Activity Note</h3>
                <p className="text-yellow-800 text-sm">
                  Always check with your healthcare team before starting any physical activity. While gentle 
                  walking is generally safe, individual circumstances vary. Be mindful of your energy levels, 
                  risk of infection, and any physical limitations you may be experiencing.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'locations'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('locations')}
              >
                <MapPin className="inline-block h-4 w-4 mr-2" />
                Walking Locations
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'benefits'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('benefits')}
              >
                <Check className="inline-block h-4 w-4 mr-2" />
                Benefits
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'tips'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tips')}
              >
                <Info className="inline-block h-4 w-4 mr-2" />
                Walking Tips
              </button>
            </nav>
          </div>

          {/* Locations Tab */}
          {activeTab === 'locations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <div 
                  key={index}
                  className="bg-green-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedLocation(index)}
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={location.imageUrl} 
                      alt={location.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">{location.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">{location.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              {generalBenefits.map((category, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div className="space-y-6">
              {walkingTips.map((category, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weather Considerations */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Cloud className="h-5 w-5 mr-2" />
            Weather Considerations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">During Treatment</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">Avoid extreme temperatures which can increase fatigue</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">Stay out of direct sun during peak hours (10am-4pm)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">Avoid walking in high humidity which can make breathing more difficult</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-gray-700">Consider indoor options during poor air quality days</span>
                </li>
              </ul>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Sun Protection</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700">Many chemotherapy drugs increase sun sensitivity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700">Use SPF 30+ sunscreen, even on cloudy days</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700">Wear a wide-brimmed hat and UV-blocking sunglasses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span className="text-gray-700">Consider UPF-rated clothing for additional protection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Journal Prompt */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-green-800 mb-4">Reflection Journal</h2>
          <p className="text-gray-700 mb-4">
            Consider keeping a simple journal about your nature walks. After each walk, take a moment to jot down:
          </p>
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-700">One thing you noticed with each sense (sight, sound, smell, touch)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-700">How you felt physically before and after your walk</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-700">Any emotional shifts you experienced</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span className="text-gray-700">Something you're looking forward to noticing on your next walk</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Location Detail Modal */}
      {selectedLocation !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="h-64 relative">
              <img 
                src={locations[selectedLocation].imageUrl} 
                alt={locations[selectedLocation].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-white">{locations[selectedLocation].name}</h2>
                </div>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6">{locations[selectedLocation].description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Benefits</h3>
                <ul className="bg-green-50 rounded-lg p-4 space-y-2">
                  {locations[selectedLocation].benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">Best Time to Visit</h3>
                  <p className="text-gray-700">{locations[selectedLocation].bestTime}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">Accessibility</h3>
                  <p className="text-gray-700">{locations[selectedLocation].accessibility}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-800 mb-2">Helpful Tips</h3>
                <ul className="bg-blue-50 rounded-lg p-4 space-y-2">
                  {locations[selectedLocation].tips.map((tip, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedLocation(null)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NatureWalks; 