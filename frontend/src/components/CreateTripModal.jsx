import { X } from 'lucide-react';
import { useState } from 'react';

export default function CreateTripModal({ isOpen, onClose, onSubmit }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '', destination: '', start_date: '', end_date: '', budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-950">Plan a New Trip</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Name</label>
            <input type="text" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required
              onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
            <input type="text" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required
              onChange={e => setFormData({...formData, destination: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input type="date" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required
                onChange={e => setFormData({...formData, start_date: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input type="date" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required
                onChange={e => setFormData({...formData, end_date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Budget ($)</label>
            <input type="number" className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" required
              onChange={e => setFormData({...formData, budget: e.target.value})} />
          </div>
          <button type="submit" className="cursor-pointer w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg mt-2">
            Create Trip
          </button>
        </form>
      </div>
    </div>
  );
}