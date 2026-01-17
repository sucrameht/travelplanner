import { X, Users } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function CreateTripModal({ isOpen, onClose, onSubmit, initialData }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '', destination: '', start_date: '', end_date: '', budget: '', travelers: []
  });

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        destination: initialData.destination || '',
        start_date: initialData.start_date || '',
        end_date: initialData.end_date || '',
        budget: initialData.budget || '',
        travelers: initialData.travelers || []
      });
    } else {
      setFormData({
        name: '', destination: '', start_date: '', end_date: '', budget: '', travelers: []
      });
    }
  }, [initialData, isOpen]);

  const addTraveler = () => {
    setFormData({
      ...formData,
      travelers: [...formData.travelers, '']
    });
  };

  const removeTraveler = (index) => {
    setFormData({
      ...formData,
      travelers: formData.travelers.filter((_, i) => i !== index)
    });
  };

  const updateTraveler = (index, value) => {
    const newTravelers = [...formData.travelers];
    newTravelers[index] = value;
    setFormData({
      ...formData,
      travelers: newTravelers
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty traveler names before submitting
    const cleanedData = {
      ...formData,
      travelers: formData.travelers.filter(t => t.trim() !== '')
    };
    onSubmit(cleanedData);
    onClose();
    // Reset form
    setFormData({
      name: '', destination: '', start_date: '', end_date: '', budget: '', travelers: []
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] bg-white shadow-2xl rounded-2xl flex flex-col relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-teal-950">
            {initialData ? 'Edit Trip' : 'Plan a New Trip'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Trip Name</label>
            <input 
              type="text" 
              value={formData.name}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
              required
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
            <input 
              type="text" 
              value={formData.destination}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
              required
              onChange={e => setFormData({...formData, destination: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Start Date</label>
              <input 
                type="date" 
                value={formData.start_date}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                required
                onChange={e => setFormData({...formData, start_date: e.target.value})} 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">End Date</label>
              <input 
                type="date" 
                value={formData.end_date}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
                required
                onChange={e => setFormData({...formData, end_date: e.target.value})} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Budget ($)</label>
            <input 
              type="number" 
              value={formData.budget}
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500" 
              required
              onChange={e => setFormData({...formData, budget: e.target.value})} 
            />
          </div>

          {/* Travelers Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Users size={18} />
              <label className="block text-sm font-semibold">Travelers</label>
            </div>
            
            {formData.travelers.map((traveler, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={traveler}
                  onChange={(e) => updateTraveler(index, e.target.value)}
                  placeholder={`Traveler ${index + 1}`}
                  className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={() => removeTraveler(index)}
                  className="p-3 hover:bg-gray-100 rounded-lg transition"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addTraveler}
              className="w-full py-3 border-2 border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition flex items-center justify-center gap-2"
            >
              + Add Traveler
            </button>
          </div>
          </div>

          <div className="p-6 pt-4 border-t border-gray-100">
            <button type="submit" className="cursor-pointer w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg">
              {initialData ? 'Update Trip' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}