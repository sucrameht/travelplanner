import { X, Plane } from 'lucide-react';
import { useState } from 'react';

export default function AddFlightModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    flight_number: '',
    flight_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({ flight_number: '', flight_date: new Date().toISOString().split('T')[0] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Plane className="text-teal-600" size={24} />
            <h2 className="text-2xl font-bold text-teal-950">Add Flight</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Flight Number *
            </label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., SQ308"
              required
              value={formData.flight_number}
              onChange={e => setFormData({...formData, flight_number: e.target.value.toUpperCase()})}
            />
            <p className="text-xs text-gray-500 mt-1">Enter the IATA flight code (e.g., SQ308, BA123)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Flight Date *
            </label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={formData.flight_date}
              onChange={e => setFormData({...formData, flight_date: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Fetching Flight Info...' : 'Add Flight'}
          </button>
        </form>
      </div>
    </div>
  );
}
