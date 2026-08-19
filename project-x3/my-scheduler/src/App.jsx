import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { restoreSession } from './features/auth/authSlice';
import { fetchTasks, fetchUserTasks } from './features/tasks/taskSlice';
import { fetchTeam } from './features/users/userSlice';
import ProtectedRoute from './components/common/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import NotFound from './pages/NotFound';

import DashboardLead from './pages/dashboardLead/DashboardLead';
import LeadDashboardOverview from './pages/dashboardLead/LeadDashboardOverview';
import LeadTaskList from './pages/dashboardLead/LeadTaskList';
import LeadTaskDetail from './pages/dashboardLead/LeadTaskDetail';
import LeadCreateTask from './pages/dashboardLead/LeadCreateTask';
import LeadTeam from './pages/dashboardLead/LeadTeam';

import DashboardStaff from './pages/dashboardStaff/DashboardStaff';
import StaffCalendar from './pages/dashboardStaff/StaffCalendar';
import StaffTaskList from './pages/dashboardStaff/StaffTaskList';
import StaffTaskDetail from './pages/dashboardStaff/StaffTaskDetail';
import StaffWorkingTasks from './pages/dashboardStaff/StaffWorkingTasks';
import StaffCompletedTasks from './pages/dashboardStaff/StaffCompletedTasks';

import './styles.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'lead') {
        dispatch(fetchTasks(user.division));
        dispatch(fetchTeam(user.division));
      } else if (user.role === 'staff') {
        dispatch(fetchUserTasks(user.username));
        dispatch(fetchTasks(user.division));
      }
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <Router>
      <div className="appContainer">
        <Header />
        <main className="mainContent">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />

            <Route
              path="/dashboard/lead"
              element={
                <ProtectedRoute requiredRole="lead">
                  <DashboardLead />
                </ProtectedRoute>
              }
            >
              <Route index element={<LeadDashboardOverview />} />
              <Route path="tasks" element={<LeadTaskList />} />
              <Route path="task/:id" element={<LeadTaskDetail />} />
              <Route path="create" element={<LeadCreateTask />} />
              <Route path="team" element={<LeadTeam />} />
            </Route>

            <Route
              path="/dashboard/staff"
              element={
                <ProtectedRoute requiredRole="staff">
                  <DashboardStaff />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffCalendar />} />
              <Route path="calendar" element={<StaffCalendar />} />
              <Route path="tasks" element={<StaffTaskList />} />
              <Route path="task/:id" element={<StaffTaskDetail />} />
              <Route path="working" element={<StaffWorkingTasks />} />
              <Route path="completed" element={<StaffCompletedTasks />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;