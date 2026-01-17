import { MapPin, Clock, DollarSign, Sparkles, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Fallback events if API fails
const getFallbackEvents = (destination) => {
  const eventDatabase = {
    'Paris': [
      { id: 'paris-1', name: 'Eiffel Tower Visit', category: 'Attraction', duration: 2, estimatedCost: 25, description: 'Iconic iron tower with city views', imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400' },
      { id: 'paris-2', name: 'Louvre Museum', category: 'Museum', duration: 3, estimatedCost: 17, description: 'World\'s largest art museum', imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400' },
      { id: 'paris-3', name: 'Seine River Cruise', category: 'Activity', duration: 1.5, estimatedCost: 15, description: 'Scenic boat tour along the Seine', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
      { id: 'paris-4', name: 'Montmartre Walking Tour', category: 'Tour', duration: 2.5, estimatedCost: 20, description: 'Explore the artistic neighborhood', imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400' },
      { id: 'paris-5', name: 'French Bistro Dinner', category: 'Food', duration: 2, estimatedCost: 60, description: 'Authentic French cuisine experience', imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' },
    ],
    'Tokyo': [
      { id: 'tokyo-1', name: 'Senso-ji Temple', category: 'Attraction', duration: 1.5, estimatedCost: 0, description: 'Ancient Buddhist temple', imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400' },
      { id: 'tokyo-2', name: 'Shibuya Crossing', category: 'Attraction', duration: 1, estimatedCost: 0, description: 'World\'s busiest pedestrian crossing', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400' },
      { id: 'tokyo-3', name: 'Tsukiji Fish Market', category: 'Food', duration: 2, estimatedCost: 30, description: 'Fresh sushi and seafood', imageUrl: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
      { id: 'tokyo-4', name: 'Tokyo Skytree', category: 'Attraction', duration: 2, estimatedCost: 18, description: 'Tallest structure in Japan', imageUrl: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=400' },
      { id: 'tokyo-5', name: 'Traditional Tea Ceremony', category: 'Cultural', duration: 1.5, estimatedCost: 45, description: 'Authentic Japanese tea experience', imageUrl: 'https://images.unsplash.com/photo-1545377038-14a0c2f72d8e?w=400' },
    ],
    'New York': [
      { id: 'ny-1', name: 'Statue of Liberty', category: 'Attraction', duration: 3, estimatedCost: 24, description: 'Iconic American monument', imageUrl: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400' },
      { id: 'ny-2', name: 'Central Park Walk', category: 'Activity', duration: 2, estimatedCost: 0, description: 'Explore Manhattan\'s green oasis', imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=400' },
      { id: 'ny-3', name: 'Broadway Show', category: 'Entertainment', duration: 2.5, estimatedCost: 150, description: 'World-class theater performance', imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400' },
      { id: 'ny-4', name: 'Metropolitan Museum', category: 'Museum', duration: 3, estimatedCost: 30, description: 'One of the world\'s finest art museums', imageUrl: 'https://images.unsplash.com/photo-1567783927556-e5a0b01c8d68?w=400' },
      { id: 'ny-5', name: 'Brooklyn Bridge Walk', category: 'Activity', duration: 1.5, estimatedCost: 0, description: 'Historic bridge with skyline views', imageUrl: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd?w=400' },
    ],
    'default': [
      { id: 'default-1', name: 'City Walking Tour', category: 'Tour', duration: 2, estimatedCost: 20, description: 'Explore the city\'s highlights', imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400' },
      { id: 'default-2', name: 'Local Restaurant', category: 'Food', duration: 1.5, estimatedCost: 40, description: 'Try local cuisine', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400' },
      { id: 'default-3', name: 'Museum Visit', category: 'Museum', duration: 2, estimatedCost: 15, description: 'Discover local history and culture', imageUrl: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400' },
      { id: 'default-4', name: 'Shopping District', category: 'Shopping', duration: 2, estimatedCost: 50, description: 'Browse local shops and markets', imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400' },
      { id: 'default-5', name: 'Park or Nature Walk', category: 'Activity', duration: 1.5, estimatedCost: 0, description: 'Enjoy outdoor scenery', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
    ]
  };

  // Find matching destination or use default
  const destinationKey = Object.keys(eventDatabase).find(key => 
    destination.toLowerCase().includes(key.toLowerCase())
  ) || 'default';

  return eventDatabase[destinationKey];
};

// Category color mapping
const getCategoryColors = (category) => {
  const colors = {
    'Food': { bg: 'from-orange-50 to-red-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700', icon: '🍽️' },
    'Dining': { bg: 'from-orange-50 to-red-50', border: 'border-orange-300', badge: 'bg-orange-100 text-orange-700', icon: '🍽️' },
    'Attraction': { bg: 'from-blue-50 to-cyan-50', border: 'border-blue-300', badge: 'bg-blue-100 text-blue-700', icon: '🏛️' },
    'Museum': { bg: 'from-purple-50 to-pink-50', border: 'border-purple-300', badge: 'bg-purple-100 text-purple-700', icon: '🎨' },
    'Activity': { bg: 'from-green-50 to-emerald-50', border: 'border-green-300', badge: 'bg-green-100 text-green-700', icon: '⚡' },
    'Tour': { bg: 'from-yellow-50 to-amber-50', border: 'border-yellow-300', badge: 'bg-yellow-100 text-yellow-700', icon: '🗺️' },
    'Entertainment': { bg: 'from-pink-50 to-rose-50', border: 'border-pink-300', badge: 'bg-pink-100 text-pink-700', icon: '🎭' },
    'Cultural': { bg: 'from-indigo-50 to-violet-50', border: 'border-indigo-300', badge: 'bg-indigo-100 text-indigo-700', icon: '🏮' },
    'Shopping': { bg: 'from-teal-50 to-cyan-50', border: 'border-teal-300', badge: 'bg-teal-100 text-teal-700', icon: '🛍️' },
  };
  return colors[category] || colors['Activity'];
};

export default function SuggestedEvents({ destination, onDragStart }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const generateEventsWithLLM = async (forceRegenerate = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Call backend endpoint that uses LLM to generate events
      const response = await axios.post('http://127.0.0.1:8000/api/generate-events/', {
        destination: destination,
        regenerate: forceRegenerate  // Force new generation on refresh
      });
      
      setEvents(response.data.events || []);
      
      // Show if using cached data
      if (response.data.cached && !forceRegenerate) {
        console.log('📦 Using cached suggestions from', new Date(response.data.generated_at).toLocaleString());
      }
    } catch (err) {
      console.error('Error generating events:', err);
      setError('Failed to generate events');
      // Use fallback events
      setEvents(getFallbackEvents(destination));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateEventsWithLLM();
  }, [destination]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-teal-600" size={20} />
          <h3 className="font-bold text-lg">Suggested Activities</h3>
        </div>
        <button
          onClick={() => generateEventsWithLLM(true)}  // Force regenerate
          disabled={loading}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          title="Regenerate suggestions (uses AI)"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-4">Drag activities to add them to your itinerary</p>
      
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Generating suggestions...</p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
          <p className="text-sm text-yellow-800">{error} - Using fallback suggestions</p>
        </div>
      )}
      
      {!loading && (
      
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {events.map((event) => {
          const colors = getCategoryColors(event.category);
          return (
          <div
            key={event.id}
            draggable
            onDragStart={(e) => onDragStart(e, event)}
            className={`rounded-lg border-2 ${colors.border} cursor-move hover:shadow-lg transition group overflow-hidden`}
          >
            {/* Image */}
            {event.imageUrl && (
              <div className="h-32 w-full overflow-hidden">
                <img 
                  src={event.imageUrl} 
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            {/* Content */}
            <div className={`p-4 bg-gradient-to-r ${colors.bg}`}>
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900 group-hover:text-gray-700 transition flex-1">
                  {event.name}
                </h4>
                <span className={`text-xs px-2 py-1 rounded font-medium ml-2 ${colors.badge} flex items-center gap-1 whitespace-nowrap`}>
                  <span>{colors.icon}</span>
                  {event.category}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{event.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-600 font-medium">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{event.duration}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={12} />
                  <span>${event.estimatedCost}</span>
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>
      )}
      
      <div className="mt-4 p-3 bg-teal-50 rounded-lg text-xs text-teal-700">
        💡 Tip: Click and drag activities to add them to specific days
      </div>
    </div>
  );
}
