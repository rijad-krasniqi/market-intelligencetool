import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import AdLibrary from './pages/AdLibrary';
import AdDetail from './pages/AdDetail';
import Competitors from './pages/Competitors';
import CompetitorProfile from './pages/CompetitorProfile';
import Analytics from './pages/Analytics';
import GeoIntel from './pages/GeoIntel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="ads" element={<AdLibrary />} />
          <Route path="ads/:adId" element={<AdDetail />} />
          <Route path="competitors" element={<Competitors />} />
          <Route path="competitors/:name" element={<CompetitorProfile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="geo" element={<GeoIntel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
