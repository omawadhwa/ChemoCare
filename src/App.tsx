import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Brain, Calendar, Book, Users, Bell, Menu } from 'lucide-react';
import HomePage from './pages/HomePage';
import MeetingPage from './pages/MeetingPage';
import GamesPage from './pages/GamesPage';
import MemoryMatch from './pages/games/MemoryMatch';
import SequenceRecall from './pages/games/SequenceRecall';
import FaceName from './pages/games/FaceName';
import QuickTap from './pages/games/QuickTap';
import ColorWord from './pages/games/ColorWord';
import ReflexMaster from './pages/games/ReflexMaster';
import WordConnections from './pages/games/WordConnections';
import NumberNavigator from './pages/games/NumberNavigator';
import StrategicIslands from './pages/games/StrategicIslands';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/meeting" element={<MeetingPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/games/memory-match" element={<MemoryMatch />} />
      <Route path="/games/sequence-recall" element={<SequenceRecall />} />
      <Route path="/games/face-name" element={<FaceName />} />
      <Route path="/games/quick-tap" element={<QuickTap />} />
      <Route path="/games/color-word" element={<ColorWord />} />
      <Route path="/games/reflex-master" element={<ReflexMaster />} />
      <Route path="/games/word-connections" element={<WordConnections />} />
      <Route path="/games/number-navigator" element={<NumberNavigator />} />
      <Route path="/games/strategic-islands" element={<StrategicIslands />} />
    </Routes>
  );
}

export default App;