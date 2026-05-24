import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
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

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Main Glass Header */}
          <Navbar />

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
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
