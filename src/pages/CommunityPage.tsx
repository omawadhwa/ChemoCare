import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  ArrowLeft, 
  Search, 
  Menu, 
  X, 
  MessageSquare, 
  Users, 
  Heart, 
  Clock, 
  Award, 
  Bell, 
  Bookmark, 
  Calendar, 
  Filter, 
  ChevronDown, 
  PenSquare
} from 'lucide-react';

// Mock data for topics
interface Topic {
  id: string;
  title: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
  };
  replies: number;
  views: number;
  lastActivity: string;
  isNew?: boolean;
  isPinned?: boolean;
}

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  
  const categories = [
    'All Categories',
    'General Discussion',
    'Treatment Support',
    'Side Effects',
    'Success Stories',
    'Caregivers Corner',
    'Research & News'
  ];
  
  // Sample topics data
  const topics: Topic[] = [
    {
      id: '1',
      title: 'Tips for managing nausea during chemotherapy',
      category: 'Side Effects',
      tags: ['nausea', 'tips', 'food'],
      author: {
        name: 'JaneS',
        avatar: 'https://randomuser.me/api/portraits/women/12.jpg'
      },
      replies: 24,
      views: 1283,
      lastActivity: 'Today',
      isPinned: true
    },
    {
      id: '2',
      title: 'New study on exercise benefits during treatment',
      category: 'Research & News',
      tags: ['exercise', 'research', 'wellness'],
      author: {
        name: 'DrMichael',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
      },
      replies: 16,
      views: 872,
      lastActivity: 'Today',
      isNew: true
    },
    {
      id: '3',
      title: 'Welcome new members - Introduce yourself here!',
      category: 'General Discussion',
      tags: ['welcome', 'introductions'],
      author: {
        name: 'ModSarah',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
      },
      replies: 58,
      views: 2341,
      lastActivity: '2 days ago',
      isPinned: true
    },
    {
      id: '4',
      title: 'How to support a loved one through chemotherapy',
      category: 'Caregivers Corner',
      tags: ['support', 'family', 'caregiving'],
      author: {
        name: 'RobertJ',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
      },
      replies: 37,
      views: 1490,
      lastActivity: '3 days ago'
    },
    {
      id: '5',
      title: 'Hair regrowth after treatment - my journey',
      category: 'Success Stories',
      tags: ['hair', 'recovery', 'journey'],
      author: {
        name: 'LisaMT',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
      },
      replies: 42,
      views: 1876,
      lastActivity: '4 days ago'
    },
    {
      id: '6',
      title: 'Dealing with chemo brain - cognitive exercises that help',
      category: 'Side Effects',
      tags: ['chemo-brain', 'cognitive', 'exercises'],
      author: {
        name: 'ThomasR',
        avatar: 'https://randomuser.me/api/portraits/men/52.jpg'
      },
      replies: 19,
      views: 984,
      lastActivity: '5 days ago'
    },
    {
      id: '7',
      title: 'Nutrition tips during treatment - what worked for me',
      category: 'Treatment Support',
      tags: ['nutrition', 'food', 'diet'],
      author: {
        name: 'NutritionistElla',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
      },
      replies: 31,
      views: 1622,
      lastActivity: '1 week ago'
    },
    {
      id: '8',
      title: 'Monthly virtual support group - Join us this Friday!',
      category: 'General Discussion',
      tags: ['support-group', 'virtual', 'meeting'],
      author: {
        name: 'ModSarah',
        avatar: 'https://randomuser.me/api/portraits/women/67.jpg'
      },
      replies: 12,
      views: 743,
      lastActivity: '1 week ago',
      isNew: true
    }
  ];
  
  // Filter topics based on category selection and search query
  const filteredTopics = topics.filter(topic => {
    const matchesCategory = selectedCategory === 'All Categories' || topic.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Already filtered in the filteredTopics variable
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-sage-600" />
              <span className="ml-2 text-xl font-semibold text-sage-900">ChemoCare</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#general" className="text-sage-600 hover:text-sage-800">General</a>
              <a href="#treatment" className="text-sage-600 hover:text-sage-800">Treatment</a>
              <a href="#stories" className="text-sage-600 hover:text-sage-800">Stories</a>
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
              <a href="#general" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">General</a>
              <a href="#treatment" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Treatment</a>
              <a href="#stories" className="block px-3 py-2 rounded-md text-base font-medium text-sage-600 hover:text-sage-800 hover:bg-sage-50">Stories</a>
              <button onClick={() => navigate('/')} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-sage-600 hover:bg-sage-700">
                Back Home
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-sage-900">Chemo Care Community</h1>
            <p className="mt-2 text-lg text-sage-600">Connect, share, and support others on their chemotherapy journey.</p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-sage-500" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-sage-900">2,458</div>
                  <div className="text-sm text-sage-600">Community Members</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-sage-500" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-sage-900">14,392</div>
                  <div className="text-sm text-sage-600">Total Posts</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-sage-500" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-sage-900">3,729</div>
                  <div className="text-sm text-sage-600">Support Reactions</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-sage-500" />
                <div className="ml-3">
                  <div className="text-2xl font-bold text-sage-900">7</div>
                  <div className="text-sm text-sage-600">Events This Month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <form onSubmit={handleSearch} className="flex items-center md:w-1/2">
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    placeholder="Search topics, tags, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="ml-2 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"
                >
                  Search
                </button>
              </form>
              
              <div className="flex space-x-2">
                <div className="relative">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500">
                    <Filter className="h-4 w-4 mr-2" />
                    {selectedCategory}
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                  <div className="hidden absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                    <div className="py-1" role="none">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sage-600 hover:bg-sage-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500">
                  <PenSquare className="h-4 w-4 mr-2" />
                  New Topic
                </button>
              </div>
            </div>
          </div>

          {/* Topics List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-6">Topic</div>
              <div className="col-span-1 text-center">Replies</div>
              <div className="col-span-2 text-center">Views</div>
              <div className="col-span-3 text-center">Activity</div>
            </div>

            {/* Topics */}
            <div className="divide-y divide-gray-200">
              {filteredTopics.map((topic) => (
                <div key={topic.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="md:grid md:grid-cols-12 md:gap-4">
                    <div className="col-span-6">
                      <div className="flex items-start">
                        {/* Avatar */}
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img src={topic.author.avatar} alt={topic.author.name} />
                        </div>
                        
                        {/* Topic details */}
                        <div className="ml-3">
                          <div className="flex items-center mb-1">
                            {topic.isPinned && (
                              <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                Pinned
                              </span>
                            )}
                            {topic.isNew && (
                              <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                            <h3 className="text-sm md:text-base font-medium text-gray-900 line-clamp-1">{topic.title}</h3>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            Posted by {topic.author.name} in {topic.category}
                          </div>
                          
                          <div className="mt-1 flex flex-wrap gap-1">
                            {topic.tags.map((tag) => (
                              <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-1 mt-4 md:mt-0 text-center flex md:block items-center">
                      <span className="text-xs text-gray-500 mr-2 md:hidden">Replies:</span>
                      <span className="text-sm font-medium text-gray-900">{topic.replies}</span>
                    </div>
                    
                    <div className="col-span-2 mt-2 md:mt-0 text-center flex md:block items-center">
                      <span className="text-xs text-gray-500 mr-2 md:hidden">Views:</span>
                      <span className="text-sm font-medium text-gray-900">{topic.views}</span>
                    </div>
                    
                    <div className="col-span-3 mt-2 md:mt-0 text-center md:text-right flex md:block items-center">
                      <span className="text-xs text-gray-500 mr-2 md:hidden">Activity:</span>
                      <span className="text-sm font-medium text-gray-900">{topic.lastActivity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">8</span> of <span className="font-medium">97</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ArrowLeft className="h-5 w-5" />
                  </a>
                  <a href="#" aria-current="page" className="z-10 bg-sage-50 border-sage-500 text-sage-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </a>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    10
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 rotate-270" />
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-sage-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join our supportive community</span>
            <span className="block text-sage-300">Share experiences and find strength together</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50">
                Sign Up Now
              </button>
            </div>
            <div className="ml-3 inline-flex">
              <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage-800 hover:bg-sage-900">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
