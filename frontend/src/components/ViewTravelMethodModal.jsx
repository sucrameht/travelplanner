import { X, Clock, Navigation, DollarSign, MapPin, Edit2, PersonStanding, Bus, Train, Bike, Car } from 'lucide-react';

export default function ViewTravelMethodModal({ isOpen, onClose, onEdit, fromStop, toStop, travelMethods }) {
  if (!isOpen) return null;

  const getModeIcon = (mode) => {
    const icons = {
      'WALK': PersonStanding,
      'BUS': Bus,
      'TRAIN': Train,
      'CYCLE': Bike,
      'DRIVE': Car,
      'PRIVATE_HIRE': Car,
    };
    return icons[mode] || PersonStanding;
  };

  const getModeLabel = (mode) => {
    const labels = {
      'WALK': 'Walk',
      'BUS': 'Bus',
      'TRAIN': 'Train',
      'CYCLE': 'Cycle',
      'DRIVE': 'Drive',
      'PRIVATE_HIRE': 'Private Hire',
    };
    return labels[mode] || mode;
  };

  // Calculate totals
  const totalDuration = travelMethods.reduce((sum, m) => sum + parseFloat(m.duration), 0);
  const totalDistance = travelMethods.reduce((sum, m) => sum + parseFloat(m.distance), 0);
  const totalCost = travelMethods.reduce((sum, m) => sum + parseFloat(m.estimated_cost || 0), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Travel Plan</h2>
              <div className="flex items-center gap-2 text-sm text-teal-100">
                <MapPin size={16} />
                <span>{fromStop?.location}</span>
                <span>→</span>
                <span>{toStop?.location}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
                title="Edit travel methods"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full p-2 transition"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 px-6 py-6 border-b border-teal-200">
          <div className="flex items-center justify-center gap-16">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <Clock size={16} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalDuration}</div>
              <div className="text-xs text-gray-600">minutes</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                <Navigation size={16} />
              </div>
              <div className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)}</div>
              <div className="text-xs text-gray-600">km</div>
            </div>
            {totalCost > 0 && (
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                  <DollarSign size={16} />
                </div>
                <div className="text-2xl font-bold text-gray-900">${totalCost.toFixed(2)}</div>
                <div className="text-xs text-gray-600">estimated</div>
              </div>
            )}
          </div>
        </div>

        {/* Travel Steps */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={18} className="text-teal-600" />
            Journey Details
            {travelMethods.length > 1 && (
              <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">
                {travelMethods.length - 1} transfer{travelMethods.length - 1 !== 1 ? 's' : ''}
              </span>
            )}
          </h3>

          <div className="space-y-4">
            {travelMethods.map((method, index) => {
              const Icon = getModeIcon(method.mode);
              const isTransit = method.mode === 'BUS' || method.mode === 'TRAIN';
              
              return (
                <div key={index} className="relative">
                  {/* Connection line */}
                  {index < travelMethods.length - 1 && (
                    <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-300"></div>
                  )}

                  <div className="flex gap-4">
                    {/* Mode Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center relative z-10">
                      <Icon size={20} />
                    </div>

                    {/* Details */}
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{getModeLabel(method.mode)}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {method.duration} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Navigation size={14} />
                            {method.distance} km
                          </span>
                          {method.estimated_cost > 0 && (
                            <span className="flex items-center gap-1 text-teal-700 font-medium">
                              <DollarSign size={14} />
                              ${parseFloat(method.estimated_cost).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Transit Details */}
                      {isTransit && method.line_number && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-teal-600 text-white px-2 py-1 rounded text-xs font-bold">
                              {method.line_number}
                            </span>
                            {method.number_of_stops > 0 && (
                              <span className="text-xs text-gray-600">
                                • {method.number_of_stops} stop{method.number_of_stops !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Board at</div>
                              <div className="font-medium text-gray-900">{method.boarding_stop}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Alight at</div>
                              <div className="font-medium text-gray-900">{method.alighting_stop}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-xl">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
