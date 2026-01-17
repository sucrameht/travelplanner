import { Calendar, MapPin, Wallet, Users, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function TripCard({ trip, onEdit, onDelete, onClick }) {
  const [showMenu, setShowMenu] = useState(false);

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
        {/* Three-dot Menu */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 rounded-full hover:bg-white/20 transition text-white"
          >
            <MoreVertical size={20} />
          </button>
          
          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  onEdit(trip);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit size={16} />
                Edit Trip
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                  if (confirm(`Delete "${trip.name}"?`)) {
                    onDelete(trip.id);
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete Trip
              </button>
            </div>
          )}
        </div>

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