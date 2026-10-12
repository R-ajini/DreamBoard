import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import VisionBoardPage from './pages/VisionBoardPage';
import DreamDetailPage from './pages/DreamDetailPage';
import GoalPlannerPage from './pages/GoalPlannerPage';
import ProgressPage from './pages/ProgressPage';
import TimelinePage from './pages/TimelinePage';
import AIPlannerPage from './pages/AIPlannerPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="vision-board" element={<VisionBoardPage />} />
              <Route path="dreams/:id" element={<DreamDetailPage />} />
              <Route path="goals/:id" element={<GoalPlannerPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="timeline" element={<TimelinePage />} />
              <Route path="ai-planner" element={<AIPlannerPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
