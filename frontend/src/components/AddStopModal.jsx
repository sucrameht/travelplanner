import { X } from 'lucide-react';
import { useState } from 'react';

export default function AddStopModal({ isOpen, onClose, onSubmit, day }) {
  const [formData, setFormData] = useState({
    location: '',
    activity: '',
    time: '',
    duration: '',
    estimated_cost: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ location: '', activity: '', time: '', duration: '', estimated_cost: '', notes: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-950">
            Add Stop - Day {day?.dayNumber}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Eiffel Tower"
              required
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Activity</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Sightseeing, Lunch, Meeting"
              value={formData.activity}
              onChange={e => setFormData({...formData, activity: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
              <input
                type="time"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (hours)</label>
              <input
                type="number"
                step="0.5"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="2"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estimated Cost ($)</label>
            <input
              type="number"
              step="0.01"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="0.00"
              value={formData.estimated_cost}
              onChange={e => setFormData({...formData, estimated_cost: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
            <textarea
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              rows="3"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg mt-2"
          >
            Add Stop
          </button>
        </form>
      </div>
    </div>
  );
}
