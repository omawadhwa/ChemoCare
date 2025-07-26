import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  FlaskConical, 
  Calendar, 
  Heart, 
  Trash2,
  Menu,
  Plus,
  ChevronLeft,
  MessageSquare,
} from 'lucide-react';

// Static data for API endpoints - in a real app, this would connect to a real backend
const API_ENDPOINT = 'http://127.0.0.1:513//api/assistant';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface SuggestedPrompt {
  title: string;
  prompt: string;
  icon: React.ReactNode;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: Date;
}

const AssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi, I'm Chemo Buddy, your personal support assistant. How can I help you today with your treatment journey?",
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Current chat',
      preview: 'Hi, I\'m Chemo Buddy...',
      date: new Date()
    },
    {
      id: '2',
      title: 'Managing nausea',
      preview: 'What are some ways to manage nausea...',
      date: new Date(Date.now() - 86400000) // yesterday
    },
    {
      id: '3',
      title: 'Nutrition advice',
      preview: 'What foods should I eat to help my body...',
      date: new Date(Date.now() - 172800000) // 2 days ago
    }
  ]);
  
  // Suggested prompts
  const suggestedPrompts: SuggestedPrompt[] = [
    {
      title: "Side Effect Management",
      prompt: "What are some ways to manage nausea during my chemotherapy?",
      icon: <FlaskConical className="h-5 w-5 text-purple-500" />
    },
    {
      title: "Treatment Schedule",
      prompt: "Can you help me create a reminder plan for my medication schedule?",
      icon: <Calendar className="h-5 w-5 text-blue-500" />
    },
    {
      title: "Emotional Support",
      prompt: "I'm feeling anxious about my upcoming treatment. Can you suggest some coping strategies?",
      icon: <Heart className="h-5 w-5 text-red-500" />
    },
    {
      title: "Nutrition Advice",
      prompt: "What foods should I eat to help my body during chemotherapy?",
      icon: <Lightbulb className="h-5 w-5 text-amber-500" />
    }
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateUniqueId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      id: generateUniqueId(),
      content: inputValue,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate API call with static response
    // setTimeout(() => {
    //   const assistantMessage: Message = {
    //     id: generateUniqueId(),
    //     content: simulateResponse(inputValue),
    //     role: 'assistant',
    //     timestamp: new Date()
    //   };
      
    //   setMessages(prev => [...prev, assistantMessage]);
    //   setIsLoading(false);
    // }, 1500);
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: inputValue })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      const assistantMessage: Message = {
        id: generateUniqueId(),
        content: data.response, // make sure your backend returns { response: "..." }
        role: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching response:', error);
  
      const errorMessage: Message = {
        id: generateUniqueId(),
        content: "Sorry, I couldn't get a response. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      };
  
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: generateUniqueId(),
        content: "Hi, I'm Chemo Buddy, your personal support assistant. How can I help you today with your treatment journey?",
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  };

  const newConversation = () => {
    // Add current conversation to history if it has more than one message
    if (messages.length > 1) {
      const newConvo: Conversation = {
        id: generateUniqueId(),
        title: getConversationTitle(),
        preview: messages[1].content.substring(0, 30) + '...',
        date: new Date()
      };
      
      setConversations(prev => [newConvo, ...prev]);
    }
    
    // Clear current conversation
    clearConversation();
  };

  const getConversationTitle = () => {
    // Try to generate a title from the first user message
    const firstUserMessage = messages.find(m => m.role === 'user');
    if (firstUserMessage) {
      // Take first 4 words
      const words = firstUserMessage.content.split(' ');
      return words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
    }
    return 'New conversation';
  };

  // Function to simulate AI responses (for demonstration)
  const simulateResponse = (input: string): string => {
    // Simple response simulation based on input keywords
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('nausea') || lowercaseInput.includes('sick')) {
      return "For managing nausea during chemotherapy, try eating smaller, more frequent meals, staying hydrated, and avoiding strong smells. Ginger tea and bland foods like crackers can be helpful. Your doctor may also prescribe anti-nausea medication that you should take as directed. Would you like more specific suggestions?";
    } else if (lowercaseInput.includes('tired') || lowercaseInput.includes('fatigue')) {
      return "Fatigue is one of the most common side effects of chemotherapy. Try to prioritize rest, but also incorporate light exercise when you can, as it can actually boost your energy. Plan your activities for when you typically have the most energy, and don't hesitate to ask for help with daily tasks.";
    } else if (lowercaseInput.includes('hair') || lowercaseInput.includes('loss')) {
      return "Hair loss can be challenging emotionally. Consider getting a short haircut before treatment starts to make the transition easier. Explore hats, scarves, or wigs if they appeal to you. Use gentle hair products and a soft brush. Remember that hair typically grows back after treatment, though sometimes with a different texture or color.";
    } else if (lowercaseInput.includes('food') || lowercaseInput.includes('eat') || lowercaseInput.includes('nutrition')) {
      return "During chemotherapy, focus on protein-rich foods like eggs, lean meats, and beans to help repair tissues. Stay hydrated and eat calorie-dense foods if you're losing weight. Some patients find cold foods more tolerable. Small, frequent meals can be easier to manage than large ones. Would you like me to suggest specific meal ideas?";
    } else if (lowercaseInput.includes('anxious') || lowercaseInput.includes('worry') || lowercaseInput.includes('scared')) {
      return "It's completely normal to feel anxious during cancer treatment. Deep breathing exercises, meditation, and gentle yoga can help calm your mind. Connecting with support groups or speaking with a therapist who specializes in cancer patients can be very beneficial. Would you like me to guide you through a quick relaxation exercise?";
    } else {
      return "Thank you for sharing that with me. As your Chemo Buddy, I'm here to support you through your treatment journey. Would you like information about managing side effects, maintaining your wellbeing, or connecting with resources and support groups?";
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-white">
      {/* Custom styles for scrollbars and transitions */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .sidebar-transition {
          transition: transform 0.3s ease, width 0.3s ease;
        }
        
        .chat-transition {
          transition: margin-left 0.3s ease, width 0.3s ease;
        }
        
        .message-animation {
          animation: messageAppear 0.3s ease;
        }
        
        @keyframes messageAppear {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Sidebar */}
      <div 
        className={`sidebar-transition fixed md:relative h-full z-20 bg-gray-50 border-r border-gray-200 
                    ${sidebarOpen ? 'w-72' : 'w-0 md:w-20'} 
                    overflow-hidden flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center p-4 border-b border-gray-200 ${!sidebarOpen && 'md:justify-center'}`}>
          <button 
            onClick={() => newConversation()}
            className="flex items-center text-gray-700 hover:bg-gray-200 py-2 px-3 rounded-md transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className={`ml-2 ${!sidebarOpen && 'md:hidden'}`}>New chat</span>
          </button>
          
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto md:flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${!sidebarOpen && 'md:rotate-180'}`} />
          </button>
        </div>
        
        {/* Conversation List */}
        <div className={`overflow-y-auto flex-1 px-1 py-2 ${!sidebarOpen && 'md:hidden'}`}>
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="mb-1 px-3 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
            >
              <div className="flex items-center text-sm text-gray-500 mb-0.5">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{formatDate(conversation.date)}</span>
              </div>
              <div className="font-medium text-gray-900 line-clamp-1">{conversation.title}</div>
              <div className="text-sm text-gray-500 line-clamp-1">{conversation.preview}</div>
            </div>
          ))}
        </div>
        
        {/* Sidebar Footer */}
        <div className={`mt-auto border-t border-gray-200 p-4 ${!sidebarOpen && 'md:hidden'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-sm font-medium">User Account</div>
          </div>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className={`chat-transition flex-1 flex flex-col h-full ${sidebarOpen ? 'md:ml-0' : 'md:ml-20'}`}>
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden mr-2 text-gray-500"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-500 hover:text-gray-700 mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="ml-2 font-medium">Back to Home</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={clearConversation}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
              title="Clear conversation"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto scrollbar-hide bg-white p-4 pb-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-animation ${message.role === 'user' ? 'pl-10' : 'pr-10'}`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                    message.role === 'user' 
                      ? 'bg-indigo-100 text-indigo-600' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      {message.role === 'user' ? 'You' : 'Chemo Buddy'} • {formatTime(message.timestamp)}
                    </div>
                    <div className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="message-animation pr-10">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mr-3 bg-purple-100 text-purple-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Chemo Buddy • {formatTime(new Date())}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse"></div>
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Footer with Input */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-3xl mx-auto">
            {/* Suggested Prompts */}
            {messages.length <= 2 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptSelect(prompt.prompt)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {prompt.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Message Chemo Buddy..."
                className="w-full border border-gray-300 rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
            
            <p className="text-xs text-gray-400 mt-2 text-center">
              Chemo Buddy can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage; 