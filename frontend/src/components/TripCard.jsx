import { Calendar, MapPin, Wallet, Users } from 'lucide-react';

export default function TripCard({ trip, onClick }) {
  // Calculate duration
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Format date
  const dateRange = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div 
      onClick={onClick}
      className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl hover:shadow-lg transition-all duration-300 cursor-pointer group"
    >
      {/* Top Half: Gradient */}
      <div className="relative h-32 bg-gradient-to-r from-teal-800 to-teal-600 p-4 group-hover:from-teal-700 group-hover:to-teal-500 transition">
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{trip.name}</h3>
          <div className="flex items-center gap-1 text-sm opacity-90">
            <MapPin size={14} />
            {trip.destination}
          </div>
        </div>
      </div>

      {/* Bottom Half: Details */}
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {dateRange}
          </div>
          <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-xs">
            {isNaN(duration) ? 0 : duration} days
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
            <Wallet size={16} />
            <span>Budget: ${trip.budget}</span>
        </div>
      </div>
    </div>
  );
}