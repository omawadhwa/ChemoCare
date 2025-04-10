import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Music, Heart, Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'react-feather';

interface Track {
  id: number;
  title: string;
  artist: string;
  category: string;
  duration: string;
  coverImage: string;
  audioSrc: string;
}

const CalmingMusic: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const musicLibrary: Track[] = [
    {
      id: 1,
      title: "Gentle Ocean Waves",
      artist: "Nature Sounds",
      category: "nature",
      duration: "5:32",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      audioSrc: "https://example.com/ocean-waves.mp3"
    },
    {
      id: 2,
      title: "Rainfall Meditation",
      artist: "Natural Therapy",
      category: "nature",
      duration: "7:15",
      coverImage: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17",
      audioSrc: "https://example.com/rainfall.mp3"
    },
    {
      id: 3,
      title: "Moonlight Sonata",
      artist: "Classical Collection",
      category: "classical",
      duration: "6:22",
      coverImage: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
      audioSrc: "https://example.com/moonlight.mp3"
    },
    {
      id: 4,
      title: "Peaceful Piano",
      artist: "Healing Melodies",
      category: "instrumental",
      duration: "4:45",
      coverImage: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
      audioSrc: "https://example.com/piano.mp3"
    },
    {
      id: 5,
      title: "Tibetan Singing Bowls",
      artist: "Meditation Masters",
      category: "meditation",
      duration: "8:10",
      coverImage: "https://images.unsplash.com/photo-1546447147-3fc2b8181a74",
      audioSrc: "https://example.com/bowls.mp3"
    },
    {
      id: 6,
      title: "Forest Birdsong",
      artist: "Nature Sounds",
      category: "nature",
      duration: "6:18",
      coverImage: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
      audioSrc: "https://example.com/birdsong.mp3"
    },
    {
      id: 7,
      title: "Ambient Relaxation",
      artist: "Serenity Now",
      category: "ambient",
      duration: "9:25",
      coverImage: "https://images.unsplash.com/photo-1557682250-f6086caa9f00",
      audioSrc: "https://example.com/ambient.mp3"
    },
    {
      id: 8,
      title: "Gentle Harp",
      artist: "Healing Melodies",
      category: "instrumental",
      duration: "5:50",
      coverImage: "https://images.unsplash.com/photo-1551818176-60579e574b18",
      audioSrc: "https://example.com/harp.mp3"
    }
  ];

  const musicCategories = [
    { id: 'all', name: 'All Tracks' },
    { id: 'nature', name: 'Nature Sounds' },
    { id: 'classical', name: 'Classical' },
    { id: 'instrumental', name: 'Instrumental' },
    { id: 'meditation', name: 'Meditation' },
    { id: 'ambient', name: 'Ambient' },
    { id: 'favorites', name: 'Favorites' }
  ];

  const benefits = [
    {
      title: "Reduces Anxiety & Stress",
      description: "Listening to calming music triggers biochemical stress reducers, helping to alleviate anxiety during chemotherapy treatments."
    },
    {
      title: "Manages Pain Perception",
      description: "Music therapy can help reduce the perception of pain by acting as a distraction and promoting relaxation."
    },
    {
      title: "Improves Sleep Quality",
      description: "Regular use of calming music before bedtime can help establish better sleep patterns and improve overall sleep quality."
    },
    {
      title: "Enhances Mood",
      description: "Music stimulates dopamine production, which can improve mood and create a more positive emotional state during treatment."
    }
  ];

  useEffect(() => {
    if (audioRef.current) {
      // Set up audio event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      audioRef.current.addEventListener('ended', handleTrackEnd);

      // Set initial volume
      audioRef.current.volume = volume;
      
      // Clean up
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('loadedmetadata', () => {});
          audioRef.current.removeEventListener('ended', handleTrackEnd);
        }
      };
    }
  }, [currentTrack]);

  useEffect(() => {
    // Set up local storage for favorites
    const storedFavorites = localStorage.getItem('musicFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  useEffect(() => {
    // Save favorites to local storage
    localStorage.setItem('musicFavorites', JSON.stringify(favorites));
  }, [favorites]);

  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnd = () => {
    playNextTrack();
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (!currentTrack) {
      // If no track is selected, play the first one
      const firstTrack = filteredTracks[0];
      if (firstTrack) {
        setCurrentTrack(firstTrack);
        setIsPlaying(true);
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play();
          }
        }, 100);
      }
    } else if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
      }
    }, 100);
  };

  const playNextTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < filteredTracks.length - 1) {
      playTrack(filteredTracks[currentIndex + 1]);
    } else {
      // Loop back to the first track
      playTrack(filteredTracks[0]);
    }
  };

  const playPreviousTrack = () => {
    if (!currentTrack) return;
    
    const currentIndex = filteredTracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(filteredTracks[currentIndex - 1]);
    } else {
      // Loop to the last track
      playTrack(filteredTracks[filteredTracks.length - 1]);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else {
        setIsMuted(false);
      }
    }
  };

  const toggleFavorite = (trackId: number) => {
    if (favorites.includes(trackId)) {
      setFavorites(favorites.filter(id => id !== trackId));
    } else {
      setFavorites([...favorites, trackId]);
    }
  };

  const filteredTracks = musicLibrary.filter(track => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'favorites') return favorites.includes(track.id);
    return track.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-indigo-50">
      {/* Audio Element */}
      <audio ref={audioRef} src={currentTrack?.audioSrc} />

      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <button
            onClick={() => navigate('/mind-soothing')}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="font-bold text-xl text-indigo-800 flex items-center">
            <Music className="h-6 w-6 mr-2" />
            Calming Music Therapy
          </h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-indigo-800 mb-4">The Healing Power of Music</h2>
          <p className="text-gray-700 mb-6">
            Music therapy is a proven complementary treatment that can help manage stress, anxiety, and 
            discomfort during chemotherapy. The carefully selected tracks below are designed to promote 
            relaxation, improve mood, and create a sense of calm during your treatment journey.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-indigo-800 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <nav className="flex space-x-8">
              {musicCategories.map(category => (
                <button
                  key={category.id}
                  className={`py-4 px-1 whitespace-nowrap border-b-2 font-medium text-sm ${
                    activeCategory === category.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Music Player UI */}
          {currentTrack && (
            <div className="bg-indigo-100 rounded-lg p-4 mb-8">
              <div className="flex flex-col md:flex-row items-center">
                <img 
                  src={currentTrack.coverImage} 
                  alt={currentTrack.title}
                  className="w-24 h-24 rounded-lg object-cover mr-0 md:mr-6 mb-4 md:mb-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{currentTrack.title}</h3>
                      <p className="text-sm text-gray-600">{currentTrack.artist}</p>
                    </div>
                    <button 
                      onClick={() => toggleFavorite(currentTrack.id)}
                      className={`p-2 rounded-full ${
                        favorites.includes(currentTrack.id) 
                          ? 'text-red-500 hover:text-red-600' 
                          : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <Heart className="h-5 w-5" fill={favorites.includes(currentTrack.id) ? "currentColor" : "none"} />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div 
                    ref={progressBarRef}
                    className="h-2 bg-indigo-200 rounded-full cursor-pointer mb-2"
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-indigo-600 rounded-full" 
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>

                  {/* Time and Controls */}
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-600">
                      {formatTime(currentTime)} / {duration ? formatTime(duration) : currentTrack.duration}
                    </div>
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={playPreviousTrack}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <SkipBack className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={togglePlay}
                        className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
                      >
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <button 
                        onClick={playNextTrack}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        <SkipForward className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button 
                        onClick={toggleMute}
                        className="p-2 text-indigo-600 hover:text-indigo-800"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5" />
                        ) : volume > 0.5 ? (
                          <Volume2 className="h-5 w-5" />
                        ) : (
                          <Volume1 className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 ml-2"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tracks List */}
          <div className="space-y-2">
            {filteredTracks.map(track => (
              <div 
                key={track.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                  currentTrack?.id === track.id
                    ? 'bg-indigo-100'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => playTrack(track)}
              >
                <div className="flex-1 flex items-center">
                  <img 
                    src={track.coverImage}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-medium">{track.title}</h3>
                    <p className="text-sm text-gray-600">{track.artist}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-4">{track.duration}</span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className={`p-2 rounded-full ${
                      favorites.includes(track.id) 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-400 hover:text-gray-500'
                    }`}
                  >
                    <Heart className="h-5 w-5" fill={favorites.includes(track.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            ))}

            {filteredTracks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No tracks found in this category.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalmingMusic 