import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ItineraryTab from './ItineraryTab';
import ExpensesTab from './ExpensesTab';

export default function TripDetails({ trip: initialTrip, onBack }) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [trip, setTrip] = useState(initialTrip);
  const [loading, setLoading] = useState(false);

  // Fetch fresh trip data
  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/trips/${initialTrip.id}/`);
        setTrip(response.data);
      } catch (err) {
        console.error('Error fetching trip details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTripDetails();
  }, [initialTrip.id]);

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
  if (today >= startDate && today <= endDate) {
    status = 'Current';
  } else if (today > endDate) {
    status = 'Past';
  }

  // Calculate countdown
  const daysUntilTrip = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));
  const showCountdown = daysUntilTrip > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 text-white px-8 py-6">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 mb-6 text-white/90 hover:text-white transition"
          >
            <ArrowLeft size={20} />
            Back
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
              <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
              <div className="flex items-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{trip.destination}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{dateRange} · {duration} days</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>{trip.travelers?.length || 0}, {trip.budget}</span>
                </div>
              </div>
            </div>
            <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`py-4 px-2 border-b-2 transition font-medium ${
                activeTab === 'itinerary'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              📍 Itinerary
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`py-4 px-2 border-b-2 transition font-medium ${
                activeTab === 'expenses'
                  ? 'border-teal-600 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              💵 Expenses
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
