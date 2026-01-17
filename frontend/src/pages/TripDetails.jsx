import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ItineraryTab from '../components/ItineraryTab';
import ExpensesTab from '../components/ExpensesTab';

export default function TripDetails() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('itinerary');
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trip data from URL parameter
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/trips/${tripId}/`);
        setTrip(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError('Failed to load trip details');
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [tripId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Trip not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
          >
            Back to Trips
          </button>
        </div>
      </div>
    );
  }

  // Calculate duration
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Format date range
  const dateRange = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Get trip status
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  let status = 'Upcoming';
  let statusColor = 'bg-blue-100 text-blue-700';
  if (today >= startDate && today <= endDate) {
    status = 'Current';
    statusColor = 'bg-green-100 text-green-700';
  } else if (today > endDate) {
    status = 'Past';
    statusColor = 'bg-gray-100 text-gray-700';
  }

  // Calculate countdown
  const daysUntilTrip = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
  const showCountdown = daysUntilTrip > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 mb-6 text-white/90 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back to Trips
          </button>

          {/* Countdown Banner */}
          {showCountdown && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">✨ Your adventure awaits ✨</h2>
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4">
                <div className="text-5xl md:text-6xl font-bold mb-1">
                  {daysUntilTrip}
                </div>
                <div className="text-lg text-white/90">
                  {daysUntilTrip === 1 ? 'day to go!' : 'days to go!'}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{trip.name}</h1>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColor}`}>
                  {status}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-6 text-white/90 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="text-lg">{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{dateRange} · {duration} days</span>
                </div>
                {trip.travelers && trip.travelers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{trip.travelers.length} {trip.travelers.length === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`py-4 font-medium border-b-2 transition ${
                activeTab === 'itinerary'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Itinerary
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 font-medium border-b-2 transition ${
                activeTab === 'expenses'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Expenses
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {activeTab === 'itinerary' ? (
          <ItineraryTab trip={trip} />
        ) : (
          <ExpensesTab trip={trip} />
        )}
      </div>
    </div>
  );
}
