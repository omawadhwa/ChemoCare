import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Book, BookOpen, FileText, Globe, 
  Search, Menu, X, ArrowLeft, ExternalLink, 
  Filter, Download, BookmarkPlus, Share2, Bookmark, Star, StarHalf,
  Info, HeartHandshake
} from 'lucide-react';

// Define resource interfaces
interface ResourceAuthor {
  name: string;
  institution?: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'books' | 'articles' | 'websites';
  category: string[];
  authors?: ResourceAuthor[];
  publishedDate?: string;
  source?: string;
  url?: string;
  imageUrl?: string;
  rating?: number;
  isPremium?: boolean;
}

const ResourceLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeResourceType, setActiveResourceType] = useState<string>('all');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  
  // Resource categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'chemobrain', name: 'Chemobrain & Cognitive Effects' },
    { id: 'treatments', name: 'Treatments & Interventions' },
    { id: 'coping', name: 'Coping Strategies' },
    { id: 'support', name: 'Support Services' },
    { id: 'research', name: 'Latest Research' }
  ];
  
  // Resource types
  const resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'books', name: 'Books', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'articles', name: 'Journal Articles', icon: <FileText className="h-4 w-4" /> },
    { id: 'websites', name: 'Websites', icon: <Globe className="h-4 w-4" /> }
  ];

  // Resources data
  const resources: Resource[] = [
    // Books
    {
      id: 'book-1',
      title: 'Your Brain After Chemo',
      description: 'A comprehensive guide to understanding and managing cognitive changes after chemotherapy, with practical strategies and expert insights.',
      type: 'books',
      category: ['chemobrain', 'coping'],
      authors: [{ name: 'D. Silverman' }, { name: 'I. Davidson' }],
      publishedDate: '2010',
      source: 'Da Capo Press',
      url: 'https://www.amazon.com/Your-Brain-After-Chemo-Scientific-American/dp/0738216593/',
      imageUrl: 'https://m.media-amazon.com/images/I/51p4F7V2fVL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg',
      rating: 4.5
    },
    {
      id: 'book-2',
      title: 'Cognitive Changes After Cancer Treatment',
      description: 'A practical resource for cancer survivors, caregivers, and healthcare professionals on managing cognitive challenges after treatment.',
      type: 'books',
      category: ['chemobrain', 'research', 'coping'],
      authors: [{ name: 'American Cancer Society' }],
      publishedDate: '2020',
      source: 'American Cancer Society',
      url: 'https://www.cancer.org/cancer/managing-cancer/side-effects/changes-in-mood-or-thinking/chemo-brain.html',
      rating: 4.3
    },
    
    // Journal Articles
    {
      id: 'article-1',
      title: 'Cognitive Impairment and Cancer: The Role of Systemic Inflammation',
      description: 'A comprehensive review examining the relationship between cancer-related cognitive impairment and systemic inflammation.',
      type: 'articles',
      category: ['chemobrain', 'research'],
      authors: [{ name: 'Olson B' }, { name: 'Marks DL' }],
      publishedDate: '2019',
      source: 'The FASEB Journal, vol. 33, no. 11',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5630507/',
      rating: 4.7
    },
    {
      id: 'article-2',
      title: 'Chemo brain - Diagnosis and treatment',
      description: 'Mayo Clinic\'s comprehensive guide to diagnosing and treating chemotherapy-related cognitive impairment.',
      type: 'articles',
      category: ['chemobrain', 'treatments'],
      authors: [{ name: 'Mayo Clinic Staff' }],
      publishedDate: '2023',
      source: 'Mayo Clinic',
      url: 'https://www.mayoclinic.org/diseases-conditions/chemo-brain/diagnosis-treatment/drc-20351065',
      rating: 4.9
    },
    {
      id: 'article-3',
      title: 'Natural Treatment for Chemo Brain',
      description: 'Evidence-based natural approaches and lifestyle modifications that may help manage symptoms of chemo brain.',
      type: 'articles',
      category: ['treatments', 'coping'],
      authors: [{ name: 'Healthline Editorial Team' }],
      publishedDate: '2023',
      source: 'Healthline',
      url: 'https://www.healthline.com/health/cancer/natural-treatment-for-chemo-brain',
      rating: 4.2
    },
    {
      id: 'article-4',
      title: 'What is Chemo Brain?',
      description: 'An accessible overview of chemo brain, its symptoms, causes, and management strategies for patients and caregivers.',
      type: 'articles',
      category: ['chemobrain', 'coping'],
      authors: [{ name: 'WebMD Editorial Team' }],
      publishedDate: '2023',
      source: 'WebMD',
      url: 'https://www.webmd.com/cancer/what-is-chemo-brain',
      rating: 4.3
    },
    {
      id: 'article-5',
      title: 'Chemo Brain: What Cancer Survivors Need to Know',
      description: 'A comprehensive guide from the American Cancer Society about chemotherapy-related cognitive changes.',
      type: 'articles',
      category: ['chemobrain', 'coping'],
      authors: [{ name: 'American Cancer Society' }],
      publishedDate: '2023',
      source: 'American Cancer Society',
      url: 'https://www.cancer.org/cancer/managing-cancer/side-effects/changes-in-mood-or-thinking/chemo-brain.html',
      rating: 4.8
    },
    {
      id: 'article-6',
      title: 'Through the Fog: Managing Chemo Brain',
      description: 'Practical advice for managing cognitive effects of chemotherapy from the Leukemia & Lymphoma Society.',
      type: 'articles',
      category: ['chemobrain', 'coping', 'treatments'],
      authors: [{ name: 'Leukemia & Lymphoma Society' }],
      publishedDate: '2023',
      source: 'Leukemia & Lymphoma Society',
      url: 'https://www.lls.org/article/through-fog-managing-chemo-brain',
      rating: 4.5
    },
    {
      id: 'article-7',
      title: 'Chemobrain - Symptoms and causes',
      description: 'Detailed information on the symptoms and underlying causes of chemotherapy-related cognitive impairment.',
      type: 'articles',
      category: ['chemobrain', 'research'],
      authors: [{ name: 'Mayo Clinic Staff' }],
      publishedDate: '2023',
      source: 'Mayo Clinic',
      url: 'https://www.mayoclinic.org/diseases-conditions/chemo-brain/symptoms-causes/syc-20351060',
      rating: 4.9
    },
    {
      id: 'article-8',
      title: 'Memory and Concentration Issues During Cancer Treatment',
      description: 'Practical advice for managing memory and concentration problems during and after cancer treatment.',
      type: 'articles',
      category: ['chemobrain', 'coping'],
      authors: [{ name: 'Maggie\'s Centres' }],
      publishedDate: '2023',
      source: 'Maggie\'s Centres',
      url: 'https://www.maggies.org/cancer-support/managing-symptoms-and-side-effects/memory-and-concentration/',
      rating: 4.4
    },
    {
      id: 'article-9',
      title: 'Cancer-Related Cognitive Impairment in Survivors of Adult Cancers',
      description: 'A scientific analysis of cognitive issues in adult cancer survivors, including prevalence and risk factors.',
      type: 'articles',
      category: ['chemobrain', 'research'],
      authors: [{ name: 'Pendergrass JC' }, { name: 'Targum SD' }, { name: 'Harrison JE' }],
      publishedDate: '2022',
      source: 'The Oncologist, vol. 27',
      url: 'https://pubmed.ncbi.nlm.nih.gov/35779876/',
      rating: 4.6
    },
    {
      id: 'article-10',
      title: 'Neural correlates of chemotherapy-related cognitive impairment',
      description: 'A neuroimaging study examining brain changes associated with chemotherapy-related cognitive impairment.',
      type: 'articles',
      category: ['chemobrain', 'research'],
      authors: [{ name: 'Inagaki M' }, { name: 'Yoshikawa E' }, { name: 'Matsuoka Y' }],
      publishedDate: '2007',
      source: 'Breast Cancer Research and Treatment, vol. 103',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2775113/',
      rating: 4.5
    },
    
    // Websites & Online Resources
    {
      id: 'website-1',
      title: 'Support Groups for Cancer Patients',
      description: 'Information on support groups specifically for cancer patients dealing with cognitive effects of treatment.',
      type: 'websites',
      category: ['support', 'coping'],
      source: 'CancerCare',
      url: 'https://www.cancercare.org/tagged/support_groups',
      rating: 4.3
    },
    {
      id: 'website-2',
      title: 'Cancer Support Community',
      description: 'A community platform offering support, education, and resources for cancer patients and their families.',
      type: 'websites',
      category: ['support', 'coping'],
      source: 'Cancer Support Community',
      url: 'https://www.cancersupportcommunity.org/',
      rating: 4.7
    },
    {
      id: 'website-3',
      title: 'Memorial Sloan Kettering Cancer Center - Managing Chemobrain',
      description: 'Expert advice from leading cancer specialists on managing cognitive changes after chemotherapy.',
      type: 'websites',
      category: ['chemobrain', 'treatments'],
      source: 'Memorial Sloan Kettering Cancer Center',
      url: 'https://www.mskcc.org/cancer-care/patient-education/managing-cognitive-changes',
      rating: 4.8
    },
    {
      id: 'website-4',
      title: 'National Cancer Institute - Cognitive Impairment',
      description: 'Research-based information from the National Cancer Institute on cancer-related cognitive changes.',
      type: 'websites',
      category: ['chemobrain', 'research'],
      source: 'National Cancer Institute',
      url: 'https://www.cancer.gov/about-cancer/treatment/side-effects/memory-cognitive-problems',
      rating: 4.9
    },
    {
      id: 'website-5',
      title: 'American Society of Clinical Oncology - Attention, Memory Problems',
      description: 'Guidance for patients and caregivers on managing attention and memory problems during cancer treatment.',
      type: 'websites',
      category: ['chemobrain', 'coping'],
      source: 'ASCO',
      url: 'https://www.cancer.net/coping-with-cancer/physical-emotional-and-social-effects-cancer/managing-physical-side-effects/attention-thinking-or-memory-problems',
      rating: 4.6
    },
    {
      id: 'website-6',
      title: 'Cognitive Training Games for Cancer Survivors',
      description: 'Online brain games and exercises designed specifically to help cancer survivors improve cognitive function.',
      type: 'websites',
      category: ['treatments', 'coping'],
      source: 'Dana-Farber Cancer Institute',
      url: 'https://www.dana-farber.org/health-library/articles/cognitive-problems-after-cancer-treatment/',
      rating: 4.4
    }
  ];

  // Filter resources based on active filters and search query
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      // Filter by category
      if (activeCategory !== 'all' && !resource.category.includes(activeCategory)) {
        return false;
      }
      
      // Filter by resource type
      if (activeResourceType !== 'all' && resource.type !== activeResourceType) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = resource.title.toLowerCase().includes(query);
        const descriptionMatch = resource.description.toLowerCase().includes(query);
        const authorMatch = resource.authors?.some(author => 
          author.name.toLowerCase().includes(query)
        );
        const sourceMatch = resource.source?.toLowerCase().includes(query);
        
        return titleMatch || descriptionMatch || authorMatch || sourceMatch;
      }
      
      return true;
    });
  }, [resources, activeCategory, activeResourceType, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already implemented through the useMemo above
  };

  // Render resource card
  const renderResourceCard = (resource: Resource) => {
    const typeIcon = () => {
      switch(resource.type) {
        case 'books':
          return <BookOpen className="h-5 w-5 text-sage-600" />;
        case 'articles':
          return <FileText className="h-5 w-5 text-blue-600" />;
        case 'websites':
          return <Globe className="h-5 w-5 text-indigo-600" />;
      }
    };
    
    const renderStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      
      for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} className="h-4 w-4 text-yellow-500" />);
      }
      
      if (hasHalfStar) {
        stars.push(<StarHalf key="half" className="h-4 w-4 text-yellow-500" />);
      }
      
      const remainingStars = 5 - stars.length;
      for (let i = 0; i < remainingStars; i++) {
        stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
      }
      
      return stars;
    };

    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
        <div className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              {typeIcon()}
              <span className="ml-2 text-xs font-medium text-gray-500 uppercase">
                {resource.type === 'books' ? 'Book' : resource.type === 'articles' ? 'Journal Article' : 'Website'}
              </span>
            </div>
            {resource.rating && (
              <div className="flex items-center">
                {renderStars(resource.rating)}
              </div>
            )}
          </div>
          
          <h3 className="mt-2 text-lg font-semibold text-sage-900 line-clamp-2">{resource.title}</h3>
          
          {resource.authors && resource.authors.length > 0 && (
            <p className="mt-1 text-sm text-gray-600">
              By {resource.authors.map(author => author.name).join(', ')}
            </p>
          )}
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{resource.description}</p>
          
          <div className="mt-4 flex items-center text-xs text-gray-500">
            {resource.source && (
              <span className="inline-block mr-3">
                Source: {resource.source}
              </span>
            )}
            {resource.publishedDate && (
              <span className="inline-block">
                Published: {resource.publishedDate}
              </span>
            )}
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {resource.category.map(cat => {
              const categoryObj = categories.find(c => c.id === cat);
              return categoryObj ? (
                <span 
                  key={cat} 
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sage-100 text-sage-800"
                >
                  {categoryObj.name}
                </span>
              ) : null;
            })}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1 border border-sage-500 text-sm font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50"
            >
              View Resource <ExternalLink className="ml-1 h-3 w-3" />
            </a>
            
            <div className="flex space-x-2">
              <button className="p-1 text-gray-400 hover:text-sage-600 transition-colors">
                <BookmarkPlus className="h-5 w-5" />
              </button>
              <button className="p-1 text-gray-400 hover:text-sage-600 transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
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
              {categories.slice(1, 4).map(category => (
                <button 
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`text-sage-600 hover:text-sage-800 ${
                    activeCategory === category.id ? 'font-semibold' : ''
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <button 
                onClick={() => navigate('/')} 
                className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700"
              >
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
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                    activeCategory === category.id 
                      ? 'bg-sage-100 text-sage-800' 
                      : 'text-sage-600 hover:text-sage-800 hover:bg-sage-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
              <button 
                onClick={() => navigate('/')} 
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white bg-sage-600 hover:bg-sage-700"
              >
                Back Home
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Header */}
      <div className="pt-24 pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-sage-900 sm:text-5xl md:text-6xl">
              <span className="block">Resource Library</span>
              <span className="block text-sage-600">Knowledge is Power</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-warm-600 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Access expert articles, books, research papers, and supportive resources to help you better understand and manage chemobrain.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex justify-center">
              <div className="max-w-xl w-full">
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      placeholder="Search resources by title, author, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-sage-600 hover:bg-sage-700"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter button */}
      <div className="md:hidden sticky top-16 z-20 bg-sage-50 p-4 shadow-sm">
        <button
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          className="w-full flex items-center justify-center px-4 py-2 bg-white border border-sage-300 rounded-md shadow-sm text-sm font-medium text-sage-700 hover:bg-sage-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div 
            className={`md:w-64 flex-shrink-0 bg-white p-6 rounded-lg shadow-md md:block ${
              showFiltersMobile ? 'block' : 'hidden'
            }`}
          >
            <h2 className="text-lg font-semibold text-sage-900 mb-4">Filter Resources</h2>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-sage-700 mb-2">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`block w-full text-left px-2 py-1.5 rounded text-sm ${
                      activeCategory === category.id 
                        ? 'bg-sage-100 text-sage-800 font-medium' 
                        : 'text-gray-600 hover:bg-sage-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Resource Types */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-sage-700 mb-2">Resource Types</h3>
              <div className="space-y-2">
                {resourceTypes.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setActiveResourceType(type.id)}
                    className={`flex items-center w-full text-left px-2 py-1.5 rounded text-sm ${
                      activeResourceType === type.id 
                        ? 'bg-sage-100 text-sage-800 font-medium' 
                        : 'text-gray-600 hover:bg-sage-50'
                    }`}
                  >
                    {type.icon && <span className="mr-2">{type.icon}</span>}
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Reset Filters */}
            <button
              onClick={() => {
                setActiveCategory('all');
                setActiveResourceType('all');
                setSearchQuery('');
              }}
              className="w-full px-3 py-2 mt-2 border border-sage-300 rounded-md text-sm font-medium text-sage-700 hover:bg-sage-50"
            >
              Reset Filters
            </button>
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-sage-900">
                  {activeCategory === 'all' ? 'All Resources' : 
                    categories.find(c => c.id === activeCategory)?.name || 'Resources'}
                </h2>
                <p className="text-sm text-gray-600">
                  {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <Book className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No resources found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredResources.map(resource => (
                    <div key={resource.id}>
                      {renderResourceCard(resource)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer and CTA Section */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-sage-50 rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 bg-sage-100 p-4 rounded-full">
              <Info className="h-8 w-8 text-sage-700" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-sage-900 mb-2">Disclaimer</h3>
              <p className="text-sage-700 text-sm mb-4">
                The information provided in these resources is for educational and informational purposes only.
                It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
                Always seek the advice of your physician or other qualified health provider with any questions
                you may have regarding a medical condition or treatment.
              </p>
              <h4 className="text-sage-800 font-medium text-sm mb-1">Suggest a Resource</h4>
              <p className="text-sage-700 text-sm">
                If you know of a valuable resource that isn't listed here, please let us know.
                We're always looking to expand our library with quality information.
              </p>
            </div>
          </div>

          {/* Additional Help Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-sage-900 mb-3">Need Additional Support?</h2>
            <p className="text-warm-600 max-w-3xl mx-auto mb-8">
              ChemoCare offers various support options to help you navigate your journey. 
              Connect with our community or speak with our AI assistant for personalized guidance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => navigate('/community')}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sage-600 hover:bg-sage-700"
              >
                <HeartHandshake className="h-5 w-5 mr-2" />
                Join Our Community
              </button>
              <button 
                onClick={() => navigate('/assistant')}
                className="inline-flex items-center justify-center px-6 py-3 border border-sage-600 text-base font-medium rounded-md text-sage-700 bg-white hover:bg-sage-50"
              >
                <Brain className="h-5 w-5 mr-2" />
                Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-sage-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-white" />
              <span className="ml-2 text-lg font-semibold">ChemoCare</span>
            </div>
            <p className="text-sage-200 text-sm text-center md:text-right">
              © 2025 ChemoCare. All rights reserved.<br />
              Resources are updated regularly to provide the most current information.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResourceLibraryPage;
