import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { DashboardProvider } from './context/DashboardContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { TourExplorer } from './pages/TourExplorer';
import { TourDetails } from './pages/TourDetails';
import { Planner } from './pages/Planner';
import { Profile } from './pages/Profile';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Glass Header */}
      {!isDashboard && <Navbar />}

      {/* Page Routing Contents */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<TourExplorer />} />
          <Route path="/tours/:id" element={<TourDetails />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {/* Clean Botanical Footer */}
      {!isDashboard && <Footer />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <DashboardProvider>
        <Router>
          <AppContent />
        </Router>
      </DashboardProvider>
    </AppProvider>
  );
}

export default App;
