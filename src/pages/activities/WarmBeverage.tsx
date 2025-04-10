import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coffee, Check, Info, Heart, AlertTriangle, Leaf, Thermometer, Moon } from 'lucide-react';

interface BeverageOption {
  name: string;
  description: string;
  benefits: string[];
  preparation: string[];
  image: string;
  icon: React.ReactNode;
  color: string;
}

const WarmBeverage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedBeverage, setSelectedBeverage] = useState<BeverageOption | null>(null);

  const beverageOptions: BeverageOption[] = [
    {
      name: "Herbal Tea",
      description: "Caffeine-free herbal infusions made from dried flowers, leaves, seeds or roots.",
      benefits: [
        "Chamomile tea can reduce anxiety and promote sleep",
        "Ginger tea helps with nausea and digestion",
        "Peppermint tea can ease digestive discomfort",
        "Rooibos tea is rich in antioxidants"
      ],
      preparation: [
        "Heat water until just before boiling (180-190°F)",
        "Add 1-2 teaspoons of loose herbs or 1 tea bag to a cup",
        "Pour hot water over the herbs and cover",
        "Steep for 5-7 minutes",
        "Strain or remove tea bag and sip slowly"
      ],
      image: "https://images.unsplash.com/photo-1565799894466-62a20cb47d10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      icon: <Leaf className="h-6 w-6 text-green-600" />,
      color: "green"
    },
    {
      name: "Warm Milk",
      description: "Traditional calming beverage that can be enhanced with spices or honey.",
      benefits: [
        "Contains tryptophan which may help with sleep",
        "Provides calcium and protein",
        "Adding turmeric can reduce inflammation",
        "Cinnamon can help stabilize blood sugar"
      ],
      preparation: [
        "Gently warm 8oz of milk in a small saucepan (avoid boiling)",
        "Optional: add a pinch of cinnamon, cardamom, or turmeric",
        "Optional: add 1 teaspoon of honey",
        "Stir continuously until warm",
        "Pour into a mug and sip slowly before bedtime"
      ],
      image: "https://images.unsplash.com/photo-1572656631137-7935297eff55?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      icon: <Moon className="h-6 w-6 text-blue-600" />,
      color: "blue"
    },
    {
      name: "Hot Lemon Water",
      description: "Simple, refreshing beverage that's gentle on the stomach.",
      benefits: [
        "The scent of lemon can reduce nausea",
        "Provides vitamin C and antioxidants",
        "Can aid digestion when consumed in the morning",
        "Helps with hydration"
      ],
      preparation: [
        "Heat 8oz of water until warm but not boiling",
        "Squeeze the juice of half a lemon into the water",
        "Optional: add a small amount of honey",
        "Optional: add a thin slice of fresh ginger",
        "Stir and drink while comfortably warm"
      ],
      image: "https://images.unsplash.com/photo-1551504734-a5c64a1637b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      icon: <Thermometer className="h-6 w-6 text-yellow-600" />,
      color: "yellow"
    },
    {
      name: "Warm Bone Broth",
      description: "Nutrient-rich savory option that's easily digestible.",
      benefits: [
        "Provides easily absorbed protein",
        "Contains minerals that support immune function",
        "Very gentle on the digestive system",
        "Can help with hydration and electrolyte balance"
      ],
      preparation: [
        "Heat pre-made bone broth in a small saucepan",
        "Warm until steaming but not boiling",
        "Optional: add a pinch of turmeric or ginger",
        "Pour into a mug and sip slowly",
        "Best consumed between meals as a nourishing snack"
      ],
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      icon: <Heart className="h-6 w-6 text-red-600" />,
      color: "red"
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
            <Coffee className="h-6 w-6 mr-2" />
            Warm Beverage Ritual
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">The Comfort of Warm Beverages</h2>
          <p className="text-gray-700 mb-6">
            A warm beverage ritual can provide comfort, relaxation, and a moment of mindfulness during your 
            chemotherapy journey. The act of preparing and slowly sipping a warm drink can become a soothing 
            ritual that helps ease anxiety, reduces nausea, and provides a sense of normalcy. Different beverages 
            offer various benefits, and finding the right one for your needs can be a helpful coping strategy.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <Info className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" />
              <div>
                <h3 className="text-yellow-800 font-semibold">Creating a Mindful Ritual</h3>
                <p className="text-yellow-800 text-sm">
                  To make your warm beverage experience more meaningful, try to be fully present. Notice the warmth 
                  of the mug in your hands, the aroma rising with the steam, and the flavors as you sip. Take slow, 
                  deep breaths between sips, and allow yourself this moment of peace.
                </p>
              </div>
            </div>
          </div>

          {/* Beverage Options */}
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Comforting Beverage Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {beverageOptions.map((beverage, index) => (
              <div 
                key={index} 
                onClick={() => setSelectedBeverage(beverage)}
                className={`bg-${beverage.color}-50 border border-${beverage.color}-200 rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow cursor-pointer`}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {beverage.icon}
                    <h3 className="ml-2 text-lg font-semibold text-gray-900">{beverage.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{beverage.description}</p>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Benefits</h4>
                    <ul className="space-y-1">
                      {beverage.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Best Practices */}
          <h3 className="text-xl font-semibold text-amber-800 mb-4">Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-amber-200 rounded-lg p-5">
              <h4 className="text-lg font-medium text-amber-700 mb-3">When to Enjoy</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Before bed to encourage relaxation and sleep</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mid-morning as a gentle way to stay hydrated</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Between meals to ease nausea</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">During a quiet moment to practice mindfulness</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-amber-200 rounded-lg p-5">
              <h4 className="text-lg font-medium text-amber-700 mb-3">Considerations</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Avoid very hot beverages if you have mouth sores</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Limit caffeine, especially in the afternoon and evening</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Consider your current symptoms when choosing a beverage</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Check with your healthcare team about herb interactions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Creating Your Ritual */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-amber-800 mb-4">Creating Your Warm Beverage Ritual</h2>
          <div className="space-y-6">
            <div className="bg-amber-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Step 1: Prepare Your Space</h3>
              <p className="text-gray-700 mb-3">
                Create a calm environment with minimal distractions. Consider a comfortable chair, soft lighting,
                and perhaps gentle background music. Keep a cozy blanket nearby if you wish.
              </p>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Step 2: Prepare Your Beverage</h3>
              <p className="text-gray-700 mb-3">
                Take your time with the preparation process. Be mindful of each step, from heating the water
                to pouring it into your favorite mug. Consider this preparation time as part of the ritual itself.
              </p>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Step 3: Engage Your Senses</h3>
              <p className="text-gray-700 mb-3">
                Hold the warm mug in both hands and feel its warmth. Inhale the aroma deeply before taking
                your first sip. Notice the flavors and temperature as you drink slowly and mindfully.
              </p>
            </div>

            <div className="bg-amber-50 p-5 rounded-lg">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Step 4: Practice Gratitude</h3>
              <p className="text-gray-700 mb-3">
                Use this time to reflect on moments of gratitude, however small. This simple practice can
                shift your focus away from discomfort and toward more positive thoughts.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Beverage Detail Modal */}
      {selectedBeverage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {selectedBeverage.icon}
                <h2 className="ml-2 text-2xl font-bold text-gray-900">{selectedBeverage.name}</h2>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedBeverage.description}</p>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h3>
                <ul className="bg-amber-50 rounded-lg p-4 space-y-2">
                  {selectedBeverage.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How to Prepare</h3>
                <ol className="bg-amber-50 rounded-lg p-4 space-y-2 list-decimal list-inside">
                  {selectedBeverage.preparation.map((step, i) => (
                    <li key={i} className="text-gray-700 pl-2">{step}</li>
                  ))}
                </ol>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedBeverage(null)}
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
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

export default WarmBeverage; 