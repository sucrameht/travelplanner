import { X } from 'lucide-react';
import { useState } from 'react';

export default function AddExpenseModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  if (!isOpen) return null;

  const categories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ description: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-950">Add Expense</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="e.g., Dinner at restaurant"
              required
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount ($) *</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="0.00"
                required
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
              <select
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              required
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg mt-2"
          >
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
