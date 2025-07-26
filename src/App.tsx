import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Brain, Calendar, Book, Users, Bell, Menu } from 'lucide-react';
import HomePage from './pages/HomePage';
import MeetingPage from './pages/MeetingPage';
import GamesPage from './pages/GamesPage';
import MindSoothingPage from './pages/MindSoothingPage';
import MemoryMatch from './pages/games/MemoryMatch';
import SequenceRecall from './pages/games/SequenceRecall';
import FaceName from './pages/games/FaceName';
import QuickTap from './pages/games/QuickTap';
import ColorWord from './pages/games/ColorWord';
import ReflexMaster from './pages/games/ReflexMaster';
import WordConnections from './pages/games/WordConnections';
import NumberNavigator from './pages/games/NumberNavigator';
import StrategicIslands from './pages/games/StrategicIslands';
import BreathingExercise from './pages/exercises/BreathingExercise';
import ProgressiveRelaxation from './pages/exercises/ProgressiveRelaxation';
import WarmBath from './pages/activities/WarmBath';
import GentleSwinging from './pages/exercises/GentleSwinging';
import LightStretching from './pages/exercises/LightStretching';
import HandMassage from './pages/exercises/HandMassage';
import WaterTherapy from './pages/exercises/WaterTherapy';
import SunlightExposure from './pages/exercises/SunlightExposure';
import NatureWalks from './pages/activities/NatureWalks';
import CalmingMusic from './pages/activities/CalmingMusic';
import Aromatherapy from './pages/activities/Aromatherapy';
import WarmBeverage from './pages/activities/WarmBeverage';
import Coloring from './pages/activities/Coloring';
import CloudWatching from './pages/activities/CloudWatching';
import AssistantPage from './pages/AssistantPage';
import CommunityPage from './pages/CommunityPage';
import FAQsPage from './pages/FAQsPage';
import SymptomTrackerPage from './pages/SymptomTrackerPage';
import RemindersPage from './pages/RemindersPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import AssistantPageT from './pages/AssitantPageT';

// ScrollToTop component to handle scrolling to top on navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/mind-soothing" element={<MindSoothingPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/assistanttrial" element={<AssistantPageT />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/faqs" element={<FAQsPage />} />
        <Route path="/symptom-tracker" element={<SymptomTrackerPage />} />
        <Route path="/reminders" element={<RemindersPage />} />
        <Route path="/resource-library" element={<ResourceLibraryPage />} />
        <Route path="/mind-soothing/breathing" element={<BreathingExercise />} />
        <Route path="/mind-soothing/progressive-relaxation" element={<ProgressiveRelaxation />} />
        <Route path="/mind-soothing/warm-bath" element={<WarmBath />} />
        <Route path="/mind-soothing/gentle-swinging" element={<GentleSwinging />} />
        <Route path="/mind-soothing/light-stretching" element={<LightStretching />} />
        <Route path="/mind-soothing/hand-massage" element={<HandMassage />} />
        <Route path="/mind-soothing/water-therapy" element={<WaterTherapy />} />
        <Route path="/mind-soothing/sunlight-exposure" element={<SunlightExposure />} />
        <Route path="/mind-soothing/nature-walks" element={<NatureWalks />} />
        <Route path="/mind-soothing/calming-music" element={<CalmingMusic />} />
        <Route path="/mind-soothing/aromatherapy" element={<Aromatherapy />} />
        <Route path="/mind-soothing/warm-beverage" element={<WarmBeverage />} />
        <Route path="/mind-soothing/coloring" element={<Coloring />} />
        <Route path="/mind-soothing/cloud-watching" element={<CloudWatching />} />
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
    </>
  );
}

export default App;