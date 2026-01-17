import { Plane, MapPin, Clock, Hash, X } from 'lucide-react';

export default function FlightCard({ flight, onDelete }) {
  const flightData = flight.flight_data || {};
  const departure = flightData.departure || {};
  const arrival = flightData.arrival || {};
  const airline = flightData.airline || {};
  const flightInfo = flightData.flight || {};

  const formatTime = (datetime) => {
    if (!datetime) return 'TBD';
    try {
      // AviationStack returns times in ISO format (UTC)
      // Parse and display the time portion only
      const date = new Date(datetime);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, '0');
      return `${displayHours}:${displayMinutes} ${ampm}`;
    } catch {
      return 'TBD';
    }
  };

  const getTimezone = (timezoneStr) => {
    if (!timezoneStr) return '';
    // Extract timezone abbreviation from timezone string
    // AviationStack returns timezone like "Asia/Hong_Kong"
    try {
      const parts = timezoneStr.split('/');
      return parts[parts.length - 1].replace('_', ' ');
    } catch {
      return '';
    }
  };

  const formatDate = (datetime) => {
    if (!datetime) return '';
    try {
      return new Date(datetime).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg border-2 border-blue-200 overflow-hidden mb-6 group">
      {/* Delete button */}
      <button
        onClick={() => onDelete(flight.id)}
        className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
        title="Delete flight"
      >
        <X size={16} />
      </button>

      {/* Boarding Pass Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">BOARDING PASS</h3>
            <p className="text-blue-100 text-sm">{airline.name || 'Airline'}</p>
          </div>
          {airline.iata && (
            <div className="bg-white text-blue-600 px-3 py-1 rounded font-bold">
              {airline.iata}
            </div>
          )}
        </div>
      </div>

      {/* Flight Details */}
      <div className="p-6">
          {/* Route */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {departure.iata || 'XXX'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {departure.airport || 'Departure Airport'}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(departure.scheduled || departure.estimated)}
              </div>
              {departure.timezone && (
                <div className="text-xs text-gray-400">
                  {getTimezone(departure.timezone)}
                </div>
              )}
            </div>

            <div className="px-6">
              <Plane className="text-blue-600" size={32} />
            </div>

            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-gray-900">
                {arrival.iata || 'XXX'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {arrival.airport || 'Arrival Airport'}
              </div>
              <div className="text-xs text-gray-500">
                {formatTime(arrival.scheduled || arrival.estimated)}
              </div>
              {arrival.timezone && (
                <div className="text-xs text-gray-400">
                  {getTimezone(arrival.timezone)}
                </div>
              )}
            </div>
          </div>

          {/* Flight Details */}
          <div className="border-t border-dashed border-blue-300 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Hash size={12} />
                  <span>Flight</span>
                </div>
                <div className="font-bold text-gray-900">
                  {flight.flight_number || flightInfo.iata || 'N/A'}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <Clock size={12} />
                  <span>Date</span>
                </div>
                <div className="font-bold text-gray-900">
                  {formatDate(flight.flight_date || departure.scheduled)}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin size={12} />
                  <span>Gate</span>
                </div>
                <div className="font-bold text-gray-900">
                  {departure.gate || 'TBD'}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-500 mb-1">
                  <MapPin size={12} />
                  <span>Terminal</span>
                </div>
                <div className="font-bold text-gray-900">
                  {departure.terminal || 'TBD'}
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          {flightData.flight_status && (
            <div className="mt-4 text-center">
              <span className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
                flightData.flight_status === 'scheduled' ? 'bg-green-100 text-green-700' :
                flightData.flight_status === 'active' ? 'bg-blue-100 text-blue-700' :
                flightData.flight_status === 'landed' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {flightData.flight_status.toUpperCase()}
              </span>
            </div>
          )}
      </div>

      {/* Decorative tear line */}
      <div className="absolute left-0 right-0 top-[120px]">
        <div className="flex justify-between">
          <div className="w-6 h-6 bg-white rounded-full -ml-3"></div>
          <div className="w-6 h-6 bg-white rounded-full -mr-3"></div>
        </div>
      </div>
    </div>
  );
}
