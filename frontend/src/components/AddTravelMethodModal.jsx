import { X, Plus, Trash2, Bus, Train, PersonStanding, Car, Bike, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AddTravelMethodModal({ isOpen, onClose, onSubmit, fromStop, toStop, existingMethods }) {
  const [travelMethods, setTravelMethods] = useState([
    {
      mode: 'WALK',
      distance: '',
      duration: '',
      estimatedCost: '',
      lineNumber: '',
      boardingStop: '',
      alightingStop: '',
      numberOfStops: ''
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      // If existingMethods provided, pre-fill with existing data
      if (existingMethods && existingMethods.length > 0) {
        setTravelMethods(existingMethods.map(method => ({
          mode: method.mode,
          distance: method.distance.toString(),
          duration: method.duration.toString(),
          estimatedCost: method.estimated_cost ? method.estimated_cost.toString() : '',
          lineNumber: method.line_number || '',
          boardingStop: method.boarding_stop || '',
          alightingStop: method.alighting_stop || '',
          numberOfStops: method.number_of_stops ? method.number_of_stops.toString() : ''
        })));
      } else {
        // Otherwise, reset to default empty method
        setTravelMethods([{
          mode: 'WALK',
          distance: '',
          duration: '',
          estimatedCost: '',
          lineNumber: '',
          boardingStop: '',
          alightingStop: '',
          numberOfStops: ''
        }]);
      }
    }
  }, [isOpen, existingMethods]);

  const modeOptions = [
    { value: 'WALK', label: 'Walk', icon: PersonStanding },
    { value: 'BUS', label: 'Bus', icon: Bus },
    { value: 'TRAIN', label: 'Train', icon: Train },
    { value: 'CYCLE', label: 'Cycle', icon: Bike },
    { value: 'DRIVE', label: 'Drive', icon: Car },
    { value: 'PRIVATE_HIRE', label: 'Private Hire', icon: Car },
  ];

  const handleMethodChange = (index, field, value) => {
    const updated = [...travelMethods];
    updated[index][field] = value;
    setTravelMethods(updated);
  };

  const addTravelMethod = () => {
    setTravelMethods([
      ...travelMethods,
      {
        mode: 'WALK',
        distance: '',
        duration: '',
        estimatedCost: '',
        lineNumber: '',
        boardingStop: '',
        alightingStop: '',
        numberOfStops: ''
      }
    ]);
  };

  const removeTravelMethod = (index) => {
    if (travelMethods.length === 1) return;
    const updated = travelMethods.filter((_, i) => i !== index);
    setTravelMethods(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(travelMethods);
  };

  const requiresTransitFields = (mode) => {
    return mode === 'BUS' || mode === 'TRAIN';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-6 rounded-t-xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Add Travel Method</h2>
            <p className="text-sm text-teal-100 mt-1">
              From: {fromStop?.location} → To: {toStop?.location}
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-2 transition">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {travelMethods.map((method, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">
                  {travelMethods.length > 1 ? `Transfer ${index + 1}` : 'Travel Method'}
                </h3>
                {travelMethods.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTravelMethod(index)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              {/* Mode Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {modeOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleMethodChange(index, 'mode', option.value)}
                        className={`p-3 rounded-lg border-2 transition flex flex-col items-center gap-2 ${
                          method.mode === option.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={24} />
                        <span className="text-sm font-medium">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={method.distance}
                    onChange={(e) => handleMethodChange(index, 'distance', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., 2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={method.duration}
                    onChange={(e) => handleMethodChange(index, 'duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., 15"
                    required
                  />
                </div>
              </div>

              {/* Cost field for private hire */}
              {method.mode === 'PRIVATE_HIRE' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={method.estimatedCost}
                    onChange={(e) => handleMethodChange(index, 'estimatedCost', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., 25.50"
                    required
                  />
                </div>
              )}

              {requiresTransitFields(method.mode) && (
                <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {method.mode === 'BUS' ? 'Bus' : 'Train'} Line Number
                      </label>
                      <input
                        type="text"
                        value={method.lineNumber}
                        onChange={(e) => handleMethodChange(index, 'lineNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder={method.mode === 'BUS' ? 'e.g., 174' : 'e.g., Circle Line'}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Stops
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={method.numberOfStops}
                        onChange={(e) => handleMethodChange(index, 'numberOfStops', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="e.g., 5"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Boarding Stop
                      </label>
                      <input
                        type="text"
                        value={method.boardingStop}
                        onChange={(e) => handleMethodChange(index, 'boardingStop', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Stop name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alighting Stop
                      </label>
                      <input
                        type="text"
                        value={method.alightingStop}
                        onChange={(e) => handleMethodChange(index, 'alightingStop', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        placeholder="Stop name"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Another Travel Method Button */}
          <button
            type="button"
            onClick={addTravelMethod}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Transfer
          </button>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              Save Travel Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
