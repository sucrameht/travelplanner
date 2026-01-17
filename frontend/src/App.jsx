import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import TripCard from './components/TripCard';
import CreateTripModal from './components/CreateTripModal';

function App() {
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Trips from Django
  const fetchTrips = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/trips/');
      setTrips(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Categorize trips by date
  const categorizeTrips = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcoming = [];
    const current = [];
    const past = [];

    console.log('Total trips:', trips.length);
    console.log('Today:', today);

    trips.forEach(trip => {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      console.log(`Trip: ${trip.name}, Start: ${startDate}, End: ${endDate}`);

      if (today < startDate) {
        upcoming.push(trip);
        console.log('  -> Upcoming');
      } else if (today >= startDate && today <= endDate) {
        current.push(trip);
        console.log('  -> Current');
      } else {
        past.push(trip);
        console.log('  -> Past');
      }
    });

    console.log('Categorized:', { upcoming: upcoming.length, current: current.length, past: past.length });
    return { upcoming, current, past };
  };

  const { upcoming, current, past } = categorizeTrips();

  // 2. Create a Trip (Send to Django)
  const handleCreateTrip = async (tripData) => {
    try {
      // Basic validation
      if (!tripData.name || !tripData.start_date) return;

      await axios.post('http://127.0.0.1:8000/api/trips/', {
        ...tripData,
        travelers: [] // Default empty list
      });
      
      fetchTrips(); // Refresh the list immediately
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to save trip. Is the Backend running?");
    }
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Content Area */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4">No trips found.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-teal-600 font-semibold hover:underline"
            >
              Create your first one!
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Upcoming Trips */}
            {upcoming.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-teal-950">Your Trips</h2>
                  <p className="text-gray-500 mt-2">Manage your upcoming adventures</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcoming.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </section>
            )}

            {/* Current Trips */}
            {current.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-teal-950">Current Trips</h2>
                  <p className="text-gray-500 mt-2">Trips you're on right now</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {current.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </section>
            )}

            {/* Past Trips */}
            {past.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-teal-950">Past Trips</h2>
                  <p className="text-gray-500 mt-2">Your travel memories</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {past.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateTrip}
      />
    </div>
  );
}

export default App;