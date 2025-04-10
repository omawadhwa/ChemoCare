import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flower, Info, Check, AlertTriangle, Droplets, Wind, Sun, Moon } from 'lucide-react';

interface EssentialOil {
  name: string;
  benefits: string[];
  uses: string[];
  precautions: string[];
  color: string;
  icon: React.ReactNode;
}

const Aromatherapy: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'oils' | 'benefits' | 'tips'>('oils');
  const [selectedOil, setSelectedOil] = useState<EssentialOil | null>(null);

  const essentialOils: EssentialOil[] = [
    {
      name: "Lavender",
      benefits: [
        "Reduces anxiety and stress",
        "Promotes relaxation and sleep",
        "Helps with nausea",
        "Soothes headaches"
      ],
      uses: [
        "Diffuse 2-3 drops in bedroom before sleep",
        "Add 1-2 drops to warm bath water",
        "Mix with carrier oil for gentle massage",
        "Place a drop on pillowcase"
      ],
      precautions: [
        "May cause drowsiness",
        "Avoid during first trimester of pregnancy",
        "Check for skin sensitivity before topical use"
      ],
      color: "purple",
      icon: <Flower className="h-6 w-6 text-purple-600" />
    },
    {
      name: "Peppermint",
      benefits: [
        "Relieves nausea and digestive discomfort",
        "Reduces fatigue and mental fog",
        "Eases headaches",
        "Improves focus and alertness"
      ],
      uses: [
        "Inhale directly from bottle when nauseous",
        "Diffuse 1-2 drops for mental clarity",
        "Mix with carrier oil for temple massage",
        "Add to foot bath for energy boost"
      ],
      precautions: [
        "Avoid if you have epilepsy",
        "Not recommended for children under 6",
        "May cause skin irritation if used undiluted"
      ],
      color: "green",
      icon: <Wind className="h-6 w-6 text-green-600" />
    },
    {
      name: "Ginger",
      benefits: [
        "Reduces nausea and vomiting",
        "Eases digestive discomfort",
        "Helps with fatigue",
        "Supports immune system"
      ],
      uses: [
        "Diffuse 2-3 drops for nausea relief",
        "Add to carrier oil for abdominal massage",
        "Mix with warm water for inhalation",
        "Use in foot bath for energy"
      ],
      precautions: [
        "May cause skin sensitivity",
        "Avoid during first trimester of pregnancy",
        "Use in moderation"
      ],
      color: "orange",
      icon: <Sun className="h-6 w-6 text-orange-600" />
    },
    {
      name: "Chamomile",
      benefits: [
        "Promotes relaxation and sleep",
        "Reduces anxiety and stress",
        "Soothes skin irritation",
        "Eases digestive discomfort"
      ],
      uses: [
        "Diffuse 2-3 drops before bedtime",
        "Add to warm bath water",
        "Mix with carrier oil for massage",
        "Use in room spray for calming atmosphere"
      ],
      precautions: [
        "May cause drowsiness",
        "Check for allergies to ragweed",
        "Use in moderation"
      ],
      color: "yellow",
      icon: <Moon className="h-6 w-6 text-yellow-600" />
    }
  ];

  const benefits = [
    {
      title: "Physical Benefits",
      items: [
        "Reduces nausea and digestive discomfort",
        "Eases muscle tension and pain",
        "Improves sleep quality",
        "Supports immune function",
        "Helps manage fatigue"
      ]
    },
    {
      title: "Emotional Benefits",
      items: [
        "Reduces anxiety and stress",
        "Improves mood and emotional wellbeing",
        "Creates sense of comfort and security",
        "Helps with emotional balance",
        "Provides gentle distraction from symptoms"
      ]
    },
    {
      title: "Mental Benefits",
      items: [
        "Improves focus and mental clarity",
        "Reduces mental fatigue",
        "Helps with 'chemo brain' symptoms",
        "Promotes relaxation of the mind",
        "Supports better sleep patterns"
      ]
    }
  ];

  const usageTips = [
    {
      title: "Getting Started",
      items: [
        "Start with one oil at a time to assess effects",
        "Use high-quality, therapeutic grade oils",
        "Always dilute essential oils before skin application",
        "Keep a journal to track which oils work best",
        "Consult with your healthcare team before starting"
      ]
    },
    {
      title: "Safe Usage",
      items: [
        "Never ingest essential oils without professional guidance",
        "Always dilute with carrier oil for skin application",
        "Start with lower concentrations (1-2%)",
        "Perform a patch test before widespread use",
        "Keep oils out of reach of children and pets"
      ]
    },
    {
      title: "During Treatment",
      items: [
        "Avoid strong scents if experiencing nausea",
        "Use gentler oils during active treatment",
        "Consider using a personal inhaler for portability",
        "Have a variety of oils for different needs",
        "Be mindful of scent sensitivity in treatment areas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-purple-800 flex items-center">
            <Flower className="h-6 w-6 mr-2" />
            Aromatherapy
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">The Healing Power of Scents</h2>
          <p className="text-gray-700 mb-6">
            Aromatherapy uses natural plant extracts to promote health and wellbeing. During chemotherapy, 
            carefully selected essential oils can help manage symptoms, reduce stress, and improve quality 
            of life. The sense of smell is directly connected to the limbic system, which controls emotions 
            and memories, making aromatherapy a powerful tool for emotional and physical support.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Important Note</h3>
                <p className="text-yellow-800 text-sm">
                  Always consult with your healthcare team before using essential oils during chemotherapy. 
                  Some oils may interact with medications or treatments. Start with small amounts and 
                  discontinue use if any adverse reactions occur.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'oils'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('oils')}
              >
                <Droplets className="inline-block h-4 w-4 mr-2" />
                Essential Oils
              </button>
              <button
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'benefits'
                    ? 'border-purple-500 text-purple-600'
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
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab('tips')}
              >
                <Info className="inline-block h-4 w-4 mr-2" />
                Usage Tips
              </button>
            </nav>
          </div>

          {/* Essential Oils Tab */}
          {activeTab === 'oils' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {essentialOils.map((oil, index) => (
                <div 
                  key={index}
                  className={`bg-${oil.color}-50 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => setSelectedOil(oil)}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {oil.icon}
                      <h3 className="ml-2 text-lg font-semibold text-gray-900">{oil.name}</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Key Benefits</h4>
                        <ul className="space-y-1">
                          {oil.benefits.slice(0, 2).map((benefit, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Common Uses</h4>
                        <ul className="space-y-1">
                          {oil.uses.slice(0, 2).map((use, i) => (
                            <li key={i} className="flex items-start">
                              <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              <span className="text-sm text-gray-600">{use}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              {benefits.map((category, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
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
              {usageTips.map((category, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-5">
                  <h3 className="text-lg font-semibold text-purple-800 mb-3">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.items.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Safety Guidelines */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-purple-800 mb-4">Safety Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">During Active Treatment</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Avoid strong scents in treatment areas</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Be cautious with skin application if skin is sensitive</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consider others' sensitivities in shared spaces</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">General Safety</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Always dilute essential oils before skin application</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Use high-quality, therapeutic grade oils</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Store oils in dark glass bottles away from heat and light</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Oil Detail Modal */}
      {selectedOil && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {selectedOil.icon}
                <h2 className="ml-2 text-2xl font-bold text-gray-900">{selectedOil.name}</h2>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
                <ul className="bg-purple-50 rounded-lg p-4 space-y-2">
                  {selectedOil.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Common Uses</h3>
                <ul className="bg-purple-50 rounded-lg p-4 space-y-2">
                  {selectedOil.uses.map((use, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Precautions</h3>
                <ul className="bg-red-50 rounded-lg p-4 space-y-2">
                  {selectedOil.precautions.map((precaution, i) => (
                    <li key={i} className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedOil(null)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
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

export default Aromatherapy; 