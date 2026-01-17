import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AddExpenseModal({ isOpen, onClose, onSubmit, trip, expense }) {
  const travelers = trip?.travelers || [];
  const isEditMode = !!expense;
  
  const currencies = [
    'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'SGD', 'AUD', 'CAD', 'CHF', 'HKD',
    'NZD', 'SEK', 'KRW', 'NOK', 'MXN', 'INR', 'RUB', 'ZAR', 'TRY', 'BRL',
    'TWD', 'DKK', 'PLN', 'THB', 'IDR', 'HUF', 'CZK', 'ILS', 'CLP', 'PHP',
    'AED', 'SAR', 'MYR', 'RON'
  ];
  
  const getInitialFormData = () => ({
    description: '',
    amount: '',
    currency: 'USD',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    paid_by: travelers[0] || '',
    split_between: travelers,
    split_type: 'equal',
    split_details: {},
    is_recurring: false,
    recurrence_pattern: ''
  });
  
  const [formData, setFormData] = useState(getInitialFormData());

  // Pre-fill form when editing
  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id,
        description: expense.description || '',
        amount: expense.amount || '',
        currency: expense.currency || 'USD',
        category: expense.category || 'Food',
        date: expense.date || new Date().toISOString().split('T')[0],
        paid_by: expense.paid_by || travelers[0] || '',
        split_between: expense.split_between || travelers,
        split_type: expense.split_type || 'equal',
        split_details: expense.split_details || {},
        is_recurring: expense.is_recurring || false,
        recurrence_pattern: expense.recurrence_pattern || ''
      });
    } else {
      setFormData(getInitialFormData());
    }
  }, [expense, isOpen]);

  if (!isOpen) return null;

  const categories = ['Food', 'Transport', 'Accommodation', 'Activities', 'Shopping', 'Other'];
  const recurrenceOptions = ['daily', 'weekly', 'monthly'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    if (!isEditMode) {
      setFormData(getInitialFormData());
    }
  };

  const toggleSplitPerson = (person) => {
    setFormData(prev => {
      const newSplitBetween = prev.split_between.includes(person)
        ? prev.split_between.filter(p => p !== person)
        : [...prev.split_between, person];
      
      // Reset split details if split type changes
      return {
        ...prev,
        split_between: newSplitBetween,
        split_details: prev.split_type === 'equal' ? {} : prev.split_details
      };
    });
  };

  const handleSplitDetailChange = (person, value) => {
    setFormData(prev => ({
      ...prev,
      split_details: {
        ...prev.split_details,
        [person]: parseFloat(value) || 0
      }
    }));
  };

  const calculateSplitPreview = () => {
    const amount = parseFloat(formData.amount || 0);
    if (formData.split_type === 'equal') {
      return formData.split_between.length > 0 
        ? amount / formData.split_between.length 
        : 0;
    } else if (formData.split_type === 'percentage') {
      const totalPercent = Object.values(formData.split_details).reduce((sum, val) => sum + val, 0);
      return `Total: ${totalPercent}%`;
    } else if (formData.split_type === 'fixed') {
      const totalFixed = Object.values(formData.split_details).reduce((sum, val) => sum + val, 0);
      return `Total: ${formData.currency} ${totalFixed.toFixed(2)} / ${formData.currency} ${amount.toFixed(2)}`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-6 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-teal-950">{isEditMode ? 'Edit Expense' : 'Add Expense'}</h2>
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

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount *</label>
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
              <label className="block text-sm font-semibold text-gray-700 mb-1">Currency *</label>
              <select
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                value={formData.currency}
                onChange={e => setFormData({...formData, currency: e.target.value})}
              >
                {currencies.map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
                ))}
              </select>
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

          {/* Paid By */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Paid By *</label>
            <select
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.paid_by}
              onChange={e => setFormData({...formData, paid_by: e.target.value})}
              required
            >
              {travelers.map(traveler => (
                <option key={traveler} value={traveler}>{traveler}</option>
              ))}
            </select>
          </div>

          {/* Split Between */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Split Between</label>
            <div className="space-y-2 mb-2">
              {travelers.map(traveler => (
                <label key={traveler} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.split_between.includes(traveler)}
                    onChange={() => toggleSplitPerson(traveler)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-700">{traveler}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Split Type */}
          {formData.split_between.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Split Type</label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, split_type: 'equal', split_details: {}})}
                  className={`flex-1 p-2 rounded-lg border-2 ${formData.split_type === 'equal' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200'}`}
                >
                  Equal
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, split_type: 'percentage', split_details: {}})}
                  className={`flex-1 p-2 rounded-lg border-2 ${formData.split_type === 'percentage' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200'}`}
                >
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, split_type: 'fixed', split_details: {}})}
                  className={`flex-1 p-2 rounded-lg border-2 ${formData.split_type === 'fixed' ? 'border-teal-600 bg-teal-50 text-teal-700' : 'border-gray-200'}`}
                >
                  Fixed Amount
                </button>
              </div>

              {/* Custom Split Inputs */}
              {formData.split_type !== 'equal' && (
                <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
                  {formData.split_between.map(person => (
                    <div key={person} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 w-24">{person}</span>
                      <input
                        type="number"
                        step={formData.split_type === 'percentage' ? '1' : '0.01'}
                        placeholder={formData.split_type === 'percentage' ? '%' : formData.currency}
                        className="flex-1 p-2 border rounded outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.split_details[person] || ''}
                        onChange={e => handleSplitDetailChange(person, e.target.value)}
                      />
                      <span className="text-sm text-gray-500 w-8">
                        {formData.split_type === 'percentage' ? '%' : formData.currency}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Split Preview */}
              <p className="text-sm text-gray-600 mt-2">
                {formData.split_type === 'equal' 
                  ? `${formData.currency} ${(parseFloat(formData.amount || 0) / formData.split_between.length).toFixed(2)} per person`
                  : calculateSplitPreview()
                }
              </p>
            </div>
          )}

          {/* Recurring Expense */}
          <div className="border-t pt-4">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={e => setFormData({...formData, is_recurring: e.target.checked, recurrence_pattern: e.target.checked ? 'monthly' : ''})}
                className="w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
              />
              <span className="text-sm font-semibold text-gray-700">Recurring Expense</span>
            </label>
            
            {formData.is_recurring && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Repeat</label>
                <select
                  className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
                  value={formData.recurrence_pattern}
                  onChange={e => setFormData({...formData, recurrence_pattern: e.target.value})}
                >
                  {recurrenceOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 shadow-lg mt-2"
          >
            {isEditMode ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  );
}
