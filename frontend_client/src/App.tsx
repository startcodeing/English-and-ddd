import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import StudyCenter from './pages/StudyCenter';
import ProfilePage from './pages/ProfilePage';
import StudyPlanPage from './pages/StudyPlanPage';
import ReviewCenter from './pages/ReviewCenter';
import TestPage from './pages/TestPage';
import CommunityPage from './pages/CommunityPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/study" element={<StudyCenter />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/plan" element={<StudyPlanPage />} />
          <Route path="/review" element={<ReviewCenter />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/community" element={<CommunityPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
