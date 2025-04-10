import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sunrise, AlertTriangle, Clock, Sun, CloudRain, CircleOff, Info } from 'lucide-react';

const SunlightExposure: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'benefits' | 'howto' | 'safety' | 'alternatives'>('benefits');
  const [showTip, setShowTip] = useState<number | null>(null);

  // Sun exposure tips
  const tips = [
    {
      title: "Morning Sun is Best",
      description: "Early morning sunlight (before 10am) provides beneficial light exposure with less UV intensity, making it gentler on your skin.",
      icon: <Sunrise className="h-8 w-8 text-amber-500" />,
      details: "Morning sunlight is rich in blue light wavelengths that can help regulate your body's natural circadian rhythm and improve sleep patterns. The UV index is typically lower before 10am, reducing the risk of skin damage while still providing vitamin D benefits."
    },
    {
      title: "Start with 5-10 Minutes",
      description: "If you're sensitive to light or heat, begin with just 5-10 minutes of exposure and gradually increase as tolerated.",
      icon: <Clock className="h-8 w-8 text-amber-500" />,
      details: "During or after chemotherapy, your skin may be more sensitive than usual. Starting with short exposure times allows your body to acclimate while still receiving benefits. Pay attention to how your skin responds and adjust accordingly."
    },
    {
      title: "Avoid Peak Hours",
      description: "Skip sun exposure between 10am and 4pm when UV rays are strongest, especially during treatment.",
      icon: <Sun className="h-8 w-8 text-amber-500" />,
      details: "During peak sun hours, UV radiation is at its highest intensity. Certain chemotherapy medications can make your skin significantly more photosensitive, increasing the risk of sunburn, hyperpigmentation, and potential long-term skin damage."
    },
    {
      title: "Use Protection",
      description: "Even with brief exposures, protect your face and areas with thin skin using sunscreen, hats, and lightweight clothing.",
      icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
      details: "Certain parts of your body—like your face, neck, and hands—have thinner skin that's more vulnerable to sun damage. Use broad-spectrum SPF 30+ sunscreen, wear a wide-brimmed hat, and consider UPF-rated clothing for these sensitive areas."
    },
    {
      title: "Check your Medications",
      description: "Many chemotherapy drugs and other medications can cause increased photosensitivity.",
      icon: <Info className="h-8 w-8 text-amber-500" />,
      details: "Medications including fluorouracil, methotrexate, dacarbazine, vinblastine, doxorubicin, and many antibiotics can significantly increase your skin's sensitivity to sunlight. Ask your oncology team for specific guidelines related to your treatment regimen."
    }
  ];

  const alternatives = [
    {
      title: "Light Therapy Boxes",
      description: "These devices provide controlled light exposure that can mimic some benefits of natural sunlight, without UV radiation.",
      suitable: true,
      notes: "Look for models specifically designed for mood and circadian rhythm support (10,000 lux). Use for 20-30 minutes in the morning."
    },
    {
      title: "Near Windows",
      description: "Sitting near a window (without UV-filtering glass) allows you to get some light benefits with less intensity.",
      suitable: true,
      notes: "Glass blocks UVB rays (needed for vitamin D) but allows some UVA and visible light through. Still beneficial for mood and circadian rhythm."
    },
    {
      title: "Vitamin D Supplements",
      description: "During treatment, supplements may be a safer way to maintain vitamin D levels.",
      suitable: true,
      notes: "Always consult with your healthcare provider before taking supplements, as absorption may be affected by your treatment."
    },
    {
      title: "Tanning Beds",
      description: "These produce intense UV radiation and should be completely avoided during treatment.",
      suitable: false,
      notes: "Tanning beds emit concentrated UVA radiation that significantly increases the risk of skin damage and potential cancer development."
    },
    {
      title: "Prolonged Direct Sun",
      description: "Long sun exposure, especially during peak hours, is not recommended during treatment.",
      suitable: false,
      notes: "Extended sun exposure increases your risk of burns, hyperpigmentation, and can potentially interfere with some treatments."
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-amber-600 hover:text-amber-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-amber-800 flex items-center">
            <Sunrise className="h-6 w-6 mr-2" />
            Gentle Sunlight Exposure
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Mindful Sunlight Exposure</h2>
          <p className="text-gray-700 mb-6">
            Gentle exposure to natural sunlight can help improve mood, regulate sleep patterns, and support vitamin D production.
            During chemotherapy, it's important to approach sunlight mindfully, as many treatments can increase sun sensitivity.
            This guide provides safe ways to enjoy the benefits of sunlight during your treatment journey.
          </p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Important Safety Note</h3>
                <p className="text-yellow-800 text-sm">
                  Always check with your healthcare provider before increasing sun exposure during treatment. Many chemotherapy
                  medications can cause photosensitivity, making your skin much more vulnerable to sun damage.
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'benefits'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Benefits
              </button>
              <button
                onClick={() => setActiveTab('howto')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'howto'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                How To Practice
              </button>
              <button
                onClick={() => setActiveTab('safety')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'safety'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Safety Guidelines
              </button>
              <button
                onClick={() => setActiveTab('alternatives')}
                className={`py-3 px-4 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'alternatives'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Alternatives
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="pt-6">
            {/* Benefits Tab */}
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="bg-amber-50 p-5 rounded-lg">
                    <h3 className="text-amber-800 font-bold mb-2">Mood Enhancement</h3>
                    <p className="text-gray-700">
                      Exposure to natural sunlight increases serotonin levels in the brain, which can help 
                      improve mood and alleviate symptoms of depression.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-lg">
                    <h3 className="text-amber-800 font-bold mb-2">Better Sleep</h3>
                    <p className="text-gray-700">
                      Morning sunlight exposure helps regulate your circadian rhythm, potentially
                      improving sleep quality and reducing insomnia.
                    </p>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-lg">
                    <h3 className="text-amber-800 font-bold mb-2">Vitamin D</h3>
                    <p className="text-gray-700">
                      Sunlight triggers vitamin D production in your skin, which supports immune function,
                      bone health, and may help manage treatment side effects.
                    </p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-amber-800 mb-3">Additional Benefits During Treatment</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="text-amber-500 mr-2">•</div>
                      <p className="text-gray-700"><span className="font-medium">Reduced Fatigue:</span> Moderate sunlight exposure may help reduce the fatigue commonly experienced during chemotherapy.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-amber-500 mr-2">•</div>
                      <p className="text-gray-700"><span className="font-medium">Cognitive Benefits:</span> Natural light may help improve focus and reduce "chemo brain" symptoms.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-amber-500 mr-2">•</div>
                      <p className="text-gray-700"><span className="font-medium">Mindfulness Opportunity:</span> Sitting in gentle sunlight provides an opportunity for quiet reflection and mindfulness practice.</p>
                    </li>
                    <li className="flex items-start">
                      <div className="text-amber-500 mr-2">•</div>
                      <p className="text-gray-700"><span className="font-medium">Connection with Nature:</span> Sunlight exposure often comes with being outdoors, which offers additional therapeutic benefits.</p>
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {/* How To Practice Tab */}
            {activeTab === 'howto' && (
              <div className="space-y-8">
                <h3 className="text-xl font-bold text-amber-800 mb-3">Sunlight Practice Guide</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tips.map((tip, index) => (
                    <div 
                      key={index}
                      className="bg-white border border-amber-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setShowTip(showTip === index ? null : index)}
                    >
                      <div className="flex items-start">
                        <div className="mr-3 flex-shrink-0">
                          {tip.icon}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-amber-800">{tip.title}</h4>
                          <p className="text-gray-600 text-sm">{tip.description}</p>
                          
                          {showTip === index && (
                            <div className="mt-3 bg-amber-50 p-3 rounded-md text-sm">
                              <p className="text-gray-700">{tip.details}</p>
                            </div>
                          )}
                          
                          <button 
                            className="mt-2 text-xs text-amber-600 hover:text-amber-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowTip(showTip === index ? null : index);
                            }}
                          >
                            {showTip === index ? 'Show less' : 'Read more'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-lg mt-6">
                  <h3 className="text-lg font-bold text-amber-800 mb-3">Mindful Sunlight Practice</h3>
                  <ol className="list-decimal list-inside space-y-3">
                    <li className="text-gray-700">
                      <span className="font-medium">Find a comfortable spot</span> in morning sunlight, preferably outdoors or near a window.
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Apply sunscreen</span> to exposed skin if you'll be in direct sunlight.
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Close your eyes</span> and take several deep breaths, feeling the warmth on your skin.
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Focus on sensations</span> - the warmth, the brightness through your eyelids, sounds around you.
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">Stay present</span> for 5-15 minutes, returning to awareness of light and warmth when your mind wanders.
                    </li>
                    <li className="text-gray-700">
                      <span className="font-medium">End mindfully</span> by expressing gratitude for the sunlight and its benefits.
                    </li>
                  </ol>
                </div>
              </div>
            )}
            
            {/* Safety Guidelines Tab */}
            {activeTab === 'safety' && (
              <div className="space-y-6">
                <p className="text-gray-700">
                  Many chemotherapy drugs and radiation treatments can increase your skin's sensitivity to sunlight. 
                  These safety guidelines will help you enjoy the benefits of sunlight while minimizing potential risks.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Medication Awareness</h3>
                    <p className="text-gray-700 text-sm">Ask your oncology team specifically about your medications and their photosensitivity effects.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Sunscreen is Non-Negotiable</h3>
                    <p className="text-gray-700 text-sm">Use broad-spectrum SPF 30+ sunscreen even for brief exposures.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Cover Sensitive Areas</h3>
                    <p className="text-gray-700 text-sm">Use hats, lightweight long sleeves, and pants if you'll be in the sun longer than a few minutes.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Watch for Reactions</h3>
                    <p className="text-gray-700 text-sm">If you notice unusual skin reactions (redness, rash, darkening) after sun exposure, inform your healthcare team immediately.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Hydration is Critical</h3>
                    <p className="text-gray-700 text-sm">Drink plenty of water before and after sun exposure, as some treatments increase dehydration risk.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4 py-2">
                    <h3 className="font-semibold text-red-800">Avoid Tanning</h3>
                    <p className="text-gray-700 text-sm">Any form of intentional tanning (including tanning beds) should be completely avoided during treatment.</p>
                  </div>
                </div>
                
                <div className="bg-white border border-amber-200 rounded-lg p-5 mt-6">
                  <h3 className="text-lg font-bold text-amber-800 mb-2">UV Index Guidelines</h3>
                  <p className="text-gray-700 mb-4">The UV Index measures the strength of UV radiation from the sun. During treatment, consider these adjusted guidelines:</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-green-800">0-2</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">Low</h4>
                        <p className="text-sm text-gray-600">Safest time for brief exposure; still use sunscreen on sensitive areas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-yellow-800">3-5</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-800">Moderate</h4>
                        <p className="text-sm text-gray-600">Keep exposure brief (5-10 min); full sun protection recommended</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-orange-800">6-7</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-800">High</h4>
                        <p className="text-sm text-gray-600">Avoid direct sunlight; seek shade if outdoors</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <span className="font-bold text-red-800">8+</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-800">Very High/Extreme</h4>
                        <p className="text-sm text-gray-600">Stay indoors; risk of serious skin damage is high</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Alternatives Tab */}
            {activeTab === 'alternatives' && (
              <div className="space-y-6">
                <p className="text-gray-700 mb-6">
                  When direct sunlight exposure isn't possible or advised during your treatment, consider these alternatives
                  to gain similar benefits:
                </p>
                
                <div className="space-y-4">
                  {alternatives.map((alt, index) => (
                    <div 
                      key={index} 
                      className={`border rounded-lg p-4 ${
                        alt.suitable 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${
                          alt.suitable 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-red-100 text-red-600'
                          } mr-3`}
                        >
                          {alt.suitable ? <Sun className="h-6 w-6" /> : <CircleOff className="h-6 w-6" />}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h3 className={`font-bold ${alt.suitable ? 'text-green-800' : 'text-red-800'}`}>
                              {alt.title}
                            </h3>
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                              alt.suitable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {alt.suitable ? 'Recommended' : 'Not Recommended'}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1">{alt.description}</p>
                          <p className={`text-sm mt-2 ${alt.suitable ? 'text-green-700' : 'text-red-700'}`}>
                            <span className="font-medium">Note:</span> {alt.notes}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
                  <div className="flex">
                    <CloudRain className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-blue-800 font-semibold">What About Cloudy Days?</h3>
                      <p className="text-blue-800 text-sm">
                        Even on cloudy days, beneficial light can reach you. While clouds block some UV rays, up to 80% can still 
                        penetrate cloud cover. Sitting near a window on cloudy days can still provide mood and circadian rhythm benefits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Journal Prompts */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Reflection Prompts for Sunlight Sessions</h2>
          <p className="text-gray-700 mb-6">
            These prompts can help deepen your mindful sunlight practice. Consider reflecting on one during or after your sunlight exposure.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <p className="italic text-amber-800">"How does the warmth of the sun feel on my skin right now? What sensations do I notice?"</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <p className="italic text-amber-800">"What emotions arise as I sit in the sunlight? How does my mood shift from before to after?"</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <p className="italic text-amber-800">"What sounds, smells, or other sensations accompany this sunlight experience?"</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
              <p className="italic text-amber-800">"How can I carry this feeling of warmth and light with me throughout the day?"</p>
            </div>
          </div>
        </div>
        
        {/* Discussion with Healthcare Provider */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Discuss With Your Healthcare Provider</h2>
          <p className="text-gray-700 mb-4">
            Before beginning or changing your sunlight exposure routine during treatment, discuss these points with your healthcare team:
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mr-3 flex-shrink-0">1</div>
              <p className="text-gray-700">Specific photosensitivity risks associated with your current medications and treatments</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mr-3 flex-shrink-0">2</div>
              <p className="text-gray-700">Your current vitamin D levels and whether supplementation might be recommended</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mr-3 flex-shrink-0">3</div>
              <p className="text-gray-700">Any skin concerns specific to your situation that might require additional protection</p>
            </li>
            <li className="flex items-start">
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 mr-3 flex-shrink-0">4</div>
              <p className="text-gray-700">Whether light therapy devices might be appropriate for your situation</p>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default SunlightExposure; 