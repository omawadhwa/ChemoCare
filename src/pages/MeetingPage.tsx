import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Video, VideoOff, Mic, MicOff, Users, PhoneOff, Sparkles, UserCircle, Brain as BrainIcon, Calendar, Book, Bell } from 'lucide-react';

function MeetingPage() {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (videoEnabled) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: micEnabled })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(error => {
          console.error('Error accessing media devices.', error);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach((track: MediaStreamTrack) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    }
  }, [videoEnabled, micEnabled]);

  const endCall = () => {
    setMicEnabled(false);
    setVideoEnabled(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-sage-900">
      {/* Header */}
      <header className="bg-sage-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-sage-200" />
            <span className="ml-2 text-xl font-semibold text-white">ChemoCare Meet</span>
          </div>
          <div className="relative" ref={dropdownRef}>
            <button
              className="p-2 rounded-full hover:bg-sage-700 transition-colors"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserCircle className="h-8 w-8 text-sage-200" />
            </button>
    
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                <a href="#" className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-sage-50">
                  <BrainIcon className="h-4 w-4 mr-2" />
                  Memory Exercises
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-sage-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Symptom Tracker
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-sage-50">
                  <Book className="h-4 w-4 mr-2" />
                  Resource Library
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-sage-50">
                  <Users className="h-4 w-4 mr-2" />
                  Support Groups
                </a>
                <a href="#" className="flex items-center px-4 py-2 text-base text-gray-700 hover:bg-sage-50">
                  <Bell className="h-4 w-4 mr-2" />
                  Daily Reminders
                </a>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-[80vh] sm:h-[70vh]">
          {/* Left participant window */}
          <div className="bg-sage-800 rounded-lg flex items-center justify-center h-full">
            <Users className="h-20 w-20 sm:h-40 sm:w-20 text-sage-400" />
          </div>
          {/* Right participant window */}
          <div className="bg-sage-800 rounded-lg flex items-center justify-center h-full">
            {videoEnabled ? (
              <video ref={videoRef} autoPlay className="w-full h-full rounded-lg object-cover"></video>
            ) : (
              <Users className="h-20 w-20 sm:h-40 sm:w-20 text-sage-400" />
            )}
          </div>
        </div>

        {/* Controls */}
<div className="fixed bottom-4 left-1/2 transform -translate-x-1/2">
  <div className="bg-sage-800 rounded-full px-4 sm:px-8 py-3 sm:py-6 shadow-lg flex items-center space-x-3 sm:space-x-8">
    {/* Microphone Toggle */}
    <div className="relative group">
      <button 
        onClick={() => setMicEnabled(!micEnabled)}
        className={`p-3 sm:p-4 rounded-full ${micEnabled ? 'bg-sage-700 hover:bg-sage-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
      >
        {micEnabled ? <Mic className="h-5 w-5 sm:h-8 sm:w-8" /> : <MicOff className="h-5 w-5 sm:h-8 sm:w-8" />}
      </button>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {micEnabled ? 'Turn off microphone' : 'Turn on microphone'}
      </div>
    </div>

    {/* Video Toggle */}
    <div className="relative group">
      <button 
        onClick={() => setVideoEnabled(!videoEnabled)}
        className={`p-3 sm:p-4 rounded-full ${videoEnabled ? 'bg-sage-700 hover:bg-sage-600' : 'bg-red-600 hover:bg-red-700'} text-white transition-colors`}
      >
        {videoEnabled ? <Video className="h-5 w-5 sm:h-8 sm:w-8" /> : <VideoOff className="h-5 w-5 sm:h-8 sm:w-8" />}
      </button>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {videoEnabled ? 'Turn off video' : 'Turn on video'}
      </div>
    </div>

    {/* AI Assistant */}
    <div className="relative group">
      <button className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-blue-500 via-teal-400 to-green-500 text-white hover:from-blue-600 hover:via-teal-500 hover:to-green-600 transition-colors shadow-lg">
        <Sparkles className="h-5 w-5 sm:h-8 sm:w-8" />
      </button>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Use AI assistant
      </div>
    </div>

    {/* End Call */}
    <div className="relative group">
      <button 
        onClick={endCall}
        className="p-3 sm:p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
      >
        <PhoneOff className="h-5 w-5 sm:h-8 sm:w-8" />
      </button>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        End call
      </div>
    </div>

    {/* Chat Toggle */}
    {/* Uncomment the following block if chat functionality is required */}
    {/* <div className="relative group">
      <button 
        onClick={() => setShowChat(!showChat)}
        className={`p-3 sm:p-4 rounded-full bg-sage-700 hover:bg-sage-600 text-white transition-colors`}
      >
        {showChat ? <MessageSquare className="h-5 w-5 sm:h-8 sm:w-8" /> : <MessageSquareOff className="h-5 w-5 sm:h-8 sm:w-8" />}
      </button>
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {showChat ? 'Hide chat' : 'Show chat'}
      </div>
    </div> */}
  </div>
</div>
      </main>
    </div>
  );
}

export default MeetingPage;