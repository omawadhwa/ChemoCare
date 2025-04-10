import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, Brain, Calendar, Book, Users, Bell, Menu, X, Gamepad2, ArrowLeft, Brain as BrainIcon, Zap, Puzzle, Clock, BarChart4, Dices, Search } from 'lucide-react';

function GamesPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // This would be replaced with actual search functionality
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement actual search logic here
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
              <a href="#cognitive" className="text-sage-600 hover:text-sage-800">Cognitive Games</a>
              <a href="#memory" className="text-sage-600 hover:text-sage-800">Memory Games</a>
              <a href="#reaction" className="text-sage-600 hover:text-sage-800">Reaction Games</a>
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
              <a href="#cognitive" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Cognitive Games</a>
              <a href="#memory" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Memory Games</a>
              <a href="#reaction" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Reaction Games</a>
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
              <span className="block">ChemoCare Games</span>
              <span className="block text-sage-600">Fun with Purpose</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Engage with games specifically designed to help improve cognitive function, memory, and reaction time - all while having fun!
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-md mx-auto">
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-sage-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-white w-full pl-10 pr-4 py-2 border border-sage-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="Search games by name or skill..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Game Categories */}
      <div className="py-12 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 id="cognitive" className="text-3xl font-bold text-sage-900 mb-6">Cognitive Enhancement Games</h2>
            <p className="text-lg text-warm-600 mb-8">Games designed to improve overall cognitive function and processing speed.</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Word Puzzle Game */}
              <div 
                onClick={() => navigate('/games/word-connections')}
                className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-green-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Puzzle className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-green-900">Word Connections</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-green-700 mb-4 text-sm leading-relaxed">Connect related words to form meaningful patterns and improve verbal reasoning.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Verbal processing, cognitive flexibility</p>
                  </div>
                </div>
              </div>

              {/* Number Sequence Game */}
              <div 
                onClick={() => navigate('/games/number-navigator')}
                className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-green-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BarChart4 className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-green-900">Number Navigator</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-green-700 mb-4 text-sm leading-relaxed">Identify patterns in number sequences to boost mathematical thinking.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Logical reasoning, pattern recognition</p>
                  </div>
                </div>
              </div>

              {/* Strategy Game */}
              <div 
                onClick={() => navigate('/games/strategic-islands')}
                className="bg-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-green-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 p-2 rounded-full">
                    <BrainIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-green-900">Strategic Islands</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-green-700 mb-4 text-sm leading-relaxed">Plan your way through increasingly complex island puzzles.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Planning, strategizing, concentration</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 id="memory" className="text-3xl font-bold text-sage-900 mb-6">Memory Enhancement Games</h2>
            <p className="text-lg text-warm-600 mb-8">Games specifically designed to strengthen various aspects of memory.</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Matching Cards Game */}
              <div 
                onClick={() => navigate('/games/memory-match')}
                className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-blue-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Dices className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-blue-900">Memory Match</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-blue-700 mb-4 text-sm leading-relaxed">A classic card-matching game with increasing difficulties and themes.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Visual memory, concentration</p>
                  </div>
                </div>
              </div>

              {/* Sequence Recall Game */}
              <div 
                onClick={() => navigate('/games/sequence-recall')}
                className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-blue-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-blue-900">Sequence Recall</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-blue-700 mb-4 text-sm leading-relaxed">Remember and repeat back sequences of sounds, colors, or patterns.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Working memory, attention span</p>
                  </div>
                </div>
              </div>

              {/* Face and Name Game */}
              <div 
                onClick={() => navigate('/games/face-name')}
                className="bg-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-blue-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-blue-900">Face & Name</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-blue-700 mb-4 text-sm leading-relaxed">Remember people's names and faces to help with social memory.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Associative memory, social recall</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 id="reaction" className="text-3xl font-bold text-sage-900 mb-6">Reaction Time Games</h2>
            <p className="text-lg text-warm-600 mb-8">Games that help improve your reaction time and processing speed.</p>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Quick Tap Game */}
              <div 
                onClick={() => navigate('/games/quick-tap')}
                className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-red-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-red-900">Quick Tap</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-red-700 mb-4 text-sm leading-relaxed">Tap targets as quickly as possible when they appear on screen.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Motor response time, visual tracking</p>
                  </div>
                </div>
              </div>

              {/* Color Word Game */}
              <div 
                onClick={() => navigate('/games/color-word')}
                className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-red-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Book className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-red-900">Color Word</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-red-700 mb-4 text-sm leading-relaxed">Identify the color of a word, not what the word spells (Stroop test).</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Cognitive inhibition, mental processing</p>
                  </div>
                </div>
              </div>

              {/* Reflexes Game */}
              <div 
                onClick={() => navigate('/games/reflex-master')}
                className="bg-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-red-200 flex flex-col h-full"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-red-900">Reflex Master</h3>
                </div>
                <div className="flex-grow">
                  <p className="text-red-700 mb-4 text-sm leading-relaxed">Test and improve your reflexes with time-based challenges.</p>
                </div>
                <div className="mt-auto">
                  <div className="bg-black p-3 rounded-md border border-gray-700">
                    <p className="text-xs text-white font-medium flex items-center">
                      💡
                      <span>Helps with:</span>
                    </p>
                    <p className="text-xs text-white mt-1">Response time, vigilance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-sage-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Track your progress</span>
            <span className="block text-sage-200">Create an account to save your achievements</span>
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

export default GamesPage; 