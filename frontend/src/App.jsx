import { Routes, Route } from 'react-router-dom';
import TripsList from './pages/TripsList';
import TripDetails from './pages/TripDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TripsList />} />
      <Route path="/details/:tripId" element={<TripDetails />} />
    </Routes>
  );
}

export default App;
