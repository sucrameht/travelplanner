import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, Plane, Calendar, History } from 'lucide-react';
import API_URL from '../config';
import Navbar from '../components/Navbar';
import TripCard from '../components/TripCard';
import CreateTripModal from '../components/CreateTripModal';

export default function TripsList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTrip, setEditingTrip] = useState(null);

  // 1. Fetch Trips from Django
  const fetchTrips = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/trips/`);
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

    trips.forEach(trip => {
      const startDate = new Date(trip.start_date);
      const endDate = new Date(trip.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (today < startDate) {
        upcoming.push(trip);
      } else if (today >= startDate && today <= endDate) {
        current.push(trip);
      } else {
        past.push(trip);
      }
    });

    return { upcoming, current, past };
  };

  const { upcoming, current, past } = categorizeTrips();

  // Filter trips based on search query
  const filterTrips = (tripList) => {
    if (!searchQuery.trim()) return tripList;
    
    return tripList.filter(trip => 
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get trips for active tab
  const getActiveTrips = () => {
    switch (activeTab) {
      case 'current':
        return filterTrips(current);
      case 'upcoming':
        return filterTrips(upcoming);
      case 'past':
        return filterTrips(past);
      default:
        return [];
    }
  };

  const activeTrips = getActiveTrips();

  // 2. Create a Trip (Send to Django)
  const handleCreateTrip = async (tripData) => {
    try {
      // Basic validation
      if (!tripData.name || !tripData.start_date) return;

      await axios.post(`${API_URL}/api/trips/`, {
        ...tripData,
        travelers: tripData.travelers || []
      });
      
      fetchTrips(); // Refresh the list immediately
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Failed to save trip. Is the Backend running?");
    }
  };

  // Edit a Trip
  const handleEditTrip = async (tripData) => {
    try {
      if (!tripData.name || !tripData.start_date) return;

      await axios.put(`${API_URL}/api/trips/${editingTrip.id}/`, {
        ...tripData,
        travelers: tripData.travelers || []
      });
      
      fetchTrips();
      setEditingTrip(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating trip:", error);
      alert("Failed to update trip.");
    }
  };

  // Delete a Trip
  const handleDeleteTrip = async (tripId) => {
    try {
      await axios.delete(`${API_URL}/api/trips/${tripId}/`);
      fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
      alert("Failed to delete trip.");
    }
  };

  // Open edit modal
  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleTripClick = (trip) => {
    navigate(`/details/${trip.id}`);
  };

  return (
    <div className="min-h-screen font-sans text-gray-900 bg-gray-50">
      <Navbar onOpenModal={() => setIsModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search trips by name or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('current')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'current'
                ? 'bg-white text-teal-700 shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            <Plane size={18} />
            Current
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">{current.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'upcoming'
                ? 'bg-white text-teal-700 shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            <Calendar size={18} />
            Upcoming
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">{upcoming.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'past'
                ? 'bg-white text-teal-700 shadow-md'
                : 'bg-transparent text-gray-600 hover:bg-white/50'
            }`}
          >
            <History size={18} />
            Past
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">{past.length}</span>
          </button>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">Loading...</div>
        ) : activeTrips.length === 0 ? (
          <div className="text-center py-20">
            <Plane className="mx-auto mb-4 text-gray-300" size={64} />
            <p className="text-gray-500 text-lg font-medium mb-2">
              {searchQuery ? 'No trips match your search' : `No ${activeTab} trips found`}
            </p>
            <p className="text-gray-400">
              {!searchQuery && activeTab === 'upcoming' && 'Create a new trip to get started!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip} 
                onClick={() => handleTripClick(trip)}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteTrip}
              />
            ))}
          </div>
        )}
      </main>

      <CreateTripModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrip(null);
        }} 
        onSubmit={editingTrip ? handleEditTrip : handleCreateTrip}
        initialData={editingTrip}
      />
    </div>
  );
}
