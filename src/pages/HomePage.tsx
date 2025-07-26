import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calendar, Book, Users, Bell, Menu, X, Sparkles, Gamepad2, Lightbulb, Info, AlertTriangle } from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

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
        <a href="#tools" className="text-sage-600 hover:text-sage-800">Tools</a>
        <a href="#resources" className="text-sage-600 hover:text-sage-800">Resources</a>
        <a href="#community" className="text-sage-600 hover:text-sage-800">Community</a>
        <button 
          onClick={() => setShowDisclaimer(true)}
          className="text-sage-600 hover:text-sage-800 flex items-center"
          aria-label="Medical Disclaimer"
        >
          <Info className="h-5 w-5 mr-1" />
          <span>Disclaimer</span>
        </button>
        <button className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700">
          Get Support
        </button>
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setShowDisclaimer(true)}
          className="p-2 mr-2 text-sage-600 hover:text-sage-800"
          aria-label="Medical Disclaimer"
        >
          <Info className="h-5 w-5" />
        </button>
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
        <a href="#tools" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Tools</a>
        <a href="#resources" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Resources</a>
        <a href="#community" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Community</a>
        <button className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-sage-600 hover:bg-sage-700">
          Get Support
        </button>
      </div>
    </div>
  )}
</nav>

      {/* Disclaimer Modal */}
      {showDisclaimer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
                  <h2 className="text-xl font-bold text-sage-900">Medical Disclaimer</h2>
                </div>
                <button 
                  onClick={() => setShowDisclaimer(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="prose prose-sage max-w-none">
                <p className="font-semibold text-sage-800">
                  The information provided by ChemoCare is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                
                <p className="mt-4">
                  The content available through this application, including but not limited to text, graphics, images, and other material, is for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                </p>
                
                <p className="mt-3">
                  Always seek the advice of your physician or other qualified healthcare provider with any questions you may have regarding a medical condition or treatment and before undertaking a new healthcare regimen. Never disregard professional medical advice or delay in seeking it because of something you have read on the ChemoCare platform.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 text-sage-800">Important Considerations:</h3>
                
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li>ChemoCare does not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on our platform.</li>
                  <li>Reliance on any information provided by ChemoCare, its employees, others appearing on the platform at the invitation of ChemoCare, or other visitors to the platform is solely at your own risk.</li>
                  <li>The platform may contain health or medical-related materials that are sexually explicit or otherwise offensive. ChemoCare, its licensors, and its suppliers have no control over and accept no responsibility for such materials.</li>
                  <li>The cognitive exercises, games, and activities provided by ChemoCare are designed as complementary tools and should be used alongside professional medical treatment, not as replacements.</li>
                  <li>In case of a medical emergency, call your doctor or emergency services immediately.</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 text-sage-800">Use of Content:</h3>
                
                <p className="mt-2">
                  The information provided by ChemoCare is compiled from various sources. While we strive to provide accurate and up-to-date information, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the platform.
                </p>
                
                <p className="mt-3 italic text-sage-700">
                  By using ChemoCare, you acknowledge that you have read this disclaimer, understand it, and agree to be bound by it.
                </p>
              </div>
              
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowDisclaimer(false)}
                  className="px-4 py-2 bg-sage-600 text-white rounded-md hover:bg-sage-700 transition-colors"
                >
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
<div className="relative bg-white overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="relative z-10 pt-12 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
      <div className="mt-16 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center lg:text-left lg:col-span-6">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl mb-6">
              <span className="block">Support for Your</span>
              <span className="block text-sage-600">Cognitive Journey</span>
            </h1>
            <p className="mt-6 text-base text-warm-600 sm:mt-7 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-7 md:text-xl lg:mx-0 mb-6">
              Navigate chemobrain with confidence. Access tools to thrive — because your mind deserves care too.
            </p>
            <div className="mt-12 sm:mt-12 sm:flex sm:justify-center lg:mt-24 lg:justify-start">
              <button
                onClick={() => navigate('/assistanttrial')}
                className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage-600 hover:bg-sage-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </button>
            </div>
          </div>
          <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
            <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-2xl">
              <img
                className="w-full h-auto rounded-lg"
                src="https://images.pexels.com/photos/8685366/pexels-photo-8685366.jpeg"
                alt="An illustration of hands with heart drawing near pink ribbon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Features Section */}
      <div className="py-12 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            
            {/* Memory Exercises */}
            <div 
              onClick={() => navigate('/mind-soothing')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Brain className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">Mind Soothing Exercises & Activities</h3>
              </div>
              <p className="text-warm-600">Daily cognitive exercises and activities designed specifically for chemobrain recovery.</p>
            </div>

            {/* AI Assistant */}
            <div 
              onClick={() => navigate('/assistant')}
              className="bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
                <h3 className="ml-2 text-lg font-medium text-white">AI Assistant</h3>
              </div>
              <p className="text-white">Get assistance and insights powered by AI to help you on your journey.</p>
            </div>

            {/* ChemoCare Games */}
            <div 
              onClick={() => navigate('/games')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Gamepad2 className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">ChemoCare Games</h3>
              </div>
              <p className="text-warm-600">Fun and engaging games designed to improve cognitive function and memory.</p>
            </div>

            {/* Symptom Tracker */}
            <div 
              onClick={() => navigate('/symptom-tracker')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Calendar className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">Symptom Tracker</h3>
              </div>
              <p className="text-warm-600">Monitor your symptoms and progress over time with our easy-to-use tracker.</p>
            </div>

            {/* Resource Library */}
            <div 
              onClick={() => navigate('/resource-library')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Book className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">Resource Library</h3>
              </div>
              <p className="text-warm-600">Access expert articles, research, and coping strategies.</p>
            </div>

            {/* Support Groups */}
            <div 
              onClick={() => navigate('/community')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">ChemoCare Community</h3>
              </div>
              <p className="text-warm-600">Connect with others who understand your journey.</p>
            </div>

            {/* FAQs */}
            <div 
              onClick={() => navigate('/faqs')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Lightbulb className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">Cancer FAQs</h3>
              </div>
              <p className="text-warm-600">Find answers to commonly asked questions about cancer and treatment.</p>
            </div>

            {/* Reminders */}
            <div 
              onClick={() => navigate('/reminders')}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center mb-4">
                <Bell className="h-6 w-6 text-sage-600" />
                <h3 className="ml-2 text-lg font-medium text-sage-900">Daily Reminders</h3>
              </div>
              <p className="text-warm-600">Set up personalized reminders for medications, appointments, and exercises.</p>
            </div>

            
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sage-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to take control?</span>
            <span className="block text-sage-200">Join our supportive community today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <button 
                onClick={() => navigate('/meeting')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;